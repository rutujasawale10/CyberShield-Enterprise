import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier, VotingClassifier, StackingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

from app.config import MODEL_DIR, MODEL_PATH, ALT_MODEL_PATH, SCALER_PATH, ALT_SCALER_PATH, FEATURE_NAMES_PATH, BENCHMARK_RESULTS_PATH
from ml.dataset_generator import generate_phishing_dataset

def train_and_benchmark_models():
    print("=" * 75)
    print("🤖 ENTERPRISE AI CYBER SECURITY - ENSEMBLE ML BENCHMARKING ENGINE")
    print("=" * 75)

    os.makedirs(MODEL_DIR, exist_ok=True)

    # 1. Generate Dataset
    print("[1/5] Generating dataset of legitimate and phishing URL features...")
    df = generate_phishing_dataset()
    X = df.drop(columns=["label"])
    y = df["label"]
    feature_names = list(X.columns)

    # 2. Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

    # 3. Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Base Classifiers
    rf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42)
    gb = GradientBoostingClassifier(n_estimators=100, random_state=42)
    et = ExtraTreesClassifier(n_estimators=100, random_state=42)
    dt = DecisionTreeClassifier(max_depth=10, random_state=42)
    lr = LogisticRegression(max_iter=1000, random_state=42)

    # Ensembles
    voting_ensemble = VotingClassifier(estimators=[('rf', rf), ('gb', gb), ('et', et)], voting='soft')
    stacking_ensemble = StackingClassifier(estimators=[('rf', rf), ('gb', gb)], final_estimator=LogisticRegression())

    models = {
        "Voting Ensemble (Soft)": voting_ensemble,
        "Stacking Ensemble": stacking_ensemble,
        "Random Forest": rf,
        "Gradient Boosting (XGBoost Alt)": gb,
        "Extra Trees": et,
        "Decision Tree": dt,
        "Logistic Regression": lr
    }

    benchmark_results = {}
    best_model_name = None
    best_f1_score = -1.0
    best_model_obj = None

    print("\n[2/5] Training and Benchmarking Ensemble Suite:\n")
    print(f"{'Model Name':<32} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10} | {'ROC-AUC':<10}")
    print("-" * 92)

    for name, clf in models.items():
        clf.fit(X_train_scaled, y_train)
        y_pred = clf.predict(X_test_scaled)
        
        if hasattr(clf, "predict_proba"):
            y_prob = clf.predict_proba(X_test_scaled)[:, 1]
        else:
            y_prob = y_pred

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred).tolist()

        benchmark_results[name] = {
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": cm
        }

        print(f"{name:<32} | {acc*100:6.2f}%    | {prec*100:6.2f}%    | {rec*100:6.2f}%    | {f1*100:6.2f}%    | {roc_auc:6.4f}")

        if f1 > best_f1_score:
            best_f1_score = f1
            best_model_name = name
            best_model_obj = clf

    print("-" * 92)
    print(f"\n🏆 Primary Selected Ensemble Model: [{best_model_name}] (F1-Score: {best_f1_score*100:.2f}%)")

    # 5. Save Artifacts & Benchmark JSON
    joblib.dump(best_model_obj, MODEL_PATH)
    joblib.dump(best_model_obj, ALT_MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(scaler, ALT_SCALER_PATH)
    joblib.dump(feature_names, FEATURE_NAMES_PATH)

    with open(BENCHMARK_RESULTS_PATH, "w") as f:
        json.dump({
            "best_model": best_model_name,
            "models": benchmark_results,
            "feature_names": feature_names
        }, f, indent=2)

    print("\n✅ Saved Ensemble Benchmark Results to:")
    print(f"    • Benchmark JSON: {BENCHMARK_RESULTS_PATH}")
    print(f"    • Best Model:     {MODEL_PATH}")
    print("=" * 75)

if __name__ == "__main__":
    train_and_benchmark_models()
