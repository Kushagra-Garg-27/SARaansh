from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import db

# Import Routes
from routes import cases, dashboard, reports

app = FastAPI(
    title="SARaansh Backend",
    description="Enterprise AML Compliance Backend",
    version="1.0.0"
)

# CORS Configuration
# In production, allow_origins should be restricted to the specific frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database Pool on Startup
@app.on_event("startup")
def startup_event():
    db.initialize()

# Close Database Pool on Shutdown
@app.on_event("shutdown")
def shutdown_event():
    db.close()

# Include Routers
app.include_router(dashboard.router)
app.include_router(cases.router)
app.include_router(reports.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SARaansh API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
