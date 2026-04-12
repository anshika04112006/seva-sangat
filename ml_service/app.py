from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import networkx as nx
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import json

# Initialize Flask
app = Flask(__name__)
CORS(app)

# --- Service Matching Logic (K-Means) ---
@app.route('/api/ml/cluster', methods=['POST'])
def cluster_beneficiaries():
    """
    Cluster beneficiaries based on their needs and demographic data.
    """
    data = request.json
    beneficiaries = data.get('beneficiaries', [])
    
    if not beneficiaries:
        return jsonify({"clusters": [], "message": "No data provided"}), 400
    
    # Feature Engineering (Simplified for prototype)
    # Income, Age, and Need category mapping
    df = pd.DataFrame(beneficiaries)
    
    # Simple mapping for needs
    needs_mapping = {'healthcare': 1, 'legal_aid': 2, 'jobs': 3, 'training': 4}
    df['need_score'] = df['primary_need'].map(needs_mapping).fillna(0)
    
    features = df[['income', 'age', 'need_score']]
    
    # K-Means Clustering (Need-based only)
    num_clusters = min(3, len(df))
    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    df['cluster'] = kmeans.fit_predict(features)
    
    return jsonify({
        "data": df.to_dict(orient='records'),
        "message": "Clustering successful (Need-based)"
    })

# --- Chatbot Intent Classification (NLP) ---
@app.route('/api/ml/intent', methods=['POST'])
def classify_intent():
    """
    Classify user query intent for Government Schemes / Safety.
    """
    query = request.json.get('query', '').lower()
    
    # Basic keyword-based intent classification for prototype
    intents = {
        "scheme": ["yojana", "scheme", "subsidy", "finance", "loan"],
        "safety": ["sos", "help", "danger", "police", "unsafe"],
        "jobs": ["work", "salary", "finding", "employment", "career"]
    }
    
    detected_intent = "general"
    for intent, keywords in intents.items():
        if any(keyword in query for keyword in keywords):
            detected_intent = intent
            break
            
    return jsonify({"intent": detected_intent, "query": query})

if __name__ == '__main__':
    app.run(port=5002, debug=True)
