# 🛡️ Image Content Moderation System

This project provides an AI-powered image moderation tool that classifies uploaded images as **"appropriate"** or **"inappropriate"** using a pretrained OpenAI CLIP (ViT-B/32) model. The system is designed to detect content that violates platform or community policies in categories like **nudity**, **violence**, and **crime**.

---

## 🚀 Features

- 🔍 Zero-shot classification using CLIP
- 🧠 GPT-4-based reasoning and moderation summaries
- 📌 Real-time image annotation and moderation decision
- 🌐 React frontend + FastAPI backend
- 🧰 Easy-to-deploy (locally or cloud)

---

## 🔐 Inappropriate Categories

### 1. **Nudity**
Images are flagged if they depict:
- Women wearing bikinis or underwear
- Fully nude individuals
- Explicit adult content or suggestive poses

### 2. **Violence**
Visual cues include:
- Firearms aimed at people
- Blood, gore, or physical injuries
- Assault or public weapon display
- Explosions, bullet holes, or aftermath of violence

### 3. **Crime**
Visual indicators:
- Drug use (injection, substances)
- Burglary (breaking windows, masks)
- Theft or shoplifting
- Arson or graffiti

---

