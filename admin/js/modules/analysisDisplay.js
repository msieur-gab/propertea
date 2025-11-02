/**
 * analysisDisplay.js - Display complete tea analysis data
 * Shows the full API analysis response in the main content area
 */

export class AnalysisDisplay {
    constructor(containerElementId) {
        this.container = document.getElementById(containerElementId);
        if (!this.container) {
            console.error(`Analysis display container with ID "${containerElementId}" not found.`);
        }
    }

    /**
     * Display the complete API analysis in the container
     * @param {Object} record - The tea record with analysis data
     */
    display(record) {
        if (!this.container) return;
        if (!record || !record.analysis) {
            this.container.innerHTML = '<p>No analysis data available.</p>';
            return;
        }

        const analysis = record.analysis;
        let html = `<div class="analysis-container">`;

        // Header
        html += `
            <div class="analysis-header">
                <h2>${record.name || 'Tea Analysis'}</h2>
                ${record.originalName ? `<p class="original-name">${record.originalName}</p>` : ''}
            </div>
        `;

        // Tea Type Analysis
        if (analysis.teaType) {
            html += this._renderTeaType(analysis.teaType);
        }

        // Compound Analysis
        if (analysis.compounds) {
            html += this._renderCompounds(analysis.compounds);
        }

        // Flavor Analysis
        if (analysis.flavor) {
            html += this._renderFlavor(analysis.flavor);
        }

        // Processing Analysis
        if (analysis.processing) {
            html += this._renderProcessing(analysis.processing);
        }

        // Geography Analysis
        if (analysis.geography) {
            html += this._renderGeography(analysis.geography);
        }

        // Expected Effects Analysis
        if (analysis.effects) {
            html += this._renderEffects(analysis.effects);
        }

        // Recommendations Section
        html += `<div class="recommendations-section">`;

        // Timing
        if (analysis.timing) {
            html += this._renderTiming(analysis.timing);
        }

        // Seasonal
        if (analysis.seasonal) {
            html += this._renderSeasonal(analysis.seasonal);
        }

        // Food Pairing
        if (analysis.food) {
            html += this._renderFood(analysis.food);
        }

        // Activities
        if (analysis.activities) {
            html += this._renderActivities(analysis.activities);
        }

        // Brewing Guide
        if (analysis.brewing) {
            html += this._renderBrewing(analysis.brewing);
        }

        html += `</div>`; // Close recommendations
        html += `</div>`; // Close container

        this.container.innerHTML = html;
    }

    _renderTeaType(teaType) {
        let html = `<div class="analysis-section tea-type-section">`;
        html += `<h3>Tea Type</h3>`;

        if (teaType.identified) {
            html += `
                <div class="info-block">
                    <p><strong>Type:</strong> ${this._capitalize(teaType.identified.type)}</p>
                    <p><strong>Subtype:</strong> ${teaType.identified.subType || 'N/A'}</p>
                    <p><strong>Confidence:</strong> ${teaType.identified.confidence}</p>
                </div>
            `;
        }

        if (teaType.description) {
            html += `<p class="description">${teaType.description}</p>`;
        }

        if (teaType.characteristics) {
            const chars = teaType.characteristics;
            html += `
                <div class="characteristics">
                    <p><strong>Oxidation Level:</strong> ${chars.oxidationLevel}</p>
                    <p><strong>Caffeine Level:</strong> ${chars.caffeineLevel}</p>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    _renderCompounds(compounds) {
        let html = `<div class="analysis-section compounds-section">`;
        html += `<h3>Compounds</h3>`;

        if (compounds.description) {
            html += `<p class="description">${compounds.description}</p>`;
        }

        if (compounds.levels) {
            html += `
                <div class="compounds-data">
                    <div class="compound-item">
                        <label>Caffeine:</label>
                        <span>${compounds.levels.caffeineLevel}</span>
                    </div>
                    <div class="compound-item">
                        <label>L-Theanine:</label>
                        <span>${compounds.levels.lTheanineLevel}</span>
                    </div>
                    <div class="compound-item">
                        <label>Ratio:</label>
                        <span>${compounds.levels.lTheanineToCaffeineRatio?.toFixed(2) || 'N/A'}</span>
                    </div>
                </div>
            `;
        }

        if (compounds.analysis) {
            const analysis = compounds.analysis;
            html += `
                <div class="compounds-analysis">
                    <div class="analysis-item">
                        <label>Category:</label>
                        <span>${analysis.ratioCategory}</span>
                    </div>
                    <div class="analysis-item">
                        <label>Stimulation:</label>
                        <span>${analysis.stimulationLevel}</span>
                    </div>
                    <div class="analysis-item">
                        <label>Relaxation:</label>
                        <span>${analysis.relaxationLevel}</span>
                    </div>
                    <div class="analysis-item highlight">
                        <label>Profile:</label>
                        <span><strong>${analysis.compoundProfile}</strong></span>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    _renderFlavor(flavor) {
        let html = `<div class="analysis-section flavor-section">`;
        html += `<h3>Flavor Profile</h3>`;

        if (flavor.description) {
            html += `<p class="description">${flavor.description}</p>`;
        }

        if (flavor.profile) {
            const profile = flavor.profile;
            html += `
                <div class="flavor-profile">
                    <div class="flavor-item">
                        <label>Identified Notes:</label>
                        <div class="notes">${profile.identified?.map(n => `<span class="note">${this._capitalize(n)}</span>`).join('')}</div>
                    </div>
                    <div class="flavor-item">
                        <label>Dominant Notes:</label>
                        <div class="notes">${profile.dominant?.map(n => `<span class="note dominant">${this._capitalize(n)}</span>`).join('')}</div>
                    </div>
                    <div class="flavor-item">
                        <label>Categories:</label>
                        <div class="notes">${profile.categories?.map(c => `<span class="category">${c}</span>`).join('')}</div>
                    </div>
                    <div class="flavor-item">
                        <label>Intensity:</label>
                        <span><strong>${profile.intensity}</strong></span>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    _renderProcessing(processing) {
        let html = `<div class="analysis-section processing-section">`;
        html += `<h3>Processing</h3>`;

        if (processing.description) {
            html += `<p class="description">${processing.description}</p>`;
        }

        if (processing.methods) {
            html += `
                <div class="processing-methods">
                    <label>Methods:</label>
                    <div class="method-list">${processing.methods.map(m => `<span class="method">${this._capitalize(m)}</span>`).join('')}</div>
                </div>
            `;
        }

        if (processing.roastLevel) {
            html += `<p><strong>Roast Level:</strong> ${processing.roastLevel}</p>`;
        }

        html += `</div>`;
        return html;
    }

    _renderGeography(geography) {
        let html = `<div class="analysis-section geography-section">`;
        html += `<h3>Geography & Climate</h3>`;

        if (geography.description) {
            html += `<p class="description">${geography.description}</p>`;
        }

        if (geography.location) {
            const loc = geography.location;
            html += `
                <div class="location-info">
                    <p><strong>Location:</strong> ${loc.location || 'N/A'}, ${loc.province || ''} ${loc.country || ''}</p>
                    ${loc.latitude && loc.longitude ? `<p><strong>Coordinates:</strong> ${loc.latitude.toFixed(2)}, ${loc.longitude.toFixed(2)}</p>` : ''}
                </div>
            `;
        }

        if (geography.climate) {
            const climate = geography.climate;
            html += `
                <div class="climate-info">
                    <div class="climate-item">
                        <label>Altitude:</label>
                        <span>${climate.altitude} (${climate.altitudeCategory})</span>
                    </div>
                    <div class="climate-item">
                        <label>Temperature:</label>
                        <span>${climate.temperature} (${climate.temperatureCategory})</span>
                    </div>
                    <div class="climate-item">
                        <label>Humidity:</label>
                        <span>${climate.humidity} (${climate.humidityCategory})</span>
                    </div>
                    <div class="climate-item">
                        <label>Solar Radiation:</label>
                        <span>${climate.solarRadiation} (${climate.solarRadiationCategory})</span>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    _renderTiming(timing) {
        let html = `<div class="recommendation-block timing-block">`;
        html += `<h4>Best Timing</h4>`;
        html += `<p class="explanation">${timing.explanation || ''}</p>`;
        html += `<div class="recommendations">`;
        html += `<p><strong>Best Times:</strong> ${timing.bestTimes?.join(', ') || 'N/A'}</p>`;
        if (timing.worstTimes && timing.worstTimes.length > 0) {
            html += `<p><strong>Avoid:</strong> ${timing.worstTimes.join(', ')}</p>`;
        }
        html += `</div></div>`;
        return html;
    }

    _renderSeasonal(seasonal) {
        let html = `<div class="recommendation-block seasonal-block">`;
        html += `<h4>Seasonal Affinity</h4>`;
        html += `<p class="explanation">${seasonal.explanation || ''}</p>`;
        html += `<p><strong>Best Seasons:</strong> ${seasonal.bestSeasons?.join(', ') || 'N/A'}</p>`;
        html += `</div>`;
        return html;
    }

    _renderFood(food) {
        let html = `<div class="recommendation-block food-block">`;
        html += `<h4>Food Pairing</h4>`;
        html += `<p class="explanation">${food.explanation || ''}</p>`;
        html += `<div class="recommendations">`;
        if (food.foods && food.foods.length > 0) {
            html += `<p><strong>Pairs with:</strong> ${food.foods.join(', ')}</p>`;
        }
        if (food.occasions && food.occasions.length > 0) {
            html += `<p><strong>Occasions:</strong> ${food.occasions.join(', ')}</p>`;
        }
        html += `</div></div>`;
        return html;
    }

    _renderActivities(activities) {
        let html = `<div class="recommendation-block activities-block">`;
        html += `<h4>Best Activities</h4>`;
        html += `<p class="explanation">${activities.explanation || ''}</p>`;
        html += `<p><strong>Activities:</strong> ${activities.activities?.join(', ') || 'N/A'}</p>`;
        html += `</div>`;
        return html;
    }

    _renderBrewing(brewing) {
        let html = `<div class="recommendation-block brewing-block">`;
        html += `<h4>Brewing Guide</h4>`;
        html += `<p class="explanation">${brewing.explanation || ''}</p>`;

        if (brewing.general) {
            html += `
                <div class="brewing-style">
                    <h5>General (Western)</h5>
                    <p>Water Temp: ${brewing.general.waterTemperature}</p>
                    <p>Steep Time: ${brewing.general.steepTime}</p>
                    <p>Ratio: ${brewing.general.leafToWaterRatio}</p>
                </div>
            `;
        }

        if (brewing.gongfu) {
            html += `
                <div class="brewing-style">
                    <h5>Gongfu Style</h5>
                    <p>Water Temp: ${brewing.gongfu.waterTemp}</p>
                    <p>Steep Time: ${brewing.gongfu.steepTime}</p>
                    <p>Infusions: ${brewing.gongfu.infusions}</p>
                </div>
            `;
        }

        if (brewing.western) {
            html += `
                <div class="brewing-style">
                    <h5>Western Style</h5>
                    <p>Water Temp: ${brewing.western.waterTemp}</p>
                    <p>Steep Time: ${brewing.western.steepTime}</p>
                    <p>Infusions: ${brewing.western.infusions}</p>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    _renderEffects(effects) {
        let html = `<div class="analysis-section effects-section">`;
        html += `<h3>Expected Effects</h3>`;

        if (effects.description) {
            html += `<p class="description">${effects.description}</p>`;
        }

        if (effects.expectedEffects) {
            const expectedEffects = effects.expectedEffects;
            html += `
                <div class="effects-display">
                    <div class="effect-item dominant-effect">
                        <label>Dominant Effect</label>
                        <span class="effect-name">${this._capitalize(expectedEffects.dominant)}</span>
                    </div>
                    <div class="effect-item supporting-effect">
                        <label>Supporting Effect</label>
                        <span class="effect-name">${this._capitalize(expectedEffects.supporting)}</span>
                    </div>
                </div>
            `;
        }

        if (effects.reasoning) {
            const reasoning = effects.reasoning;
            html += `
                <div class="effects-reasoning">
                    <h5>Effect Reasoning</h5>
                    <p><strong>Dominant:</strong> ${reasoning.dominant}</p>
                    <p><strong>Supporting:</strong> ${reasoning.supporting}</p>
                </div>
            `;
        }

        if (effects.allScores) {
            html += `
                <div class="effects-scores">
                    <h5>All Effect Scores</h5>
                    <div class="scores-list">
            `;

            // Sort scores in descending order
            const sorted = Object.entries(effects.allScores)
                .sort(([, a], [, b]) => b - a);

            sorted.forEach(([effect, score]) => {
                const percentage = (score / 30 * 100).toFixed(0); // Normalize to 0-30 scale
                const barWidth = Math.min(percentage, 100);
                html += `
                    <div class="score-item">
                        <span class="score-label">${this._capitalize(effect)}</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${barWidth}%"></div>
                        </div>
                        <span class="score-value">${score.toFixed(1)}</span>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    _capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '<div id="welcomeMessage" style="text-align: center; padding: 40px; color: #777;"><h2>Welcome to the Tea Recorder</h2><p>Use the sidebar menu on the left to add or view teas.</p></div>';
        }
    }
}
