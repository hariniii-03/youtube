package com.example.careermatch.dto;

import com.example.careermatch.model.JobPosting;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobMatchResponseDTO {
    private JobPosting job;
    private Integer matchScore;
    private List<String> matchExplanation;
}
