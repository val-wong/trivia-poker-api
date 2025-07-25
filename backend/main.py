import random
import json
from fastapi import FastAPI
from pathlib import Path

app = FastAPI()

DATA_PATH = Path(__file__).parent / "questions.json"

@app.get("/")
def root():
    return {
        "message": "👋 Welcome to the Poker Trivia API!",
        "docs": "/docs",
        "endpoints": {
            "daily": "/trivia/daily",
            "random": "/trivia/random",
            "search": "/trivia/search?q=..."
        }
    }

@app.get("/trivia/random")
def get_random_question():
    with open(DATA_PATH, "r") as f:
        questions = json.load(f)
    return random.choice(questions)
