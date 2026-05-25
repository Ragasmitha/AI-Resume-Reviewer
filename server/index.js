const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const jobRole = req.body.jobRole || 'Software Engineer';
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: `You are an expert ATS resume reviewer and career coach.

Analyze this resume for a ${jobRole} position.

Evaluate the resume specifically for the selected job role.

Prioritize:
- relevant technical skills for the role
- matching projects
- role-specific tools and technologies
- relevant experience
- domain alignment

A resume should receive a LOWER score if it lacks skills or projects relevant to the selected role.

Return the response STRICTLY in this format:

# Resume Score
Score: [Final score here]

Internally evaluate these categories before deciding the final score:
- ATS Compatibility (/20)
- Technical Skills (/20)
- Projects (/20)
- Experience (/20)
- Resume Clarity (/20)

Do not display these category ratings in the final response.

Calculate the FINAL SCORE out of 100 based on these category ratings.

Scoring rubric:
- 90-100 = Exceptional industry-level resume
- 80-89 = Strong resume with minor weaknesses
- 70-79 = Average student resume
- 60-69 = Weak resume with major improvement areas
- Below 60 = Poor resume

IMPORTANT:
Return the final score EXACTLY in this format:
Score: [Final score here]

Do not write '/100'.
Do not change the wording.

Consider:
- ATS compatibility
- Technical skills relevance
- Project quality
- Quantified achievements
- Resume formatting
- Real-world impact
- Experience quality
- Grammar and clarity

Give realistic scores. Do NOT inflate scores.

Compare the resume carefully based on:
- technical skills depth
- internship quality
- project complexity
- ATS formatting
- quantified achievements
- impact
- resume clarity

Different resumes should receive meaningfully different scores when quality differs.
Avoid giving similar scores unless resumes are genuinely similar.

Use the FULL scoring range from 40-95 when appropriate.
Do not cluster scores around the same values.
Small resume differences should produce noticeable score differences.

# Score Explanation
Explain briefly why the resume received this score.
DO NOT repeat the numeric score again.

# ATS Compatibility
Mention whether the resume is:
- Good
- Moderate
- Poor

and explain briefly why.

# Strengths
Give exactly 3 strengths in bullet points.

# Weaknesses
Give exactly 3 weaknesses in bullet points.

# Improvement Suggestions
Give exactly 3 practical suggestions in bullet points.

# Final Verdict
Give a short 2-3 line professional summary about the resume.

Resume:
${resumeText}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const feedback = response.data.choices[0].message.content;
    res.json({ feedback });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});