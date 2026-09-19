import os
from dotenv import load_dotenv

# Load environment variables before any service imports
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import Base, engine
from database import models  # noqa: F401 — registers all models

from routes.profile import router as profile_router
from routes.schemes import router as schemes_router
from routes.eligibility import router as eligibility_router
from routes.chat import router as chat_router
from routes.documents import router as documents_router
from routes.applications import router as applications_router

# Create all database tables
Base.metadata.create_all(bind=engine)

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")

app = FastAPI(
    title="SchemeSaathi AI",
    description=(
        "AI-powered Government Scheme Discovery and Application Readiness platform. "
        "Deterministic eligibility engine with explainable AI grounded in official scheme data."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
if raw_origins == "*":
    allowed_origins = ["*"]
    origin_regex = None
else:
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    origin_regex = r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$|^https://.*\.onrender\.com$"

cors_kwargs = dict(
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if origin_regex:
    cors_kwargs["allow_origin_regex"] = origin_regex

app.add_middleware(CORSMiddleware, **cors_kwargs)

# Register API routers
app.include_router(profile_router)
app.include_router(schemes_router)
app.include_router(eligibility_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(applications_router)


@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "demo_mode": DEMO_MODE,
    }


# ---------------------------------------------------------------------------
# Serve the built React frontend as static files (single-server deployment)
# ---------------------------------------------------------------------------
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

_dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
_dist_path = os.path.normpath(_dist_path)

if os.path.isdir(_dist_path):
    # Serve static assets (JS, CSS, images) under /assets
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(_dist_path, "assets")),
        name="assets",
    )

    # Catch-all: serve index.html for any path not matched by API routes
    # This enables React Router (BrowserRouter) to handle client-side navigation.
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        index = os.path.join(_dist_path, "index.html")
        return FileResponse(index)