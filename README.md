#  Smart Screener — AI-Powered Resume Screening & Candidate Shortlisting

Smart Screener is an AI-powered resume screening and candidate shortlisting system designed to automate and simplify the recruitment process.

The system analyzes candidate resumes against a given Job Description (JD), extracts relevant candidate information, performs semantic matching, retrieves relevant resume evidence using **RAG (Retrieval-Augmented Generation)**, and generates an explainable candidate match score.

The goal is to help recruiters quickly identify relevant candidates while keeping the screening process **transparent, evidence-based, and configurable**.

---

##  Features

*  Upload and process Resume PDFs
*  Upload and analyze Job Descriptions
*  Automatic resume text extraction
*  AI-based resume information extraction
*  Skill extraction
*  Education extraction
*  Work experience extraction
*  Project and certification extraction
*  Semantic similarity between Resume and Job Description
*  Embedding-based candidate matching
*  RAG-based retrieval of relevant resume evidence
*  LLM-powered candidate analysis
*  Explainable candidate match score
*  Candidate ranking
*  Automated shortlist/review classification
*  Identification of missing skills and requirements
*  Candidate-wise detailed analysis
*  Recruiter-friendly dashboard
* Exportable screening results

---

#  System Architecture

```text
                    ┌─────────────────────┐
                    │     Recruiter       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Job Description    │
                    │  + Resume PDFs      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌─────────────────┐           ┌─────────────────┐
       │ Resume Parser   │           │ JD Parser       │
       └────────┬────────┘           └────────┬────────┘
                │                             │
                ▼                             ▼
       ┌─────────────────┐           ┌─────────────────┐
       │ Text Cleaning   │           │ Requirement     │
       │ & Processing    │           │ Extraction      │
       └────────┬────────┘           └────────┬────────┘
                │                             │
                ▼                             ▼
       ┌─────────────────┐           ┌─────────────────┐
       │ Resume          │           │ JD Structured   │
       │ Information     │           │ Information     │
       │ Extraction      │           │                 │
       └────────┬────────┘           └────────┬────────┘
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Text Chunking       │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Embedding Model     │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Vector Database     │
                    │ / FAISS             │
                    └──────────┬──────────┘
                               │
                         RAG Retrieval
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Relevant Resume     │
                    │ Evidence            │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │ LLM Analysis        │
                    │ & Explanation       │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Matching & Scoring  │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Candidate Ranking   │
                    └──────────┬──────────┘
                               ▼
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
        SHORTLIST            REVIEW       NOT SHORTLISTED
```

---

# 🔄 How It Works

## 1. Resume Upload

The recruiter uploads one or multiple candidate resumes in PDF format.

```text
Resume.pdf
     ↓
PDF Text Extraction
     ↓
Cleaned Resume Text
```

The system extracts the textual content from the resume using PDF processing techniques.

---

## 2. Job Description Processing

The recruiter provides a Job Description containing information such as:

* Job title
* Required skills
* Preferred skills
* Required experience
* Educational requirements
* Tools and technologies
* Other job-specific requirements

The system converts the JD into structured information.

Example:

```json
{
  "role": "Machine Learning Engineer",
  "required_skills": [
    "Python",
    "Machine Learning",
    "SQL",
    "Scikit-learn"
  ],
  "preferred_skills": [
    "AWS",
    "Docker"
  ],
  "minimum_experience": 2
}
```

---

# 🧠 Resume Information Extraction

The system extracts important information from each resume.

### Information extracted

* Candidate name
* Skills
* Programming languages
* Tools and technologies
* Education
* Work experience
* Experience duration
* Projects
* Certifications

The information can be represented as structured JSON.

Example:

```json
{
  "name": "Candidate Name",
  "skills": [
    "Python",
    "SQL",
    "Machine Learning",
    "Pandas"
  ],
  "experience": [
    {
      "role": "ML Engineer",
      "years": 2.5
    }
  ],
  "education": [
    "B.Tech Computer Science"
  ],
  "projects": [
    "Customer Churn Prediction"
  ]
}
```

---

# 🔗 Semantic Matching

Traditional ATS systems often depend heavily on exact keyword matching.

Smart Screener uses **semantic similarity** to understand relationships between resume content and job requirements.

For example:

```text
Job Description:
"Experience in predictive modeling"

Resume:
"Developed customer churn prediction models using XGBoost"
```

Even though the exact phrase is different, the system can identify that both statements are semantically related.

---

