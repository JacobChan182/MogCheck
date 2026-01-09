# Start the FastAPI server
.\.venv\Scripts\python.exe -m uvicorn api:app --reload

# Test the Gemini AI endpoint (PowerShell) - now uses query parameters
Invoke-RestMethod -Uri "http://localhost:8000/api/gemini/?prompt=Tell me a short story"

# Or open in browser
# http://localhost:8000/api/gemini/?prompt=Tell me a short story

# Or using curl
curl "http://localhost:8000/api/gemini/?prompt=Tell%20me%20a%20short%20story"

.\.venv\Scripts\python.exe -m uvicorn api:app --reload