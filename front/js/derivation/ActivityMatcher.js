// ActivityMatcher.js
// Matches a tea's profile to suitable activities and identifies activity clusters.
// Enhanced to group related activities into thematic clusters

export class ActivityMatcher {
    constructor(config = {}) {
        // Configuration options
        this.config = {
            // Minimum score (0-100) required to be included in a recommended cluster
            clusterThreshold: config.clusterThreshold || 80,
            // Maximum number of top activities to return
            maxRecommendations: config.maxRecommendations || 3,
            ...config
        };
        
        // Define activity clusters with related activities
        this.activityClusters = [
            {
                theme: "Mindfulness & Relaxation",
                activities: ["Meditation", "Yoga", "Deep Breathing", "Gentle Stretching", "Mindfulness Practice"]
            },
            {
                theme: "Focus & Productivity",
                activities: ["Work", "Study", "Reading", "Writing", "Problem Solving", "Coding", "High-Focus Work", "Productivity Sessions"]
            },
            {
                theme: "Creative Pursuits",
                activities: ["Art", "Journaling", "Creative Writing", "Music", "Crafting", "Brainstorming", "Creative Projects"]
            },
            {
                theme: "Social Engagement",
                activities: ["Social Gatherings", "Conversation", "Hosting", "Meetings", "Group Activities", "Tea Ceremony", "Social Events"]
            },
            {
                theme: "Active & Energetic",
                activities: ["Exercise", "Walking", "Light Exercise", "Sports", "Dance", "Active Outdoor Activities", "Morning Routines"]
            },
            {
                theme: "Evening Wind-Down",
                activities: ["Reading Before Bed", "Evening Ritual", "Relaxation", "Light Reading", "Evening Wind-Down", "Sleep Preparation"]
            },
            {
                theme: "Contemplative & Reflective",
                activities: ["Contemplation", "Reflection", "Journaling", "Deep Thinking", "Planning", "Self-Reflection", "Mindful Observation"]
            },
            {
                theme: "Everyday Rituals",
                activities: ["Daily Rituals", "Morning Routines", "Afternoon Break", "Breakfast Companion", "Casual Sipping", "General Enjoyment", "Everyday Activities"]
            }
        ];
        
        // Helper mapping for string levels to numbers
        this.levelMap = {
            "none": 0, "very low": 1, "low": 2,
            "moderate": 3, "medium": 3, // Alias medium
            "medium-high": 4,
            "high": 4,
            "very high": 5
        };
    }

    /**
     * Helper to add score to an activity with tracing
     */
    addActivityWithTrace(trace, scoreMap, activity, score, reasonStep, reasonDetail) {
        if (!activity) return; // Skip undefined or empty activities
        const currentScore = scoreMap.get(activity) || 0;
        const newScore = currentScore + score;
        scoreMap.set(activity, newScore);
        
        trace.push({
            step: reasonStep,
            reason: reasonDetail,
            adjustment: `${score >= 0 ? '+' : ''}${score} ${activity}`,
            value: newScore
        });
    }

