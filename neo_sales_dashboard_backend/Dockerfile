# Use an official Python runtime as a parent image
FROM python:3.12-slim
# Set environment variables
# Ensures that Python output is sent straight to the terminal without being buffered
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app
COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/

# Create the staticfiles directory if it doesn't exist
RUN mkdir -p staticfiles

RUN python manage.py collectstatic --noinput

EXPOSE 8000

