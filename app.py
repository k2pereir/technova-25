import gemini_api
from fastapi import FastAPI
import google.generativeai as genai
import os

app = FastAPI()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

@app.get("/")
def home():
    return {"status": "ok"}

@app.post("/generate")
def get_recipe():
    gemini_api.main()
    return {"status": "Recipe generated. Check console output."}

