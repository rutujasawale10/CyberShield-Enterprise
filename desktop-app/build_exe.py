# PyInstaller Compilation Pipeline Script for CyberShield.exe
import subprocess
import sys
import os

def build_exe():
    print("[INIT] Compiling CyberShield Desktop Application into CyberShield.exe...")
    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--onefile",
        "--noconsole",
        "--name=CyberShield",
        "--clean",
        "desktop-app/main.py"
    ]
    try:
        res = subprocess.run(cmd, check=True)
        print("\n[SUCCESS] CyberShield.exe built successfully in dist/CyberShield.exe")
    except Exception as e:
        print(f"\n[ERROR] PyInstaller compilation failed: {e}")

if __name__ == "__main__":
    build_exe()
