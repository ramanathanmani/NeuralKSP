/* ============================================
   NeuralKSP — App Controller
   Handles routing, navigation, theme, profile modal, and translations
   ============================================ */

(function() {
    'use strict';

    const TRANSLATIONS = {
        en: {
            brandName: 'NeuralKSP',
            brandTag: 'Crime Intelligence',
            systemActive: 'System Active',
            navDashboard: 'Dashboard',
            navNetwork: 'Network Intel',
            navPulse: 'Crime Pulse',
            navChat: 'AI Assistant',
            navBriefing: 'Briefings',
            searchPlaceholder: 'Search crimes, accused, stations...',
            dashTitle: 'Crime Intelligence Dashboard',
            dashSubtitle: 'Real-time analytics and anomaly detection across Karnataka',
            networkTitle: 'Criminal Network Intelligence',
            networkSubtitle: 'Graph-based syndicate detection, centrality analysis & shortest path link tracer',
            pulseTitle: 'Temporal Crime Pulse Engine',
            pulseSubtitle: 'Predict when crimes happen — temporal pattern analysis & anomaly detection',
            chatTitle: 'AI Crime Intelligence Assistant',
            chatSubtitle: 'Natural language queries in English & Kannada — with voice support',
            briefingTitle: 'Intelligence Briefings',
            briefingSubtitle: 'Auto-generated daily intelligence reports for each station',
            
            // Charts & Cards
            crimeTrend: 'Crime Trend (12 Months)',
            crimeDist: 'Crime Distribution',
            districtHotspots: 'District Hotspots',
            recentAnomalies: 'Recent Anomalies',
            
            // Network Intel Controls
            districtFilter: 'District Filter',
            crimeCategory: 'Crime Category',
            displayDensity: 'Display Density',
            minConnections: 'Min Connections',
            graphLayout: 'Graph Layout',
            refreshGraph: 'Refresh Graph',
            pathFinder: 'Path Finder',
            networkMetrics: 'Network Graph Metrics',
            kingpinsTitle: 'Key Ring leaders / Kingpins',
            suspectDossier: 'Selected Suspect Dossier',
            detectedSyndicates: 'Detected Syndicates',
            
            // Crime Pulse
            weeklyRhythm: 'Weekly Crime Rhythm',
            predictedWindows: 'Predicted Crime Windows',
            
            // Briefings
            generateBriefing: 'Generate Briefing',
            exportPdf: 'Export PDF',
            stationLabel: 'Station',
            dateLabel: 'Date'
        },
        kn: {
            brandName: 'ನ್ಯೂರಲ್-ಕೆಎಸ್‌ಪಿ',
            brandTag: 'ಅಪರಾಧ ಗುಪ್ತಚರ ಪೋರ್ಟಲ್',
            systemActive: 'ಸಿಸ್ಟಮ್ ಸಕ್ರಿಯವಾಗಿದೆ',
            navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            navNetwork: 'ನೆಟ್‌ವರ್ಕ್ ಇಂಟೆಲ್',
            navPulse: 'ಅಪರಾಧ ಪಲ್ಸ್',
            navChat: 'ಎಐ ಸಹಾಯಕ',
            navBriefing: 'ವರದಿಗಳು',
            searchPlaceholder: 'ಅಪರಾಧಗಳು, ಆರೋಪಿಗಳು, ಠಾಣೆಗಳನ್ನು ಹುಡುಕಿ...',
            dashTitle: 'ಅಪರಾಧ ಗುಪ್ತಚರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            dashSubtitle: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ನೈಜ-ಸಮಯದ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಅಸಂಗತತೆ ಪತ್ತೆ',
            networkTitle: 'ಕ್ರಿಮಿನಲ್ ನೆಟ್‌ವರ್ಕ್ ಗುಪ್ತಚರ ಮಾಹಿತಿ',
            networkSubtitle: 'ಗ್ರಾಫ್ ಆಧಾರಿತ ಜಾಲ ಪತ್ತೆ, ಕೇಂದ್ರತೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಲಿಂಕ್ ಟ್ರೇಸರ್',
            pulseTitle: 'ಅಪರಾಧ ಸಮಯ ಮುನ್ಸೂಚನೆ ಎಂಜಿನ್',
            pulseSubtitle: 'ಅಪರಾಧದ ಸಮಯದ ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಭವಿಷ್ಯ ನುಡಿಯುವುದು',
            chatTitle: 'ಎಐ ಅಪರಾಧ ಮಾಹಿತಿ ಸಹಾಯಕ',
            chatSubtitle: 'ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಬೆಂಬಲಿತ ಸಹಾಯಕ',
            briefingTitle: 'ದೈನಂದಿನ ಗುಪ್ತಚರ ವರದಿಗಳು',
            briefingSubtitle: 'ಪ್ರತಿ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಸ್ವಯಂಚಾಲಿತ ವರದಿ ಸೃಷ್ಟಿ',
            
            // Charts & Cards
            crimeTrend: 'ಅಪರಾಧ ಪ್ರವೃತ್ತಿ (12 ತಿಂಗಳು)',
            crimeDist: 'ಅಪರಾಧ ವಿಂಗಡಣೆ',
            districtHotspots: 'ಜಿಲ್ಲಾ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು',
            recentAnomalies: 'ಇತ್ತೀಚಿನ ಅಸಂಗತತೆಗಳು',
            
            // Network Intel Controls
            districtFilter: 'ಜಿಲ್ಲಾ ಫಿಲ್ಟರ್',
            crimeCategory: 'ಅಪರಾಧ ವರ್ಗ',
            displayDensity: 'ಪ್ರದರ್ಶನ ಸಾಂದ್ರತೆ',
            minConnections: 'ಕನಿಷ್ಠ ಸಂಪರ್ಕಗಳು',
            graphLayout: 'ಗ್ರಾಫ್ ಲೇಔಟ್',
            refreshGraph: 'ಗ್ರಾಫ್ ನವೀಕರಿಸಿ',
            pathFinder: 'ಮಾರ್ಗ ಪತ್ತೆ (ಪಾತ್ ಫೈಂಡರ್)',
            networkMetrics: 'ನೆಟ್‌ವರ್ಕ್ ಗಣಾಂಕಗಳು',
            kingpinsTitle: 'ಮುಖ್ಯ ರಿಂಗ್ ಲೀಡರ್ / ಕಿಂಗ್‌ಪಿನ್‌ಗಳು',
            suspectDossier: 'ಆಯ್ದ ಆರೋಪಿಯ ವಿವರಗಳು',
            detectedSyndicates: 'ಪತ್ತೆಯಾದ ಕ್ರಿಮಿನಲ್ ಸೈಂಡಿಕೇಟ್‌ಗಳು',
            
            // Crime Pulse
            weeklyRhythm: 'ವಾರದ ಅಪರಾಧ ಲಯ',
            predictedWindows: 'ಮುನ್ಸೂಚಿತ ಅಪರಾಧ ಸಮಯಗಳು',
            
            // Briefings
            generateBriefing: 'ವರದಿ ಸೃಷ್ಟಿಸಿ',
            exportPdf: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್',
            stationLabel: 'ಪೋಲಿಸ್ ಠಾಣೆ',
            dateLabel: 'ದಿನಾಂಕ'
        }
    };

    const App = {
        currentPage: 'dashboard',
        language: 'en',
        theme: 'dark',

        init() {
            setTimeout(() => {
                this.hideLoader();
                this.setupNavigation();
                this.setupSidebar();
                this.setupLanguageToggle();
                this.setupThemeToggle();
                this.setupProfileModal();
                this.setupSearch();
                this.initIcons();
                this.initModules();
            }, 2200);
        },

        hideLoader() {
            const loader = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            if (loader) loader.classList.add('fade-out');
            if (app) app.style.display = 'flex';
            setTimeout(() => loader && loader.remove(), 600);
        },

        setupNavigation() {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const page = item.dataset.page;
                    this.navigateTo(page);
                });
            });
        },

        navigateTo(page) {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            const activeNav = document.querySelector(`[data-page="${page}"]`);
            if (activeNav) activeNav.classList.add('active');

            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            const activeView = document.getElementById(`view-${page}`);
            if (activeView) {
                activeView.classList.add('active');
                activeView.style.animation = 'none';
                activeView.offsetHeight;
                activeView.style.animation = '';
            }

            const titles = {
                dashboard: this.language === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Dashboard',
                network: this.language === 'kn' ? 'ನೆಟ್‌ವರ್ಕ್ ಇಂಟೆಲ್' : 'Network Intel',
                pulse: this.language === 'kn' ? 'ಅಪರಾಧ ಪಲ್ಸ್' : 'Crime Pulse',
                chat: this.language === 'kn' ? 'ಎಐ ಸಹಾಯಕ' : 'AI Assistant',
                briefing: this.language === 'kn' ? 'ವರದಿಗಳು' : 'Briefings'
            };
            const titleEl = document.getElementById('page-title');
            if (titleEl) titleEl.textContent = titles[page] || page;

            const pageIcons = {
                dashboard: 'layout-dashboard',
                network: 'share-2',
                pulse: 'activity',
                chat: 'bot',
                briefing: 'file-text'
            };
            const iconContainer = document.querySelector('.breadcrumb-icon');
            if (iconContainer) {
                const iconName = pageIcons[page] || 'shield';
                iconContainer.innerHTML = `<i data-lucide="${iconName}"></i>`;
                if (window.lucide) window.lucide.createIcons();
            }

            this.currentPage = page;
            this.onPageEnter(page);
        },

        onPageEnter(page) {
            switch(page) {
                case 'dashboard':
                    if (window.DashboardModule) {
                        window.DashboardModule.render('view-dashboard');
                    }
                    break;
                case 'network':
                    if (window.NetworkModule) {
                        if (!window.NetworkModule._initialized) {
                            window.NetworkModule.init();
                            window.NetworkModule._initialized = true;
                        }
                        window.NetworkModule.render();
                    }
                    break;
                case 'pulse':
                    if (window.PulseModule) {
                        window.PulseModule.render();
                    }
                    break;
                case 'chat':
                    if (window.ChatModule) {
                        if (!window.ChatModule._initialized) {
                            window.ChatModule.init();
                            window.ChatModule._initialized = true;
                        }
                    }
                    break;
                case 'briefing':
                    if (window.BriefingModule) {
                        if (!window.BriefingModule._initialized) {
                            window.BriefingModule.init();
                            window.BriefingModule._initialized = true;
                        }
                    }
                    break;
            }
        },

        setupSidebar() {
            const toggle = document.getElementById('sidebar-toggle');
            const closeBtn = document.getElementById('sidebar-close-btn');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');

            const openSidebar = () => {
                if (sidebar) sidebar.classList.add('open');
                if (overlay) overlay.classList.add('active');
            };

            const closeSidebar = () => {
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            };

            if (toggle) toggle.addEventListener('click', openSidebar);
            if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
            if (overlay) overlay.addEventListener('click', closeSidebar);

            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 900) {
                        closeSidebar();
                    }
                });
            });
        },

        setupThemeToggle() {
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    this.theme = this.theme === 'dark' ? 'light' : 'dark';
                    if (this.theme === 'light') {
                        document.body.classList.add('light-theme');
                    } else {
                        document.body.classList.remove('light-theme');
                    }
                    
                    const icon = document.getElementById('theme-icon');
                    if (icon) {
                        icon.setAttribute('data-lucide', this.theme === 'dark' ? 'moon' : 'sun');
                        if (window.lucide) window.lucide.createIcons();
                    }
                });
            }
        },

        setupLanguageToggle() {
            const btn = document.getElementById('lang-toggle');
            if (btn) {
                btn.addEventListener('click', () => {
                    this.language = this.language === 'en' ? 'kn' : 'en';
                    btn.querySelector('.lang-label').textContent = this.language === 'en' ? 'EN' : 'ಕನ';
                    
                    this.applyTranslations(this.language);
                    
                    if (window.ChatModule && window.ChatModule.renderSuggestions) {
                        window.ChatModule.renderSuggestions();
                    }
                });
            }
        },

        applyTranslations(lang) {
            const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
            
            // Sidebar brand
            const brandName = document.querySelector('.brand-name');
            const brandTag = document.querySelector('.brand-tag');
            if (brandName) brandName.textContent = t.brandName;
            if (brandTag) brandTag.textContent = t.brandTag;

            // Nav items
            const navMap = {
                'dashboard': t.navDashboard,
                'network': t.navNetwork,
                'pulse': t.navPulse,
                'chat': t.navChat,
                'briefing': t.navBriefing
            };
            for (let [page, text] of Object.entries(navMap)) {
                const navBtn = document.getElementById(`nav-${page}`);
                if (navBtn) {
                    const span = navBtn.querySelector('span');
                    if (span) span.textContent = text;
                }
            }

            // Search input
            const searchInput = document.getElementById('global-search');
            if (searchInput) searchInput.placeholder = t.searchPlaceholder;

            // View Titles
            const setHeader = (viewId, title, sub) => {
                const v = document.getElementById(viewId);
                if (v) {
                    const h1 = v.querySelector('.view-header h1');
                    const p = v.querySelector('.view-header p');
                    if (h1) h1.textContent = title;
                    if (p) p.textContent = sub;
                }
            };
            setHeader('view-dashboard', t.dashTitle, t.dashSubtitle);
            setHeader('view-network', t.networkTitle, t.networkSubtitle);
            setHeader('view-pulse', t.pulseTitle, t.pulseSubtitle);
            setHeader('view-chat', t.chatTitle, t.chatSubtitle);
            setHeader('view-briefing', t.briefingTitle, t.briefingSubtitle);

            // Translate static card headers
            const translateHeader = (selector, iconName, text) => {
                const el = document.querySelector(selector);
                if (el) el.innerHTML = `<i data-lucide="${iconName}"></i> ${text}`;
            };

            translateHeader('#view-dashboard .charts-grid:nth-of-type(1) .chart-card:nth-of-type(1) h3', 'trending-up', t.crimeTrend);
            translateHeader('#view-dashboard .charts-grid:nth-of-type(1) .chart-card:nth-of-type(2) h3', 'pie-chart', t.crimeDist);
            translateHeader('#view-dashboard .charts-grid:nth-of-type(2) .chart-card:nth-of-type(1) h3', 'map-pin', t.districtHotspots);
            translateHeader('#view-dashboard .charts-grid:nth-of-type(2) .glass-card:nth-of-type(2) h3', 'alert-triangle', t.recentAnomalies);

            // Network controls
            const netLabels = document.querySelectorAll('#view-network .control-group label');
            if (netLabels.length >= 5) {
                netLabels[0].textContent = t.districtFilter;
                netLabels[1].textContent = t.crimeCategory;
                netLabels[2].textContent = t.displayDensity;
                netLabels[3].textContent = t.minConnections;
                netLabels[4].textContent = t.graphLayout;
            }
            const pathBtn = document.getElementById('network-pathfinder-btn');
            if (pathBtn) pathBtn.innerHTML = `<i data-lucide="git-commit"></i> ${t.pathFinder}`;
            const refBtn = document.getElementById('network-refresh');
            if (refBtn) refBtn.innerHTML = `<i data-lucide="refresh-cw"></i> ${t.refreshGraph}`;

            translateHeader('#network-stats .card-header h3', 'bar-chart-3', t.networkMetrics);
            translateHeader('#kingpins-list .card-header h3', 'crown', t.kingpinsTitle);
            translateHeader('#node-details .card-header h3', 'user', t.suspectDossier);
            translateHeader('#syndicate-list .card-header h3', 'users', t.detectedSyndicates);

            // Pulse
            translateHeader('.pulse-heatmap-card .card-header h3', 'calendar', t.weeklyRhythm);
            translateHeader('#view-pulse .glass-card:nth-of-type(2) .card-header h3', 'clock', t.predictedWindows);

            // Briefings
            const genBtn = document.getElementById('generate-briefing');
            if (genBtn) genBtn.innerHTML = `<i data-lucide="file-text"></i> ${t.generateBriefing}`;
            const expBtn = document.getElementById('export-briefing');
            if (expBtn) expBtn.innerHTML = `<i data-lucide="download"></i> ${t.exportPdf}`;

            // Breadcrumb title
            this.navigateTo(this.currentPage);

            // Re-render active module to update dynamic labels
            this.onPageEnter(this.currentPage);

            if (window.lucide) window.lucide.createIcons();
        },

        setupProfileModal() {
            const profileBtn = document.getElementById('user-profile-btn') || document.querySelector('.user-avatar');
            if (profileBtn) {
                profileBtn.onclick = () => this.showProfileModal();
            }
        },

        showProfileModal() {
            let overlay = document.getElementById('profile-modal-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
                return;
            }

            overlay = document.createElement('div');
            overlay.id = 'profile-modal-overlay';
            overlay.className = 'modal-overlay';

            const isKn = this.language === 'kn';

            overlay.innerHTML = `
                <div class="profile-modal">
                    <button id="close-profile-modal" style="position:absolute; top:16px; right:16px; background:none; border:none; color:var(--text-secondary); cursor:pointer;">
                        <i data-lucide="x"></i>
                    </button>
                    <div class="profile-modal-header">
                        <div class="profile-modal-avatar">SP</div>
                        <div class="profile-modal-info">
                            <h3>${isKn ? 'ಡಾ. ಆಲೋಕ್ ಕುಮಾರ್, ಐಪಿಎಸ್' : 'Dr. Alok Kumar, IPS'}</h3>
                            <p>${isKn ? 'ಸೂಪರಿಂಟೆಂಡೆಂಟ್ ಆಫ್ ಪೊಲೀಸ್ (ಗುಪ್ತಚರ)' : 'Superintendent of Police (Intel)'}</p>
                        </div>
                    </div>
                    <div class="profile-details-grid">
                        <div class="profile-detail-item">
                            <div class="profile-detail-label">${isKn ? 'ಬ್ಯಾಡ್ಜ್ ಸಂಖ್ಯೆ' : 'Badge ID'}</div>
                            <div class="profile-detail-val">KSP-8842-INT</div>
                        </div>
                        <div class="profile-detail-item">
                            <div class="profile-detail-label">${isKn ? 'ಮುಖ್ಯ ಕಚೇರಿ' : 'Headquarters'}</div>
                            <div class="profile-detail-val">${isKn ? 'ಬೆಂಗಳೂರು ಕೇಂದ್ರ' : 'Bengaluru HQ'}</div>
                        </div>
                        <div class="profile-detail-item">
                            <div class="profile-detail-label">${isKn ? 'ಕ್ಲಿಯರೆನ್ಸ್ ಹಂತ' : 'Clearance Level'}</div>
                            <div class="profile-detail-val" style="color:var(--accent-cyan);">Level 5 (Top Secret)</div>
                        </div>
                        <div class="profile-detail-item">
                            <div class="profile-detail-label">${isKn ? 'ಕರ್ತವ್ಯ ಸ್ಥಿತಿ' : 'Duty Status'}</div>
                            <div class="profile-detail-val" style="color:var(--accent-green);">${isKn ? 'ಸಕ್ರಿಯ (ಆನ್ ಡ್ಯೂಟಿ)' : 'Active (On Duty)'}</div>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px;">
                        <button id="close-modal-btn" class="btn btn-secondary">${isKn ? 'ಮುಚ್ಚಿ' : 'Close'}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            if (window.lucide) window.lucide.createIcons();

            const closeFunc = () => { overlay.style.display = 'none'; };
            document.getElementById('close-profile-modal').onclick = closeFunc;
            document.getElementById('close-modal-btn').onclick = closeFunc;
            overlay.onclick = (e) => { if (e.target === overlay) closeFunc(); };
        },

        setupSearch() {
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const query = searchInput.value.trim();
                        if (query) {
                            this.navigateTo('chat');
                            setTimeout(() => {
                                if (window.ChatModule) {
                                    window.ChatModule.processQuery(query);
                                }
                            }, 300);
                            searchInput.value = '';
                        }
                    }
                });
            }
        },

        initIcons() {
            if (window.lucide) {
                lucide.createIcons();
            }
        },

        initModules() {
            setTimeout(() => {
                if (window.DashboardModule) window.DashboardModule.render('view-dashboard');
            }, 100);
        },

        animateCounter(element, target, duration = 1500) {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(start).toLocaleString();
                }
            }, 16);
        },

        formatDate(dateStr) {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        },

        timeAgo(timestamp) {
            const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
            if (seconds < 60) return `${seconds}s ago`;
            if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
            if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
            return `${Math.floor(seconds / 86400)}d ago`;
        }
    };

    window.NeuralKSPApp = App;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();