#  Embeddings

Resume and Job Description text are converted into numerical vectors called **embeddings**.

```text
Resume Text
     ↓
Embedding Model
     ↓
Vector Representation
```

The same process is performed for the Job Description.

The vectors can then be compared using semantic similarity techniques such as cosine similarity.

---

#  RAG — Retrieval-Augmented Generation

Smart Screener uses RAG to provide relevant resume evidence to the LLM.

Instead of sending an entire resume blindly to the LLM:

```text
Resume
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Database
   ↓
Retrieve relevant sections
   ↓
LLM
```

For example, if the Job Description requires Python and Machine Learning, the system retrieves resume sections containing relevant evidence.

This helps the LLM generate explanations based on the actual resume content.

---

# 🤖 LLM Integration

The LLM is used for tasks such as:

* Extracting structured information
* Understanding unstructured resume text
* Analyzing candidate-job alignment
* Identifying relevant evidence
* Explaining matched requirements
* Identifying missing requirements

The LLM is instructed to use retrieved evidence rather than inventing candidate information.

---

# 📊 Candidate Scoring

Smart Screener combines multiple signals to calculate a candidate's match score.

Example scoring components:

| Component            | Weight |
| -------------------- | -----: |
| Required Skill Match |    35% |
| Experience Match     |    25% |
| Semantic Similarity  |    20% |
| Education Match      |    10% |
| Project Relevance    |    10% |

The weights can be configured according to the requirements of the application.

Example:

```text
Skill Match          = 90
Experience Match     = 100
Semantic Similarity  = 85
Education Match      = 100
Project Relevance    = 80

Final Score = 91.5%
```

---

#  Candidate Ranking

After calculating the match scores, candidates are ranked according to their compatibility with the configured job requirements.

Example:

| Rank | Candidate   | Match Score | Status    |
| ---: | ----------- | ----------: | --------- |
|    1 | Candidate A |       91.5% | Shortlist |
|    2 | Candidate B |       87.2% | Shortlist |
|    3 | Candidate C |       81.4% | Review    |
|    4 | Candidate D |       73.8% | Review    |

---

#  Candidate Shortlisting

The recruiter can configure a screening threshold.

Example:

```text
Score >= 85       → Shortlist
Score 70–84       → Recruiter Review
Score < 70        → Does not meet configured threshold
```

The thresholds are configurable and should be treated as recruitment criteria rather than an objective measure of candidate quality.

---

# 🔎 Explainable Screening

One of the important features of Smart Screener is explainability.

Instead of showing only:

```text
Match Score: 91%
```

the system can provide:

```text
Candidate: Candidate A

Match Score: 91%

Matched Skills:
✓ Python
✓ Machine Learning
✓ SQL
✓ Pandas
✓ Scikit-learn

Missing Requirements:
✗ Docker

Experience:
2.8 years

Relevant Evidence:
"Developed machine learning models using Python,
Pandas and Scikit-learn."

Strengths:
• Strong Python and ML experience
• Relevant ML project experience
• SQL experience

Gaps:
• Docker experience was not found in the resume
```

This makes the screening process easier to understand and review.

---

# 🛠️ Technology Stack

### Programming

* Python

### AI / Machine Learning

* Machine Learning
* Natural Language Processing
* Large Language Models
* Semantic Similarity
* Sentence Embeddings

### RAG

* Retrieval-Augmented Generation
* Vector Search
* FAISS / Vector Database

### NLP

* Resume Parsing
* Text Processing
* Information Extraction
* Semantic Matching

### Frontend / Application

* Streamlit

### Data Processing

* Pandas
* NumPy
* Scikit-learn

### PDF Processing

* PyMuPDF

---

# 📁 Project Structure

```text
SmartScreener/
│
├── data/
│   ├── raw/
│   │   ├── resumes/
│   │   └── job_descriptions/
│   │
│   └── processed/
│
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_resume_parsing.ipynb
│   ├── 03_feature_extraction.ipynb
│   ├── 04_embeddings.ipynb
│   ├── 05_rag.ipynb
│   ├── 06_matching.ipynb
│   └── 07_evaluation.ipynb
│
├── src/
│   ├── parser.py
│   ├── cleaner.py
│   ├── extractor.py
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── rag.py
│   ├── scorer.py
│   ├── ranker.py
│   └── llm.py
│
├── models/
│
├── app/
│   └── app.py
│
├── requirements.txt
├── README.md
└── .gitignore
```

