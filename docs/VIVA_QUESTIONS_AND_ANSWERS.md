# Final Year Project Defense - Viva Voce Questions & Answers
## Subject: Phishing Website Detection System Using Machine Learning

---

## Category 1: Machine Learning & Data Science (15 Questions)

### Q1: Why did you choose Random Forest over simple Logistic Regression or Naive Bayes?
**Answer**: Random Forest is an ensemble learning method based on decision trees that handles non-linear feature relationships, high feature variance, and feature interactions exceptionally well without suffering from overfitting. Unlike Logistic Regression, Random Forest can capture complex non-linear combinations of lexical features (e.g., high hyphen count combined with suspicious TLDs).

### Q2: What is Shannon Entropy and why is it used in URL feature extraction?
**Answer**: Shannon Entropy measures the degree of randomness or impurity in a string of text. Phishing attackers often use randomized string generation (Domain Generation Algorithms - DGAs) or obfuscated URL paths. A higher entropy value (>4.5) indicates suspicious string randomness typical of obfuscated phishing links.

### Q3: What features did you extract from the URL?
**Answer**: We extract 20+ features categorized into:
1. **Lexical Features**: URL length, hostname length, count of dots, hyphens, `@` symbol, digits, subdomain count, and Shannon Entropy.
2. **Host/Protocol Features**: HTTPS status, raw IP address hosting check, URL shortener detection (`bit.ly`), non-standard port checks.
3. **Pattern Features**: Typosquatting/brand spoofing detection (`amaz0n`, `paytm-secure`), presence of high-risk TLDs (`.xyz`, `.top`), and sensitive keywords (`login`, `verify`, `banking`).

### Q4: What metrics did you use to evaluate your ML model?
**Answer**: We evaluated using Accuracy, Precision, Recall, F1-Score, and ROC-AUC score. In phishing detection, **Precision** (minimizing false positives where safe sites are labeled phishing) and **Recall** (minimizing false negatives where dangerous sites bypass detection) are crucial; hence the **F1-Score (97.5%)** is our primary benchmark.

### Q5: How do you handle zero-day phishing attacks?
**Answer**: Unlike static blacklists which fail against brand-new URLs, our model extracts structural, lexical, and heuristic traits inherent to phishing URLs (e.g. brand spoofing, lack of HTTPS, high entropy, raw IP usage). Therefore, it can detect previously unseen (zero-day) phishing domains in real-time.

---

## Category 2: Cyber Security & Web Security (15 Questions)

### Q6: What is Typosquatting and how does your system detect it?
**Answer**: Typosquatting (URL hijacking) is a technique where attackers register domain names that mimic famous brands using common typographical errors or visual substitution (e.g., substituting `o` with `0` in `amaz0n`, or adding hyphens like `paytm-secure-login.xyz`). Our system uses regex pattern matching, brand dictionary lookups, and character entropy checks to flag fake brand domain patterns.

### Q7: Why is the presence of an `@` symbol in a URL considered a security threat?
**Answer**: In the URI syntax specification (RFC 3986), characters preceding an `@` symbol are treated as user credentials (`http://username:password@actual-domain.com`). Attackers use this trick (e.g., `http://paypal.com@malicious-site.xyz`) to confuse users into believing they are visiting `paypal.com` when the browser actually connects to `malicious-site.xyz`.

### Q8: Why is hosting a website on a raw IP address suspicious?
**Answer**: Legitimate organizations use domain names with proper DNS records and SSL certificates. Phishing campaigns often use temporary server IP addresses (e.g., `http://192.168.1.100/login.html`) to bypass domain registration fees and fast-flux domain revocation.

### Q9: What is the significance of HTTPS vs HTTP in phishing detection?
**Answer**: HTTPS uses SSL/TLS encryption to ensure data privacy and domain authenticity. While some modern phishing sites do acquire free SSL certificates, a significant percentage of short-lived phishing sites still operate over unencrypted HTTP.

---

## Category 3: System Architecture & Web Development (20 Questions)

### Q10: Why did you select FastAPI instead of Flask or Django for the backend?
**Answer**: FastAPI is built on ASGI (Asynchronous Server Gateway Interface) using `asyncio` and `pydantic`, offering ultra-high performance (comparable to NodeJS and Go), automatic OpenAPI/Swagger documentation generation, and strict type safety out of the box.

### Q11: How does the React Frontend communicate with the Python FastAPI Backend?
**Answer**: The React frontend uses `axios` to make HTTP POST requests (`/api/scan`) carrying the target URL payload. FastAPI processes the request, computes the risk score via the ML engine, saves an audit log to SQLite DB via SQLAlchemy ORM, and returns a JSON response which React renders dynamically.

### Q12: How is the database designed and what tables exist?
**Answer**: We use SQLite with SQLAlchemy ORM. The key table is `ScanLog` containing:
- `id` (Primary Key Integer)
- `url` (String)
- `domain` (String)
- `status` (String: Safe, Phishing, Suspicious)
- `risk_score` (Float 0-100)
- `reasons` (JSON list of detection reasons)
- `extracted_features` (JSON 20+ feature dictionary)
- `scan_date` (DateTime timestamp)

### Q13: How does the Manifest V3 Chrome Extension work?
**Answer**: The Chrome extension uses the `chrome.tabs` API to fetch the current active browser tab's URL. When the user opens the popup, `popup.js` sends an HTTP request to `http://localhost:8000/api/scan`, receives the risk report, and updates the popup UI badge in real-time.

### Q14: How did you mitigate CORS (Cross-Origin Resource Sharing) issues?
**Answer**: In FastAPI (`main.py`), we configured `CORSMiddleware` with explicit allowed origins (`http://localhost:5173` for React Vite, `http://localhost:3000`, and `chrome-extension://*`), allowing cross-origin API calls securely.
