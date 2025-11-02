// TimeMatcher.js (Hourly Version - Smoothed Transitions V2)
// Matches a tea's profile to suitable hours, aiming for lower night scores and smoother curves.
// Includes fixes for 06:00 peak and reduced evening boosts/penalties.

export class TimeMatcher {
    constructor(config = {}) {
        this.config = {
            rangeThreshold: config.rangeThreshold || 70, // Score 0-100
            baseScore: config.baseScore || 50, // Keeping base at 50
            maxRecommendations: config.maxRecommendations || 3,
            ...config
        };
        this.hours = Array.from({ length: 24 }, (_, i) => i); // [0, 1, ..., 23]

        this.levelMap = {
            "none": 0, "very low": 1, "low": 2,
            "moderate": 3, "medium": 3,
            "medium-high": 4,
            "high": 5,
            "very high": 6
        };
    }

    // Helper to add score adjustment (unchanged)
    _adjustScoreForHour(trace, scoreMap, hour, adjustment, reasonStep, reasonDetail) {
        if (hour < 0 || hour > 23) return;
        const currentScore = scoreMap.get(hour);
        // Clamp score slightly above 0 if penalty is applied, to allow some granularity
        let newScore = currentScore + adjustment;
        if (adjustment < 0) {
             newScore = Math.max(1, newScore); // Clamp penalties at 1 instead of 0
        } else {
             newScore = Math.max(0, newScore); // Boosts can still start from 0
        }
        scoreMap.set(hour, newScore);
        trace.push({ step: reasonStep, reason: reasonDetail, adjustment: `${adjustment >= 0 ? '+' : ''}${adjustment} @ Hour ${hour}`, value: newScore.toFixed(1) });
    }

    // Helper to apply profile (unchanged)
    _applyHourlyProfile(trace, scoreMap, profile, reasonStep, reasonDetail) {
        if (!Array.isArray(profile) || profile.length !== 24) {
            console.error("Invalid hourly profile provided.");
            trace.push({ step: "Error", reason: "Invalid hourly profile applied", adjustment: "Skipped profile application" });
            return;
        }
        this.hours.forEach(hour => {
            this._adjustScoreForHour(trace, scoreMap, hour, profile[hour], reasonStep, reasonDetail);
        });
    }

    // --- REFINED Hourly Score Profiles ---

    _getStimulationProfile(level) { // level is 0-5
        const profile = new Array(24).fill(0);
        const boost = level * 5; // Slightly reduced max boost (+25)
        const penalty = -level * 8; // Slightly reduced max penalty (-40)

        // Morning/Midday Boost (Starts at 7am to fix 6am peak)
        for (let h = 7; h <= 16; h++) { // Start boost at 7am
            let factor = Math.max(0, 1.0 - Math.abs(h - 10.5) / 6.5); // Peak ~10:30
            profile[h] = boost * factor;
        }
        // Evening/Night Penalty (More gradual onset)
        for (let h = 18; h <= 23; h++) profile[h] = penalty * 0.6 * (1 + (h - 18) / 5); // Gradual onset, reduced max slightly
        for (let h = 0; h <= 5; h++) profile[h] = penalty; // Keep strong penalty in deep night

        return profile.map(p => Math.round(p));
    }

    _getRelaxationProfile(level) { // level is 0-5
        const profile = new Array(24).fill(0);
        const boost = level * 3.5; // Reduced max boost (+17.5)
        const penalty = -level * 3; // Keep reduced morning penalty (-15 max)

        // Evening/Night Boost (Peak ~21:00, reduced magnitude, faster decay)
        for (let h = 17; h <= 23; h++) {
             let factor = Math.max(0, 1 - Math.abs(h - 21) / 4.5); // Slightly tighter peak
             if (h === 23 || h === 0 || h === 1) factor *= 0.1; // Very low boost late
             profile[h] = boost * factor;
         }
         for (let h = 0; h <= 1; h++) profile[h] = boost * 0.1; // Keep very low boost after midnight

        // Morning Penalty (Starts at 7am, reduced magnitude)
        for (let h = 7; h <= 11; h++) profile[h] = penalty;

        return profile.map(p => Math.round(p));
    }

