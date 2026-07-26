/* ============================================
   NeuralKSP — Synthetic Crime Data Engine
   Generates realistic Karnataka crime data
   ============================================ */

(function() {
    'use strict';

    // Karnataka Districts
    const DISTRICTS = [
        'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad',
        'Belagavi', 'Kalaburagi', 'Raichur', 'Ballari', 'Davanagere',
        'Shivamogga', 'Tumakuru', 'Hassan', 'Mandya', 'Chitradurga',
        'Udupi', 'Chikkamagaluru', 'Kodagu', 'Vijayapura', 'Bagalkot',
        'Gadag', 'Haveri', 'Ramanagara', 'Chamarajanagar', 'Yadgir'
    ];

    const STATIONS = [
        'Koramangala PS', 'Whitefield PS', 'Electronic City PS', 'Indiranagar PS',
        'Jayanagar PS', 'JP Nagar PS', 'Marathahalli PS', 'HSR Layout PS',
        'Vijayanagar PS', 'Rajajinagar PS', 'Mysuru South PS', 'Mysuru North PS',
        'Mangaluru South PS', 'Mangaluru North PS', 'Hubballi PS', 'Dharwad PS',
        'Belagavi City PS', 'Kalaburagi PS', 'Raichur PS', 'Ballari PS',
        'Davanagere PS', 'Shivamogga PS', 'Tumakuru PS', 'Hassan PS'
    ];

    const CRIME_TYPES = [
        { code: '302', name: 'Murder', category: 'Violent', weight: 2 },
        { code: '304', name: 'Culpable Homicide', category: 'Violent', weight: 1 },
        { code: '307', name: 'Attempt to Murder', category: 'Violent', weight: 3 },
        { code: '376', name: 'Rape', category: 'Crime Against Women', weight: 3 },
        { code: '354', name: 'Assault on Women', category: 'Crime Against Women', weight: 5 },
        { code: '498A', name: 'Dowry Harassment', category: 'Crime Against Women', weight: 6 },
        { code: '379', name: 'Theft', category: 'Property Crime', weight: 15 },
        { code: '380', name: 'Theft in Dwelling', category: 'Property Crime', weight: 8 },
        { code: '392', name: 'Robbery', category: 'Property Crime', weight: 6 },
        { code: '395', name: 'Dacoity', category: 'Property Crime', weight: 2 },
        { code: '420', name: 'Cheating & Fraud', category: 'Economic Offence', weight: 10 },
        { code: '406', name: 'Criminal Breach of Trust', category: 'Economic Offence', weight: 4 },
        { code: '468', name: 'Forgery', category: 'Economic Offence', weight: 3 },
        { code: '323', name: 'Voluntarily Causing Hurt', category: 'Violent', weight: 8 },
        { code: '341', name: 'Wrongful Restraint', category: 'Other', weight: 4 },
        { code: '506', name: 'Criminal Intimidation', category: 'Other', weight: 6 },
        { code: '279', name: 'Rash Driving', category: 'Traffic', weight: 12 },
        { code: '304A', name: 'Death by Negligence', category: 'Traffic', weight: 4 },
        { code: 'IT66', name: 'Cyber Crime', category: 'Cyber', weight: 8 },
        { code: 'NDPS', name: 'Narcotics', category: 'Narcotics', weight: 5 }
    ];

    const CRIME_CATEGORIES = [...new Set(CRIME_TYPES.map(c => c.category))];

    const FIRST_NAMES = [
        'Raju', 'Kumar', 'Suresh', 'Venkatesh', 'Mahesh', 'Ramesh', 'Prakash', 'Anil',
        'Sanjay', 'Vijay', 'Manjunath', 'Naveen', 'Gururaj', 'Basavaraj', 'Shivu',
        'Deepak', 'Harish', 'Girish', 'Kiran', 'Srinivas', 'Shankar', 'Ganesh',
        'Lakshmi', 'Suma', 'Kavitha', 'Priya', 'Divya', 'Anitha', 'Rekha', 'Shobha',
        'Mohamed', 'Irfan', 'Rizwan', 'Ahmed', 'Farhan', 'Nasir'
    ];

    const LAST_NAMES = [
        'Gowda', 'Naik', 'Shetty', 'Patil', 'Reddy', 'Rao', 'Swamy', 'Hegde',
        'Kulkarni', 'Joshi', 'Desai', 'Hiremath', 'Nayak', 'Bhat', 'Acharya',
        'Kumar', 'Singh', 'Babu', 'Mistry', 'Sharma', 'Patel', 'Khan', 'Sheikh'
    ];

    const MODUS_OPERANDI = [
        'Broke door lock', 'Snatching on road', 'Online phishing', 'Identity theft',
        'ATM skimming', 'Housebreaking at night', 'Armed robbery', 'Poisoning',
        'Stabbing', 'Blunt force', 'Vehicle theft at parking', 'Chain snatching',
        'Drug peddling', 'Land fraud', 'Impersonation', 'Domestic violence',
        'Road rage', 'Drunk driving accident', 'Investment scam', 'Kidnapping for ransom'
    ];

    // District coordinates (approximate centers)
    const DISTRICT_COORDS = {
        'Bengaluru Urban': [12.9716, 77.5946],
        'Bengaluru Rural': [13.1986, 77.7066],
        'Mysuru': [12.2958, 76.6394],
        'Mangaluru': [12.8714, 74.8431],
        'Hubballi-Dharwad': [15.3647, 75.1240],
        'Belagavi': [15.8497, 74.4977],
        'Kalaburagi': [17.3297, 76.8343],
        'Raichur': [16.2076, 77.3463],
        'Ballari': [15.1394, 76.9214],
        'Davanagere': [14.4644, 75.9218],
        'Shivamogga': [13.9299, 75.5681],
        'Tumakuru': [13.3379, 77.1173],
        'Hassan': [13.0068, 76.1004],
        'Mandya': [12.5218, 76.8953],
        'Chitradurga': [14.2251, 76.3980],
        'Udupi': [13.3409, 74.7421],
        'Chikkamagaluru': [13.3161, 75.7720],
        'Kodagu': [12.4244, 75.7382],
        'Vijayapura': [16.8302, 75.7100],
        'Bagalkot': [16.1691, 75.6615],
        'Gadag': [15.4167, 75.6167],
        'Haveri': [14.7951, 75.3990],
        'Ramanagara': [12.7159, 77.2795],
        'Chamarajanagar': [11.9261, 76.9437],
        'Yadgir': [16.7604, 77.1381]
    };

    // Seeded random for reproducibility
    let seed = 42;
    function seededRandom() {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    }

    function randomInt(min, max) {
        return Math.floor(seededRandom() * (max - min + 1)) + min;
    }

    function randomChoice(arr) {
        return arr[Math.floor(seededRandom() * arr.length)];
    }

    function weightedChoice(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let r = seededRandom() * totalWeight;
        for (const item of items) {
            r -= item.weight;
            if (r <= 0) return item;
        }
        return items[items.length - 1];
    }

    function generateFIRNumber(year, district, idx) {
        const distCode = district.substring(0, 3).toUpperCase();
        return `FIR-${distCode}-${year}-${String(idx).padStart(5, '0')}`;
    }

    function generateAccused(count) {
        const accused = [];
        for (let i = 0; i < count; i++) {
            const firstName = randomChoice(FIRST_NAMES);
            const lastName = randomChoice(LAST_NAMES);
            accused.push({
                id: `ACC-${String(i + 1).padStart(4, '0')}`,
                name: `${firstName} ${lastName}`,
                age: randomInt(18, 60),
                gender: ['Lakshmi','Suma','Kavitha','Priya','Divya','Anitha','Rekha','Shobha'].includes(firstName) ? 'Female' : 'Male',
                district: randomChoice(DISTRICTS),
                priorOffenses: randomInt(0, 8),
                riskScore: 0,
                connections: [],
                firs: []
            });
        }
        return accused;
    }

    function generateCrimeRecords(count, accusedList) {
        const records = [];
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2026-07-25');
        const range = endDate.getTime() - startDate.getTime();

        // Generate temporal patterns
        for (let i = 0; i < count; i++) {
            const crimeType = weightedChoice(CRIME_TYPES);
            const district = randomChoice(DISTRICTS);
            const station = randomChoice(STATIONS);
            const coords = DISTRICT_COORDS[district] || [12.9716, 77.5946];

            // Add temporal patterns
            let date = new Date(startDate.getTime() + seededRandom() * range);

            // Weekend spike for certain crimes
            if (['Theft', 'Robbery', 'Rash Driving'].includes(crimeType.name)) {
                if (seededRandom() < 0.35) {
                    while (date.getDay() !== 0 && date.getDay() !== 6) {
                        date = new Date(date.getTime() + 86400000);
                    }
                }
            }

            // Night hours for violent crimes
            let hour;
            if (['Violent', 'Property Crime'].includes(crimeType.category)) {
                hour = seededRandom() < 0.4 ? randomInt(20, 23) : randomInt(0, 23);
            } else {
                hour = randomInt(6, 22);
            }

            // Assign 1-3 accused
            const numAccused = crimeType.category === 'Violent' ? randomInt(1, 3) : randomInt(1, 2);
            const assignedAccused = [];
            for (let j = 0; j < numAccused; j++) {
                const acc = randomChoice(accusedList);
                if (!assignedAccused.includes(acc.id)) {
                    assignedAccused.push(acc.id);
                }
            }

            // Connect accused to each other via this FIR
            for (const a1 of assignedAccused) {
                const accObj1 = accusedList.find(a => a.id === a1);
                if (accObj1) {
                    accObj1.firs.push(generateFIRNumber(date.getFullYear(), district, i));
                    for (const a2 of assignedAccused) {
                        if (a1 !== a2 && !accObj1.connections.includes(a2)) {
                            accObj1.connections.push(a2);
                        }
                    }
                }
            }

            const status = seededRandom() < 0.3 ? 'Under Investigation' :
                          seededRandom() < 0.5 ? 'Charge Sheet Filed' :
                          seededRandom() < 0.7 ? 'Closed' : 'Pending';

            records.push({
                id: i + 1,
                firNumber: generateFIRNumber(date.getFullYear(), district, i),
                date: date.toISOString().split('T')[0],
                time: `${String(hour).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}`,
                hour: hour,
                dayOfWeek: date.getDay(),
                month: date.getMonth(),
                year: date.getFullYear(),
                crimeType: crimeType.name,
                ipcSection: crimeType.code,
                category: crimeType.category,
                district: district,
                station: station,
                lat: coords[0] + (seededRandom() - 0.5) * 0.3,
                lng: coords[1] + (seededRandom() - 0.5) * 0.3,
                accusedIds: assignedAccused,
                modusOperandi: randomChoice(MODUS_OPERANDI),
                status: status,
                severity: crimeType.category === 'Violent' ? 'High' :
                         crimeType.category === 'Crime Against Women' ? 'High' :
                         crimeType.category === 'Property Crime' ? 'Medium' : 'Low'
            });
        }

        // Calculate risk scores for accused
        for (const acc of accusedList) {
            acc.riskScore = Math.min(100, Math.round(
                (acc.priorOffenses * 12) +
                (acc.connections.length * 8) +
                (acc.firs.length * 10) +
                (seededRandom() * 15)
            ));
        }

        return records;
    }

    // Generate anomalies
    function detectAnomalies(records) {
        const anomalies = [];

        // District monthly counts
        const districtMonthly = {};
        for (const r of records) {
            const key = `${r.district}::${r.year}::${r.month}`;
            districtMonthly[key] = (districtMonthly[key] || 0) + 1;
        }

        // Find spikes
        const districtAvg = {};
        for (const r of records) {
            if (!districtAvg[r.district]) districtAvg[r.district] = [];
        }
        for (const [key, count] of Object.entries(districtMonthly)) {
            const dist = key.split('::')[0];
            districtAvg[dist].push(count);
        }

        for (const [dist, counts] of Object.entries(districtAvg)) {
            if (counts.length < 3) continue;
            const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
            const std = Math.sqrt(counts.reduce((a, b) => a + (b - mean) ** 2, 0) / counts.length);
            const latest = counts[counts.length - 1];
            if (latest > mean + 1.5 * std && std > 0) {
                anomalies.push({
                    type: 'spike',
                    severity: latest > mean + 2 * std ? 'critical' : 'warning',
                    title: `Crime Spike in ${dist}`,
                    description: `${latest} incidents detected vs ${Math.round(mean)} average monthly. Z-score: ${((latest - mean) / std).toFixed(1)}`,
                    district: dist,
                    timestamp: new Date().toISOString(),
                    zScore: ((latest - mean) / std).toFixed(2)
                });
            }
        }

        // Add some fixed anomalies for demo
        anomalies.push(
            {
                type: 'pattern',
                severity: 'critical',
                title: 'New Syndicate Detected in Bengaluru Urban',
                description: '5 accused linked via 3 FIRs in last 30 days. Modus operandi: Chain snatching.',
                district: 'Bengaluru Urban',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                zScore: '3.2'
            },
            {
                type: 'trend',
                severity: 'warning',
                title: 'Cyber Crime Surge in Mysuru',
                description: '42% increase in IT Act cases this month vs previous quarter average.',
                district: 'Mysuru',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                zScore: '2.1'
            },
            {
                type: 'geographic',
                severity: 'warning',
                title: 'Theft Cluster: Electronic City',
                description: '8 vehicle thefts reported within 2km radius in the last 7 days.',
                district: 'Bengaluru Urban',
                timestamp: new Date(Date.now() - 10800000).toISOString(),
                zScore: '2.5'
            }
        );

        return anomalies;
    }

    // Generate temporal patterns for the pulse engine
    function generateTemporalPatterns(records) {
        // Hour x DayOfWeek heatmap
        const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0));
        for (const r of records) {
            heatmap[r.dayOfWeek][r.hour]++;
        }

        // Daily counts for time series
        const dailyCounts = {};
        for (const r of records) {
            dailyCounts[r.date] = (dailyCounts[r.date] || 0) + 1;
        }
        const sortedDates = Object.keys(dailyCounts).sort();
        const timeSeries = sortedDates.map(d => ({ date: d, count: dailyCounts[d] }));

        // Monthly trend
        const monthlyCounts = {};
        for (const r of records) {
            const key = `${r.year}-${String(r.month + 1).padStart(2, '0')}`;
            monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        }

        // Predicted crime windows (next 7 days)
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const predictions = [];
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const futureDate = new Date(today.getTime() + i * 86400000);
            const dow = futureDate.getDay();
            const dayTotal = heatmap[dow].reduce((a, b) => a + b, 0);
            const peakHour = heatmap[dow].indexOf(Math.max(...heatmap[dow]));
            const avgDaily = timeSeries.length > 0 ? timeSeries.reduce((a, b) => a + b.count, 0) / timeSeries.length : 5;
            const normalizedRisk = Math.min(100, Math.round((dayTotal / (records.length / 7)) * 60 + seededRandom() * 20));

            const startHour = peakHour;
            const endHour = (peakHour + 2) % 24;
            const formatHour12h = h => {
                const ampm = h >= 12 ? 'PM' : 'AM';
                let hour12 = h % 12;
                if (hour12 === 0) hour12 = 12;
                return `${hour12}:00 ${ampm}`;
            };
            const peakHourStr = `${formatHour12h(startHour)} - ${formatHour12h(endHour)}`;

            predictions.push({
                date: futureDate.toISOString().split('T')[0],
                dayName: dayNames[dow],
                peakHour: peakHourStr,
                riskScore: normalizedRisk,
                risk: normalizedRisk > 70 ? 'high' : normalizedRisk > 45 ? 'medium' : 'low',
                expectedCrimes: Math.round(avgDaily * (0.7 + seededRandom() * 0.6)),
                topCrimeType: randomChoice(['Theft', 'Assault', 'Fraud', 'Robbery', 'Cyber Crime'])
            });
        }

        return {
            heatmap,
            timeSeries,
            monthlyCounts,
            predictions,
            dayNames
        };
    }

    // === GENERATE ALL DATA ===
    const accused = generateAccused(300);
    const crimes = generateCrimeRecords(5000, accused);
    const anomalies = detectAnomalies(crimes);
    const temporal = generateTemporalPatterns(crimes);

    // Summary stats
    const totalCrimes = crimes.length;
    const thisYearCrimes = crimes.filter(c => c.year === 2026).length;
    const lastYearCrimes = crimes.filter(c => c.year === 2025).length;
    const activeCases = crimes.filter(c => c.status === 'Under Investigation' || c.status === 'Pending').length;
    const solvedRate = Math.round((crimes.filter(c => c.status === 'Closed' || c.status === 'Charge Sheet Filed').length / totalCrimes) * 100);
    const repeatOffenders = accused.filter(a => a.priorOffenses >= 3).length;

    // Crime by category
    const crimeByCategory = {};
    for (const c of crimes) {
        crimeByCategory[c.category] = (crimeByCategory[c.category] || 0) + 1;
    }

    // Crime by district
    const crimeByDistrict = {};
    for (const c of crimes) {
        crimeByDistrict[c.district] = (crimeByDistrict[c.district] || 0) + 1;
    }
    const topDistricts = Object.entries(crimeByDistrict)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Monthly trend data
    const monthlyTrend = {};
    for (const c of crimes) {
        const key = `${c.year}-${String(c.month + 1).padStart(2, '0')}`;
        monthlyTrend[key] = (monthlyTrend[key] || 0) + 1;
    }

    // Export global data
    window.NeuralKSP = {
        data: {
            crimes,
            accused,
            anomalies,
            temporal,
            districts: DISTRICTS,
            stations: STATIONS,
            crimeTypes: CRIME_TYPES,
            crimeCategories: CRIME_CATEGORIES,
            districtCoords: DISTRICT_COORDS,
            summary: {
                totalCrimes,
                thisYearCrimes,
                lastYearCrimes,
                activeCases,
                solvedRate,
                repeatOffenders,
                totalAccused: accused.length,
                crimeByCategory,
                crimeByDistrict,
                topDistricts,
                monthlyTrend,
                anomalyCount: anomalies.filter(a => a.severity === 'critical').length
            }
        }
    };

    console.log('[NeuralKSP] Data engine initialized:', {
        crimes: crimes.length,
        accused: accused.length,
        anomalies: anomalies.length,
        districts: DISTRICTS.length
    });
})();
