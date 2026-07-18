const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let students = [];
let studentIdCounter = 1;

const jobs = [
  {
    id: 1,
    title: "Software Engineer I",
    company: "TechCorp",
    location: "San Francisco, CA",
    workMode: "HYBRID",
    minimumGpa: 3.2,
    sponsorshipAvailable: false,
    requiredSkills: ["Java", "Spring Boot", "SQL", "AWS"]
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "DesignStudio",
    location: "Remote",
    workMode: "REMOTE",
    minimumGpa: 3.0,
    sponsorshipAvailable: true,
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"]
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "FinanceHub",
    location: "New York, NY",
    workMode: "ONSITE",
    minimumGpa: 3.5,
    sponsorshipAvailable: false,
    requiredSkills: ["Python", "SQL", "Excel", "Tableau"]
  },
  {
    id: 4,
    title: "Machine Learning Engineer",
    company: "DeepAI",
    location: "Boston, MA",
    workMode: "HYBRID",
    minimumGpa: 3.8,
    sponsorshipAvailable: true,
    requiredSkills: ["Python", "PyTorch", "Machine Learning", "SQL"]
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Seattle, WA",
    workMode: "REMOTE",
    minimumGpa: 3.0,
    sponsorshipAvailable: false,
    requiredSkills: ["Docker", "Kubernetes", "AWS", "Linux"]
  },
  {
    id: 6,
    title: "Product Management Intern",
    company: "InnovateHQ",
    location: "Austin, TX",
    workMode: "HYBRID",
    minimumGpa: 3.4,
    sponsorshipAvailable: true,
    requiredSkills: ["Agile", "Product Strategy", "Communication"]
  }
];

function calculateMatch(student, job) {
  let score = 0;
  let explanation = [];

  // 1. Work Auth (30% weight)
  const hasVisaMismatch = student.visaRequired && !job.sponsorshipAvailable;
  if (hasVisaMismatch) {
    explanation.push("❌ Sponsorship required but not provided by the company (Hard Filter applied).");
    return { job, matchScore: 0, matchExplanation: explanation };
  } else {
    score += 30;
    if (student.visaRequired && job.sponsorshipAvailable) {
      explanation.push("✅ Sponsorship needed and supported by this role (+30%).");
    } else {
      explanation.push("✅ Work authorization compatible, no sponsorship needed (+30%).");
    }
  }

  // 2. GPA (20% weight)
  if (student.gpa >= job.minimumGpa) {
    score += 20;
    explanation.push(`✅ GPA of ${student.gpa} meets or exceeds minimum requirement of ${job.minimumGpa} (+20%).`);
  } else {
    explanation.push(`❌ GPA of ${student.gpa} is below minimum requirement of ${job.minimumGpa} (+0%).`);
  }

  // 3. Skills Overlap (50% weight)
  const requiredSkills = job.requiredSkills || [];
  if (requiredSkills.length === 0) {
    score += 50;
    explanation.push("✅ No specific skills required for this posting (+50%).");
  } else {
    const studentSkills = student.skills || [];
    const studentSkillsLower = studentSkills.map(s => s ? s.toLowerCase().trim() : '');
    const matchedSkills = [];
    
    requiredSkills.forEach(reqSkill => {
      if (reqSkill && studentSkillsLower.includes(reqSkill.toLowerCase().trim())) {
        matchedSkills.push(reqSkill);
      }
    });

    const totalRequired = requiredSkills.length;
    const totalMatched = matchedSkills.length;
    const skillScore = (totalMatched / totalRequired) * 50;
    score += skillScore;

    if (totalMatched > 0) {
      explanation.push(`✅ Matched ${totalMatched} of ${totalRequired} required skills (+${skillScore.toFixed(1)}%). Matched: ${matchedSkills.join(", ")}`);
    } else {
      explanation.push(`❌ None of the ${totalRequired} required skills matched (+0%).`);
    }

    const missingSkills = requiredSkills.filter(s => !matchedSkills.map(m => m.toLowerCase().trim()).includes(s.toLowerCase().trim()));
    if (missingSkills.length > 0) {
      explanation.push(`🔍 Missing skills: ${missingSkills.join(", ")}`);
    }
  }

  return {
    job,
    matchScore: Math.round(score),
    matchExplanation: explanation
  };
}

app.post('/api/students', (req, res) => {
  const { name, email, gpa, visaRequired, skills } = req.body;
  let student = students.find(s => s.email === email);
  if (student) {
    student.name = name;
    student.gpa = gpa;
    student.visaRequired = visaRequired;
    student.skills = skills || [];
  } else {
    student = { id: studentIdCounter++, name, email, gpa, visaRequired, skills: skills || [] };
    students.push(student);
  }
  res.json(student);
});

app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/students/:id/matches', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).send('Student not found');
  
  const matches = jobs.map(job => calculateMatch(student, job))
                      .sort((a, b) => b.matchScore - a.matchScore);
  res.json(matches);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Mock CareerMatch Backend running on port ${PORT}`);
});