    _getCompoundEffectProfile(compoundProfileName) {
        const profile = new Array(24).fill(0);
        // Tuned values for smoother curves and less extreme impact
        switch (compoundProfileName) {
             case "Intense & Sharp":
                 for (let h = 7; h <= 13; h++) profile[h] = 18 * (1 - Math.abs(h - 9.5) / 4.5); // Reduced boost
                 for (let h = 18; h <= 23; h++) profile[h] = -35 * ( (h-17)/6 );
                 for (let h = 0; h <= 5; h++) profile[h] = -45; // Reduced penalty
                 break;
             case "Focused & Energized":
                 for (let h = 8; h <= 15; h++) profile[h] = 15 * (1 - Math.abs(h - 11) / 5); // Reduced boost
                 for (let h = 19; h <= 23; h++) profile[h] = -25 * ( (h-18)/5 );
                 for (let h = 0; h <= 5; h++) profile[h] = -35; // Reduced penalty
                 break;
             case "Balanced": case "Balanced & Focused":
                 for (let h = 9; h <= 17; h++) profile[h] = 6; // Reduced boost
                 for (let h = 22; h <= 23; h++) profile[h] = -8; // Reduced penalty
                 break;
             case "Calm & Clear": case "Smooth & Sustained":
                 for (let h = 14; h <= 20; h++) profile[h] = 10 * (1 - Math.abs(h - 17) / 4); // Reduced boost
                 for (let h = 7; h <= 9; h++) profile[h] = -10; // Reduced penalty
                 break;
             case "Deeply Calm": case "Primarily Relaxing":
                 for (let h = 18; h <= 23; h++) profile[h] = 15 * (1 - Math.abs(h - 21) / 4); // Reduced boost
                 for (let h = 0; h <= 1; h++) profile[h] = 3; // Reduced post-midnight boost
                 for (let h = 7; h <= 12; h++) profile[h] = -20; // Reduced penalty
                 break;
             default:
                 for (let h = 10; h <= 16; h++) profile[h] = 4; // Reduced boost
                 break;
         }
        return profile.map(p => Math.round(p));
    }

    _getCaffeineCategoryProfile(category) {
        const profile = new Array(24).fill(0);
        if (category === "high") {
            for (let h = 7; h <= 14; h++) profile[h] = 10 * (1 - Math.abs(h - 9.5) / 5.5); // Reduced boost
            for (let h = 18; h <= 23; h++) profile[h] = -40 * ( (h-17)/6 ); // Gradual onset, reduced max penalty
            for (let h = 0; h <= 5; h++) profile[h] = -50; // Reduced max penalty
        } else if (category === "low") {
            // Removed evening boost, keep small morning penalty
            for (let h = 7; h <= 9; h++) profile[h] = -5;
            // Add tiny boost late night for low caffeine?
            for (let h = 20; h <= 23; h++) profile[h] = 3; // Very small boost
        }
        return profile.map(p => Math.round(p));
    }

    _getTeaTypeSpecificProfile(primaryTeaType, subType) {
         const profile = new Array(24).fill(0);
         const typeToCheck = subType ? subType.toLowerCase() : primaryTeaType.toLowerCase();

         if (typeToCheck.includes("gyokuro") || typeToCheck.includes("matcha")) {
            // Reduced penalties to avoid hitting absolute zero too easily
            for (let h = 18; h <= 23; h++) profile[h] = -50 * ( (h-17)/6 ); // Gradual onset, reduced max
            for (let h = 0; h <= 5; h++) profile[h] = -60; // Reduced max
            for (let h = 10; h <= 16; h++) profile[h] = 8; // Reduced boost
         } else if (typeToCheck.includes("herbal") || typeToCheck.includes("tisane") || typeToCheck.includes("hojicha") || typeToCheck.includes("chamomile") || typeToCheck.includes("lavender")) {
            for (let h = 17; h <= 23; h++) profile[h] = 12 * (1 - Math.abs(h-20)/6); // Reduced boost
            for (let h = 0; h <= 1; h++) profile[h] = 8; // Reduced boost
            for (let h = 7; h <= 11; h++) profile[h] = -12; // Reduced penalty
         } else if (typeToCheck.includes("breakfast") || typeToCheck.includes("assam")) {
             for (let h = 6; h <= 9; h++) profile[h] = 12; // Slightly reduced boost
             for (let h = 21; h <= 23; h++) profile[h] = -8; // Reduced penalty
         } else if (typeToCheck.includes("puerh-shou") || typeToCheck.includes("shou")) {
             for (let h = 14; h <= 19; h++) profile[h] = 6; // Reduced boost
         }
         else if (typeToCheck.includes("silver needle")){
              // Added gentle penalties for late night instead of boost
              for (let h = 22; h <= 23; h++) profile[h] = -10;
              for (let h = 0; h <= 4; h++) profile[h] = -15; // Extend penalty slightly
         }
         return profile.map(p => Math.round(p));
    }


