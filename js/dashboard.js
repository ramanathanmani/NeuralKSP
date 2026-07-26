(function(window) {
    'use strict';

    const DashboardModule = {
        init: function() {
            // Initialization logic if required
        },
        render: function(containerId) {
            const container = document.getElementById(containerId || 'view-dashboard');
            if (!container) return;

            const data = (window.NeuralKSP && window.NeuralKSP.data) ? window.NeuralKSP.data : this.getFallbackData();
            
            this.renderStats(data);
            this.renderAnomaliesBanner(data);
            this.renderRecentAnomaliesList(data);
            this.renderTrendChart(data);
            this.renderDistributionChart(data);
            this.renderDistrictChart(data);

            if (window.lucide && window.lucide.createIcons) {
                window.lucide.createIcons();
            }
        },

        getHtmlTemplate: function() {
            return `
                <div class="dashboard-container" style="padding: 20px; color: #f8fafc; height: 100%; overflow-y: auto;">
                    <!-- Anomaly Alerts Banner -->
                    <div id="anomaly-alerts-banner" style="margin-bottom: 24px;"></div>

                    <!-- Stats Row -->
                    <div id="stats-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
                        <!-- Stats cards injected here -->
                    </div>

                    <!-- Charts Grid -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="glass-card stat-card" style="padding: 20px; border-radius: 12px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); position: relative;">
                            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; color: #e2e8f0;">Crime Trend</h3>
                            <div style="height: 300px; width: 100%;">
                                <canvas id="trendChart"></canvas>
                            </div>
                        </div>
                        <div class="glass-card stat-card" style="padding: 20px; border-radius: 12px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); position: relative;">
                            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; color: #e2e8f0;">Crime Distribution</h3>
                            <div style="height: 300px; width: 100%; position: relative;">
                                <canvas id="distributionChart"></canvas>
                                <div id="doughnut-center-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                                    <div style="font-size: 0.9rem; color: #94a3b8;">Total</div>
                                    <div id="doughnut-total" style="font-size: 1.5rem; font-weight: bold; color: #f8fafc;">0</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="glass-card stat-card" style="padding: 20px; border-radius: 12px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); position: relative;">
                            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; color: #e2e8f0;">District Hotspots</h3>
                            <div style="height: 350px; width: 100%;">
                                <canvas id="districtChart"></canvas>
                            </div>
                        </div>
                        <div class="glass-card stat-card" style="padding: 20px; border-radius: 12px; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); position: relative; overflow-y: auto; max-height: 400px;">
                            <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; color: #e2e8f0;">Recent Anomalies</h3>
                            <div id="recent-anomalies" style="display: flex; flex-direction: column; gap: 15px;">
                                <!-- Anomalies injected here -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        animateCounter: function(el, target, duration = 1500) {
            let start = 0;
            const increment = target / (duration / 16);
            const animate = () => {
                start += increment;
                if (start < target) {
                    el.innerText = Math.floor(start).toLocaleString();
                    requestAnimationFrame(animate);
                } else {
                    el.innerText = target.toLocaleString();
                }
            };
            requestAnimationFrame(animate);
        },

        renderStats: function(data) {
            const statsRow = document.getElementById('stats-row');
            if (!statsRow) return;

            const summary = data.summary || {};
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';

            const cards = [
                { id: 'stat-total', label: isKn ? 'ಒಟ್ಟು ಅಪರಾಧಗಳು' : 'Total Crimes', value: summary.totalCrimes || 5000, trend: 12, icon: 'shield', iconClass: 'cyan' },
                { id: 'stat-active', label: isKn ? 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು' : 'Active Cases', value: summary.activeCases || 3733, trend: -5, icon: 'folder', iconClass: 'purple' },
                { id: 'stat-solved', label: isKn ? 'ಪರಿಹಾರದ ಶೇಕಡಾವಾರು %' : 'Solved Rate %', value: summary.solvedRate || 25, trend: 8, icon: 'check-circle', iconClass: 'green' },
                { id: 'stat-repeat', label: isKn ? 'ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳು' : 'Repeat Offenders', value: summary.repeatOffenders || 42, trend: 15, icon: 'users', iconClass: 'red' }
            ];

            let html = '';
            cards.forEach(c => {
                const isPositive = c.trend > 0;
                const trendIcon = isPositive ? 'trending-up' : 'trending-down';
                const trendColor = isPositive ? '#ef4444' : '#22c55e';
                const finalTrendColor = (c.label.includes('Rate') || c.label.includes('ಶೇಕಡಾವಾರು')) ? (isPositive ? '#22c55e' : '#ef4444') : trendColor;
                const trendText = c.trend !== 0 ? Math.abs(c.trend) + '%' : '0%';

                html += `
                    <div class="glass-card stat-card ${c.iconClass}" style="padding: 20px; border-radius: 12px; background: var(--bg-card); border: var(--border-subtle); display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: var(--shadow-sm);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                            <div class="stat-card-icon ${c.iconClass}">
                                <i data-lucide="${c.icon}"></i>
                            </div>
                            <div style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: ${finalTrendColor}; background: ${finalTrendColor}20; padding: 4px 8px; border-radius: 12px;">
                                <i data-lucide="${trendIcon}" style="width: 14px; height: 14px;"></i>
                                <span>${trendText}</span>
                            </div>
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${c.label}</div>
                        <div id="${c.id}-val" style="font-size: 1.8rem; font-weight: bold; color: var(--text-primary);">0</div>
                    </div>
                `;
            });

            statsRow.innerHTML = html;

            if (window.lucide && window.lucide.createIcons) {
                window.lucide.createIcons();
            }

            cards.forEach(c => {
                const el = document.getElementById(`${c.id}-val`);
                if (el) this.animateCounter(el, c.value);
            });
        },

        renderAnomaliesBanner: function(data) {
            const bannerContainer = document.getElementById('anomaly-alerts') || document.getElementById('anomaly-alerts-banner');
            if (!bannerContainer || !data.anomalies) return;

            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            const topAnomalies = data.anomalies.slice(0, 3);
            let html = '';

            topAnomalies.forEach((anom, i) => {
                const isCritical = anom.severity === 'critical' || anom.severity === 'high';
                const color = isCritical ? '#ef4444' : '#f59e0b';
                const icon = isCritical ? 'alert-triangle' : 'alert-circle';
                const bg = isCritical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)';
                const border = isCritical ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)';

                let title = anom.title || 'Anomaly Detected';
                let desc = anom.description || 'Unusual pattern identified.';
                let timeAgo = anom.timeAgo || 'Just now';

                if (isKn) {
                    if (title.includes('Syndicate')) {
                        title = 'ಬೆಂಗಳೂರು ನಗರದಲ್ಲಿ ಹೊಸ ಗ್ಯಾಂಗ್ ಪತ್ತೆಯಾಗಿದೆ';
                        desc = 'ಕಳೆದ 30 ದಿನಗಳಲ್ಲಿ 3 ಎಫ್‌ಐಆರ್‌ಗಳ ಮೂಲಕ 5 ಆರೋಪಿಗಳು ಸಂಪರ್ಕ ಹೊಂದಿದ್ದಾರೆ.';
                    } else if (title.includes('Surge')) {
                        title = 'ಮೈಸೂರಿನಲ್ಲಿ ಸೈಬರ್ ಅಪರಾಧಗಳ ಹೆಚ್ಚಳ';
                        desc = 'ಈ ತಿಂಗಳಲ್ಲಿ ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆಯಡಿ ಶೇ.42 ರಷ್ಟು ಪ್ರಕರಣಗಳು ಹೆಚ್ಚಾಗಿವೆ.';
                    } else if (title.includes('Theft')) {
                        title = 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿಯಲ್ಲಿ ವಾಹನ ಕಳವು';
                        desc = 'ಕಳೆದ 7 ದಿನಗಳಲ್ಲಿ 2 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ 8 ವಾಹನ ಕಳವು ವರದಿಯಾಗಿದೆ.';
                    }
                    timeAgo = 'ಈಗಷ್ಟೇ';
                }

                html += `
                    <div id="alert-${i}" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; margin-bottom: 10px; border-radius: 8px; background: ${bg}; border: 1px solid ${border};">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 32px; height: 32px; border-radius: 8px; background: ${color}25; display: flex; align-items: center; justify-content: center; color: ${color}; flex-shrink: 0;">
                                <i data-lucide="${icon}" style="width: 20px; height: 20px;"></i>
                            </div>
                            <div>
                                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${title}</div>
                                <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">${desc} <span style="opacity: 0.7; margin-left: 8px;">${timeAgo}</span></div>
                            </div>
                        </div>
                        <button onclick="document.getElementById('alert-${i}').remove()" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 4px;">
                            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                        </button>
                    </div>
                `;
            });

            bannerContainer.innerHTML = html;

            if (window.lucide && window.lucide.createIcons) {
                window.lucide.createIcons();
            }
        },

        renderRecentAnomaliesList: function(data) {
            const container = document.getElementById('recent-anomalies');
            if (!container || !data.anomalies) return;

            let html = '';
            data.anomalies.forEach(anom => {
                const isCritical = anom.severity === 'critical' || anom.severity === 'high';
                const dotColor = isCritical ? '#ef4444' : '#f59e0b';
                
                html += `
                    <div style="display: flex; align-items: flex-start; gap: 12px; padding-bottom: 12px; border-bottom: var(--border-subtle);">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${dotColor}; margin-top: 6px; box-shadow: 0 0 8px ${dotColor}; flex-shrink: 0;"></div>
                        <div style="flex: 1;">
                            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${anom.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">${anom.description}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">${anom.timeAgo || 'Recently'}</div>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        },

        renderTrendChart: function(data) {
            const ctx = document.getElementById('trendChart');
            if (!ctx || !window.Chart) return;
            if (this.trendChartInstance) {
                this.trendChartInstance.destroy();
            }

            const monthlyTrend = data.summary?.monthlyTrend || {};
            const labels = Array.isArray(monthlyTrend) ? monthlyTrend.map(d => d.month || d.label) : Object.keys(monthlyTrend);
            const values = Array.isArray(monthlyTrend) ? monthlyTrend.map(d => d.count || d.value) : Object.values(monthlyTrend);

            const canvas = ctx.getContext('2d');
            const gradient = canvas.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');

            const isLight = document.body.classList.contains('light-theme');
            const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';
            const textColor = isLight ? '#334155' : '#94a3b8';

            this.trendChartInstance = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Crime Count',
                        data: values,
                        borderColor: '#00f0ff',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointBackgroundColor: isLight ? '#ffffff' : '#0f172a',
                        pointBorderColor: '#00f0ff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                            titleColor: isLight ? '#0f172a' : '#f8fafc',
                            bodyColor: isLight ? '#334155' : '#e2e8f0',
                            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor }
                        },
                        y: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor },
                            beginAtZero: true
                        }
                    }
                }
            });
        },

        renderDistributionChart: function(data) {
            const ctx = document.getElementById('distributionChart');
            if (!ctx || !window.Chart) return;
            if (this.distributionChartInstance) {
                this.distributionChartInstance.destroy();
            }

            const categoryData = data.summary?.crimeByCategory || {};
            const labels = Object.keys(categoryData);
            const values = Object.values(categoryData);
            const total = values.reduce((a, b) => a + b, 0);

            const totalEl = document.getElementById('doughnut-total');
            if (totalEl) this.animateCounter(totalEl, total);

            const isLight = document.body.classList.contains('light-theme');
            const legendTextColor = isLight ? '#334155' : '#94a3b8';

            this.distributionChartInstance = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            '#00f0ff', '#a855f7', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#ec4899'
                        ],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: legendTextColor,
                                usePointStyle: true,
                                padding: 15,
                                boxWidth: 8
                            }
                        },
                        tooltip: {
                            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                            titleColor: isLight ? '#0f172a' : '#f8fafc',
                            bodyColor: isLight ? '#334155' : '#e2e8f0',
                            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            borderWidth: 1
                        }
                    }
                }
            });
        },

        renderDistrictChart: function(data) {
            const ctx = document.getElementById('districtChart');
            if (!ctx || !window.Chart) return;
            if (this.districtChartInstance) {
                this.districtChartInstance.destroy();
            }

            const topDistricts = data.summary?.topDistricts || [];
            const sliceData = topDistricts.slice(0, 10);
            const labels = sliceData.map(d => Array.isArray(d) ? d[0] : (d.district || d.name));
            const values = sliceData.map(d => Array.isArray(d) ? d[1] : (d.count || d.value));

            this.districtChartInstance = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Crimes',
                        data: values,
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const {ctx, chartArea} = chart;
                            if (!chartArea) return '#00f0ff';
                            const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                            gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
                            gradient.addColorStop(1, 'rgba(0, 240, 255, 0.8)');
                            return gradient;
                        },
                        borderRadius: 4,
                        barPercentage: 0.6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                            titleColor: isLight ? '#0f172a' : '#f8fafc',
                            bodyColor: isLight ? '#334155' : '#e2e8f0',
                            borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor }
                        },
                        y: {
                            grid: { display: false, drawBorder: false },
                            ticks: { color: textColor }
                        }
                    }
                }
            });
        },

        getFallbackData: function() {
            return {
                summary: {
                    stats: {
                        totalCrimes: { value: 125000, trend: -5.4 },
                        activeCases: { value: 32450, trend: 2.1 },
                        solvedRate: { value: 72, trend: 1.5 },
                        repeatOffenders: { value: 8900, trend: -3.2 }
                    },
                    monthlyTrend: [
                        { month: 'Jan', count: 9500 }, { month: 'Feb', count: 8900 }, { month: 'Mar', count: 10200 },
                        { month: 'Apr', count: 11500 }, { month: 'May', count: 9800 }, { month: 'Jun', count: 10500 }
                    ],
                    crimeByCategory: {
                        'Cybercrime': 3500, 'Theft': 2800, 'Assault': 1900, 'Fraud': 1500, 'Narcotics': 800
                    },
                    topDistricts: [
                        { district: 'Bengaluru Urban', count: 4200 }, { district: 'Mysuru', count: 1800 },
                        { district: 'Mangaluru', count: 1500 }, { district: 'Hubballi', count: 1200 },
                        { district: 'Belagavi', count: 950 }, { district: 'Kalaburagi', count: 850 }
                    ]
                },
                anomalies: [
                    { id: '1', type: 'Spike', severity: 'critical', title: 'Sudden Spike in Cyber Fraud', description: '400% increase in UPI fraud reports in Bengaluru South within last 2 hours.', timeAgo: '10 mins ago' },
                    { id: '2', type: 'Pattern', severity: 'high', title: 'Chain Snatching Series', description: '5 similar incidents reported across Mysuru ring road in the last 24 hours.', timeAgo: '2 hours ago' },
                    { id: '3', type: 'Cluster', severity: 'medium', title: 'Unusual Crowd Gathering', description: 'Large unauthorized gathering detected near Majestic area.', timeAgo: '4 hours ago' }
                ]
            };
        }
    };

    window.DashboardModule = DashboardModule;

})(window);
