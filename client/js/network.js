/* ============================================
   NeuralKSP — Criminal Network Intelligence Engine
   D3.js Graph Link Analysis, Centrality Kingpin Detection & Pathfinder
   ============================================ */

(function() {
    'use strict';

    const NetworkModule = {
        _initialized: false,
        nodes: [],
        links: [],
        simulation: null,
        svg: null,
        zoom: null,
        highlightedPath: new Set(),
        selectedNode: null,

        KANNADA_FIRST_NAMES: {
            'Raju': 'ರಾಜು', 'Kumar': 'ಕುಮಾರ್', 'Suresh': 'ಸುರೇಶ್', 'Venkatesh': 'ವೆಂಕಟೇಶ್',
            'Mahesh': 'ಮಹೇಶ್', 'Ramesh': 'ರಮೇಶ್', 'Prakash': 'ಪ್ರಕಾಶ್', 'Anil': 'ಅನಿಲ್',
            'Sanjay': 'ಸಂಜಯ್', 'Vijay': 'ವಿಜಯ್', 'Manjunath': 'ಮಂಜುನಾಥ್', 'Naveen': 'ನವೀನ್',
            'Gururaj': 'ಗುರುರಾಜ್', 'Basavaraj': 'ಬಸವರಾಜ್', 'Shivu': 'ಶಿವು', 'Deepak': 'ದೀಪಕ್',
            'Harish': 'ಹರೀಶ್', 'Girish': 'ಗಿರೀಶ್', 'Kiran': 'ಕಿರಣ್', 'Srinivas': 'ಶ್ರೀನಿವಾಸ್',
            'Shankar': 'ಶಂಕರ್', 'Ganesh': 'ಗಣೇಶ್', 'Lakshmi': 'ಲಕ್ಷ್ಮಿ', 'Suma': 'ಸುಮಾ',
            'Kavitha': 'ಕವಿತಾ', 'Priya': 'ಪ್ರಿಯಾ', 'Divya': 'ದಿವ್ಯಾ', 'Anitha': 'ಅನಿತಾ',
            'Rekha': 'ರೇಖಾ', 'Shobha': 'ಶೋಭಾ', 'Mohamed': 'ಮೊಹಮ್ಮದ್', 'Irfan': 'ಇರ್ಫಾನ್',
            'Rizwan': 'ರಿಜ್ವಾನ್', 'Ahmed': 'ಅಹ್ಮದ್', 'Farhan': 'ಫರ್ಹಾನ್', 'Nasir': 'ನಾಸಿರ್'
        },

        KANNADA_LAST_NAMES: {
            'Gowda': 'ಗೌಡ', 'Naik': 'ನಾಯಕ್', 'Shetty': 'ಶೆಟ್ಟಿ', 'Patil': 'ಪಾಟೀಲ್',
            'Reddy': 'ರೆಡ್ಡಿ', 'Rao': 'ರಾವ್', 'Swamy': 'ಸ್ವಾಮಿ', 'Hegde': 'ಹೆಗಡೆ',
            'Kulkarni': 'ಕುಲಕರ್ಣಿ', 'Joshi': 'ಜೋಶಿ', 'Desai': 'ದೇಸಾಯಿ', 'Hiremath': 'ಹಿರೇಮಠ',
            'Nayak': 'ನಾಯಕ್', 'Bhat': 'ಭಟ್', 'Acharya': 'ಆಚಾರ್ಯ', 'Kumar': 'ಕುಮಾರ್',
            'Singh': 'ಸಿಂಗ್', 'Babu': 'ಬಾಬು', 'Mistry': 'ಮಿಸ್ತ್ರಿ', 'Sharma': 'ಶರ್ಮಾ',
            'Patel': 'ಪಟೇಲ್', 'Khan': 'ಖಾನ್', 'Sheikh': 'ಶೇಕ್'
        },

        KANNADA_NAMES: {
            "Raju Nayak": "ರಾಜು ನಾಯಕ್",
            "Kavitha Sheikh": "ಕವಿತಾ ಶೇಕ್",
            "Basavaraj Kumar": "ಬಸವರಾಜ್ ಕುಮಾರ್",
            "Girish Singh": "ಗಿರೀಶ್ ಸಿಂಗ್",
            "Rekha Naik": "ರೇಖಾ ನಾಯಕ್",
            "Nasir Mistry": "ನಾಸಿರ್ ಮಿಸ್ತ್ರಿ",
            "Anil Sheikh": "ಅನಿಲ್ ಶೇಕ್",
            "Srinivas Hegde": "ಶ್ರೀನಿವಾಸ್ ಹೆಗಡೆ",
            "Venkatesh Gowda": "ವೆಂಕಟೇಶ್ ಗೌಡ",
            "Deepak Sheikh": "ದೀಪಕ್ ಶೇಕ್",
            "Kiran Babu": "ಕಿರಣ್ ಬಾಬು",
            "Suma Khan": "ಸುಮಾ ಖಾನ್",
            "Suresh Sheikh": "ಸುರೇಶ್ ಶೇಕ್",
            "Naveen Nayak": "ನವೀನ್ ನಾಯಕ್",
            "Kumar Sheikh": "ಕುಮಾರ್ ಶೇಕ್",
            "Farhan Hiremath": "ಫರ್ಹಾನ್ ಹಿರೇಮಠ",
            "Mohamed Hegde": "ಮೊಹಮ್ಮದ್ ಹೆಗಡೆ",
            "Raju Patel": "ರಾಜು ಪಟೇಲ್",
            "Kumar Mistry": "ಕುಮಾರ್ ಮಿಸ್ತ್ರಿ",
            "Ramesh Desai": "ರಮೇಶ್ ದೇಸಾಯಿ",
            "Srinivas Naik": "ಶ್ರೀನಿವಾಸ್ ನಾಯಕ್",
            "Suresh Rao": "ಸುರೇಶ್ ರಾವ್",
            "Kiran Swamy": "ಕಿರಣ್ ಸ್ವಾಮಿ",
            "Anitha Swamy": "ಅನಿತಾ ಸ್ವಾಮಿ",
            "Shankar Patel": "ಶಂಕರ್ ಪಟೇಲ್",
            "Nasir Desai": "ನಾಸಿರ್ ದೇಸಾಯಿ",
            "Manjunath Singh": "ಮಂಜುನಾಥ್ ಸಿಂಗ್",
            "Mahesh Joshi": "ಮಹೇಶ್ ಜೋಶಿ",
            "Suresh Reddy": "ಸುರೇಶ್ ರೆಡ್ಡಿ",
            "Srinivas Patil": "ಶ್ರೀನಿವಾಸ್ ಪಾಟೀಲ್",
            "Naveen Gowda": "ನವೀನ್ ಗೌಡ"
        },

        KANNADA_DISTRICTS: {
            "Bengaluru Urban": "ಬೆಂಗಳೂರು ನಗರ",
            "Bengaluru Rural": "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
            "Mysuru": "ಮೈಸೂರು",
            "Hubballi-Dharwad": "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ",
            "Mangaluru": "ಮಂಗಳೂರು",
            "Belagavi": "ಬೆಳಗಾವಿ",
            "Kalaburagi": "ಕಲಬುರಗಿ",
            "Ballari": "ಬಳ್ಳಾರಿ",
            "Vijayapura": "ವಿಜಯಪುರ",
            "Yadgir": "ಯಾದಗಿರಿ",
            "Tumakuru": "ತುಮಕೂರು",
            "Shivamogga": "ಶಿವಮೊಗ್ಗ"
        },

        getName: function(name) {
            if (!name) return name;
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            if (!isKn) return name;
            
            if (this.KANNADA_NAMES[name]) return this.KANNADA_NAMES[name];

            const parts = name.split(' ');
            const translatedParts = parts.map(p => {
                return this.KANNADA_FIRST_NAMES[p] || this.KANNADA_LAST_NAMES[p] || p;
            });
            return translatedParts.join(' ');
        },

        getDistrict: function(district) {
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            return isKn ? (this.KANNADA_DISTRICTS[district] || district) : district;
        },

        init: function() {
            this.container = document.getElementById('network-graph');
            this.statsContainer = document.getElementById('network-stats-body');
            this.detailsContainer = document.getElementById('node-details-body');
            this.syndicateContainer = document.getElementById('syndicate-list-body');
            this.kingpinsContainer = document.getElementById('kingpins-list-body');
            this.districtFilter = document.getElementById('network-district-filter');
            this.categoryFilter = document.getElementById('network-category-filter');
            this.nodeLimitSelect = document.getElementById('network-node-limit');
            this.minConnectionsSlider = document.getElementById('network-min-connections');
            this.minConnVal = document.getElementById('min-conn-value');
            this.layoutSelect = document.getElementById('network-layout');
            this.refreshButton = document.getElementById('network-refresh');
            this.pathfinderBtn = document.getElementById('network-pathfinder-btn');
            this.pathfinderBar = document.getElementById('pathfinder-bar');
            this.pathSourceSelect = document.getElementById('path-source');
            this.pathTargetSelect = document.getElementById('path-target');
            this.traceBtn = document.getElementById('trace-path-btn');
            this.pathResult = document.getElementById('path-result');

            this.setupControls();
            this._initialized = true;
        },

        setupControls: function() {
            if (this.refreshButton) this.refreshButton.onclick = () => this.render();
            if (this.districtFilter) this.districtFilter.onchange = () => this.render();
            if (this.categoryFilter) this.categoryFilter.onchange = () => this.render();
            if (this.nodeLimitSelect) this.nodeLimitSelect.onchange = () => this.render();
            if (this.layoutSelect) this.layoutSelect.onchange = () => this.render();
            
            if (this.minConnectionsSlider) {
                this.minConnectionsSlider.oninput = () => {
                    if (this.minConnVal) this.minConnVal.textContent = this.minConnectionsSlider.value;
                    this.render();
                };
            }
            if (this.pathfinderBtn) {
                this.pathfinderBtn.onclick = () => {
                    if (this.pathfinderBar) {
                        const isHidden = this.pathfinderBar.style.display === 'none' || !this.pathfinderBar.style.display;
                        this.pathfinderBar.style.display = isHidden ? 'flex' : 'none';
                    }
                };
            }
            if (this.traceBtn) {
                this.traceBtn.onclick = () => this.tracePath();
            }
        },

        populateDropdowns: function(accusedList) {
            if (this.districtFilter && this.districtFilter.options.length <= 1) {
                const districts = new Set();
                accusedList.forEach(d => d.district && districts.add(d.district));
                let html = '<option value="all">All Districts</option>';
                Array.from(districts).sort().forEach(d => {
                    html += `<option value="${d}">${d}</option>`;
                });
                this.districtFilter.innerHTML = html;
            }

            if (this.pathSourceSelect && this.pathTargetSelect) {
                let optionsHtml = '';
                const sorted = [...accusedList].sort((a, b) => b.riskScore - a.riskScore);
                sorted.forEach(a => {
                    optionsHtml += `<option value="${a.id}">${a.name} (${a.district})</option>`;
                });
                this.pathSourceSelect.innerHTML = '<option value="">Select Suspect A...</option>' + optionsHtml;
                this.pathTargetSelect.innerHTML = '<option value="">Select Suspect B...</option>' + optionsHtml;
            }
        },

        render: function() {
            if (!window.NeuralKSP || !window.NeuralKSP.data || !window.d3) {
                console.error("NeuralKSP data or D3 not loaded");
                return;
            }

            const rawAccused = window.NeuralKSP.data.accused || [];
            this.populateDropdowns(rawAccused);

            const district = this.districtFilter ? this.districtFilter.value : 'all';
            const category = this.categoryFilter ? this.categoryFilter.value : 'all';
            const limitVal = this.nodeLimitSelect ? this.nodeLimitSelect.value : '35';
            const minConn = this.minConnectionsSlider ? parseInt(this.minConnectionsSlider.value, 10) : 3;

            // 1. Filter by district & connections
            let filteredAccused = rawAccused.filter(a => {
                if (district !== 'all' && a.district !== district) return false;
                if (a.connections && a.connections.length < minConn) return false;
                return true;
            });

            // 2. Sort by risk/connections and apply density limit for a clean, non-congested view
            if (limitVal !== 'all') {
                const maxCount = parseInt(limitVal, 10);
                filteredAccused = [...filteredAccused]
                    .sort((a, b) => (b.riskScore * 0.7 + b.connections.length * 5) - (a.riskScore * 0.7 + a.connections.length * 5))
                    .slice(0, maxCount);
            }

            this.buildGraph(filteredAccused);
            this.calculateCentrality();
            this.updateStats();
            this.renderD3();
            this.renderKingpins();
            this.renderSyndicates();
        },

        buildGraph: function(accusedList) {
            this.nodes = [];
            this.links = [];
            this.highlightedPath.clear();

            const nodeMap = new Map();
            accusedList.forEach(a => {
                const node = {
                    id: String(a.id),
                    name: a.name,
                    age: a.age,
                    gender: a.gender,
                    district: a.district,
                    priorOffenses: a.priorOffenses,
                    riskScore: a.riskScore,
                    firs: a.firs || [],
                    connectionCount: a.connections ? a.connections.length : 0,
                    connections: a.connections ? a.connections.map(String) : [],
                    degreeCentrality: 0
                };
                this.nodes.push(node);
                nodeMap.set(node.id, node);
            });

            const linkSet = new Set();
            this.nodes.forEach(sourceNode => {
                sourceNode.connections.forEach(targetId => {
                    if (nodeMap.has(targetId)) {
                        const linkKey = [sourceNode.id, targetId].sort().join('-');
                        if (!linkSet.has(linkKey)) {
                            linkSet.add(linkKey);
                            this.links.push({
                                source: sourceNode.id,
                                target: targetId,
                                weight: Math.floor(Math.random() * 3) + 1,
                                id: linkKey
                            });
                        }
                    }
                });
            });
        },

        calculateCentrality: function() {
            const degrees = {};
            this.nodes.forEach(n => degrees[n.id] = 0);
            this.links.forEach(l => {
                const sId = typeof l.source === 'object' ? l.source.id : l.source;
                const tId = typeof l.target === 'object' ? l.target.id : l.target;
                if (degrees[sId] !== undefined) degrees[sId]++;
                if (degrees[tId] !== undefined) degrees[tId]++;
            });

            this.nodes.forEach(n => {
                n.degreeCentrality = degrees[n.id] || 0;
            });
        },

        updateStats: function() {
            if (!this.statsContainer) return;
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            const avgConn = this.nodes.length > 0 ? (this.links.length * 2 / this.nodes.length).toFixed(1) : 0;
            const highRiskCount = this.nodes.filter(n => n.riskScore > 75).length;

            this.statsContainer.innerHTML = `
                <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px; text-align:center;">
                    <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${isKn ? 'ಪ್ರದರ್ಶಿತ ವ್ಯಕ್ತಿಗಳು' : 'Displayed Nodes'}</div>
                        <div style="font-size:1.4rem; font-weight:800; color:var(--accent-cyan);">${this.nodes.length}</div>
                    </div>
                    <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${isKn ? 'ಎಫ್‌ಐಆರ್ ಸಂಪರ್ಕಗಳು' : 'FIR Edges'}</div>
                        <div style="font-size:1.4rem; font-weight:800; color:var(--accent-purple);">${this.links.length}</div>
                    </div>
                    <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${isKn ? 'ಸರಾಸರಿ ಸಂಪರ್ಕಗಳು' : 'Avg Connections'}</div>
                        <div style="font-size:1.4rem; font-weight:800; color:var(--accent-blue);">${avgConn}</div>
                    </div>
                    <div style="background:var(--bg-tertiary); padding:10px; border-radius:8px;">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${isKn ? 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಗುರಿಗಳು' : 'High-Risk Targets'}</div>
                        <div style="font-size:1.4rem; font-weight:800; color:var(--accent-red);">${highRiskCount}</div>
                    </div>
                </div>
            `;
        },

        renderKingpins: function() {
            if (!this.kingpinsContainer) return;
            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            const kingpins = [...this.nodes].sort((a, b) => (b.riskScore * 0.6 + b.degreeCentrality * 5) - (a.riskScore * 0.6 + a.degreeCentrality * 5)).slice(0, 3);

            let html = '';
            kingpins.forEach((k, idx) => {
                html += `
                    <div class="kingpin-card" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; margin-bottom:8px; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:8px; cursor:pointer;" onclick="window.NetworkModule.selectAndZoomNode('${k.id}')">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="background:var(--accent-amber); color:#000; font-weight:800; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem;">👑</div>
                            <div>
                                <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;">${this.getName(k.name)}</div>
                                <div style="font-size:0.75rem; color:var(--text-muted);">${this.getDistrict(k.district)} • ${k.connectionCount} ${isKn ? 'ಸಹಚರರು' : 'Associates'}</div>
                            </div>
                        </div>
                        <div style="background:var(--accent-red); color:#fff; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:700;">
                            ${isKn ? 'ಅಂಕ' : 'Score'}: ${k.riskScore}
                        </div>
                    </div>
                `;
            });
            this.kingpinsContainer.innerHTML = html || '<p class="placeholder-text">No kingpins in current filter</p>';
        },

        renderSyndicates: function() {
            if (!this.syndicateContainer) return;
            const visited = new Set();
            const syndicates = [];

            this.nodes.forEach(node => {
                if (!visited.has(node.id)) {
                    const component = [];
                    const queue = [node.id];
                    visited.add(node.id);

                    while (queue.length > 0) {
                        const currId = queue.shift();
                        const currNode = this.nodes.find(n => n.id === currId);
                        if (currNode) {
                            component.push(currNode);
                            currNode.connections.forEach(neighborId => {
                                if (this.nodes.some(n => n.id === neighborId) && !visited.has(neighborId)) {
                                    visited.add(neighborId);
                                    queue.push(neighborId);
                                }
                            });
                        }
                    }

                    if (component.length >= 3) {
                        syndicates.push(component);
                    }
                }
            });

            let html = '';
            syndicates.sort((a, b) => b.length - a.length).slice(0, 4).forEach((syn, i) => {
                const names = ['Syndicate Alpha', 'Syndicate Bravo', 'Syndicate Charlie', 'Syndicate Delta'][i] || `Gang #${i+1}`;
                const avgRisk = Math.round(syn.reduce((s, n) => s + n.riskScore, 0) / syn.length);

                html += `
                    <div style="padding:10px; margin-bottom:8px; background:var(--bg-tertiary); border:var(--border-subtle); border-radius:8px; cursor:pointer;" onclick="window.NetworkModule.highlightSyndicate([${syn.map(n=>n.id).join(',')}])">
                        <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--text-primary); font-size:0.85rem;">
                            <span>${names}</span>
                            <span style="color:var(--accent-cyan);">${syn.length} Members</span>
                        </div>
                        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                            HQ: ${syn[0].district} | Risk: <span style="color:var(--accent-red); font-weight:700;">${avgRisk}</span>
                        </div>
                    </div>
                `;
            });

            this.syndicateContainer.innerHTML = html || '<p class="placeholder-text">No syndicates in current density view</p>';
        },

        renderD3: function() {
            this.container = document.getElementById('network-graph');
            if (!this.container) return;

            this.container.innerHTML = '';
            const width = this.container.clientWidth || 800;
            const height = this.container.clientHeight || 550;

            const svg = d3.select(this.container)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${width} ${height}`);

            const g = svg.append('g');

            const zoom = d3.zoom()
                .scaleExtent([0.3, 4])
                .on('zoom', (event) => g.attr('transform', event.transform));

            svg.call(zoom);
            this.svg = svg;
            this.zoom = zoom;

            const layoutType = this.layoutSelect ? this.layoutSelect.value : 'force';

            if (layoutType === 'radial') {
                const radius = Math.min(width, height) / 2.6;
                this.nodes.forEach((d, i) => {
                    const angle = (i / this.nodes.length) * 2 * Math.PI;
                    d.fx = width / 2 + radius * Math.cos(angle);
                    d.fy = height / 2 + radius * Math.sin(angle);
                });
            } else if (layoutType === 'concentric') {
                const centerX = width / 2;
                const centerY = height / 2;
                this.nodes.forEach(d => {
                    const r = d.riskScore > 75 ? 90 : d.riskScore > 45 ? 190 : 280;
                    const angle = Math.random() * 2 * Math.PI;
                    d.fx = centerX + r * Math.cos(angle);
                    d.fy = centerY + r * Math.sin(angle);
                });
            } else {
                this.nodes.forEach(d => { delete d.fx; delete d.fy; });
            }

            // Enhanced D3 physics spacing to prevent node crowding!
            const simulation = d3.forceSimulation(this.nodes)
                .force('link', d3.forceLink(this.links).id(d => d.id).distance(130))
                .force('charge', d3.forceManyBody().strength(-450))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collide', d3.forceCollide(32));

            const isLight = document.body.classList.contains('light-theme');

            const link = g.append('g')
                .selectAll('line')
                .data(this.links)
                .enter().append('line')
                .attr('stroke', d => {
                    const sId = typeof d.source === 'object' ? d.source.id : d.source;
                    const tId = typeof d.target === 'object' ? d.target.id : d.target;
                    if (this.highlightedPath.has(sId) && this.highlightedPath.has(tId)) return '#00f0ff';
                    return isLight ? '#cbd5e1' : '#334155';
                })
                .attr('stroke-width', d => {
                    const sId = typeof d.source === 'object' ? d.source.id : d.source;
                    const tId = typeof d.target === 'object' ? d.target.id : d.target;
                    if (this.highlightedPath.has(sId) && this.highlightedPath.has(tId)) return 4;
                    return d.weight;
                })
                .attr('stroke-opacity', d => {
                    const sId = typeof d.source === 'object' ? d.source.id : d.source;
                    const tId = typeof d.target === 'object' ? d.target.id : d.target;
                    if (this.highlightedPath.size > 0) {
                        return (this.highlightedPath.has(sId) && this.highlightedPath.has(tId)) ? 1.0 : 0.15;
                    }
                    return 0.5;
                });

            const node = g.append('g')
                .selectAll('.node')
                .data(this.nodes)
                .enter().append('g')
                .attr('class', 'node')
                .style('cursor', 'pointer')
                .attr('opacity', d => {
                    if (this.highlightedPath.size > 0) {
                        return this.highlightedPath.has(d.id) ? 1.0 : 0.25;
                    }
                    return 1.0;
                })
                .call(d3.drag()
                    .on('start', (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x; d.fy = d.y;
                    })
                    .on('drag', (event, d) => {
                        d.fx = event.x; d.fy = event.y;
                    })
                    .on('end', (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        if (layoutType === 'force') { d.fx = null; d.fy = null; }
                    }))
                .on('click', (e, d) => this.showNodeDetails(d));

            // Small, crisp circle sizes
            node.append('circle')
                .attr('r', d => Math.max(9, Math.min(18, 8 + d.connectionCount)))
                .attr('fill', d => d.riskScore > 75 ? '#ef4444' : d.riskScore > 45 ? '#f59e0b' : '#22c55e')
                .attr('stroke', d => {
                    if (this.highlightedPath.has(d.id)) return '#00f0ff';
                    if (d.degreeCentrality >= 6) return '#fbbf24';
                    return isLight ? '#ffffff' : '#0f172a';
                })
                .attr('stroke-width', d => this.highlightedPath.has(d.id) ? 3.5 : d.degreeCentrality >= 6 ? 3 : 2)
                .attr('filter', d => d.riskScore > 75 ? 'drop-shadow(0 0 4px #ef4444)' : 'none');

            // High-contrast, bold labels with SVG outline for crisp readability in Light & Dark modes!
            node.append('text')
                .text(d => this.getName(d.name))
                .attr('x', 0)
                .attr('y', d => Math.max(9, Math.min(18, 8 + d.connectionCount)) + 14)
                .attr('text-anchor', 'middle')
                .attr('fill', isLight ? '#0f172a' : '#ffffff')
                .attr('font-size', '11px')
                .attr('font-weight', '800')
                .attr('paint-order', 'stroke')
                .attr('stroke', isLight ? '#ffffff' : '#0f172a')
                .attr('stroke-width', '3.5px')
                .attr('stroke-linejoin', 'round')
                .attr('opacity', 1.0);

            simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('transform', d => `translate(${d.x},${d.y})`);
            });

            this.simulation = simulation;
        },

        showNodeDetails: function(d) {
            this.selectedNode = d;
            if (!this.detailsContainer) return;

            const isKn = window.NeuralKSPApp && window.NeuralKSPApp.language === 'kn';
            const statusColor = d.riskScore > 75 ? '#ef4444' : d.riskScore > 45 ? '#f59e0b' : '#22c55e';

            this.detailsContainer.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                    <div>
                        <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">${this.getName(d.name)}</h4>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${d.gender === 'M' ? (isKn ? 'ಪುರುಷ' : 'Male') : (isKn ? 'ಮಹಿಳೆ' : 'Female')}, ${d.age} ${isKn ? 'ವರ್ಷ' : 'yrs'} • ${this.getDistrict(d.district)}</div>
                    </div>
                    <div style="background:${statusColor}20; color:${statusColor}; border:1px solid ${statusColor}; padding:2px 10px; border-radius:12px; font-weight:800; font-size:0.8rem;">
                        ${isKn ? 'ಅಪಾಯ' : 'Risk'}: ${d.riskScore}
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-bottom:12px;">
                    <div style="background:var(--bg-tertiary); padding:8px; border-radius:6px;">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${isKn ? 'ಪೂರ್ವಾಪರ ಅಪರಾಧಗಳು' : 'Prior Offenses'}</div>
                        <div style="font-weight:700; color:var(--text-primary);">${d.priorOffenses} ${isKn ? 'ಎಫ್‌ಐಆರ್‌ಗಳು' : 'FIRs'}</div>
                    </div>
                    <div style="background:var(--bg-tertiary); padding:8px; border-radius:6px;">
                        <div style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${isKn ? 'ಪರಿಚಿತ ಸಹಚರರು' : 'Known Associates'}</div>
                        <div style="font-weight:700; color:var(--accent-cyan);">${d.connectionCount} ${isKn ? 'ಆರೋಪಿಗಳು' : 'Suspects'}</div>
                    </div>
                </div>

                <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:6px;">${isKn ? 'ಸಂಬಂಧಿತ ಎಫ್‌ಐಆರ್‌ಗಳು:' : 'Associated FIRs:'}</div>
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px;">
                    ${d.firs.length > 0 ? d.firs.map(f => `<span style="background:var(--bg-tertiary); color:var(--accent-purple); padding:2px 6px; border-radius:4px; font-size:0.7rem; font-weight:600;">${f}</span>`).join('') : `<span style="color:var(--text-muted); font-size:0.75rem;">${isKn ? 'ಯಾವುದೇ ಎಫ್‌ಐಆರ್‌ಗಳಿಲ್ಲ' : 'No linked FIRs'}</span>`}
                </div>
            `;
        },

        selectAndZoomNode: function(nodeId) {
            const numId = Number(nodeId);
            const targetNode = this.nodes.find(n => n.id === numId);
            if (targetNode) {
                this.showNodeDetails(targetNode);
                if (this.svg && this.zoom) {
                    const width = this.container.clientWidth || 800;
                    const height = this.container.clientHeight || 550;
                    const transform = d3.zoomIdentity
                        .translate(width / 2 - targetNode.x * 1.5, height / 2 - targetNode.y * 1.5)
                        .scale(1.5);
                    this.svg.transition().duration(750).call(this.zoom.transform, transform);
                }
            }
        },

        highlightSyndicate: function(memberIds) {
            this.highlightedPath = new Set(memberIds.map(String));
            this.renderD3();
        },

        tracePath: function() {
            const sourceId = String(this.pathSourceSelect?.value || '');
            const targetId = String(this.pathTargetSelect?.value || '');

            if (!sourceId || !targetId) {
                if (this.pathResult) this.pathResult.innerHTML = `<span style="color:var(--accent-amber);">Please select both Suspect A and Suspect B.</span>`;
                return;
            }

            if (sourceId === targetId) {
                if (this.pathResult) this.pathResult.innerHTML = `<span style="color:var(--accent-amber);">Source and Target are the same suspect.</span>`;
                return;
            }

            // Build full adjacency graph from ALL raw accused dataset so pathfinding works 100% reliably!
            const rawAccused = window.NeuralKSP ? window.NeuralKSP.data.accused : [];
            const fullMap = new Map();
            rawAccused.forEach(a => {
                const aId = String(a.id);
                const conns = a.connections ? a.connections.map(String) : [];
                fullMap.set(aId, conns);
            });

            // BFS algorithm for shortest path
            const queue = [[sourceId]];
            const visited = new Set([sourceId]);
            let foundPath = null;

            while (queue.length > 0) {
                const path = queue.shift();
                const curr = path[path.length - 1];

                if (curr === targetId) {
                    foundPath = path;
                    break;
                }

                const neighbors = fullMap.get(curr) || [];
                for (const nxt of neighbors) {
                    if (!visited.has(nxt)) {
                        visited.add(nxt);
                        queue.push([...path, nxt]);
                    }
                }
            }

            if (foundPath && foundPath.length > 1) {
                // Include path suspects in node rendering view
                const pathSuspects = rawAccused.filter(a => foundPath.includes(String(a.id)));
                this.buildGraph(pathSuspects);
                this.highlightedPath = new Set(foundPath);
                this.renderD3();

                const pathNames = foundPath.map(id => {
                    const acc = rawAccused.find(a => String(a.id) === String(id));
                    return acc ? `<strong style="color:var(--accent-cyan);">${acc.name} (${acc.district})</strong>` : id;
                });

                if (this.pathResult) {
                    this.pathResult.innerHTML = `<span style="color:var(--accent-green); font-weight:700;">Path Traced (${foundPath.length - 1} FIR Links):</span> ${pathNames.join(' ➔ ')}`;
                }
            } else {
                this.highlightedPath.clear();
                if (this.pathResult) {
                    this.pathResult.innerHTML = `<span style="color:var(--accent-red); font-weight:700;">No direct criminal connection link found between suspects.</span>`;
                }
            }
        }
    };

    window.NetworkModule = NetworkModule;
})();
