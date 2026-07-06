# AI Twin knowledge corpus — Amritesh Praveen

> **Amritesh: this file is what your twin knows. Review every fact before launch — especially
> the items marked ⚠️. The twin is instructed to never answer beyond this corpus, so anything
> missing here is something it will decline to discuss. Add sections freely; the indexer
> chunks by heading, so keep one topic per heading.**

## Identity

Amritesh Praveen is an AI/ML engineer from India, early in his career and recently graduated.
He works primarily on retrieval-augmented generation (RAG) systems, chatbots, NLP, and applied
reinforcement learning. GitHub: github.com/Amritesh-878 · LinkedIn: linkedin.com/in/amritesh-praveen
· Email: amritesh.praveen@gmail.com.

## Current role

Amritesh is an **AI & ML Associate at Impact Solutions Lab (ISL)** — an initiative of the AAM
Foundation — a full-time role he began on **June 1, 2026**, working on the Program and Curriculum
vertical. He first joined ISL as an **AI & ML Intern from October 2025 to May 2026**. During the
internship he built internal automation (a Drive-to-YouTube pipeline that extracts class
recordings and runs on GitHub Actions; a Zoom attendance-reporting tool) and the Adira Academy
entrance-exam portal used by 300+ students, and laid the groundwork for a production Text-to-SQL
pipeline on the AI for Social Impact (AI for SI) DataHub.

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

## Project: Mental Health RAG Chatbot

A retrieval-augmented chatbot for mental-health domain content: Groq-hosted LLM, LangChain
orchestration, Chroma vector store, Sentence-Transformers embeddings, with both CLI and Chainlit
web UIs and environment-based configuration. Its ideas (grounded answers, careful scope) are the
direct ancestor of the AI twin on this site.

## Project: Cognizant Hackathon RAG application

A competitive RAG system for document intelligence built during the Cognizant hackathon:
LangChain + vector database + embedding models for semantic retrieval and QA, with work focused
on prompt management, context chunking, response evaluation, and inference speed.

## Project: Wildfire Smoke Detection (ongoing)

Early wildfire smoke detection using the SmokeyNet architecture — a hybrid of CNNs, LSTMs, and
Vision Transformers — trained on the FigLib dataset. Current focus: optimization strategies to
improve accuracy, F1, and robustness.

## Project: YouTube Trending Analysis Dashboard

Analysis of the Kaggle Trending YouTube dataset across the US and India: engagement-metric
exploration in Python (Pandas), visualized with Matplotlib/Seaborn/Plotly/WordCloud, delivered
as an interactive Streamlit dashboard.

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

Languages: Python, Java, SQL. Libraries/frameworks: PyTorch, TensorFlow, Scikit-learn, LangChain,
Pandas, NumPy, Seaborn, Matplotlib. Core areas: RAG, NLP, deep learning, computer vision,
transformers, reinforcement learning. Visualization: Power BI, Tableau, Plotly, Streamlit.
Tools: Git/GitHub.

## Certifications

Machine Learning Specialization (Stanford, Coursera); NLP with Attention Models (DeepLearning.AI);
Intro to TensorFlow (DeepLearning.AI); Fundamentals of Reinforcement Learning (University of
Alberta); AI & ML Fundamentals (IBM SkillsBuild); Machine Learning with Python (Udemy); Generative
AI Tools using Python (MSME, Govt. of India); Python Programming Essentials (Rice University);
SQL & PostgreSQL (Udemy).

## This website

The portfolio itself is a project: a docs-site-style portfolio built with Next.js, Fumadocs, and
Tailwind, hosted free on Vercel with the game backend on a Hugging Face Space. The AI twin is a
hybrid RAG pipeline (BM25 + Gemini embeddings, reciprocal rank fusion, build-time JSON index) —
deliberately over-engineered for its tiny corpus because the pipeline itself is the demo. The
retrieval trace visitors can open in the chat UI shows the real chunks and scores behind each answer.

## What Amritesh is looking for

⚠️ *(Amritesh: fill this in honestly — roles, locations, visa/relocation notes, what kind of team
excites you. The twin gets asked this constantly and can only answer from here.)*

## Personal-flavor facts (safe for the twin to share)

⚠️ *(Amritesh: add 5–10 humanizing facts — hobbies, favorite tools, how you got into AI, a hot
take on RAG evaluation, what you're learning now. This is what makes the twin feel like you and
not a resume reader. The twin declines personal topics not listed here.)*
