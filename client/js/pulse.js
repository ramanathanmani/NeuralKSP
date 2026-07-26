/* ============================================
   NeuralKSP — Temporal Crime Pulse Engine
   Heatmap Analytics, Risk Window Predictions & GIS Map
   ============================================ */

(function() {
    'use strict';

    let map = null;
    let chart = null;

    const PulseModule = {
        init: function() {
            // Initialized hook
        },

        render: function() {
            if (!window.NeuralKSP || !window.NeuralKSP.data) {
                console.error("NeuralKSP data not loaded");
                return;
            }

            this.renderHeatmap();
            this.renderPredictions();
            this.renderTimeline();
            this.renderMap();
        },

        renderHeatmap: function() {
            const container = document.getElementById('pulse-heatmap');
            if (!container || !window.d3) return;

            container.innerHTML = '';

            const rawHeatmap = window.NeuralKSP.data.temporal.heatmap || [];
            let data = [];
            if (Array.isArray(rawHeatmap) && Array.isArray(rawHeatmap[0])) {
                rawHeatmap.forEach((row, dayIdx) => {
                    row.forEach((count, hourIdx) => {
                        data.push({ day: dayIdx, hour: hourIdx, count: count });
                    });
                });
            } else {
                data = rawHeatmap;
            }

            const isLight = document.body.classList.contains('light-theme');

            const margin = {top: 20, right: 30, bottom: 40, left: 50};
            const width = Math.max(300, container.clientWidth - margin.left - margin.right);
            const height = 300 - margin.top - margin.bottom;

            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const hours = d3.range(24);

            const svg = d3.select("#pulse-heatmap")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .range([0, width])
                .domain(hours)
                .padding(0.05);

            const y = d3.scaleBand()
                .range([0, height])
                .domain(days)
                .padding(0.05);

            const formatHourAMPM = h => {
                const ampm = h >= 12 ? 'PM' : 'AM';
                let hour12 = h % 12;
                if (hour12 === 0) hour12 = 12;
                return `${hour12} ${ampm}`;
            };

            const tickHours = hours.filter(h => h % 3 === 0);

            // X Axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).tickValues(tickHours).tickFormat(d => formatHourAMPM(d)))
                .selectAll("text")
                .style("fill", isLight ? "#475569" : "#9ca3af")
                .style("font-weight", "600");

            svg.selectAll(".domain, .tick line")
                .style("stroke", isLight ? "#cbd5e1" : "#334155");

            // Y Axis
            svg.append("g")
                .call(d3.axisLeft(y))
                .selectAll("text")
                .style("fill", isLight ? "#475569" : "#9ca3af")
                .style("font-weight", "600");

            svg.selectAll(".domain, .tick line")
                .style("stroke", isLight ? "#cbd5e1" : "#334155");

            const maxCount = d3.max(data, d => d.count) || 100;

            const customColor = d3.scaleLinear()
                .domain([0, maxCount * 0.33, maxCount * 0.66, maxCount])
                .range(isLight ? ["#f1f5f9", "#60a5fa", "#f59e0b", "#ef4444"] : ["#0f172a", "#00f0ff", "#fbbf24", "#ef4444"]);

            const tooltip = d3.select("body")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip glass-card")
                .style("position", "absolute")
                .style("background-color", isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.9)")
                .style("border", isLight ? "1px solid #cbd5e1" : "1px solid #334155")
                .style("border-radius", "6px")
                .style("padding", "8px 12px")
                .style("color", isLight ? "#0f172a" : "#fff")
                .style("pointer-events", "none")
                .style("font-size", "12px")
                .style("z-index", "1000");

            svg.selectAll()
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x(d.hour))
                .attr("y", d => y(days[d.day]))
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .attr("rx", 3)
                .attr("ry", 3)
                .style("fill", d => customColor(d.count))
                .on("mouseover", function(event, d) {
                    tooltip.style("opacity", 1);
                    d3.select(this)
                        .style("stroke", isLight ? "#0f172a" : "#fff")
                        .style("stroke-width", 2);
                })
                .on("mousemove", function(event, d) {
                    const timeLabel = formatHourAMPM(d.hour);
                    tooltip
                        .html(`${days[d.day]} @ ${timeLabel}<br>Crimes: <strong style="color:var(--accent-cyan);">${d.count} cases</strong>`)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseleave", function() {
                    tooltip.style("opacity", 0);
                    d3.select(this).style("stroke", "none");
                });
        },

        renderPredictions: function() {
            const container = document.getElementById('predicted-windows');
            if (!container) return;

            const preds = window.NeuralKSP.data.temporal.predictions || [];
            const sorted = [...preds].sort((a, b) => b.riskScore - a.riskScore);
            const isLight = document.body.classList.contains('light-theme');

            container.innerHTML = '';

            sorted.forEach(p => {
                let badgeColor = "#22c55e";
                let badgeText = "Low Risk";
                if (p.riskScore > 75) { badgeColor = "#ef4444"; badgeText = "High Risk"; }
                else if (p.riskScore > 50) { badgeColor = "#f59e0b"; badgeText = "Med Risk"; }

                const card = document.createElement('div');
                card.className = "stat-card glass-card";
                card.style.padding = "14px 16px";
                card.style.marginBottom = "10px";
                card.style.borderLeft = `4px solid ${badgeColor}`;

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                        <div>
                            <div style="font-weight:800; font-size:15px; color:var(--text-primary);">${p.date}</div>
                            <div style="font-size:12px; color:var(--text-muted); font-weight:600;">${p.dayName} • ${p.peakHour}</div>
                        </div>
                        <div style="background-color:${badgeColor}18; color:${badgeColor}; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:800; border:1px solid ${badgeColor}44;">
                            ${badgeText} (${Math.round(p.riskScore)})
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-top:10px;">
                        <div>
                            <div style="color:var(--text-muted); font-size:11px; font-weight:600;">Expected Frequency</div>
                            <div style="color:var(--accent-cyan); font-weight:800;">${p.expectedCrimes} cases</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:var(--text-muted); font-size:11px; font-weight:600;">Dominant Risk Type</div>
                            <div style="color:var(--text-primary); font-weight:700;">${p.topCrimeType}</div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        },

        renderTimeline: function() {
            const canvas = document.getElementById('pulseTimeline');
            if (!canvas || !window.Chart) return;

            const rawData = window.NeuralKSP.data.temporal.timeSeries || [];
            const data = rawData.slice(-90);

            const labels = data.map(d => d.date);
            const counts = data.map(d => d.count);

            const sum = counts.reduce((a, b) => a + b, 0);
            const mean = sum / counts.length;
            const sqDiff = counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
            const std = Math.sqrt(sqDiff / counts.length);
            const threshold = mean + 1.5 * std;

            const pointColors = counts.map(c => c > threshold ? "#ef4444" : "#00f0ff");
            const pointRadius = counts.map(c => c > threshold ? 4 : 0);

            const ma = [];
            for (let i = 0; i < counts.length; i++) {
                if (i < 6) {
                    ma.push(null);
                } else {
                    let s = 0;
                    for (let j = 0; j < 7; j++) s += counts[i - j];
                    ma.push(s / 7);
                }
            }

            const ctx = canvas.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

            if (chart) chart.destroy();

            const isLight = document.body.classList.contains('light-theme');
            const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';
            const textColor = isLight ? '#334155' : '#94a3b8';

            chart = new window.Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '7-Day Moving Average',
                            data: ma,
                            borderColor: '#a855f7',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointRadius: 0,
                            tension: 0.4,
                            fill: false,
                            order: 1
                        },
                        {
                            label: 'Daily Crime Pulse',
                            data: counts,
                            borderColor: '#00f0ff',
                            backgroundColor: gradient,
                            borderWidth: 2,
                            pointBackgroundColor: pointColors,
                            pointBorderColor: pointColors,
                            pointRadius: pointRadius,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4,
                            order: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        },
                        tooltip: {
                            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)',
                            titleColor: isLight ? '#0f172a' : '#fff',
                            bodyColor: isLight ? '#334155' : '#e2e8f0',
                            borderColor: isLight ? 'rgba(0,0,0,0.1)' : '#334155',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor, maxTicksLimit: 10 }
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

        renderMap: function() {
            const mapContainer = document.getElementById('crime-heatmap');
            if (!mapContainer || !window.L) return;

            if (map) {
                map.remove();
                map = null;
            }

            map = L.map('crime-heatmap').setView([14.5, 76.5], 7);

            const isLight = document.body.classList.contains('light-theme');
            const tileUrl = isLight 
                ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

            L.tileLayer(tileUrl, {
                attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            const crimes = window.NeuralKSP.data.crimes || [];

            const getSeverityColor = (sev) => {
                if (sev === 'High') return '#ef4444';
                if (sev === 'Medium') return '#f59e0b';
                return '#22c55e';
            };

            const markers = [];

            crimes.forEach(c => {
                if (c.lat && c.lng) {
                    const marker = L.circleMarker([c.lat, c.lng], {
                        radius: 5,
                        fillColor: getSeverityColor(c.severity),
                        color: getSeverityColor(c.severity),
                        weight: 1,
                        opacity: 0.3,
                        fillOpacity: 0.5
                    });

                    marker.bindPopup(`
                        <div style="background:${isLight ? '#ffffff' : '#0f172a'}; color:${isLight ? '#0f172a' : '#ffffff'}; border:1px solid ${isLight ? '#cbd5e1' : '#334155'}; padding:8px; border-radius:6px; font-family:sans-serif;">
                            <div style="color:var(--accent-cyan); font-weight:800; margin-bottom:4px;">${c.type}</div>
                            <div style="font-size:12px; color:var(--text-muted);">${c.date} • ${c.time}</div>
                            <div style="font-size:12px; margin-top:4px;">Severity: <strong style="color:${getSeverityColor(c.severity)}">${c.severity}</strong></div>
                        </div>
                    `);

                    markers.push(marker);
                    marker.addTo(map);
                }
            });

            map.on('zoomend', function() {
                const z = map.getZoom();
                markers.forEach(m => {
                    if (z < 6) m.setRadius(2);
                    else if (z < 9) m.setRadius(5);
                    else m.setRadius(8);
                });
            });
        }
    };

    window.PulseModule = PulseModule;
})();
