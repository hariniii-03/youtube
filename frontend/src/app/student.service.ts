import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  name: string;
  email: string;
  gpa: number;
  visaRequired: boolean;
  skills: string[];
}

export interface JobPosting {
  id: number;
  title: string;
  company: string;
  location: string;
  workMode: string;
  minimumGpa: number;
  sponsorshipAvailable: boolean;
  requiredSkills: string[];
}

export interface JobMatchResponse {
  job: JobPosting;
  matchScore: number;
  matchExplanation: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = this.getApiUrl();

  private getApiUrl(): string {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      return 'http://localhost:8080/api';
    }
    // Relative path for same-host deployment or reverse proxy.
    // Replace '/api' with full hosted backend URL if hosted separately.
    return '/api';
  }

  saveProfile(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student);
  }

  getMatches(studentId: number): Observable<JobMatchResponse[]> {
    return this.http.get<JobMatchResponse[]>(`${this.apiUrl}/students/${studentId}/matches`);
  }

  getAllJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobs`);
  }
}
