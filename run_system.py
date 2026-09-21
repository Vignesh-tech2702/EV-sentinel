"""
EV-Sentinel Server Launcher & Runner
------------------------------------
Boots FastAPI backend on http://localhost:8000
Serves the Edge AI Engine and the 18-Screen Cyber Mobile App Prototype.
"""

import uvicorn
import os
import sys

if __name__ == "__main__":
    print("=" * 65)
    print("  EV-SENTINEL: SMART CYBERSECURITY FOR CONNECTED EVS")
    print("  Edge AI Autoencoder Engine & Mobile Application Prototype")
    print("=" * 65)
    print("  * Web Simulator:   http://localhost:8000")
    print("  * API Docs (SOC):  http://localhost:8000/docs")
    print("  * Demo Mode:       Available on Web Screen 19 & Floating Pill")
    print("=" * 65)
    
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=False)
