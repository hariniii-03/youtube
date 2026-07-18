package com.example.careermatch.service;

import com.example.careermatch.dto.JobMatchResponseDTO;
import com.example.careermatch.model.JobPosting;
import com.example.careermatch.model.Student;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    public JobMatchResponseDTO calculateMatch(Student student, JobPosting job) {
        List<String> explanation = new ArrayList<>();
        double score = 0.0;

        // 1. Work Authorization & Sponsorship Check (30% weight)
        boolean hasVisaMismatch = student.getVisaRequired() && !job.getSponsorshipAvailable();
        if (hasVisaMismatch) {
            explanation.add("❌ Sponsorship required but not provided by the company (Hard Filter applied).");
            return new JobMatchResponseDTO(job, 0, explanation);
        } else {
            score += 30.0;
            if (student.getVisaRequired() && job.getSponsorshipAvailable()) {
                explanation.add("✅ Sponsorship needed and supported by this role (+30%).");
            } else {
                explanation.add("✅ Work authorization compatible, no sponsorship needed (+30%).");
            }
        }

        // 2. GPA Check (20% weight)
        if (student.getGpa() >= job.getMinimumGpa()) {
            score += 20.0;
            explanation.add("✅ GPA of " + student.getGpa() + " meets or exceeds minimum requirement of " + job.getMinimumGpa() + " (+20%).");
        } else {
            explanation.add("❌ GPA of " + student.getGpa() + " is below minimum requirement of " + job.getMinimumGpa() + " (+0%).");
        }

        // 3. Skills Overlap (50% weight)
        Set<String> requiredSkills = job.getRequiredSkills();
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            score += 50.0;
            explanation.add("✅ No specific skills required for this posting (+50%).");
        } else {
            Set<String> studentSkillsLower = student.getSkills().stream()
                    .map(String::toLowerCase)
                    .map(String::trim)
                    .collect(Collectors.toSet());

            List<String> matchedSkills = new ArrayList<>();
            for (String reqSkill : requiredSkills) {
                if (studentSkillsLower.contains(reqSkill.toLowerCase().trim())) {
                    matchedSkills.add(reqSkill);
                }
            }

            int totalRequired = requiredSkills.size();
            int totalMatched = matchedSkills.size();
            double skillScore = ((double) totalMatched / totalRequired) * 50.0;
            score += skillScore;

            if (totalMatched > 0) {
                explanation.add(String.format("✅ Matched %d of %d required skills (+%.1f%%). Matched: %s",
                        totalMatched, totalRequired, skillScore, String.join(", ", matchedSkills)));
            } else {
                explanation.add("❌ None of the " + totalRequired + " required skills matched (+0%).");
            }
            
            // Add what was missing
            List<String> missingSkills = requiredSkills.stream()
                    .filter(s -> !matchedSkills.contains(s))
                    .collect(Collectors.toList());
            if (!missingSkills.isEmpty()) {
                explanation.add("🔍 Missing skills: " + String.join(", ", missingSkills));
            }
        }

        int finalScore = (int) Math.round(score);
        return new JobMatchResponseDTO(job, finalScore, explanation);
    }

    public List<JobMatchResponseDTO> getMatchesForStudent(Student student, List<JobPosting> jobs) {
        return jobs.stream()
                .map(job -> calculateMatch(student, job))
                .sorted((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore())) // Sort by score descending
                .collect(Collectors.toList());
    }
}
