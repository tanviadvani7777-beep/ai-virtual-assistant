import subprocess
import os
import sys
import time

backend_dir = os.path.join(os.path.dirname(__file__), "backend")
frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")

os.environ["PATH"] = r"C:\Program Files\nodejs;" + os.environ.get("PATH", "")

print("=" * 60)
print("Starting AI Virtual Assistant (Backend + Frontend)...")
print("=" * 60)

backend_proc = subprocess.Popen([r"C:\Program Files\nodejs\node.exe", "index.js"], cwd=backend_dir)
print(f"[*] Backend server started (PID: {backend_proc.pid}) on port 8000")

time.sleep(2)

frontend_proc = subprocess.Popen([r"C:\Program Files\nodejs\npm.cmd", "run", "dev", "--", "--port", "5173"], cwd=frontend_dir)
print(f"[*] Frontend server started (PID: {frontend_proc.pid}) on port 5173")

print("\nApp is ready! Open http://localhost:5173 in your browser.")
print("Press Ctrl+C to stop both servers.\n")

try:
    while True:
        time.sleep(1)
        if backend_proc.poll() is not None:
            print("Backend stopped unexpectedly")
            break
        if frontend_proc.poll() is not None:
            print("Frontend stopped unexpectedly")
            break
except KeyboardInterrupt:
    print("\nStopping servers...")
    backend_proc.terminate()
    frontend_proc.terminate()
