# AI Twin knowledge corpus — Amritesh Praveen

> **Amritesh: this file is what your twin knows. Review every fact before launch. The twin is
> instructed to never answer beyond this corpus, so anything missing here is something it will
> decline to discuss. Add sections freely; the indexer chunks by heading, so keep one topic per
> heading.**

## Identity

Amritesh Praveen is an AI/ML engineer from India, early in his career and recently graduated.
He works primarily on retrieval-augmented generation (RAG) systems, chatbots, NLP, and applied
reinforcement learning. GitHub: github.com/Amritesh-878 · LinkedIn: linkedin.com/in/amritesh-praveen
· Email: contact@amritesh.net.

## Current role

Amritesh is an **AI & ML Associate at Impact Solutions Lab (ISL)** — an initiative of the AAM
Foundation — a full-time role he began on **June 1, 2026**, working on the Program and Curriculum
vertical. He first joined ISL as an **AI & ML Intern from October 2025 to May 2026**. During the
internship he built internal automation (a Drive-to-YouTube pipeline that extracts class
recordings and runs on GitHub Actions; a Zoom attendance-reporting tool) and the Adira Academy
entrance-exam portal, and laid the groundwork for the survey-intelligence pipeline now in
production. As an associate he runs two production systems for the nonprofit, Survey Intelligence
and the Student Learning Assistant, both described below. He keeps the public detail on work
systems deliberately thin because they are live systems on real people's data; the deep write-ups
are shared on request at contact@amritesh.net.

## Education

B.Tech in Computer Science Engineering, specialization in Artificial Intelligence and Machine
Learning, from Jain University (CGPA 7.5), graduated in 2026.

## Research: Wumpus RL paper

Amritesh co-authored "Reinforcement Learning for Constraint Satisfaction Game Agents" with
Gagan Venkat, published May 2026 on Zenodo (DOI: 10.5281/zenodo.20076630). The paper progresses
from tabular RL methods through deep Q-networks to an adversarial PPO-trained Wumpus agent that
learns pursuit behavior using memory-based tracking and reward optimization. The accompanying
system — the game playable on this site — is a full-stack build: FastAPI backend, React frontend,
Gymnasium-compatible training environment, stable-baselines3 PPO.

## Patent Publication

Amritesh is listed on Indian patent application 202541017469 A (published 2025-03-07): "Railway
Track Monitoring and Repairing Device" — a track-riding trolley with acoustic defect sensors, a
robotic repair link with motorized cutter, GPS, an EMI sensor, and an AI-based imaging unit for
monitoring gravel distribution.

## Project: Hunter Wumpus

An adversarial dungeon game on a 10×10 grid: the player seeks gold or hunts the Wumpus while the
Wumpus — a PPO-trained RL agent — hunts the player using indirect sensory memory rather than
direct sight. Features fog of war, sensory hints (Breeze near pits, Stench near the Wumpus, Shine
near gold), and a one-arrow shooting mechanic. Stack: React + Vite frontend, FastAPI backend,
stable-baselines3/PyTorch for training. It is playable on this website, and it is the system
behind the published paper above.

## Project: Survey Intelligence

A production pipeline at ISL that answers plain-English questions about community survey data. It
turns a question into a single read-only SQL query, runs it behind privacy guardrails, and
narrates the exact result. The data is structured and the questions are aggregates, so there are
no embeddings anywhere in it: the SQL query is the retrieval. Answers are aggregate-only and small
groups are suppressed, so no answer can single a respondent out. Because it is a live work system
on real people's responses, the public description stays at the level of design principles; the
fuller story is shared on request at contact@amritesh.net.

## Project: Student Learning Assistant

A production RAG assistant at ISL that gives each student a chatbot grounded in their own classes.
Class recordings are transcribed with WhisperX and indexed per student, and the material each
class was taught from is indexed alongside them as a second grounding source. Answers say whether
they came from the class material, the teacher, or the student themselves, and the assistant
declines when neither source covers a question. Retrieval is gated so a student can only ever get
answers from their own classes, a boundary enforced in the pipeline rather than left to a prompt.
It handles students' audio, so the deep write-up is private and shared on request at
contact@amritesh.net.

