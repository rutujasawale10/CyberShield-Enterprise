import random
import pandas as pd
from app.feature_extractor import FeatureExtractor

# Configurable dataset generation size per class
DATASET_SIZE = 100

def generate_phishing_dataset(dataset_size: int = DATASET_SIZE) -> pd.DataFrame:
    """
    Generates a realistic benchmark dataset of legitimate and phishing URLs 
    using offline feature extraction (offline=True) with progress logs.
    """
    base_legitimate_urls = [
        "https://www.google.com",
        "https://www.youtube.com",
        "https://www.facebook.com",
        "https://www.amazon.com",
        "https://www.wikipedia.org",
        "https://www.reddit.com",
        "https://www.yahoo.com",
        "https://www.github.com",
        "https://www.linkedin.com",
        "https://www.netflix.com",
        "https://www.microsoft.com",
        "https://www.apple.com",
        "https://www.instagram.com",
        "https://www.paytm.com",
        "https://www.onlinesbi.sbi",
        "https://www.hdfcbank.com",
        "https://www.icicibank.com",
        "https://www.paypal.com",
        "https://www.stackoverflow.com",
        "https://www.medium.com",
        "https://www.python.org",
        "https://www.fastapi.tiangolo.com",
        "https://www.react.dev",
        "https://www.npmjs.com",
        "https://www.scikit-learn.org",
        "https://www.cloudflare.com",
        "https://www.dropbox.com",
        "https://www.spotify.com",
        "https://www.slack.com",
        "https://www.zoom.us",
        "https://www.canva.com",
        "https://www.quora.com",
        "https://www.twitch.tv",
        "https://www.disneyplus.com",
        "https://www.ebay.com",
        "https://www.bing.com",
        "https://www.bbc.com",
        "https://www.cnn.com",
        "https://www.nytimes.com",
        "https://www.theguardian.com"
    ]

    base_phishing_urls = [
        "http://amaz0n-login.xyz",
        "http://paytm-secure-login.xyz",
        "http://statebank-login.net",
        "http://paypal-security-update-verify.top",
        "http://sbi-netbanking-passcode-update.club",
        "http://192.168.1.100/login/paypal.html",
        "http://bit.ly/3x8Zk99-secure-bank",
        "http://tinyurl.com/account-verify-login",
        "http://user:password@secure-login-hdfc.gq",
        "http://amaz0n-customer-support-check.site",
        "http://google-drive-share-doc-login.online",
        "http://appleid-support-account-locked.top",
        "http://netflix-billing-update-subscription.xyz",
        "http://microsoft-office365-verify-account.work",
        "http://instagram-blue-tick-verification-free.top",
        "http://facebook-security-checkpoint-verify.kim",
        "http://paytm-kyc-update-pending-urgent.site",
        "http://icici-bank-reward-points-claim.xyz",
        "http://hdfc-credit-card-limit-increase.top",
        "http://crypto-wallet-metamask-seed-phrase.gq",
        "http://binance-login-account-recovery.xyz",
        "http://coinbase-auth-verify-security.online",
        "http://steam-community-free-skins-gift.site",
        "http://roblox-free-robux-generator-login.xyz",
        "http://pubg-mobile-uc-redeem-code.top",
        "http://free-iphone15-pro-max-winner-claim.xyz",
        "http://whatsapp-gold-edition-download-apk.site",
        "http://telegram-crypto-airdrop-claim-now.xyz",
        "http://zoom-meeting-join-passcode-verify.top",
        "http://google-account-password-reset-urgent.xyz",
        "http://amaz0n-prime-video-free-trial.club",
        "http://uber-promo-code-free-ride-claim.site",
        "http://statebank-of-india-yono-login.xyz",
        "http://axisbank-netbanking-login-auth.top",
        "http://kotak-netbanking-mobile-verify.site",
        "http://airtel-5g-sim-upgrade-free.xyz",
        "http://jio-recharge-offer-500-cashback.top",
        "http://income-tax-refund-claim-form-govt.site",
        "http://passport-verification-status-check.xyz",
        "http://driving-license-renewal-online-apply.top"
    ]

    dataset = []

    # Process base legitimate URLs
    total_base_legit = len(base_legitimate_urls)
    for idx, url in enumerate(base_legitimate_urls, 1):
        print(f"Processing legitimate URL {idx}/{total_base_legit}")
        feats = FeatureExtractor.extract_features(url, offline=True)
        vector = FeatureExtractor.get_ml_feature_vector(feats)
        dataset.append(vector + [0])  # 0 = Legitimate

    # Process base phishing URLs
    total_base_phish = len(base_phishing_urls)
    for idx, url in enumerate(base_phishing_urls, 1):
        print(f"Processing phishing URL {idx}/{total_base_phish}")
        feats = FeatureExtractor.extract_features(url, offline=True)
        vector = FeatureExtractor.get_ml_feature_vector(feats)
        dataset.append(vector + [1])  # 1 = Phishing

    # Generate synthetic legitimate URLs
    print("Generating synthetic legitimate URLs...")
    random.seed(42)
    legit_domains = ["google", "github", "microsoft", "amazon", "apple", "netflix", "wikipedia", "stackoverflow", "adobe", "salesforce"]
    legit_tlds = [".com", ".org", ".net", ".edu", ".gov", ".co.uk", ".in"]
    
    for i in range(dataset_size):
        dom = random.choice(legit_domains)
        tld = random.choice(legit_tlds)
        sub = random.choice(["", "www.", "app.", "api.", "docs.", "blog."])
        path = random.choice(["", "/index.html", "/profile", "/search", "/about-us", "/products/item1"])
        url = f"https://{sub}{dom}{tld}{path}"
        
        feats = FeatureExtractor.extract_features(url, offline=True)
        vector = FeatureExtractor.get_ml_feature_vector(feats)
        dataset.append(vector + [0])

    # Generate synthetic phishing URLs
    print("Generating synthetic phishing URLs...")
    phish_brands = ["amaz0n", "paytm", "sbi-bank", "paypal-secure", "netflix-verify", "google-login", "apple-support", "hdfc-secure"]
    phish_tlds = [".xyz", ".top", ".club", ".work", ".site", ".online", ".gq", ".kim"]
    phish_keywords = ["login.php", "verify-account", "secure-update", "confirm-passcode", "billing-fix"]
    
    for i in range(dataset_size):
        brand = random.choice(phish_brands)
        tld = random.choice(phish_tlds)
        kw = random.choice(phish_keywords)
        use_ip = random.choice([True, False, False, False])
        use_short = random.choice([True, False, False, False])
        
        if use_ip:
            ip1, ip2 = random.randint(10, 192), random.randint(1, 255)
            url = f"http://{ip1}.{ip2}.45.12/{kw}"
        elif use_short:
            url = f"http://bit.ly/3x{random.randint(100,999)}-{kw}"
        else:
            url = f"http://{brand}-{random.randint(10,999)}{tld}/{kw}?ref={random.randint(1000,9999)}"

        feats = FeatureExtractor.extract_features(url, offline=True)
        vector = FeatureExtractor.get_ml_feature_vector(feats)
        dataset.append(vector + [1])

    columns = FeatureExtractor.get_feature_names() + ["label"]
    df = pd.DataFrame(dataset, columns=columns)
    return df
