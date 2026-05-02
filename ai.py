from fastapi import APIRouter, File, UploadFile

# from fastapi.responses import FileResponse
from pydantic import BaseModel
import ollama
import subprocess
import whisper


router = APIRouter(prefix="/ai")


class Content(BaseModel):
    text: str


@router.post("/")
def generate(content: Content):
    response = ollama.chat(
        model="gemma3:270m",
        messages=[
            {
                "role": "user",
                "content": content.text,
            },
        ],
    )
    r = {
        "role": "assistant",
        "content": response["message"]["content"],
    }
    with open("outputs/generate.txt", "w") as f:
        f.write(r["content"])
    subprocess.run(
        [
            "python",
            "VibeVoice/demo/realtime_model_inference_from_file.py",
            "--model_path",
            "microsoft/VibeVoice-Realtime-0.5B",
            "--txt_path",
            "outputs/generate.txt",
            "--speaker_name",
            "Carter",
        ]
    )  # will generate wav file
    r["audio_url"] = "/outputs/generate_generated.wav"
    print(r)
    return r

    # return FileResponse(
    #     "outputs/generate_generated.wav",  # <-- adjust to your actual output file name
    #     media_type="audio/wav",
    #     filename="speech.wav",
    # )


model = whisper.load_model("tiny")  # load once globally!


@router.post("/voice")
async def generate_from_voice(file: UploadFile = File(...)):
    file_path = "outputs/input.webm"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    result = model.transcribe(file_path)

    c = Content(text=result["text"])
    print(c)
    return generate(c)
