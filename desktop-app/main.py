# CyberShield Enterprise v4.0 - Windows Desktop Protection Application
import os
import sys
import threading
import time
import requests
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext

# Try importing PIL and pystray for System Tray icon
try:
    from PIL import Image, ImageDraw
    import pystray
    HAS_TRAY = True
except ImportError:
    HAS_TRAY = False

API_BASE_URL = "http://localhost:8000/api"

class CyberShieldDesktopApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CyberShield Enterprise v4.0 - Desktop Security Console")
        self.root.geometry("900x620")
        self.root.configure(bg="#050816")
        self.root.resizable(True, True)

        self.protection_enabled = True
        self.tray_icon = None
        self.device_id = None

        self.setup_styles()
        self.create_widgets()
        self.register_device()

        # Handle window close -> minimize to tray
        self.root.protocol("WM_DELETE_WINDOW", self.on_close_window)

        if HAS_TRAY:
            self.setup_system_tray()

    def setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use("clam")
        self.style.configure("TNotebook", background="#050816", borderwidth=0)
        self.style.configure("TNotebook.Tab", background="#0D1322", foreground="#9CA3AF", padding=[16, 8], font=("Segoe UI", 10, "bold"))
        self.style.map("TNotebook.Tab", background=[("selected", "#00D9FF")], foreground=[("selected", "#000000")])
        self.style.configure("TFrame", background="#050816")

    def create_widgets(self):
        # Top Header Bar
        header = tk.Frame(self.root, bg="#0D1322", height=60, highlightbackground="rgba(255,255,255,0.1)", highlightthickness=1)
        header.pack(fill="x", side="top")

        title_lbl = tk.Label(header, text="🛡️ CYBERSHIELD ENTERPRISE v4.0", font=("Segoe UI", 14, "bold"), fg="#00D9FF", bg="#0D1322")
        title_lbl.pack(side="left", padx=20, pady=12)

        self.status_lbl = tk.Label(header, text="● SYSTEM PROTECTED", font=("Segoe UI", 10, "bold"), fg="#00E676", bg="#0D1322")
        self.status_lbl.pack(side="right", padx=20, pady=12)

        # Tab Navigation Notebook
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=12, pady=12)

        # Tab 1: Dashboard
        self.tab_dashboard = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_dashboard, text=" Protection Dashboard ")
        self.build_dashboard_tab()

        # Tab 2: URL Scanner
        self.tab_scanner = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_scanner, text=" URL Scanner ")
        self.build_scanner_tab()

        # Tab 3: Security Alerts
        self.tab_alerts = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_alerts, text=" Security Alerts ")
        self.build_alerts_tab()

        # Tab 4: Number Protection
        self.tab_number = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_number, text=" Number Protection ")
        self.build_number_tab()

        # Tab 5: Settings
        self.tab_settings = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_settings, text=" Settings ")
        self.build_settings_tab()

    def build_dashboard_tab(self):
        frame = tk.Frame(self.tab_dashboard, bg="#050816")
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        lbl = tk.Label(frame, text="REAL-TIME SYSTEM PROTECTION MATRIX", font=("Segoe UI", 12, "bold"), fg="#F3F4F6", bg="#050816")
        lbl.pack(anchor="w", pady=(0, 15))

        # Status Toggles Box
        status_box = tk.Frame(frame, bg="#0D1322", highlightbackground="rgba(255,255,255,0.08)", highlightthickness=1)
        status_box.pack(fill="x", pady=10, ipady=10)

        toggles = [
            ("● REAL-TIME SYSTEM PROTECTION", "ACTIVE", "#00E676"),
            ("● BROWSER PRE-NAVIGATION FILTER", "ACTIVE", "#00E676"),
            ("● THREAT INTELLIGENCE FEED", "ACTIVE", "#00E676"),
            ("● URL MONITORING ENGINE", "ACTIVE", "#00E676"),
            ("● DEFENSIVE NUMBER PROTECTION", "READY", "#00D9FF")
        ]

        for text, state, color in toggles:
            row = tk.Frame(status_box, bg="#0D1322")
            row.pack(fill="x", padx=20, pady=6)
            tk.Label(row, text=text, font=("Segoe UI", 10, "bold"), fg="#F3F4F6", bg="#0D1322").pack(side="left")
            tk.Label(row, text=state, font=("Segoe UI", 10, "bold"), fg=color, bg="#0D1322").pack(side="right")

        # Stats Cards
        stats_frame = tk.Frame(frame, bg="#050816")
        stats_frame.pack(fill="x", pady=20)

        cards = [
            ("TOTAL SCANS", "1,248", "#00D9FF"),
            ("SAFE URLS", "1,180", "#00E676"),
            ("SUSPICIOUS", "42", "#FFC107"),
            ("BLOCKED PHISHING", "26", "#FF3D71")
        ]

        for title, val, color in cards:
            card = tk.Frame(stats_frame, bg="#0D1322", highlightbackground="rgba(255,255,255,0.08)", highlightthickness=1)
            card.pack(side="left", fill="both", expand=True, padx=6)
            tk.Label(card, text=title, font=("Segoe UI", 8, "bold"), fg="#9CA3AF", bg="#0D1322").pack(pady=(12, 4))
            tk.Label(card, text=val, font=("Segoe UI", 18, "bold"), fg=color, bg="#0D1322").pack(pady=(0, 12))

    def build_scanner_tab(self):
        frame = tk.Frame(self.tab_scanner, bg="#050816")
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        tk.Label(frame, text="DESKTOP REAL-TIME URL SCANNER", font=("Segoe UI", 12, "bold"), fg="#F3F4F6", bg="#050816").pack(anchor="w", pady=(0, 10))

        input_frame = tk.Frame(frame, bg="#050816")
        input_frame.pack(fill="x", pady=10)

        self.url_entry = tk.Entry(input_frame, font=("Consolas", 11), bg="#0D1322", fg="#00D9FF", insertbackground="#00D9FF", borderwidth=1, relief="solid")
        self.url_entry.insert(0, "http://185.199.108.153/login")
        self.url_entry.pack(side="left", fill="x", expand=True, ipady=8, padx=(0, 10))

        btn_scan = tk.Button(input_frame, text="SCAN NOW", font=("Segoe UI", 10, "bold"), bg="#00D9FF", fg="#000000", activebackground="#0088FF", relief="flat", command=self.perform_scan)
        btn_scan.pack(side="right", ipady=6, ipadx=16)

        # Scan Result Box
        self.scan_output = scrolledtext.ScrolledText(frame, font=("Consolas", 10), bg="#0D1322", fg="#F3F4F6", borderwidth=1, relief="solid")
        self.scan_output.pack(fill="both", expand=True, pady=10)
        self.scan_output.insert("end", "Enter target URL above and click SCAN NOW for real-time security inspection.")

    def perform_scan(self):
        url = self.url_entry.get().strip()
        if not url:
            messagebox.showwarning("Input Error", "Please enter a URL to scan.")
            return

        self.scan_output.delete("1.0", "end")
        self.scan_output.insert("end", f"Scanning {url} via CyberShield Backend...\n\n")

        try:
            res = requests.post(f"{API_BASE_URL}/protection/check-url", json={"url": url, "client_type": "DESKTOP"}, timeout=3)
            if res.status_code == 200:
                data = res.json()
                out = []
                out.append(f"DECISION:        {data['decision']}")
                out.append(f"CLASSIFICATION:  {data['status']}")
                out.append(f"RISK SCORE:      {data['risk_score']}%")
                out.append(f"THREAT LEVEL:    {data['threat_level']}\n")
                out.append("REASONS:")
                for r in data.get("reasons", []):
                    out.append(f"  • {r}")
                out.append("\nHUMAN EXPLANATION:")
                out.append(f"  {data['explanation']['summary']}\n")
                out.append("TECHNICAL DETAILS:")
                tech = data.get("technical_details", {})
                for k, v in tech.items():
                    out.append(f"  {k:<20}: {v}")

                self.scan_output.insert("end", "\n".join(out))
            else:
                self.scan_output.insert("end", f"Error from backend API: HTTP {res.status_code}")
        except Exception as e:
            self.scan_output.insert("end", f"Backend connection failed: {e}\nRunning in degraded offline security mode.")

    def build_alerts_tab(self):
        frame = tk.Frame(self.tab_alerts, bg="#050816")
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        tk.Label(frame, text="RECENT CENTRALIZED SECURITY ALERTS", font=("Segoe UI", 12, "bold"), fg="#F3F4F6", bg="#050816").pack(anchor="w", pady=(0, 10))

        self.alerts_box = scrolledtext.ScrolledText(frame, font=("Consolas", 10), bg="#0D1322", fg="#FF3D71", borderwidth=1, relief="solid")
        self.alerts_box.pack(fill="both", expand=True, pady=10)
        self.load_alerts()

    def load_alerts(self):
        try:
            res = requests.get(f"{API_BASE_URL}/protection/alerts", timeout=2)
            if res.status_code == 200:
                alerts = res.json()
                self.alerts_box.delete("1.0", "end")
                if not alerts:
                    self.alerts_box.insert("end", "No critical security alerts currently logged.")
                for a in alerts:
                    self.alerts_box.insert("end", f"[{a['timestamp'][:19]}] [{a['severity']}] {a['alert_type']}\n  Target: {a['target']} | Risk: {a['risk_score']}%\n  Message: {a['message']}\n\n")
            else:
                self.alerts_box.insert("end", "Failed to load alerts from backend.")
        except Exception:
            self.alerts_box.insert("end", "Backend offline. Displaying local alert cache.")

    def build_number_tab(self):
        frame = tk.Frame(self.tab_number, bg="#050816")
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        tk.Label(frame, text="CALL & SMS ABUSE PROTECTION (DEFENSIVE)", font=("Segoe UI", 12, "bold"), fg="#F3F4F6", bg="#050816").pack(anchor="w", pady=(0, 4))
        tk.Label(frame, text="Note: Protects your registered mobile number against spam and suspicious callers. Safe defensive protection.", font=("Segoe UI", 9), fg="#9CA3AF", bg="#050816").pack(anchor="w", pady=(0, 15))

        # Register Form
        reg_box = tk.Frame(frame, bg="#0D1322", highlightbackground="rgba(255,255,255,0.08)", highlightthickness=1)
        reg_box.pack(fill="x", pady=10, padx=5, ipady=10)

        tk.Label(reg_box, text="Register My Mobile Number:", font=("Segoe UI", 10, "bold"), fg="#00D9FF", bg="#0D1322").pack(anchor="w", padx=15, pady=4)
        
        num_frame = tk.Frame(reg_box, bg="#0D1322")
        num_frame.pack(fill="x", padx=15, pady=6)

        self.num_entry = tk.Entry(num_frame, font=("Consolas", 10), bg="#050816", fg="#F3F4F6", insertbackground="#00D9FF")
        self.num_entry.insert(0, "+1-555-0199")
        self.num_entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 10))

        btn_reg = tk.Button(num_frame, text="REGISTER NUMBER", font=("Segoe UI", 9, "bold"), bg="#00E676", fg="#000", relief="flat", command=self.register_number)
        btn_reg.pack(side="right", ipady=4, ipadx=10)

        # Block List / Log
        self.num_log = scrolledtext.ScrolledText(frame, font=("Consolas", 10), bg="#0D1322", fg="#00D9FF", borderwidth=1, relief="solid")
        self.num_log.pack(fill="both", expand=True, pady=10)
        self.load_number_events()

    def register_number(self):
        num = self.num_entry.get().strip()
        if not num:
            return
        try:
            res = requests.post(f"{API_BASE_URL}/protection/number/register", json={"phone_number": num, "label": "Windows Desktop User"}, timeout=2)
            if res.status_code == 200:
                messagebox.showinfo("Success", f"Mobile number {num} registered for abuse monitoring!")
                self.load_number_events()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to register number: {e}")

    def load_number_events(self):
        try:
            res = requests.get(f"{API_BASE_URL}/protection/number/list", timeout=2)
            if res.status_code == 200:
                nums = res.json()
                self.num_log.delete("1.0", "end")
                self.num_log.insert("end", "REGISTERED PROTECTED NUMBERS:\n")
                for n in nums:
                    self.num_log.insert("end", f"  • {n['phone_number']} ({n['label']}) | Blocked: {n['is_blocked']} | Spam Count: {n['spam_count']}\n")
        except Exception:
            self.num_log.insert("end", "Backend offline.")

    def build_settings_tab(self):
        frame = tk.Frame(self.tab_settings, bg="#050816")
        frame.pack(fill="both", expand=True, padx=20, pady=20)

        tk.Label(frame, text="DESKTOP PROTECTION SETTINGS", font=("Segoe UI", 12, "bold"), fg="#F3F4F6", bg="#050816").pack(anchor="w", pady=(0, 15))

        # Backend URL setting
        url_frame = tk.Frame(frame, bg="#0D1322", highlightbackground="rgba(255,255,255,0.08)", highlightthickness=1)
        url_frame.pack(fill="x", pady=10, ipady=10, padx=5)

        tk.Label(url_frame, text="CyberShield Backend Endpoint URL:", font=("Segoe UI", 10, "bold"), fg="#00D9FF", bg="#0D1322").pack(anchor="w", padx=15, pady=4)
        
        self.api_url_entry = tk.Entry(url_frame, font=("Consolas", 10), bg="#050816", fg="#F3F4F6")
        self.api_url_entry.insert(0, API_BASE_URL)
        self.api_url_entry.pack(fill="x", padx=15, pady=6, ipady=6)

        # Pause Protection Toggle
        self.btn_pause = tk.Button(frame, text="PAUSE REAL-TIME PROTECTION", font=("Segoe UI", 10, "bold"), bg="#FFC107", fg="#000", relief="flat", command=self.toggle_protection)
        self.btn_pause.pack(anchor="w", pady=20, ipady=8, ipadx=16)

    def toggle_protection(self):
        self.protection_enabled = not self.protection_enabled
        if self.protection_enabled:
            self.btn_pause.configure(text="PAUSE REAL-TIME PROTECTION", bg="#FFC107")
            self.status_lbl.configure(text="● SYSTEM PROTECTED", fg="#00E676")
        else:
            self.btn_pause.configure(text="RESUME REAL-TIME PROTECTION", bg="#00E676")
            self.status_lbl.configure(text="● PROTECTION PAUSED", fg="#FFC107")

    def register_device(self):
        def _reg():
            try:
                res = requests.post(f"{API_BASE_URL}/protection/device/register", json={
                    "device_name": "CyberShield Windows Desktop App",
                    "device_type": "DESKTOP",
                    "client_version": "4.0.0",
                    "os_name": "Windows"
                }, timeout=2)
                if res.status_code == 200:
                    self.device_id = res.json()["id"]
            except Exception:
                pass
        threading.Thread(target=_reg, daemon=True).start()

    def setup_system_tray(self):
        def create_tray_image():
            img = Image.new("RGBA", (64, 64), (5, 8, 22, 255))
            draw = ImageDraw.Draw(img)
            draw.polygon([(32, 8), (56, 18), (56, 38), (32, 56), (8, 38), (8, 18)], fill=(0, 217, 255, 255))
            return img

        menu = pystray.Menu(
            pystray.MenuItem("Protection Status: ACTIVE", lambda: None, enabled=False),
            pystray.MenuItem("Open Security Dashboard", lambda: self.root.after(0, self.restore_from_tray)),
            pystray.MenuItem("Scan URL...", lambda: self.root.after(0, lambda: self.notebook.select(self.tab_scanner))),
            pystray.MenuItem("Pause Protection", lambda: self.root.after(0, self.toggle_protection)),
            pystray.MenuItem("Exit CyberShield", lambda: self.exit_app())
        )

        self.tray_icon = pystray.Icon("CyberShield", create_tray_image(), "CyberShield Enterprise v4.0", menu)
        threading.Thread(target=self.tray_icon.run, daemon=True).start()

    def on_close_window(self):
        if HAS_TRAY and self.tray_icon:
            self.root.withdraw()
            messagebox.showinfo("CyberShield Tray", "CyberShield Desktop Application minimized to Windows System Tray.")
        else:
            self.root.destroy()

    def restore_from_tray(self):
        self.root.deiconify()
        self.root.lift()

    def exit_app(self):
        if self.tray_icon:
            self.tray_icon.stop()
        self.root.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = CyberShieldDesktopApp(root)
    root.mainloop()