    /**
     * Matches the tea's profile to suitable activities.
     * @param {object} compoundAnalysis - The 'analysis' object from CompoundCalculator.
     * Expected: stimulationLevel, relaxationLevel, compoundProfile.
     * @param {object} teaTypeAnalysis - The 'analysis' object from TeaTypeCalculator.
     * Expected: baseActivityHints.
     * @param {object} flavorAnalysis - The 'analysis' object from FlavorCalculator.
     * Expected: activityHints.
     * @returns {Object} - Results with recommended activities and activity clusters
     */
    matchActivity(compoundAnalysis = {}, teaTypeAnalysis = {}, flavorAnalysis = {}) {
        // Initialize the trace array
        let trace = [];
        
        // --- Extract and CONVERT data ---
        const compoundProfile = compoundAnalysis?.analysis?.compoundProfile || compoundAnalysis.compoundProfile || "Balanced";
        const stimulationStr = compoundAnalysis?.analysis?.stimulationLevel || compoundAnalysis.stimulationLevel || "moderate";
        const relaxationStr = compoundAnalysis?.analysis?.relaxationLevel || compoundAnalysis.relaxationLevel || "moderate";

        trace.push({ 
            step: "Input Processing", 
            reason: "Raw compound analysis", 
            adjustment: `Using data: stimulation=${stimulationStr}, relaxation=${relaxationStr}, profile=${compoundProfile}`, 
            value: compoundProfile
        });

        // Convert string levels to numbers
        const stimulationLevelNum = this.levelMap[stimulationStr.toLowerCase()] ?? 3;
        const relaxationLevelNum = this.levelMap[relaxationStr.toLowerCase()] ?? 3;

        // Use correct property names from teaTypeAnalysis
        const baseActivityHints = teaTypeAnalysis?.analysis?.baseActivityHints || teaTypeAnalysis.baseActivityHints || [];
        const primaryTeaType = teaTypeAnalysis.primaryType || ""; // Use primaryType

        const activityHints = flavorAnalysis?.analysis?.activityHints || flavorAnalysis.activityHints || [];
        // Assuming flavorProfile is primarily for flavor-based hints below, keep as is
        const flavorProfile = flavorAnalysis.flavorProfile || "";
        
        trace.push({ 
            step: "Data Extraction", 
            reason: "Processing activity hints", 
            adjustment: `Found ${baseActivityHints.length} base hints and ${activityHints.length} flavor-based hints`, 
            value: `Base hints: ${baseActivityHints.join(', ')}, Flavor hints: ${activityHints.join(', ')}`
        });
        // --- End Data Extraction/Conversion ---

        // Use a Map to store activity scores
        const activityScores = new Map();
        
        // Initialize base scores (e.g., 50) to avoid zero scores unless penalized
        this.activityClusters.forEach(cluster => {
            cluster.activities.forEach(activity => {
                if (!activityScores.has(activity)) { // Avoid overwriting if activity exists in multiple clusters
                    activityScores.set(activity, 50);
                }
            });
        });
        if (!activityScores.has("General Enjoyment")) activityScores.set("General Enjoyment", 50);
        if (!activityScores.has("Casual Sipping")) activityScores.set("Casual Sipping", 50);
        
        trace.push({ 
            step: "Score Initialization", 
            reason: "Baseline setup", 
            adjustment: "All activities initialized with score 50", 
            value: "initialized activity scoring"
        });

        // Start with recommendations based on compound profile
        switch (compoundProfile) {
            case "Intense & Sharp":
                this.addActivityWithTrace(trace, activityScores, "Sports & Exercise", 25, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                this.addActivityWithTrace(trace, activityScores, "Morning Routines", 25, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                this.addActivityWithTrace(trace, activityScores, "Productivity Sessions", 15, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                this.addActivityWithTrace(trace, activityScores, "Active Outdoor Activities", 15, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                this.addActivityWithTrace(trace, activityScores, "High-Focus Work", 20, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                this.addActivityWithTrace(trace, activityScores, "Meditation", -20, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                this.addActivityWithTrace(trace, activityScores, "Relaxation", -20, "Compound Profile Adjustment", "Profile is 'Intense & Sharp'");
                break;
            case "Focused & Energized":
                this.addActivityWithTrace(trace, activityScores, "Work", 25, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                this.addActivityWithTrace(trace, activityScores, "Study", 25, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                this.addActivityWithTrace(trace, activityScores, "Creative Projects", 20, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                this.addActivityWithTrace(trace, activityScores, "Brainstorming", 15, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                this.addActivityWithTrace(trace, activityScores, "Problem Solving", 15, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                this.addActivityWithTrace(trace, activityScores, "Evening Wind-Down", -15, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                this.addActivityWithTrace(trace, activityScores, "Sleep Preparation", -15, "Compound Profile Adjustment", "Profile is 'Focused & Energized'");
                break;
            case "Balanced":
            case "Balanced & Focused":
                this.addActivityWithTrace(trace, activityScores, "Social Gatherings", 15, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                this.addActivityWithTrace(trace, activityScores, "Reading", 15, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                this.addActivityWithTrace(trace, activityScores, "Light Exercise", 15, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                this.addActivityWithTrace(trace, activityScores, "Everyday Activities", 15, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                this.addActivityWithTrace(trace, activityScores, "Work", 5, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                
                // Only apply Puerh-specific boosts if the tea type is actually Puerh
                if (primaryTeaType === 'puerh-shou' || primaryTeaType === 'puerh-sheng') {
                    this.addActivityWithTrace(trace, activityScores, "Relaxation", 20, "Compound Profile Adjustment", "Profile is 'Balanced' for Puerh");
                    this.addActivityWithTrace(trace, activityScores, "Contemplation", 20, "Compound Profile Adjustment", "Profile is 'Balanced' for Puerh");
                    this.addActivityWithTrace(trace, activityScores, "Social Gatherings", 20, "Compound Profile Adjustment", "Profile is 'Balanced' for Puerh");
                    this.addActivityWithTrace(trace, activityScores, "Digestive", 25, "Compound Profile Adjustment", "Profile is 'Balanced' for Puerh");
                    this.addActivityWithTrace(trace, activityScores, "Evening Wind-Down", 15, "Compound Profile Adjustment", "Profile is 'Balanced' for Puerh");
                }
                
                // Reduce high-focus work for balanced profile
                this.addActivityWithTrace(trace, activityScores, "High-Focus Work", -10, "Compound Profile Adjustment", "Profile is 'Balanced' or 'Balanced & Focused'");
                break;
            case "Calm & Clear":
            case "Smooth & Sustained":
                // Modification 3.1: Enhanced for Matcha/Gyokuro
                this.addActivityWithTrace(trace, activityScores, "Focus", 25, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained' (Matcha/Gyokuro boost)");
                this.addActivityWithTrace(trace, activityScores, "Work", 20, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained' (Matcha/Gyokuro boost)");
                this.addActivityWithTrace(trace, activityScores, "Study", 20, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained' (Matcha/Gyokuro boost)");
                this.addActivityWithTrace(trace, activityScores, "Creative Projects", 15, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained' (Matcha/Gyokuro boost)");
                
                // Adjust Meditation/Yoga based on stimulation level
                if (stimulationLevelNum >= 3) {
                    this.addActivityWithTrace(trace, activityScores, "Meditation", 15, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained' (reduced bonus due to stimulation)");
                } else {
                    this.addActivityWithTrace(trace, activityScores, "Meditation", 25, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                }
                
                this.addActivityWithTrace(trace, activityScores, "Yoga", 20, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                this.addActivityWithTrace(trace, activityScores, "Reading", 15, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                this.addActivityWithTrace(trace, activityScores, "Gentle Stretching", 15, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                this.addActivityWithTrace(trace, activityScores, "Contemplation", 20, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                this.addActivityWithTrace(trace, activityScores, "Sports & Exercise", -15, "Compound Profile Adjustment", "Profile is 'Calm & Clear' or 'Smooth & Sustained'");
                break;
            case "Deeply Calm":
            case "Primarily Relaxing":
                this.addActivityWithTrace(trace, activityScores, "Evening Wind-Down", 25, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "Reading Before Bed", 25, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "Relaxation", 25, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "Meditation", 20, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "Deep Breathing", 15, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "Sports & Exercise", -20, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "Active Outdoor Activities", -20, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                this.addActivityWithTrace(trace, activityScores, "High-Focus Work", -15, "Compound Profile Adjustment", "Profile is 'Deeply Calm' or 'Primarily Relaxing'");
                break;
            default:
                // Default suggestions for unknown profiles
                this.addActivityWithTrace(trace, activityScores, "General Enjoyment", 5, "Compound Profile Adjustment", "Profile is unknown");
                this.addActivityWithTrace(trace, activityScores, "Casual Sipping", 5, "Compound Profile Adjustment", "Profile is unknown");
        }

        // Refine based on stimulation and relaxation levels
        if (stimulationLevelNum >= 4) { // High or Very High
            this.addActivityWithTrace(trace, activityScores, "High-Focus Work", 15, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Active Outdoor Activities", 15, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Morning Routines", 10, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Exercise", 10, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Evening Wind-Down", -25, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Sleep Preparation", -25, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Relaxation", -15, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Meditation", -15, "Stimulation Level Adjustment", `High stimulation level (${stimulationLevelNum})`);
        } else if (stimulationLevelNum <= 1) { // Very Low or None
            this.addActivityWithTrace(trace, activityScores, "Sports & Exercise", -15, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Active Outdoor Activities", -15, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Morning Routines", -10, "Stimulation Level Adjustment", `Low stimulation level (${stimulationLevelNum})`);
        }

        if (relaxationLevelNum >= 4) { // High or Very High
            this.addActivityWithTrace(trace, activityScores, "Meditation", 20, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Yoga", 15, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Deep Breathing", 15, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Exercise", -10, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Sports & Exercise", -15, "Relaxation Level Adjustment", `High relaxation level (${relaxationLevelNum})`);
        } else if (relaxationLevelNum <= 1) { // Very Low or None
            this.addActivityWithTrace(trace, activityScores, "Meditation", -10, "Relaxation Level Adjustment", `Low relaxation level (${relaxationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Deep Breathing", -10, "Relaxation Level Adjustment", `Low relaxation level (${relaxationLevelNum})`);
            this.addActivityWithTrace(trace, activityScores, "Yoga", -5, "Relaxation Level Adjustment", `Low relaxation level (${relaxationLevelNum})`);
        }

        // Consider tea type specific hints
        if (baseActivityHints.length > 0) {
            trace.push({ 
                step: "Base Activity Hints", 
                reason: "From tea type analysis", 
                adjustment: `Processing ${baseActivityHints.length} hints`, 
                value: baseActivityHints.join(', ')
            });
            
            baseActivityHints.forEach(hint => {
                const normalizedHint = this.normalizeHint(hint);
                if (normalizedHint) {
                    this.addActivityWithTrace(trace, activityScores, normalizedHint, 15, "Tea Type Activity Hint", `Activity hint: '${hint}'`);
                }
            });
        }

        // Incorporate flavor-derived hints - potentially worth more than type hints
        if (activityHints.length > 0) {
            trace.push({ 
                step: "Flavor Activity Hints", 
                reason: "From flavor analysis", 
                adjustment: `Processing ${activityHints.length} hints`, 
                value: activityHints.join(', ')
            });
            
            activityHints.forEach(hint => {
                const normalizedHint = this.normalizeHint(hint);
                if (normalizedHint) {
                    this.addActivityWithTrace(trace, activityScores, normalizedHint, 25, "Flavor Activity Hint", `Activity hint: '${hint}'`);
                }
            });
        }

        // --- Final Processing ---
        const rawScoresArray = Array.from(activityScores.entries()).map(([activity, score]) => `${activity}: ${score}`);
        trace.push({ 
            step: "Raw Scores", 
            reason: "Before normalization", 
            adjustment: "Calculated raw scores for each activity", 
            value: rawScoresArray.length > 5 ? rawScoresArray.slice(0, 5).join(', ') + '...' : rawScoresArray.join(', ')
        });
        
        const normalizedScores = this.normalizeActivityScores(activityScores);
        trace.push({ 
            step: "Score Normalization", 
            reason: "Converting to 0-100 scale", 
            adjustment: "Normalized all activity scores", 
            value: Object.entries(normalizedScores).length > 5 ? 
                  Object.entries(normalizedScores).slice(0, 5).map(([a, s]) => `${a}: ${s}`).join(', ') + '...' : 
                  Object.entries(normalizedScores).map(([a, s]) => `${a}: ${s}`).join(', ')
        });
        
        const recommendedActivities = this.getRecommendedActivities(normalizedScores);
        trace.push({ 
            step: "Recommendation Generation", 
            reason: "Finding best activities", 
            adjustment: `Selected ${recommendedActivities.length} recommended activities`, 
            value: recommendedActivities.map(item => `${item.name}: ${item.score}`).join(', ')
        });
        
        const activityClusters = this.identifyActivityClusters(normalizedScores);
        trace.push({ 
            step: "Cluster Identification", 
            reason: "Finding activity groups", 
            adjustment: `Identified ${activityClusters.length} activity clusters`, 
            value: activityClusters.map(cluster => `${cluster.theme} (${cluster.score})`).join(', ')
        });

        // Generate a natural language description of the results
        const description = this.generateActivityDescription(
            { 
                recommendedActivities,
                activityClusters
            }, 
            primaryTeaType || "tea"
        );
        
        trace.push({ 
            step: "Description Generation", 
            reason: "Summarizing activity analysis", 
            adjustment: "Generated human-readable description", 
            value: description.substring(0, 50) + "..." // Truncate for trace
        });

        return {
            recommendedActivities,
            activityClusters,
            description,
            trace
        };
    }

    /**
     * Normalize the activity scores to a 0-100 scale
     * @param {Map} activityScores - Map of raw activity scores
     * @returns {Object} - Object with activity names as keys and normalized scores as values
     */
    normalizeActivityScores(activityScores) {
        const result = {};
        
        // Handle empty scores
        if (activityScores.size === 0) {
            return { "General Enjoyment": 50 };
        }
        
        // Find maximum and minimum scores for normalization
        const scores = [...activityScores.values()];
        const maxScore = Math.max(...scores, 1); // Prevent division by zero
        const minScore = Math.min(...scores, 0);
        
        // Convert scores to 0-100 scale
        for (const [activity, score] of activityScores.entries()) {
            let normalizedScore = 0;
            if (maxScore > minScore) {
                normalizedScore = Math.round(((score - minScore) / (maxScore - minScore)) * 100);
            } else if (maxScore > 0) {
                normalizedScore = 100;
            }
            result[activity] = Math.max(0, Math.min(normalizedScore, 100));
        }
        
        console.log("Normalized Activity Scores:", result);
        return result;
    }
    
    /**
     * Get recommended activities based on normalized scores
     * @param {Object} normalizedScores - Object with normalized activity scores
     * @returns {Array} - Array of recommended activity objects with name and score
     */
    getRecommendedActivities(normalizedScores) {
        // Sort by score descending
        const sortedActivities = Object.entries(normalizedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        // Handle empty activities
        if (sortedActivities.length === 0) {
            return [{ name: "General Enjoyment", score: 50 }];
        }
        
        const maxScore = sortedActivities[0][1];
        const absoluteThreshold = 65; // Example
        const relativeThreshold = 20; // Example
        
        // Include activities that meet thresholds
        const topActivities = sortedActivities
            .filter(([activity, score]) => score >= absoluteThreshold && score >= maxScore - relativeThreshold)
            .map(([activity, score]) => ({ name: activity, score }));
        
        // Ensure at least one activity is recommended
        if (topActivities.length === 0 && sortedActivities.length > 0) {
            return [ { name: sortedActivities[0][0], score: sortedActivities[0][1] } ];
        }
        
        // Limit to configured maximum number of recommendations
        return topActivities.slice(0, this.config.maxRecommendations);
    }
    
    /**
     * Identify clusters of related activities
     * @param {Object} normalizedScores - Object with normalized activity scores
     * @returns {Array} - Array of activity cluster objects
     */
    identifyActivityClusters(normalizedScores) {
        const result = [];
        const threshold = this.config.clusterThreshold; // Use config
        
        // Process each predefined cluster
        this.activityClusters.forEach(cluster => {
            const matchingActivities = [];
            let totalScore = 0;
            
            // Find activities in this cluster that have scores
            cluster.activities.forEach(activity => {
                if (normalizedScores[activity] !== undefined && 
                    normalizedScores[activity] >= threshold) {
                    matchingActivities.push({
                        name: activity,
                        score: normalizedScores[activity]
                    });
                    totalScore += normalizedScores[activity];
                }
            });
            
            // Only include clusters with enough matching activities
            if (matchingActivities.length >= 1) { // Changed from >= 2 to show clusters even with 1 match above threshold
                // Sort activities by score
                matchingActivities.sort((a, b) => b.score - a.score);
                
                // Calculate average score for the cluster
                const avgScore = Math.round(totalScore / matchingActivities.length);
                
                result.push({
                    theme: cluster.theme,
                    activities: matchingActivities,
                    score: avgScore
                });
            }
        });
        
        // Sort clusters by score
        result.sort((a, b) => b.score - a.score);
        
        return result;
    }
    
    /**
     * Format the activity clusters for display
     * @param {Array} clusters - Array of cluster objects
     * @returns {string} - Formatted display string
     */
    formatActivityClusters(clusters) {
        if (clusters.length === 0) {
            return "No specific activity clusters recommended";
        }
        
        // Sort clusters by score
        const sortedClusters = [...clusters].sort((a, b) => b.score - a.score);
        
        // Format each cluster
        return sortedClusters.map(cluster => {
            const activityNames = cluster.activities.map(a => a.name).join(", ");
            return `${cluster.theme} (${cluster.score}%): ${activityNames}`;
        }).join('\n');
    }
    
    /**
     * Generate a description of recommended activities and clusters
     * @param {Object} results - Results from matchActivity
     * @param {string} teaName - Name of the tea
     * @returns {string} - Human-readable description
     */
    generateActivityDescription(results, teaName) {
        const { recommendedActivities, activityClusters } = results;
        
        if (recommendedActivities.length === 0) {
            return `${teaName} is versatile and can be enjoyed during most activities.`;
        }
        
        let description = `${teaName} pairs especially well with `;
        
        // Add top activities
        if (recommendedActivities.length === 1) {
            description += `${recommendedActivities[0].name.toLowerCase()} (${recommendedActivities[0].score}% match).`;
        } else if (recommendedActivities.length === 2) {
            description += `${recommendedActivities[0].name.toLowerCase()} (${recommendedActivities[0].score}%) and ${recommendedActivities[1].name.toLowerCase()} (${recommendedActivities[1].score}%).`;
        } else {
            const lastActivity = recommendedActivities[recommendedActivities.length - 1];
            const topActivities = recommendedActivities.slice(0, -1).map(a => `${a.name.toLowerCase()} (${a.score}%)`).join(', ');
            description += `${topActivities}, and ${lastActivity.name.toLowerCase()} (${lastActivity.score}%).`;
        }
        
        // Add cluster information if available
        if (activityClusters.length > 0) {
            const topCluster = activityClusters[0];
            description += ` It's especially suited for "${topCluster.theme}" activities (${topCluster.score}% match).`;
        }
        
        return description;
    }

    /**
     * Helper to normalize hint strings (e.g., capitalize)
     * @param {string} hint
     * @returns {string}
     */
    normalizeHint(hint) {
        if (!hint) return '';
        // Simple capitalize first letter
        return hint.charAt(0).toUpperCase() + hint.slice(1).toLowerCase();
    }
}

// Export the class
export default ActivityMatcher;