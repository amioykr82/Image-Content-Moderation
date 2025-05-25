FROM python:3.10-slim

# Install system dependencies for distutils and OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    python3-distutils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the backend code
COPY backend/ .

# Expose FastAPI port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
