import json
from pathlib import Path

input_path = Path(__file__).resolve().parent.parent / "questions.json"
output_path = Path(__file__).resolve().parent / "questions_unique.json"

with open(input_path, "r") as f:
    questions = json.load(f)

seen = set()
unique_questions = []

for q in questions:
    if q["question"] not in seen:
        unique_questions.append(q)
        seen.add(q["question"])

with open(output_path, "w") as f:
    json.dump(unique_questions, f, indent=2)

print(f"✅ Deduplicated: {len(unique_questions)} unique questions saved to {output_path}")
