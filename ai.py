from fastapi import APIRouter
from pydantic import BaseModel
import ollama

router = APIRouter(prefix="/ai")

class Content(BaseModel):
    text: str

@router.post("/")
def generate(content: Content):
    response = ollama.chat(
        model="gemma4:31b-cloud",
        messages=[
            {
                "role": "user",
                "content": content.text,
            },
        ],
    )
    r = {"role": "assistant", "content": response["message"]["content"]}
    print(r)
    return r
