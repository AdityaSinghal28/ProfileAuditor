from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from app.api.routes import router as api_router

app = FastAPI(title="ProfileAuditor Backend", version="0.1.0")

# Configure CORS with explicit trusted origins
origins_env = os.getenv("ALLOWED_ORIGINS", "")
if origins_env.strip():
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    allow_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router with /api prefix
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ProfileAuditor Backend API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.options("/{path:path}")
def options_handler(path: str):
    return {"message": "OK"}
