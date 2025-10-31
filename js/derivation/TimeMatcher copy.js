// TimeMatcher.js
// Matches a tea's profile to the most suitable time(s) of day for consumption.

export class TimeMatcher {
    constructor(config = {}) {
        this.config = {
            rangeThreshold: config.rangeThreshold || 70,
            ...config
        };
        this.timePeriods = [
            "Early Morning", "Morning", "Midday",
            "Afternoon", "Evening", "Night"
        ];

        // Helper mapping for string levels to numbers (adjust scores as needed)
        this.levelMap = {
             "none": 0, "very low": 1, "low": 2,
             "moderate": 3, "medium": 3, // Alias medium
             "medium-high": 4, // Add compound levels
             "high": 4,
             "very high": 5
        };
    }

    // Helper to add score with tracing
    addTimeWithTrace(trace, scoreMap, time, score, reasonStep, reasonDetail) {
        if (!time || !this.timePeriods.includes(time)) return; // Only score defined periods
        const currentScore = scoreMap.get(time) || 0; // Default should be taken care of by init
        const newScore = currentScore + score;
        scoreMap.set(time, newScore);
        
        trace.push({
            step: reasonStep, // e.g., "Compound Profile Adjustment"
            reason: reasonDetail, // e.g., "Profile is 'Intense & Sharp'"
            adjustment: `${score >= 0 ? '+' : ''}${score} ${time}`,
            value: newScore
        });
    }

