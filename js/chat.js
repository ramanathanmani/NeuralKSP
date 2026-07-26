/* ============================================
   NeuralKSP — AI Crime Intelligence Assistant
   Natural language querying (English + Kannada) with Voice support
   ============================================ */

(function () {
    'use strict';

    const ChatModule = {
        _initialized: false,
        history: [],

        init: function () {
            this.messagesContainer = document.getElementById('chat-messages');
            this.inputField = document.getElementById('chat-input');
            this.sendBtn = document.getElementById('send-btn');
            this.voiceBtn = document.getElementById('voice-btn');
            this.suggestionsContainer = document.getElementById('chat-suggestions');
            this.historyContainer = document.getElementById('query-history');
            this.quickQueriesContainer = document.getElementById('quick-queries');
            this.recognition = null;
            this.isRecording = false;

            this.setupEventListeners();
            this.renderSuggestions();
            this.renderQuickQueries();
            
            if (this.messagesContainer && this.messagesContainer.children.length === 0) {
                const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
                const welcomeMsg = isKn ? 
                    "ನಮಸ್ಕಾರ! ನಾನು NeuralKSP AI ಸಹಾಯಕ. ಇಂದಿನ ಅಪರಾಧ ದತ್ತಾಂಶ ಮತ್ತು ಮಾಹಿತಿಯ ಬಗ್ಗೆ ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?" : 
                    "Hello! I am NeuralKSP AI Assistant. How can I help you with crime intelligence today?";
                this.addMessage(welcomeMsg, "bot");
            }

            this.initSpeechRecognition();
            this._initialized = true;
        },

        setupEventListeners: function () {
            if (this.sendBtn) {
                this.sendBtn.onclick = () => this.handleSend();
            }

            if (this.inputField) {
                this.inputField.onkeydown = (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.handleSend();
                    }
                };
                this.inputField.oninput = () => {
                    this.inputField.style.height = 'auto';
                    this.inputField.style.height = Math.min(this.inputField.scrollHeight, 120) + 'px';
                };
            }

            if (this.voiceBtn) {
                this.voiceBtn.onclick = () => this.toggleVoiceRecording();
            }
        },

        initSpeechRecognition: function () {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;

                this.recognition.onstart = () => {
                    this.isRecording = true;
                    if (this.voiceBtn) this.voiceBtn.classList.add('recording');
                };

                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (this.inputField) {
                        this.inputField.value = transcript;
                        this.handleSend();
                    }
                };

                this.recognition.onerror = (event) => {
                    console.error("Speech recognition error", event.error);
                    this.stopVoiceRecording();
                };

                this.recognition.onend = () => {
                    this.stopVoiceRecording();
                };
            }
        },

        toggleVoiceRecording: function () {
            if (!this.recognition) {
                alert("Speech recognition is not supported in your browser.");
                return;
            }

            if (this.isRecording) {
                this.recognition.stop();
            } else {
                const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
                this.recognition.lang = isKn ? 'kn-IN' : 'en-IN';
                this.recognition.start();
            }
        },

        stopVoiceRecording: function () {
            this.isRecording = false;
            if (this.voiceBtn) this.voiceBtn.classList.remove('recording');
        },

        speak: function (text) {
            if (text.length > 250 || !window.speechSynthesis) return;
            const plainText = text.replace(/<[^>]*>?/gm, '');
            const utterance = new SpeechSynthesisUtterance(plainText);
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            utterance.lang = isKn ? 'kn-IN' : 'en-IN';
            window.speechSynthesis.speak(utterance);
        },

        handleSend: function () {
            if (!this.inputField) return;
            const text = this.inputField.value.trim();
            if (!text) return;

            this.inputField.value = '';
            this.inputField.style.height = 'auto';

            this.addMessage(text, 'user');
            this.addToHistory(text);
            this.processQuery(text);
        },

        processQuery: function (query) {
            if (!this.messagesContainer) return;
            
            const typingId = 'typing-' + Date.now();
            this.addTypingIndicator(typingId);

            const data = window.NeuralKSP ? window.NeuralKSP.data : null;
            if (!data) {
                setTimeout(() => {
                    this.removeTypingIndicator(typingId);
                    this.addMessage("Error: Crime intelligence data is initializing...", "bot");
                }, 600);
                return;
            }

            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            const q = query.toLowerCase();
            const translatedQ = this.translateKannadaToEnglish(q);

            let response = "";
            let delay = 600 + Math.random() * 400;

            // Helper to extract district name
            const extractDistrict = (text) => {
                if (!data.districts) return null;
                for (const d of data.districts) {
                    if (text.includes(d.toLowerCase())) return d;
                }
                return null;
            };

            // Helper to extract crime type
            const extractCrimeType = (text) => {
                const types = ['theft', 'assault', 'cyber', 'fraud', 'murder', 'robbery', 'narcotics', 'rash driving', 'dowry'];
                for (const t of types) {
                    if (text.includes(t)) return t;
                }
                return null;
            };

            const district = extractDistrict(translatedQ);
            const crimeType = extractCrimeType(translatedQ);

            // Intent Matching
            if (q.includes("hi") || q.includes("hello") || q.includes("namaste") || q.includes("ನಮಸ್ಕಾರ") || q.includes("hey")) {
                response = isKn ? 
                    "ನಮಸ್ಕಾರ ಅಧಿಕಾರಿ! ನಾನು ನಿಮ್ಮ NeuralKSP ಎಐ ಸಹಾಯಕ. ಅಪರಾಧ ಅಂಕಿಅಂಶಗಳು, ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು ಅಥವಾ ಆರೋಪಿಗಳ ವರದಿಗಳನ್ನು ಕೇಳಿ." :
                    "Hello Officer! I am your NeuralKSP AI Assistant. You can ask me about crime stats, high-risk districts, repeat offenders, or predictions.";
            }
            else if (translatedQ.includes("how many crimes") || translatedQ.includes("crime count") || translatedQ.includes("number of crimes")) {
                if (district) {
                    const count = data.crimes.filter(c => c.district.toLowerCase() === district.toLowerCase()).length;
                    response = isKn ? 
                        `<strong>${district}</strong> ಜಿಲ್ಲೆಯಲ್ಲಿ ಒಟ್ಟು <span style="color:#00f0ff; font-weight:bold; font-size:1.1rem;">${count}</span> ಅಪರಾಧ ಪ್ರಕರಣಗಳು ದಾಖಲಾಗಿವೆ.` :
                        `Total recorded incidents in <strong>${district}</strong>: <span style="color:#00f0ff; font-weight:bold; font-size:1.1rem;">${count}</span> cases.`;
                } else {
                    response = isKn ? 
                        `ಕರ್ನಾಟಕ ರಾಜ್ಯದಲ್ಲಿ ಒಟ್ಟು ದಾಖಲಾದ ಅಪರಾಧ ಪ್ರಕರಣಗಳು: <span style="color:#00f0ff; font-weight:bold; font-size:1.1rem;">${data.summary.totalCrimes}</span>.` :
                        `Statewide Total Recorded Crimes: <span style="color:#00f0ff; font-weight:bold; font-size:1.1rem;">${data.summary.totalCrimes}</span> cases. Active Cases: <span style="color:#ef4444; font-weight:bold;">${data.summary.activeCases}</span>.`;
                }
            }
            else if (translatedQ.includes("repeat offender") || translatedQ.includes("accused") || translatedQ.includes("offenders")) {
                const repeat = data.accused ? data.accused.filter(a => a.priorOffenses >= 3).sort((a, b) => b.riskScore - a.riskScore).slice(0, 5) : [];
                if (repeat.length > 0) {
                    let tableHTML = `<table class="chat-table"><tr><th>Name</th><th>District</th><th>Prior FIRs</th><th>Risk Score</th></tr>`;
                    repeat.forEach(a => {
                        tableHTML += `<tr><td><strong>${a.name}</strong></td><td>${a.district}</td><td>${a.priorOffenses}</td><td><span class="risk-badge high">${a.riskScore}</span></td></tr>`;
                    });
                    tableHTML += `</table>`;
                    response = isKn ? 
                        `3+ ಹೆಚ್ಚು ಅಪರಾಧ ಹಿನ್ನೆಲೆಯುಳ್ಳ ಪ್ರಮುಖ ಆರೋಪಿಗಳು:<br>${tableHTML}` :
                        `Top high-risk repeat offenders with 3+ prior offenses:<br>${tableHTML}`;
                } else {
                    response = isKn ? "ಯಾವುದೇ ಪ್ರಮುಖ ಮರು-ಅಪರಾಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ." : "No repeat offenders with 3+ offenses found.";
                }
            }
            else if (translatedQ.includes("top") && (translatedQ.includes("district") || translatedQ.includes("area") || translatedQ.includes("dangerous") || translatedQ.includes("hotspot"))) {
                const topList = data.summary.topDistricts.slice(0, 5);
                let tableHTML = `<table class="chat-table"><tr><th>Rank</th><th>District</th><th>Total Incidents</th></tr>`;
                topList.forEach((d, i) => {
                    tableHTML += `<tr><td>#${i + 1}</td><td><strong>${d[0]}</strong></td><td>${d[1]}</td></tr>`;
                });
                tableHTML += `</table>`;
                response = isKn ? 
                    `ಹೆಚ್ಚಿನ ಅಪರಾಧ ಸಂಖ್ಯೆ ಹೊಂದಿರುವ ಪ್ರಮುಖ 5 ಜಿಲ್ಲೆಗಳು:<br>${tableHTML}` :
                    `Here are the Top 5 crime hotspot districts in Karnataka:<br>${tableHTML}`;
            }
            else if (translatedQ.includes("predict") || translatedQ.includes("future") || translatedQ.includes("next week") || translatedQ.includes("forecast")) {
                const preds = data.temporal ? data.temporal.predictions.slice(0, 3) : [];
                let text = isKn ? "ಮುಂದಿನ ದಿನಗಳ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ:<br>" : "AI Temporal Crime Risk Predictions:<br>";
                preds.forEach(p => {
                    text += `<div style="margin-top:6px; padding:6px 10px; background:rgba(0,240,255,0.05); border-left:3px solid #00f0ff; border-radius:4px;">
                        <strong>${p.date} (${p.dayName})</strong>: Risk Level <strong>${p.risk.toUpperCase()}</strong> (${p.riskScore}/100)<br>
                        Peak Hours: ${p.peakHour} | High Risk Crime: ${p.topCrimeType}
                    </div>`;
                });
                response = text;
            }
            else if (translatedQ.includes("active case") || translatedQ.includes("pending")) {
                response = isKn ? 
                    `ಪ್ರಸ್ತುತ ತನಿಖೆಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು: <span style="color:#ef4444; font-weight:bold; font-size:1.1rem;">${data.summary.activeCases}</span> (ದೂರು ವಿಲೇವಾರಿ ದರ: ${data.summary.solvedRate}%).` :
                    `Current Active Cases Under Investigation: <span style="color:#ef4444; font-weight:bold; font-size:1.1rem;">${data.summary.activeCases}</span> (Case Clearance Rate: ${data.summary.solvedRate}%).`;
            }
            else if (translatedQ.includes("stat") || translatedQ.includes("summary")) {
                response = `<strong>KSP Statewide Intelligence Summary:</strong><br>
                    • Total Crimes: <strong style="color:#00f0ff">${data.summary.totalCrimes}</strong><br>
                    • Active Investigations: <strong style="color:#ef4444">${data.summary.activeCases}</strong><br>
                    • Case Solved Rate: <strong style="color:#22c55e">${data.summary.solvedRate}%</strong><br>
                    • Tracked Repeat Offenders: <strong style="color:#a855f7">${data.summary.repeatOffenders}</strong><br>
                    • Active Anomaly Alerts: <strong style="color:#f59e0b">${data.anomalies.length}</strong>`;
            }
            else if (crimeType) {
                const count = data.crimes.filter(c => c.category.toLowerCase().includes(crimeType) || c.crimeType.toLowerCase().includes(crimeType)).length;
                response = isKn ? 
                    `<strong>${crimeType.toUpperCase()}</strong> ಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಒಟ್ಟು <strong>${count}</strong> ಪ್ರಕರಣಗಳು ದಾಖಲಾಗಿವೆ.` :
                    `Analysis for <strong>${crimeType.toUpperCase()}</strong>: Total <strong>${count}</strong> registered cases found across police stations.`;
            }
            else {
                response = isKn ? 
                    `ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅಪರಾಧ ಸಂಖ್ಯೆ, ಜಿಲ್ಲೆಗಳು, ಅಥವಾ ಆರೋಪಿಗಳ ವರದಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ.` :
                    `I analyzed your query: "<em>${query}</em>". Try asking: <br>• <em>"Top crime districts"</em><br>• <em>"Show repeat offenders"</em><br>• <em>"Predict next week"</em><br>• <em>"How many crimes in Mysuru"</em>`;
            }

            setTimeout(() => {
                this.removeTypingIndicator(typingId);
                this.addMessage(response, "bot");
                this.speak(response);
            }, delay);
        },

        translateKannadaToEnglish: function (text) {
            const dictionary = {
                'ಅಪರಾಧ': 'crime',
                'ಅಪರಾಧಗಳು': 'crimes',
                'ಕಳ್ಳತನ': 'theft',
                'ಜಿಲ್ಲೆ': 'district',
                'ಎಷ್ಟು': 'how many',
                'ಮತ್ತು': 'and',
                'ಹೋಲಿಕೆ': 'compare',
                'ಸಕ್ರಿಯ': 'active',
                'ಪ್ರಕರಣಗಳು': 'cases',
                'ಆರೋಪಿ': 'accused',
                'ಮುನ್ಸೂಚನೆ': 'predict',
                'ಅಂಕಿಅಂಶ': 'statistics'
            };
            let translated = text;
            for (let [kn, en] of Object.entries(dictionary)) {
                translated = translated.split(kn).join(en);
            }
            return translated;
        },

        addMessage: function (text, sender) {
            if (!this.messagesContainer) return;
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${sender}`;
            
            const avatarHtml = sender === 'bot' ? 
                `<div class="chat-avatar"><i data-lucide="bot"></i></div>` :
                `<div class="chat-avatar"><span>YOU</span></div>`;

            msgDiv.innerHTML = `
                ${avatarHtml}
                <div class="chat-bubble">${text}</div>
            `;
            
            this.messagesContainer.appendChild(msgDiv);
            if (window.lucide) window.lucide.createIcons();
            this.scrollToBottom();
        },

        addTypingIndicator: function (id) {
            if (!this.messagesContainer) return;
            const typingDiv = document.createElement('div');
            typingDiv.className = `chat-message bot typing-indicator-container`;
            typingDiv.id = id;
            typingDiv.innerHTML = `
                <div class="chat-avatar"><i data-lucide="bot"></i></div>
                <div class="chat-bubble">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
            this.messagesContainer.appendChild(typingDiv);
            if (window.lucide) window.lucide.createIcons();
            this.scrollToBottom();
        },

        removeTypingIndicator: function (id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        },

        scrollToBottom: function () {
            if (this.messagesContainer) {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }
        },

        renderSuggestions: function () {
            if (!this.suggestionsContainer) return;
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            const suggestions = isKn ? [
                'ಅಪರಾಧ ಅಂಕಿಅಂಶಗಳು', 'ಹೆಚ್ಚಿನ ಅಪರಾಧ ಜಿಲ್ಲೆಗಳು', 'ಪ್ರಮುಖ ಆರೋಪಿಗಳು',
                'ಮುಂದಿನ ವಾರದ ಮುನ್ಸೂಚನೆ', 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು', 'ಬೆಂಗಳೂರು ಅಪರಾಧಗಳು'
            ] : [
                'Crime statistics', 'Top crime districts', 'Show repeat offenders',
                'Predict next week', 'Active cases', 'Crimes in Bengaluru'
            ];

            let html = '';
            suggestions.forEach(s => {
                html += `<button class="chat-suggestion">${s}</button>`;
            });
            this.suggestionsContainer.innerHTML = html;

            this.suggestionsContainer.querySelectorAll('.chat-suggestion').forEach(btn => {
                btn.onclick = () => {
                    const text = btn.textContent;
                    if (this.inputField) this.inputField.value = text;
                    this.handleSend();
                };
            });
        },

        renderQuickQueries: function () {
            if (!this.quickQueriesContainer) return;
            const queries = [
                'Top crime districts',
                'Show repeat offenders',
                'Predict next week',
                'Statewide statistics'
            ];

            let html = '';
            queries.forEach(q => {
                html += `<button class="quick-query-btn">${q}</button>`;
            });
            this.quickQueriesContainer.innerHTML = html;

            this.quickQueriesContainer.querySelectorAll('.quick-query-btn').forEach(btn => {
                btn.onclick = () => {
                    const text = btn.textContent;
                    this.addMessage(text, 'user');
                    this.processQuery(text);
                };
            });
        },

        addToHistory: function (query) {
            if (!this.historyContainer) return;
            this.history.unshift(query);
            if (this.history.length > 8) this.history.pop();

            let html = '';
            this.history.forEach(h => {
                html += `<div class="query-history-item">${h}</div>`;
            });
            this.historyContainer.innerHTML = html;

            this.historyContainer.querySelectorAll('.query-history-item').forEach(item => {
                item.onclick = () => {
                    const text = item.textContent;
                    this.addMessage(text, 'user');
                    this.processQuery(text);
                };
            });
        }
    };

    window.ChatModule = ChatModule;
})();
