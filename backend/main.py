import os
import shutil
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.labeler import get_labels_and_annotate
from openai import OpenAI

# ✅ Correct initialization for openai>=1.0.0
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModerationResponse(BaseModel):
    decision: str
    labels: list
    explanation: str
    annotated_image: str

def get_reasoning(predicted_labels, decision):
    tag_list = ", ".join([lbl for lbl, _ in predicted_labels])
    prompt = (
        f"The image was classified as **{decision.upper()}** because it contains: {tag_list}.\n"
        "Please explain why these tags make the image appropriate or inappropriate for publishing on a retail platform.\n"
        "Conclude with a recommended moderation action (allow, review, reject)."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"(⚠️ GPT Error: {e})"

@app.post("/moderate/", response_model=ModerationResponse)
async def moderate_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    predicted_labels, annotated_image = get_labels_and_annotate(temp_path)

    has_inappropriate = any(lbl in ["nudity", "crime", "violence"]
                            for lbl, _ in predicted_labels)
    decision = "inappropriate" if has_inappropriate else "appropriate"
    explanation = get_reasoning(predicted_labels, decision)

    os.remove(temp_path)

    return ModerationResponse(
        decision=decision,
        labels=predicted_labels,
        explanation=explanation,
        annotated_image=annotated_image
    )