    // Main matching function (structure unchanged)
    matchTime(compoundAnalysis = {}, teaTypeAnalysis = {}, processingAnalysis = {}) {
        let trace = [];
        const hourlyScores = new Map();

        this.hours.forEach(hour => hourlyScores.set(hour, this.config.baseScore));
        trace.push({ step: "Initialization", reason: "Baseline setup", adjustment: `All 24 hours initialized to ${this.config.baseScore}` });

        // --- Extract Inputs (Unchanged) ---
        const stimulationStr = compoundAnalysis?.analysis?.stimulationLevel || compoundAnalysis.stimulationLevel || "moderate";
        const relaxationStr = compoundAnalysis?.analysis?.relaxationLevel || compoundAnalysis.relaxationLevel || "moderate";
        const compoundProfile = compoundAnalysis?.analysis?.compoundProfile || compoundAnalysis.compoundProfile || "Balanced";
        const stimulationLevelNum = this.levelMap[stimulationStr.toLowerCase()] ?? 3;
        const relaxationLevelNum = this.levelMap[relaxationStr.toLowerCase()] ?? 3;

        const primaryTeaType = teaTypeAnalysis?.teaType || ""; // Assumes fix where this can be 'matcha' etc.
        const subType = teaTypeAnalysis?.subType || "";
        const typicalCaffeineStr = teaTypeAnalysis?.analysis?.typicalCaffeine || "medium";

        let caffeineCategory = "medium";
        const lowerCaffeineStr = typicalCaffeineStr.toLowerCase();
        if (lowerCaffeineStr.includes("very high") || lowerCaffeineStr.includes("high")) caffeineCategory = "high";
        else if (lowerCaffeineStr.includes("very low") || lowerCaffeineStr.includes("low") || lowerCaffeineStr.includes("none")) caffeineCategory = "low";

        trace.push({ step: "Input Processing", reason: "Extracting analysis data", adjustment: `Stim: ${stimulationStr}(${stimulationLevelNum}), Relax: ${relaxationStr}(${relaxationLevelNum}), Profile: ${compoundProfile}, CaffeineCat: ${caffeineCategory}, Type: ${primaryTeaType}, SubType: ${subType}` });

        // --- Apply Tuned Profiles ---
        const compoundProfileAdjustments = this._getCompoundEffectProfile(compoundProfile);
        this._applyHourlyProfile(trace, hourlyScores, compoundProfileAdjustments, "Compound Profile Adjustment", `Based on profile: '${compoundProfile}'`);

        const stimulationProfileAdjustments = this._getStimulationProfile(stimulationLevelNum);
        this._applyHourlyProfile(trace, hourlyScores, stimulationProfileAdjustments, "Stimulation Level Adjustment", `Based on level: ${stimulationStr} (${stimulationLevelNum})`);

        const relaxationProfileAdjustments = this._getRelaxationProfile(relaxationLevelNum);
        this._applyHourlyProfile(trace, hourlyScores, relaxationProfileAdjustments, "Relaxation Level Adjustment", `Based on level: ${relaxationStr} (${relaxationLevelNum})`);

        const caffeineCategoryAdjustments = this._getCaffeineCategoryProfile(caffeineCategory);
        this._applyHourlyProfile(trace, hourlyScores, caffeineCategoryAdjustments, "Caffeine Category Adjustment", `Based on category: '${caffeineCategory}'`);

        const teaTypeAdjustments = this._getTeaTypeSpecificProfile(primaryTeaType, subType);
        this._applyHourlyProfile(trace, hourlyScores, teaTypeAdjustments, "Tea Type Specific Adjustment", `Based on type: '${primaryTeaType}', subtype: '${subType}'`);

        // --- Final Processing (Unchanged) ---
        const finalScores = Object.fromEntries(hourlyScores);
        const rawScoresArray = Object.entries(finalScores).map(([hour, score]) => `${hour}: ${score.toFixed(0)}`);
        trace.push({ step: "Raw Scores", reason: "Before normalization", adjustment: "Aggregated raw scores for each hour", value: rawScoresArray.join(', ') });

        const normalizedScores = this.normalizeScores(finalScores); // Using percentile normalization
        trace.push({ step: "Score Normalization", reason: "Converting to 0-100 scale (Percentile)", adjustment: "Normalized all scores", value: Object.entries(normalizedScores).map(([h, s]) => `${h}:${s}`).join(', ') });

        const recommendedTimes = this.getRecommendedTimes(normalizedScores);
        trace.push({ step: "Recommendation Generation", reason: "Finding best hours", adjustment: `Selected top ${recommendedTimes.length} hours`, value: recommendedTimes.map(item => `${item.hour}:${item.score}`).join(', ') });

        const idealRanges = this.identifyTimeRanges(normalizedScores);
        if (idealRanges.length > 0) {
            trace.push({ step: "Range Identification", reason: "Finding continuous blocks of suitable hours", adjustment: `Identified ${idealRanges.length} ranges`, value: idealRanges.map(r => `${r.start}-${r.end}(${r.score})`).join(', ') });
        }

        return {
            hourlyScores: normalizedScores,
            recommendedTimes: recommendedTimes,
            idealRanges: idealRanges,
            trace
        };
    }

