import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StudentService, Student, JobPosting, JobMatchResponse } from './student.service';
import { MatchScorePipe } from './match-score.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatchScorePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);

  profileForm!: FormGroup;
  currentSkillInput = '';
  skillsList: string[] = ['Java', 'SQL']; // Seeded default skills
  
  // Popular skills to suggest to the user
  popularSkills: string[] = [
    'Java', 'Spring Boot', 'SQL', 'Python', 'React', 
    'TypeScript', 'JavaScript', 'HTML', 'CSS', 'AWS', 
    'Docker', 'Kubernetes', 'Tableau', 'Excel', 'Agile'
  ];

  activeStudent: Student | null = null;
  jobs: JobPosting[] = [];
  matches: JobMatchResponse[] = [];
  
  // Filters & Sorting state
  searchLocation = '';
  filterWorkMode = 'ALL';
  filterSponsorship = 'ALL';
  sortBy = 'SCORE';

  // Application tracker: jobId -> status
  appliedJobs: { [jobId: number]: string } = {};
  showAppliedOnly = false;

  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.initForm();
    this.loadAllJobs();
    
    // Load tracking from localStorage if exists
    const savedTracking = localStorage.getItem('appliedJobs');
    if (savedTracking) {
      this.appliedJobs = JSON.parse(savedTracking);
    }
  }

  private initForm() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gpa: [3.5, [Validators.required, Validators.min(0.0), Validators.max(4.0)]],
      visaRequired: [false, Validators.required]
    });
  }

  // Load jobs when profile isn't saved yet
  loadAllJobs() {
    this.studentService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs = data;
      },
      error: (err) => {
        console.error('Failed to load jobs', err);
        this.errorMessage = 'Could not load jobs from backend. Make sure the Spring Boot server is running on port 8080.';
      }
    });
  }

  // Add skill tag
  addSkill(skill: string) {
    const cleanSkill = skill.trim();
    if (cleanSkill && !this.skillsList.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      this.skillsList.push(cleanSkill);
      this.currentSkillInput = '';
    }
  }

  // Remove skill tag
  removeSkill(skill: string) {
    this.skillsList = this.skillsList.filter(s => s !== skill);
  }

  // Handle Enter key on skill input
  onSkillKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addSkill(this.currentSkillInput);
    }
  }

  // Submit Profile Form
  onSubmitProfile() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fix the errors in the profile form before saving.';
      return;
    }

    const studentData: Student = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      gpa: Number(this.profileForm.value.gpa),
      visaRequired: this.profileForm.value.visaRequired,
      skills: this.skillsList
    };

    this.studentService.saveProfile(studentData).subscribe({
      next: (savedStudent) => {
        this.activeStudent = savedStudent;
        this.successMessage = 'Profile saved successfully! Job matching engine recalculated.';
        this.errorMessage = '';
        this.loadMatches();
        
        // Auto-dismiss success alert
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        console.error('Error saving profile', err);
        this.errorMessage = 'Failed to connect to the backend server to save profile.';
      }
    });
  }

  // Fetch match details for the active student
  loadMatches() {
    if (!this.activeStudent || !this.activeStudent.id) return;
    
    this.studentService.getMatches(this.activeStudent.id).subscribe({
      next: (data) => {
        this.matches = data;
      },
      error: (err) => {
        console.error('Error fetching matches', err);
        this.errorMessage = 'Failed to calculate job matches.';
      }
    });
  }

  // Filter & Sort listings dynamically
  get filteredListings(): JobMatchResponse[] {
    // If student is not saved, we filter the raw jobs list and wrap into JobMatchResponse objects
    if (!this.activeStudent) {
      return this.jobs
        .filter(job => this.applyFiltersToJob(job))
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(job => ({
          job: job,
          matchScore: 0,
          matchExplanation: []
        }));
    }

    // If student is saved, we filter the calculated matches list
    let list = [...this.matches];

    // Apply filters
    list = list.filter(m => this.applyFiltersToJob(m.job));

    // Filter by Application Tracking state
    if (this.showAppliedOnly) {
      list = list.filter(m => !!this.appliedJobs[m.job.id]);
    }

    // Apply Sorting
    if (this.sortBy === 'SCORE') {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (this.sortBy === 'TITLE') {
      list.sort((a, b) => a.job.title.localeCompare(b.job.title));
    } else if (this.sortBy === 'COMPANY') {
      list.sort((a, b) => a.job.company.localeCompare(b.job.company));
    }

    return list;
  }

  private applyFiltersToJob(job: JobPosting): boolean {
    // 1. Location search (case-insensitive)
    if (this.searchLocation && !job.location.toLowerCase().includes(this.searchLocation.toLowerCase())) {
      return false;
    }

    // 2. Work Mode filter
    if (this.filterWorkMode !== 'ALL' && job.workMode !== this.filterWorkMode) {
      return false;
    }

    // 3. Sponsorship Filter
    if (this.filterSponsorship === 'SPONSOR_ONLY' && !job.sponsorshipAvailable) {
      return false;
    }

    return true;
  }

  // Toggle job application
  toggleApply(jobId: number) {
    if (this.appliedJobs[jobId]) {
      delete this.appliedJobs[jobId];
    } else {
      this.appliedJobs[jobId] = 'Applied';
    }
    this.saveTrackingToStorage();
  }

  // Change Application Status
  updateApplicationStatus(jobId: number, status: string) {
    this.appliedJobs[jobId] = status;
    this.saveTrackingToStorage();
  }

  private saveTrackingToStorage() {
    localStorage.setItem('appliedJobs', JSON.stringify(this.appliedJobs));
  }

  // Utility to determine score badge class
  getScoreBadgeClass(score: number): string {
    if (score >= 80) return 'badge-high';
    if (score >= 50) return 'badge-medium';
    return 'badge-low';
  }
}
