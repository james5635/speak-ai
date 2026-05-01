from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# import items 
import ai 
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(items.router, prefix='/api')
app.include_router(ai.router, prefix='/api')

@app.get("/")
def read_root():
    return {"hello": "world"}