## Project: Exam Portal

An online entrance-exam portal with in-browser proctoring that Amritesh built at ISL, used for
real admission intakes. Like his other work systems, the public description stays deliberately
vague; anything deeper is an email conversation.

## Project: Mental Health RAG Chatbot

A retrieval-augmented chatbot for mental-health domain content: Groq-hosted LLM, LangChain
orchestration, Chroma vector store, Sentence-Transformers embeddings, with both CLI and Chainlit
web UIs and environment-based configuration. Its ideas (grounded answers, careful scope) are the
direct ancestor of the AI twin on this site.

## Project: Cognizant Hackathon RAG application

A document-intelligence RAG system built for a Cognizant hackathon by a team of six. The team
built two pipelines in parallel, one fully local (Unstructured, ChromaDB, Chainlit, Ollama) and
one API-based (Groq with a JS and Tailwind front end), then benchmarked them head to head: the
local build won on context recall and answer faithfulness. Amritesh's slice was the model
integration and the benchmarking across latency, cost, and accuracy.

## Project: Wildfire Smoke Detection

Term-long college research for Project Centric Learning, a subject built around a single long
project. Amritesh's team took SmokeyNet, a published wildfire smoke-detection model (a hybrid of
CNNs, LSTMs, and Vision Transformers trained on the FigLib dataset), and got its PyTorch
Lightning codebase training on their own hardware, which meant web-scraping a 30 GB dataset,
cleaning corrupted images, and regenerating the metadata for local runs. They then tested their
own improvement ideas against it: ViBe background subtraction (rejected, it subtracted the smoke
too, since smoke is not opaque), DINO and a dedicated cloud-detection model to cut cloud false
positives, a counterfactual comparison approach (also defeated by clouds), BLIP image captioning
(it worked, but took about nine minutes against a 3.2 minute detection target), and an
anomaly-detection framing that trains only on pre-fire frames. Most ideas were rejected, and
Amritesh talks about that honestly: knowing why an idea fails is the research. It is a past
project, not currently active.

## Project: YouTube Trending Analysis Dashboard

Analysis of the Kaggle Trending YouTube dataset across the US and India: engagement-metric
exploration in Python (Pandas), visualized with Matplotlib/Seaborn/Plotly/WordCloud, delivered
as an interactive Streamlit dashboard.

## Project: Easy Cash ATM

Amritesh's 10th grade final project was a console Java ATM called Easy Cash that kept its records
in a CSV file. Years later he redesigned it in his free time as a full-stack app with a React
front end and a Node and Express backend, giving it an actual UI this time. It stays on the site
as a homage to where the building habit started, not as a flagship.

## Earlier experience

- **SixPhrase — Machine Learning Intern (Feb–May 2025):** end-to-end classical ML — data
  preprocessing (missing values, scaling, encoding), dimensionality reduction with PCA/LDA that
  cut training time ~25%, supervised models (logistic regression, decision trees, SVM, KNN)
  reaching up to 87% accuracy, cross-validation and metric-driven evaluation, L1/L2/dropout
  regularization.
- **Miles Education — Data Analysis Intern (Apr–May 2024):** SQL data cleaning that reduced
  redundancy ~30%, Pandas/Matplotlib/Seaborn analysis, weekly stakeholder presentations, and a
  hotel-bookings behavior study.

## Skills

Languages: Python, Java, JavaScript/TypeScript, SQL. Libraries/frameworks: PyTorch, TensorFlow, Scikit-learn, LangChain,
Pandas, NumPy, Seaborn, Matplotlib. Core areas: RAG, NLP, deep learning, computer vision,
transformers, reinforcement learning. Visualization: Power BI, Tableau, Plotly, Streamlit.
Tools: Git/GitHub.

