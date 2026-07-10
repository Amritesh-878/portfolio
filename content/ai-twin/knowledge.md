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

## Project: Wildfire Smoke Detection

Early wildfire smoke detection using the SmokeyNet architecture, a hybrid of CNNs, LSTMs, and Vision
Transformers, trained on the FigLib dataset. The work explored optimization strategies to improve
accuracy, F1, and robustness. It is a past project, not currently active.

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