    // --- Helper functions (normalizeScores, getRecommendedTimes, identifyTimeRanges, calculateAverageScore) ---
    // Keep these the same as the previous percentile version.

    normalizeScores(hourlyScores) {
        const scoreEntries = Object.entries(hourlyScores);
        if (scoreEntries.length === 0) return {};
        const scores = Object.values(hourlyScores).sort((a, b) => a - b);
        if (scores.length < 2) {
            return Object.fromEntries(scoreEntries.map(([hour, score]) => [hour, Math.max(0, Math.min(100, Math.round(score)))]));
        }
        const medianIndex = Math.floor(scores.length / 2);
        const q90Index = Math.floor(scores.length * 0.9);
        const median = scores[medianIndex];
        const q90 = scores[Math.min(q90Index, scores.length - 1)];
        const denominator = q90 - median;

        if (denominator <= 0) {
            if (scores[0] === scores[scores.length - 1]) {
                return Object.fromEntries(scoreEntries.map(([hour]) => [hour, 50]));
            } else {
                const minScore = scores[0];
                const maxScore = scores[scores.length - 1];
                const range = maxScore - minScore;
                if (range <= 0) return Object.fromEntries(scoreEntries.map(([hour]) => [hour, 50]));
                return Object.fromEntries(
                    scoreEntries.map(([hour, score]) => [ hour, Math.max(0, Math.min(100, Math.round(((score - minScore) / range) * 100))) ])
                );
            }
        }
        return Object.fromEntries(
            scoreEntries.map(([hour, score]) => {
                let normalizedScore = 50 + (score - median) * 40 / denominator;
                normalizedScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));
                return [hour, normalizedScore];
            })
        );
    }

    getRecommendedTimes(normalizedScores) {
        const sortedTimes = Object.entries(normalizedScores)
             .map(([hour, score]) => ({ hour: parseInt(hour), score }))
             .sort((a, b) => b.score - a.score);
         if (sortedTimes.length === 0) return [];
         const maxScore = sortedTimes[0].score;
         const absoluteThreshold = 65;
         const relativeThreshold = 20;
         const recommended = sortedTimes
             .filter(item => item.score >= absoluteThreshold && item.score >= maxScore - relativeThreshold)
             .slice(0, this.config.maxRecommendations);
        if (recommended.length === 0 && sortedTimes.length > 0) {
            return [sortedTimes[0]];
        }
        recommended.sort((a,b) => a.hour - b.hour);
        return recommended;
    }

    identifyTimeRanges(normalizedScores) {
        const ranges = [];
        const threshold = this.config.rangeThreshold;
        const suitableHours = this.hours.filter(hour => normalizedScores[hour] >= threshold);
        if (suitableHours.length === 0) return [];
        let currentRange = [];
        for (let i = 0; i < suitableHours.length; i++) {
            const hour = suitableHours[i];
            if (currentRange.length === 0 || hour === (currentRange[currentRange.length - 1] + 1) % 24) {
                currentRange.push(hour);
            } else {
                ranges.push({ start: currentRange[0], end: currentRange[currentRange.length - 1], score: this.calculateAverageScore(currentRange, normalizedScores) });
                currentRange = [hour];
            }
        }
         ranges.push({ start: currentRange[0], end: currentRange[currentRange.length - 1], score: this.calculateAverageScore(currentRange, normalizedScores) });
         if (ranges.length > 1 && ranges[0].start === 0 && ranges[ranges.length - 1].end === 23) {
             const lastRange = ranges.pop();
             const firstRange = ranges.shift();
             const combinedHours = [...Array(firstRange.end + 1).keys()].concat([...Array(24).keys()].slice(lastRange.start));
             ranges.push({ start: lastRange.start, end: firstRange.end, score: this.calculateAverageScore(combinedHours, normalizedScores), isWraparound: true });
         }
        ranges.sort((a,b) => b.score - a.score);
        return ranges;
    }

    calculateAverageScore(hourRange, normalizedScores) {
        let hoursToAverage = [];
        if (!hourRange || hourRange.length === 0) return 0;
        const start = hourRange[0];
        const end = hourRange[hourRange.length - 1];
        if (start <= end) {
            for (let h = start; h <= end; h++) hoursToAverage.push(h);
        } else { // Wrap around
            for (let h = start; h <= 23; h++) hoursToAverage.push(h);
            for (let h = 0; h <= end; h++) hoursToAverage.push(h);
        }
        if (hoursToAverage.length === 0) return 0;
        const sum = hoursToAverage.reduce((acc, hour) => acc + (normalizedScores[hour] || 0), 0);
        return Math.round(sum / hoursToAverage.length);
    }
}

export default TimeMatcher;