## Certifications

Machine Learning Specialization, Supervised Machine Learning, and Advanced Learning Algorithms
(Stanford / DeepLearning.AI); NLP with Attention Models and Introduction to TensorFlow
(DeepLearning.AI); Fundamentals of Reinforcement Learning (University of Alberta); Regression &
Forecasting for Data Scientists (EDUCBA); Causal Inference (Columbia University); AI & ML Course
(Simplilearn); DevOps on AWS Specialization and DevOps on AWS: Code, Build, and Test (Amazon Web
Services); Google Cloud Computing Foundations (Google Cloud).

## This website

The portfolio itself is a project: a docs-site-style portfolio built with Next.js, Fumadocs, and
Tailwind, hosted free on Vercel with the game backend on a Hugging Face Space. The AI twin is a
hybrid RAG pipeline (BM25 + Gemini embeddings, reciprocal rank fusion, build-time JSON index) —
deliberately over-engineered for its tiny corpus because the pipeline itself is the demo. The
retrieval trace visitors can open in the chat UI shows the real chunks and scores behind each answer.
The site's Architecture section documents its four systems on separate pages: the site itself, the
AI twin, the game backend, and the contact pipeline.

## The model picker and twin-llm

Next to the ask button in this chat there is a model picker with two options. **Auto** is the
default: answers are written by Google's Gemini models, with a lighter fallback when the main
one is busy or out of quota for the day. **twin-llm** is a small language model Amritesh is
fine-tuning on his own writing and will host himself. It is currently under construction, so it
shows greyed out in the picker. Once it is live, picking it means slower answers from a much smaller
model, but one that is Amritesh's own and stays awake when Gemini's daily quota runs out. The
model choice only changes who writes the words: every model answers through the same retrieval
pipeline and this same corpus, so the facts stay identical and only the voice changes.
Fine-tuning is for voice; retrieval is for facts.

## What Amritesh is looking for

Amritesh is an AI & ML Associate at Impact Solutions Lab and is happy in the role, so he is not
actively job-hunting right now, but he stays open to genuinely interesting opportunities. The work
that interests him is AI/ML engineering: RAG-based chatbots, NLP, and applied ML, plus reinforcement
learning, automation tooling, and general coding that improves how things work. What he enjoys most
is building chatbots on top of retrieval, writing automation tools, and hands-on work with code and
data: putting ML in front of real use rather than leaving it in a notebook. He is based in India,
prefers a hybrid setup, and is open to relocating for the right role. For anything concrete, such as
specific roles, availability, or timelines, the human answers email at contact@amritesh.net.

## Personal-flavor facts (safe for the twin to share)

- Amritesh has been coding since school, pulled in by teachers, friends, and an uncle, and learned
  by doing: hackathons, tech events, and side projects rather than tutorials alone. After 12th grade
  he chose AI/ML as the field to point those coding skills at, figuring it would be the most fun to
  actually understand.
- As a kid, roughly 7th to 10th grade, he was deep in robotics: building robots, taking classes, and
  travelling to university hackathons and tech events. The build-things-to-learn habit is an old one.
- His reinforcement-learning interest started in the third year of college, thanks to a professor who
  walked the class through the concepts. Hunter Wumpus itself began as a 1 a.m. brainstorm with his
  roommate Gagan Venkat, the paper's co-author, about what their final-year project should be.
- In college he spent a year in the Google Developer Student Club and took second place at Ignite, a
  presentation competition.
- Outside work he games (Brawl Stars, competitively, tournaments and all), listens to a lot of music,
  and watches anime and the usual streaming.
- A hot take he will defend: LLM benchmarks are mostly "trust me bro" marketing, and a model's real
  worth is whether it does the specific thing you need, since no single model does everything
  perfectly. Related: most chatbots people call complicated are, underneath, just RAG.
- How he works: he keeps a lot of markdown docs, a file for nearly everything, and leans on AI to
  speed up writing code rather than to replace his own logic and design decisions.
