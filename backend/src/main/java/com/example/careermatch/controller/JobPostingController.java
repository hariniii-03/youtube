package com.example.careermatch.controller;

import com.example.careermatch.model.JobPosting;
import com.example.careermatch.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:4200")
public class JobPostingController {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @GetMapping
    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<JobPosting> createJob(@RequestBody JobPosting jobPosting) {
        return ResponseEntity.ok(jobPostingRepository.save(jobPosting));
    }
}