    matchTime(compoundAnalysis = {}, teaTypeAnalysis = {}, processingAnalysis = {}) {
        // Initialize the trace array
        let trace = [];
        
        // --- Extract and CONVERT data ---
        const stimulationStr = compoundAnalysis?.analysis?.stimulationLevel || compoundAnalysis.stimulationLevel || "moderate"; // e.g., "Low"
        const relaxationStr = compoundAnalysis?.analysis?.relaxationLevel || compoundAnalysis.relaxationLevel || "moderate"; // e.g., "High"
        const compoundProfile = compoundAnalysis?.analysis?.compoundProfile || compoundAnalysis.compoundProfile || "Balanced";

        trace.push({ 
            step: "Input Processing", 
            reason: "Raw compound analysis", 
            adjustment: `Using data: stimulation=${stimulationStr}, relaxation=${relaxationStr}, profile=${compoundProfile}`, 
            value: compoundProfile
        });

        // Convert string levels to numbers using the map
        const stimulationLevelNum = this.levelMap[stimulationStr.toLowerCase()] ?? 3; // Default to moderate (3) if unknown
        const relaxationLevelNum = this.levelMap[relaxationStr.toLowerCase()] ?? 3; // Default to moderate (3) if unknown

        // Get caffeine level string and tea type name correctly
        const typicalCaffeineStr = teaTypeAnalysis?.analysis?.typicalCaffeine || teaTypeAnalysis.typicalCaffeine || "medium"; // e.g., "Medium-High"
        const primaryTeaType = teaTypeAnalysis.primaryType || ""; // Use primaryType

        trace.push({ 
            step: "Tea Type Analysis", 
            reason: "Raw tea type data", 
            adjustment: `Type: ${primaryTeaType}, Typical Caffeine: ${typicalCaffeineStr}`, 
            value: primaryTeaType
        });

        // Convert typicalCaffeine string to a simpler category for checks
        let caffeineCategory = "medium"; // Default
        const lowerCaffeineStr = typicalCaffeineStr.toLowerCase();
        if (lowerCaffeineStr.includes("very high") || lowerCaffeineStr.includes("high")) {
            caffeineCategory = "high";
        } else if (lowerCaffeineStr.includes("very low") || lowerCaffeineStr.includes("low") || lowerCaffeineStr.includes("none")) {
            caffeineCategory = "low";
        }
        
        trace.push({ 
            step: "Caffeine Categorization", 
            reason: `From: ${typicalCaffeineStr}`, 
            adjustment: `Simplified to: ${caffeineCategory}`, 
            value: caffeineCategory
        });
        // --- End Data Extraction/Conversion ---


        const timeScores = new Map();

        // Initialize with a base score (e.g., 50) for all periods
        // This prevents periods from having zero score unless explicitly penalized
        this.timePeriods.forEach(period => timeScores.set(period, 50));
        
        trace.push({ 
            step: "Score Initialization", 
            reason: "Baseline setup", 
            adjustment: "All time periods initialized with score 50", 
            value: this.timePeriods.join(', ')
        });


        // Base scores based on compoundProfile (Using larger increments now)
        switch (compoundProfile) {
            case "Intense & Sharp":
                 this.addTimeWithTrace(trace, timeScores, "Early Morning", 25, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                 this.addTimeWithTrace(trace, timeScores, "Morning", 35, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");     
                 this.addTimeWithTrace(trace, timeScores, "Midday", 15, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");       
                 this.addTimeWithTrace(trace, timeScores, "Evening", -20, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");      
                 this.addTimeWithTrace(trace, timeScores, "Night", -30, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");        
                 break;
            case "Focused & Energized":
                 this.addTimeWithTrace(trace, timeScores, "Morning", 30, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                 this.addTimeWithTrace(trace, timeScores, "Midday", 25, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 15, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                 this.addTimeWithTrace(trace, timeScores, "Evening", -15, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                 this.addTimeWithTrace(trace, timeScores, "Night", -25, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                 break;
            case "Balanced":
            case "Balanced & Focused": // Grouping similar profiles
                 // Balanced teas are more versatile, apply smaller adjustments
                 this.addTimeWithTrace(trace, timeScores, "Morning", 10, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                 this.addTimeWithTrace(trace, timeScores, "Midday", 15, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 15, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                 this.addTimeWithTrace(trace, timeScores, "Evening", 5, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                 break;
             case "Calm & Clear":
             case "Smooth & Sustained": // Grouping similar profiles
                 this.addTimeWithTrace(trace, timeScores, "Morning", -10, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                 this.addTimeWithTrace(trace, timeScores, "Midday", 10, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 25, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                 this.addTimeWithTrace(trace, timeScores, "Evening", 30, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                 this.addTimeWithTrace(trace, timeScores, "Night", 10, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                 break;
             case "Deeply Calm":
                 this.addTimeWithTrace(trace, timeScores, "Morning", -30, "Compound Profile Adjustment", "Profile is 'Deeply Calm'");
                 this.addTimeWithTrace(trace, timeScores, "Midday", -10, "Compound Profile Adjustment", "Profile is 'Deeply Calm'");
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 15, "Compound Profile Adjustment", "Profile is 'Deeply Calm'");
                 this.addTimeWithTrace(trace, timeScores, "Evening", 35, "Compound Profile Adjustment", "Profile is 'Deeply Calm'");
                 this.addTimeWithTrace(trace, timeScores, "Night", 30, "Compound Profile Adjustment", "Profile is 'Deeply Calm'");
                 break;
             default:
                 // Less impact for unknown profiles
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 5, "Compound Profile Adjustment", "Profile is unknown");
                 this.addTimeWithTrace(trace, timeScores, "Morning", 5, "Compound Profile Adjustment", "Profile is unknown");
        }

        // Adjust based on stimulation level NUMBER (Using larger increments)
        // Example mapping: 0=None, 1=VL, 2=L, 3=M, 4=H, 5=VH
        if (stimulationLevelNum >= 4) { // High or Very High
            this.addTimeWithTrace(trace, timeScores, "Early Morning", 15, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Morning", 20, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Midday", 10, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Evening", -25, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Night", -35, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
        } else if (stimulationLevelNum <= 1) { // Very Low or None
            this.addTimeWithTrace(trace, timeScores, "Morning", -15, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Afternoon", 10, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Evening", 15, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Night", 10, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
        }

        // Adjust based on relaxation level NUMBER (Using larger increments)
        if (relaxationLevelNum >= 4) { // High or Very High
            this.addTimeWithTrace(trace, timeScores, "Afternoon", 10, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Evening", 25, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Night", 20, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Early Morning", -20, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Morning", -15, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
        } else if (relaxationLevelNum <= 1) { // Very Low or None
            this.addTimeWithTrace(trace, timeScores, "Evening", -15, "Relaxation Level Adjustment", `Low relaxation level (${relaxationLevelNum})`);
            this.addTimeWithTrace(trace, timeScores, "Night", -20, "Relaxation Level Adjustment", `Low relaxation level (${relaxationLevelNum})`);
        }

        // Adjust based on caffeine CATEGORY (high/medium/low)
        if (caffeineCategory === "high") {
            this.addTimeWithTrace(trace, timeScores, "Early Morning", 10, "Caffeine Level Adjustment", "High caffeine category");
            this.addTimeWithTrace(trace, timeScores, "Morning", 15, "Caffeine Level Adjustment", "High caffeine category");
            this.addTimeWithTrace(trace, timeScores, "Midday", 5, "Caffeine Level Adjustment", "High caffeine category");
            this.addTimeWithTrace(trace, timeScores, "Evening", -30, "Caffeine Level Adjustment", "High caffeine category");
            this.addTimeWithTrace(trace, timeScores, "Night", -40, "Caffeine Level Adjustment", "High caffeine category");
        } else if (caffeineCategory === "low") {
            this.addTimeWithTrace(trace, timeScores, "Afternoon", 10, "Caffeine Level Adjustment", "Low caffeine category");
            this.addTimeWithTrace(trace, timeScores, "Evening", 15, "Caffeine Level Adjustment", "Low caffeine category");
            this.addTimeWithTrace(trace, timeScores, "Night", 15, "Caffeine Level Adjustment", "Low caffeine category");
        }

        // Adjust based on primaryTeaType (using the correct variable)
        if (primaryTeaType) {
            const lowerTeaType = primaryTeaType.toLowerCase();
             if (lowerTeaType.includes("breakfast") || lowerTeaType.includes("assam") || lowerTeaType.includes("black")) { // Example grouping
                 this.addTimeWithTrace(trace, timeScores, "Early Morning", 15, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (breakfast/assam/black)`);
                 this.addTimeWithTrace(trace, timeScores, "Morning", 15, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (breakfast/assam/black)`);
             }
             if (lowerTeaType.includes("green") && !lowerTeaType.includes("hojicha")){ // Hojicha is often evening
                 this.addTimeWithTrace(trace, timeScores, "Morning", 10, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (green)`);
                 this.addTimeWithTrace(trace, timeScores, "Midday", 5, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (green)`);
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 5, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (green)`);
                 this.addTimeWithTrace(trace, timeScores, "Evening", -5, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (green)`);
             }
             if (lowerTeaType.includes("white")) {
                 this.addTimeWithTrace(trace, timeScores, "Afternoon", 10, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (white)`);
                 this.addTimeWithTrace(trace, timeScores, "Evening", 5, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (white)`);
             }
            if (lowerTeaType.includes("herbal") || lowerTeaType.includes("tisane") || lowerTeaType.includes("hojicha") || lowerTeaType.includes("chamomile") || lowerTeaType.includes("lavender")) { // Grouping low/no caffeine
                 this.addTimeWithTrace(trace, timeScores, "Evening", 15, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (herbal/tisane/hojicha/chamomile/lavender)`);
                 this.addTimeWithTrace(trace, timeScores, "Night", 15, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (herbal/tisane/hojicha/chamomile/lavender)`);
            }
            
            // Modification 1.1: Apply penalty to gyokuro and matcha for evening/night
            if (lowerTeaType.includes("gyokuro") || lowerTeaType.includes("matcha")) {
                this.addTimeWithTrace(trace, timeScores, "Evening", -35, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (gyokuro/matcha)`);
                this.addTimeWithTrace(trace, timeScores, "Night", -45, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (gyokuro/matcha)`);
                this.addTimeWithTrace(trace, timeScores, "Afternoon", 10, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (gyokuro/matcha)`);
            }
            
            // Modification 1.2: Boost Afternoon for Ripe Puerh
            if (lowerTeaType.includes("puerh-shou") || (lowerTeaType.includes("puerh") && lowerTeaType.includes("ripe"))) {
                this.addTimeWithTrace(trace, timeScores, "Afternoon", 10, "Tea Type Adjustment", `Tea type: ${primaryTeaType} (puerh-shou/ripe puerh)`);
            }
            
            // Add more specific type adjustments if needed
        }

        // --- Final Processing ---
        // Remove periods if their score dropped too low (e.g., below 20)
        let periodsRemoved = [];
        for (const [time, score] of timeScores.entries()) {
            if (score < 20) {
                periodsRemoved.push(time);
                timeScores.delete(time);
            }
        }
        
        if (periodsRemoved.length > 0) {
            trace.push({ 
                step: "Score Filtering", 
                reason: "Removing low-scoring periods", 
                adjustment: `Removed periods with scores < 20`, 
                value: periodsRemoved.join(', ')
            });
        }

        // Log raw scores before normalization
        const rawScoresArray = Array.from(timeScores.entries()).map(([time, score]) => `${time}: ${score}`);
        trace.push({ 
            step: "Raw Scores", 
            reason: "Before normalization", 
            adjustment: "Calculated raw scores for each period", 
            value: rawScoresArray.join(', ')
        });

        const normalizedScores = this.normalizeTimeScores(timeScores);
        trace.push({ 
            step: "Score Normalization", 
            reason: "Converting to 0-100 scale", 
            adjustment: "Normalized all scores", 
            value: Object.entries(normalizedScores).map(([time, score]) => `${time}: ${score}`).join(', ')
        });
        
        const recommendedTimes = this.getRecommendedTimes(normalizedScores);
        trace.push({ 
            step: "Recommendation Generation", 
            reason: "Finding best time periods", 
            adjustment: `Selected ${recommendedTimes.length} recommended periods`, 
            value: recommendedTimes.map(item => `${item.name}: ${item.score}`).join(', ')
        });
        
        const timeRanges = this.identifyTimeRanges(normalizedScores);
        if (timeRanges.length > 0) {
            trace.push({ 
                step: "Range Identification", 
                reason: "Finding continuous time ranges", 
                adjustment: `Identified ${timeRanges.length} continuous ranges`, 
                value: timeRanges.map(range => `${range.start} to ${range.end} (${range.score})`).join(', ')
            });
        }

        return {
            recommendations: normalizedScores,
            recommendedTimes,
            idealRanges: timeRanges,
            trace
        };
    }

    // --- Normalize Scores (Consider revising) ---
     normalizeTimeScores(timeScores) {
         const result = {};
         const scores = [...timeScores.values()];

         if (scores.length === 0) return {}; // Handle empty map

         // Maybe normalize based on a fixed potential range (e.g., 0 to 100 raw) instead of max achieved?
         // Or keep max-based normalization for now.
         const maxScore = Math.max(...scores, 1);
         const minScore = Math.min(...scores, 0); // Get min score

         // If max and min are close, might indicate low differentiation
         // Alternative: Normalize 0-100 based on potential range (e.g. 0 to 100 raw base + adjustments)

         for (const [time, score] of timeScores.entries()) {
             // Option 1: Scale relative to max (current approach)
             // let normalizedScore = Math.max(0, Math.min(Math.round((score / maxScore) * 100), 100));

             // Option 2: Scale relative to observed min/max range
             let normalizedScore = 0;
             if (maxScore > minScore) { // Avoid division by zero if all scores are same
                 normalizedScore = Math.round(((score - minScore) / (maxScore - minScore)) * 100);
             } else if (maxScore > 0) { // If all scores are same and positive
                 normalizedScore = 100;
             }
             normalizedScore = Math.max(0, Math.min(normalizedScore, 100)); // Ensure 0-100 bounds

             result[time] = normalizedScore;
         }
         console.log("Normalized Time Scores:", result); // Log normalized scores
         return result;
     }


    // --- Get Recommended Times (Consider revising threshold or logic) ---
    getRecommendedTimes(normalizedScores) {
         const sortedTimes = Object.entries(normalizedScores)
             .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

         if (sortedTimes.length === 0) {
             return [{ name: "Anytime", score: 50 }]; // Default fallback
         }

         const maxScore = sortedTimes[0][1];
         // Maybe use an absolute threshold AND a relative one?
         // E.g., score >= 70 AND score >= maxScore - 20
         const absoluteThreshold = 65; // Example: Must score at least 65
         const relativeThreshold = 20; // Example: Must be within 20 points of max

         const recommendedTimes = sortedTimes
             .filter(([time, score]) => score >= absoluteThreshold && score >= maxScore - relativeThreshold)
             .map(([time, score]) => ({ name: time, score }));

         // Fallback if filtering leaves nothing
         if (recommendedTimes.length === 0) {
              // Return just the top scoring period if no recommendations meet thresholds
              return [{ name: sortedTimes[0][0], score: sortedTimes[0][1] }];
          }

         return recommendedTimes;
     }


    // --- Identify Time Ranges (Keep as is for now) ---
    identifyTimeRanges(normalizedScores) {
         const ranges = [];
         // Use a potentially lower threshold for ranges if needed, or keep config.rangeThreshold
         const threshold = this.config.rangeThreshold;
         const orderedTimes = this.timePeriods.filter(time =>
             normalizedScores[time] !== undefined &&
             normalizedScores[time] >= threshold
         );

         // (Rest of the range logic remains the same as in your code)
         if (orderedTimes.length === 0) return [];
         if (orderedTimes.length === 1) return [{ start: orderedTimes[0], end: orderedTimes[0], score: normalizedScores[orderedTimes[0]] }];

         let rangeStart = orderedTimes[0];
         let currentRange = [rangeStart];
         let previousIndex = this.timePeriods.indexOf(rangeStart);

         for (let i = 1; i < orderedTimes.length; i++) {
             const currentTime = orderedTimes[i];
             const currentIndex = this.timePeriods.indexOf(currentTime);
             if (currentIndex === previousIndex + 1) {
                 currentRange.push(currentTime);
             } else {
                 ranges.push({ start: currentRange[0], end: currentRange[currentRange.length - 1], score: this.calculateAverageScore(currentRange, normalizedScores) });
                 rangeStart = currentTime;
                 currentRange = [rangeStart];
             }
             previousIndex = currentIndex;
         }
         if (currentRange.length > 0) {
             ranges.push({ start: currentRange[0], end: currentRange[currentRange.length - 1], score: this.calculateAverageScore(currentRange, normalizedScores) });
         }
         return ranges;
     }

     // --- Calculate Average Score (Keep as is) ---
     calculateAverageScore(timeRange, normalizedScores) {
         const sum = timeRange.reduce((acc, time) => acc + (normalizedScores[time] || 0), 0);
         return Math.round(sum / timeRange.length);
     }

     // --- Format Time Ranges (Keep as is) ---
     formatTimeRanges(ranges) {
         // (Keep formatting logic as is)
         if (ranges.length === 0) return "No specific time range recommended";
         const sortedRanges = [...ranges].sort((a, b) => b.score - a.score);
         return sortedRanges.map(range => {
             if (range.start === range.end) return `${range.start} (${range.score}%)`;
             return `${range.start} to ${range.end} (${range.score}%)`;
         }).join(', ');
     }
}

// Export the class
export default TimeMatcher;