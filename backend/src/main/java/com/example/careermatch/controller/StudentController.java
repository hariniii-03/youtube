package com.example.careermatch.controller;

import com.example.careermatch.dto.JobMatchResponseDTO;
import com.example.careermatch.model.JobPosting;
import com.example.careermatch.model.Student;
import com.example.careermatch.repository.JobPostingRepository;
import com.example.careermatch.repository.StudentRepository;
import com.example.careermatch.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private MatchingService matchingService;

    // Create or update profile
    @PostMapping
    public ResponseEntity<Student> createOrUpdateProfile(@RequestBody Student student) {
        Optional<Student> existingStudent = studentRepository.findByEmail(student.getEmail());
        if (existingStudent.isPresent()) {
            Student toUpdate = existingStudent.get();
            toUpdate.setName(student.getName());
            toUpdate.setGpa(student.getGpa());
            toUpdate.setVisaRequired(student.getVisaRequired());
            toUpdate.setSkills(student.getSkills());
            return ResponseEntity.ok(studentRepository.save(toUpdate));
        }
        return ResponseEntity.ok(studentRepository.save(student));
    }

    // Get profile by id
    @GetMapping("/{id}")
    public ResponseEntity<Student> getProfile(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get matches for a student
    @GetMapping("/{id}/matches")
    public ResponseEntity<List<JobMatchResponseDTO>> getMatches(@PathVariable Long id) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<JobPosting> jobs = jobPostingRepository.findAll();
        List<JobMatchResponseDTO> matches = matchingService.getMatchesForStudent(studentOpt.get(), jobs);
        return ResponseEntity.ok(matches);
    }
}
