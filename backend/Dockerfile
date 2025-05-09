# Use slim Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /code

# Optional: Clean Python env behavior
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy app files
COPY . .

# Start the FastAPI app
CMD ["/bin/bash"]
