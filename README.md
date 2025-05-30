# 🛡️ Image Content Moderation System

This project provides an AI-powered image moderation tool that classifies uploaded images as **"appropriate"** or **"inappropriate"** using a pretrained OpenAI CLIP (ViT-B/32) model. The system is designed to detect content that violates platform or community policies in categories like **nudity**, **violence**, and **crime**.

---

## 🚀 Features

- 🔍 **Image Upload & Review** via React UI  
- 🎯 **CLIP-based Visual Matching** for content labeling  
- 🧠 **OpenAI GPT Explanation** for moderation decisions  
- 🖼️ **Annotated Images** with category labels  
- 💬 **Professional UI/UX Styling**  
- ☁️ **Deployable on Railway.app** with domain binding  
- 🧪 Designed for real-time use cases in **retail**, **e-commerce**, **marketplaces**, and **ad tech**  


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

## 📁 Folder Structure

Image-Content-Moderation/
├── backend/ # FastAPI backend
│ ├── main.py # Entry point
│ ├── labeler.py # CLIP + annotation logic
│ └── models/ # Saved/fine-tuned model files (optional)
├── frontend/ # React frontend
│ └── src/
│ ├── App.js # React UI logic
│ ├── App.css # Enhanced professional styles
├── requirements.txt # Backend Python requirements
├── Dockerfile # For containerized deployment
├── render.yaml (optional) # For Render deployments
└── README.md # You’re here

## 🧠 Technologies Used

| Layer      | Tech Stack                               |
|------------|-------------------------------------------|
| Frontend   | React, Axios, HTML/CSS                   |
| Backend    | FastAPI, OpenAI, HuggingFace Transformers |
| ML Models  | `openai/clip-vit-base-patch32`           |
| Hosting    | Railway.app (Frontend + Backend)         |
| Deployment | GitHub → Railway CI/CD    
