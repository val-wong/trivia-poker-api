import os
import json
import random
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()
ENV = os.getenv("ENV", "development")

app = FastAPI()

# ✅ CORS config
allowed_origins = (
    ["https://poker-trivia-frontend.onrender.com"]
    if ENV == "production"
    else ["http://localhost:5173", "http://localhost:5176", "http://localhost:5177"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ✅ Load deduplicated questions
QUESTIONS_PATH = Path(__file__).resolve().parent / "questions_unique.json"
with open(QUESTIONS_PATH, "r") as f:
    questions = json.load(f)

# ✅ Daily question logic
def get_daily_question():
    seed = datetime.now().strftime("%Y-%m-%d")
    random.seed(seed)
    return random.choice(questions)

# ✅ Routes
@app.get("/")
@limiter.limit("50/minute")
def root(request: Request):
    return {
        "message": "👋 Welcome to the Poker Trivia API!",
        "docs": "/docs",
        "endpoints": {
            "daily": "/trivia/daily",
            "random": "/trivia/random",
            "search": "/trivia/search?q=...",
        },
    }

@app.get("/trivia/daily")
@limiter.limit("50/minute")
def trivia_daily(request: Request):
    return get_daily_question()

@app.get("/trivia/random")
@limiter.limit("50/minute")
def trivia_random(request: Request):
    return random.choice(questions)

@app.get("/trivia/search")
@limiter.limit("50/minute")
def search_trivia(q: str = Query(...), request: Request = None):
    results = [
        item for item in questions
        if item.get("question") and q.lower() in item["question"].lower()
    ]
    return {"query": q, "results": results}

