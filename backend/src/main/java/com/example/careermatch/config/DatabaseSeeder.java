package com.example.careermatch.config;

import com.example.careermatch.model.JobPosting;
import com.example.careermatch.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Override
    public void run(String... args) throws Exception {
        if (jobPostingRepository.count() == 0) {
            JobPosting jp1 = new JobPosting(
                    null,
                    "Software Engineer I",
                    "TechCorp",
                    "San Francisco, CA",
                    "HYBRID",
                    3.2,
                    false,
                    new HashSet<>(Arrays.asList("Java", "Spring Boot", "SQL", "AWS"))
            );

            JobPosting jp2 = new JobPosting(
                    null,
                    "Frontend Developer Intern",
                    "DesignStudio",
                    "Remote",
                    "REMOTE",
                    3.0,
                    true,
                    new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React", "TypeScript"))
            );

            JobPosting jp3 = new JobPosting(
                    null,
                    "Data Analyst",
                    "FinanceHub",
                    "New York, NY",
                    "ONSITE",
                    3.5,
                    false,
                    new HashSet<>(Arrays.asList("Python", "SQL", "Excel", "Tableau"))
            );

            JobPosting jp4 = new JobPosting(
                    null,
                    "Machine Learning Engineer",
                    "DeepAI",
                    "Boston, MA",
                    "HYBRID",
                    3.8,
                    true,
                    new HashSet<>(Arrays.asList("Python", "PyTorch", "Machine Learning", "SQL"))
            );

            JobPosting jp5 = new JobPosting(
                    null,
                    "DevOps Engineer",
                    "CloudScale",
                    "Seattle, WA",
                    "REMOTE",
                    3.0,
                    false,
                    new HashSet<>(Arrays.asList("Docker", "Kubernetes", "AWS", "Linux"))
            );

            JobPosting jp6 = new JobPosting(
                    null,
                    "Product Management Intern",
                    "InnovateHQ",
                    "Austin, TX",
                    "HYBRID",
                    3.4,
                    true,
                    new HashSet<>(Arrays.asList("Agile", "Product Strategy", "Communication"))
            );

            jobPostingRepository.saveAll(Arrays.asList(jp1, jp2, jp3, jp4, jp5, jp6));
            System.out.println("--- CareerMatch Database Seeded Successfully with 6 Job Postings! ---");
        }
    }
}
