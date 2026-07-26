# 🛡️ NeuralKSP — AI-Powered Criminal Intelligence & Predictive Policing Platform

[![Datathon 2026](https://img.shields.io/badge/KSP-Datathon%202026-blue)](https://hack2skill.com)
[![Deployment](https://img.shields.io/badge/Deployment-Zoho%20Catalyst-brightgreen)](https://datathon-60080173971.development.catalystserverless.in/app/index.html)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E0%B2%95%E0%B2%A8%E0%B3%8D%E0%B2%A8%E0%B2%A1-purple)](#-100-bilingual-support-english--kannada)

> **Official Submission for Karnataka State Police Datathon 2026 (Hack2Skill)**  
> **Live Production URL**: [https://datathon-60080173971.development.catalystserverless.in/app/index.html](https://datathon-60080173971.development.catalystserverless.in/app/index.html)

---

## 📌 Executive Summary

**NeuralKSP** is a next-generation web-based criminal intelligence and predictive policing platform designed for the **Karnataka State Police (KSP)** and **State Crime Records Bureau (SCRB)**. It transforms fragmented FIR records and suspect databases into real-time, field-ready actionable intelligence.

Featuring an interactive D3.js force-directed link graph, 12-hour AM/PM temporal peak window forecasting, an AI intelligence assistant, automated station briefings, and **100% native bilingual support in English and Kannada (`ಕನ್ನಡ`)**, NeuralKSP empowers law enforcement officers from beat constables to police leadership.

---

## 🚀 Key Modules & Capabilities

### 1. 📊 Crime Intelligence Dashboard
- Real-time KPI analytics: Total FIRs, Active Cases, Solved Rate %, Repeat Offenders.
- Dynamic AI Anomaly Alert Banners alerting command centers of abnormal crime spikes.
- Interactive multi-district charts (Monthly Trends, Category Distribution, District Hotspots).

### 2. 🕸️ Criminal Network Link Analysis & Pathfinder
- **60 FPS D3 Force-Directed Link Graph**: Maps 300+ accused nodes and 75+ FIR edges across Karnataka districts.
- **Kingpin Centrality Scoring**: Automatically highlights criminal ringleaders (e.g., *Rekha Naik*, *Basavaraj Kumar*).
- **Pathfinder Shortest Link Tracer (`ACC-XXXX`)**: Calculates multi-hop suspect connections to uncover hidden inter-district gang bridges.
- **Clean View Density Controls**: Toggle density (Top 35 High-Risk / Top 60 / All 300) for uncluttered field analysis.

### 3. ⏰ Predictive Crime Pulse & 12-Hour Peak Windows
- **12-Hour AM/PM Temporal Formatting**: Displays peak crime windows (*8:00 PM – 11:00 PM*) for intuitive shift planning.
- **D3 Weekly Rhythm Heatmap**: Correlates day of week (Monday–Sunday) with time of day (00:00–23:00).
- **Resource Allocation Directives**: Recommends exact patrol forces (*2 Hoysala PCR Vans + 4 Beat Constables*) based on historical risk.

### 4. 🤖 Bilingual AI Crime Assistant
- Natural Language Search in English and Kannada (`ಕನ್ನಡ`).
- Quick suggestion query pills and voice interaction support.

### 5. 📑 Automated Station Intelligence Briefings
- Official confidential police briefing document generator aligned with KSP internal standards.
- 4 Interactive tabs (*Executive Summary*, *Anomaly Threat Alerts*, *Patrol Deployment Directives*, *Priority Target Watchlist*).
- 1-Click native PDF export (`window.print()`).

---

## 🌐 100% Bilingual Support (English & Kannada `ಕನ`)

- **Instant Language Toggle**: Seamlessly switch every UI element, metric card, alert banner, and briefing table between English and Kannada.
- **Suspect Name Transliteration**: Converts all 300 suspect node names (*ವೆಂಕಟೇಶ್ ಗೌಡ*, *ಗಿರೀಶ್ ಸಿಂಗ್*, *ರೇಖಾ ನಾಯಕ್*, *ಬಸವರಾಜ್ ಕುಮಾರ್*) into pure Kannada script.
- **District & Station Support**: Translates all 31 districts of Karnataka (*ಬೆಂಗಳೂರು ನಗರ*, *ಮೈಸೂರು*, *ಮಂಗಳೂರು*, *ಬೆಳಗಾವಿ*, *ಕಲಬುರಗಿ*).

---

## 📽️ PowerPoint Pitch Decks Included

This repository includes two ready-to-use presentation decks for hackathon review:

1. 📄 **`NeuralKSP_Hack2Skill_Official_Template.pptx`**: Official 6-Slide Hack2Skill Format.
2. 📄 **`NeuralKSP_Datathon2026_PitchDeck.pptx`**: Detailed 10-Slide Pitch Deck.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: HTML5, ES6+ Vanilla JavaScript, Custom Glassmorphism CSS Design Token System.
- **Visualization**: D3.js v7 (Force-Directed Criminal Graphs & Interactive Weekly Heatmaps), Lucide Vector Icons.
- **Serverless Cloud Hosting**: Zoho Catalyst App Hosting (`client/` layout deployed via `zcatalyst-cli`).
- **Quality Assurance**: End-to-end Playwright automated browser testing across Light/Dark themes and EN/KN languages.

---

## 💻 How to Run Locally

1. Clone or download this repository.
2. Open terminal in the project directory:
   ```bash
   py -3 -m http.server 8080
   ```
3. Open your browser and navigate to `http://localhost:8080`.

---

## ☁️ How to Deploy to Zoho Catalyst

1. Install Catalyst CLI: `npm install -g zcatalyst-cli`
2. Authenticate: `catalyst login`
3. Deploy client:
   ```bash
   catalyst deploy --only client
   ```
