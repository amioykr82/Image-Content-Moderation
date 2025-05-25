import torch
from PIL import Image, ImageDraw, ImageFont
from torchvision import transforms
from transformers import CLIPProcessor, CLIPModel
import base64
from io import BytesIO

# Descriptive prompts to improve visual matching
PROMPTS = [
    "woman wearing a bikini",
    "nude person",
    "explicit nudity",
    "man without clothes",
    "woman without clothes",
    "woman in underwear",
    "person injecting heroin",
    "person holding white powder in a plastic bag",
    "masked person breaking into a house",
    "person stealing from a store",
    "person holding a crowbar and breaking a window",
    "person handing over cash for drugs",
    "person setting fire to a building",
    "person tagging graffiti on a wall at night",
    "person aiming a handgun at someone",
    "person with bloody knife",
    "person with bruised face and black eye",
    "person kicking another person on the ground",
    "man holding an assault rifle in public",
    "explosion in a public area",
    "severed body parts or gore",
    "pool of blood on the ground",
    "bullet holes on a wall"
]

# Mapping prompts to master categories
LABEL_MAP = {
    # Nudity
    "woman wearing a bikini": "nudity",
    "nude person": "nudity",
    "explicit nudity": "nudity",
    "woman without clothes": "nudity",
    "woman in less clothes": "nudity",
    "man without clothes": "nudity",
    "woman in underwear": "nudity",

    # Crime
    "person injecting heroin": "crime",
    "person holding white powder in a plastic bag": "crime",
    "masked person breaking into a house": "crime",
    "person stealing from a store": "crime",
    "person holding a crowbar and breaking a window": "crime",
    "person handing over cash for drugs": "crime",
    "person setting fire to a building": "crime",
    "person tagging graffiti on a wall at night": "crime",

    # Violence
    "person aiming a handgun at someone": "violence",
    "person with bloody knife": "violence",
    "person with bruised face and black eye": "violence",
    "person kicking another person on the ground": "violence",
    "man holding an assault rifle in public": "violence",
    "explosion in a public area": "violence",
    "severed body parts or gore": "violence",
    "pool of blood on the ground": "violence",
    "bullet holes on a wall": "violence"
}

THRESHOLD = 0.65

# Load CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model.eval()

def get_labels_and_annotate(image_path):
    try:
        image = Image.open(image_path).convert("RGB")
    except Exception as e:
        print(f"❌ Failed to open image: {e}")
        return [], ""

    inputs = processor(text=PROMPTS, images=image, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1).squeeze().tolist()

    raw_labels = [(PROMPTS[i], round(probs[i], 2)) for i in range(len(PROMPTS)) if probs[i] >= THRESHOLD]
    
    # Deduplicate mapped labels
    unified_labels = {}
    for raw_label, score in raw_labels:
        mapped_label = LABEL_MAP[raw_label]
        if mapped_label not in unified_labels or score > unified_labels[mapped_label]:
            unified_labels[mapped_label] = score

    result_labels = [(label, round(score, 2)) for label, score in unified_labels.items()]

    # Annotate image
    draw = ImageDraw.Draw(image)
    try:
        font = ImageFont.truetype("arial.ttf", 32)
    except:
        font = ImageFont.load_default()

    y = 15
    for label, score in result_labels:
        draw.text((15, y), f"{label}: {score}", fill="red", font=font)
        y += 40

    buf = BytesIO()
    image.save(buf, format="JPEG")
    encoded_image = base64.b64encode(buf.getvalue()).decode("utf-8")

    return result_labels, encoded_image