> Update this structure to match the actual files in your repository.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SmartScreener.git
cd SmartScreener
```

## 2. Create a virtual environment

```bash
python -m venv venv
```

### macOS/Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

#  Environment Variables

Create a `.env` file:

```text
LLM_API_KEY=your_api_key_here
```

Do **not** upload API keys to GitHub.

Add the following to `.gitignore`:

```text
.env
venv/
__pycache__/
*.pyc
```

---

# ▶️ Running the Application

Start the Streamlit application:

```bash
streamlit run app/app.py
```

The application will open in your browser.

---

#  Application Workflow

```text
1. Upload Job Description
           ↓
2. Upload Resume PDFs
           ↓
3. Extract Resume Information
           ↓
4. Process Job Requirements
           ↓
5. Generate Embeddings
           ↓
6. Retrieve Relevant Evidence
           ↓
7. Perform Semantic Matching
           ↓
8. LLM-Based Analysis
           ↓
9. Calculate Match Scores
           ↓
10. Rank Candidates
           ↓
11. Generate Shortlist
           ↓
12. Display Explainable Results
```

---

# 📊 Example Output

```text
=================================================
              SMART SCREENER AI
=================================================

Job Role:
Machine Learning Engineer

Candidates Screened:
100

Shortlisted:
12

Requires Review:
25

-------------------------------------------------

Candidate        Score       Status
-------------------------------------------------

Candidate A      92.4%      SHORTLIST
Candidate B      89.7%      SHORTLIST
Candidate C      84.1%      REVIEW
Candidate D      76.5%      REVIEW
Candidate E      63.2%      REVIEW
```

---

#  Project Objectives

The main objectives of Smart Screener are:

1. Automate repetitive resume screening tasks.
2. Reduce manual effort during initial candidate screening.
3. Improve semantic matching between resumes and job descriptions.
4. Retrieve relevant resume evidence using RAG.
5. Use LLMs for structured information extraction and explanations.
6. Provide transparent candidate scoring.
7. Rank candidates according to configurable job requirements.
8. Help recruiters focus on detailed candidate evaluation rather than manual resume filtering.

---

#  Future Improvements

Future versions can include:

*  Advanced resume parsing
*  Multi-language resume support
*  Better OCR for scanned resumes
*  Advanced ranking models
*  XGBoost-based candidate matching
*  Learning-to-rank models
*  Better RAG evaluation
*  Recruiter feedback loop
*  Candidate comparison
*  Interview question generation
*  Automated interview scheduling
*  Email integration
*  Candidate database
*  Authentication and role-based access
*  Cloud deployment
*  Monitoring and model evaluation
*  Bias and fairness auditing

---

# 🔒 Responsible AI

Smart Screener is designed as a **decision-support system**, not an autonomous hiring decision maker.

The system should focus on job-relevant information such as:

* Skills
* Experience
* Education
* Projects
* Certifications
* Job-specific requirements

Sensitive or protected characteristics should not be used as ranking criteria.

Recruiters should review the evidence and make the final hiring decision.

---

#  Evaluation

The system can be evaluated using:

### Classification Metrics

* Accuracy
* Precision
* Recall
* F1 Score
* ROC-AUC

### Ranking Metrics

* Precision@K
* Recall@K
* MRR
* NDCG

### RAG Metrics

* Retrieval Precision
* Retrieval Recall
* Top-K Retrieval Accuracy

### Extraction Metrics

* Skill extraction accuracy
* Education extraction accuracy
* Experience extraction accuracy

---

# 📚 Key Concepts Demonstrated

This project demonstrates practical implementation of:

```text
Python
   ↓
NLP
   ↓
PDF Processing
   ↓
Information Extraction
   ↓
Embeddings
   ↓
Semantic Search
   ↓
Vector Database
   ↓
RAG
   ↓
LLM
   ↓
Semantic Matching
   ↓
Scoring
   ↓
Ranking
   ↓
Candidate Shortlisting
   ↓
Streamlit Deployment
```

---

#  Author

**Your Name**

Computer Science / Data Science Student

GitHub: 'https://github.com/arun-avasthi/smartscreener'

LinkedIn: `https://www.linkedin.com/in/arun-avasthi`

---

# Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

##  Disclaimer

Smart Screener is an academic/project-oriented AI screening system intended to assist with initial candidate screening. It should not be used as the sole basis for employment decisions. Human review and appropriate organizational policies should remain part of the recruitment process.
