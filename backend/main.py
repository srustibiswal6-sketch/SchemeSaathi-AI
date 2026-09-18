from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import Base, engine
from database import models

from routes.profile import router as profile_router
from routes.schemes import router as schemes_router
from routes.eligibility import router as eligibility_router
from routes.chat import router as chat_router
from routes.documents import router as documents_router
from routes.applications import router as applications_router


# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SchemeSaathi AI",
    description="AI-powered Government Scheme Discovery Assistant",
    version="1.0.0"
)

# CORS configuration for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(profile_router)
app.include_router(schemes_router)
app.include_router(eligibility_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(applications_router)


@app.get("/")
def home():
    return {
        "message": "SchemeSaathi AI backend is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }