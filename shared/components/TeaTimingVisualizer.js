// /shared/components/TeaTimingVisualizer.js

// Adjust the path based on your actual folder structure
// e.g., if 'shared' is inside 'js': './utils/markdownUtils.js'
// e.g., if 'shared' and 'js' are siblings: '../../js/utils/markdownUtils.js'
import { formatString, formatScoreWithBar } from '../../js/utils/markdownUtils.js';

class TeaTimingVisualizer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: inherit; /* Inherit font from host */
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    border: 1px solid #eee;
                    border-radius: 5px;
                    background-color: #fff;
                }
                h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: #3a7d65; /* Use theme color */
                    font-size: 1.1em;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 0.5rem;
                }
                .timing-container {
                    /* Add styling for layout if needed */
                }
                .recommendation-list {
                    margin-bottom: 1rem;
                }
                 .recommendation-list div {
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                 }
                .time-label {
                    flex: 0 0 100px; /* Fixed width for labels */
                    font-weight: 500;
                    font-size: 0.9em;
                 }
                .score-display {
                    flex-grow: 1;
                    font-size: 0.9em;
                 }
                 .ranges {
                     font-size: 0.9em;
                     margin-top: 1rem;
                     border-top: 1px solid #eee;
                     padding-top: 1rem;
                 }
                 .ranges strong {
                     display: block;
                     margin-bottom: 0.5rem;
                     color: #2c6049;
                 }
                 .error-message {
                    color: #e74c3c;
                    font-style: italic;
                 }
            </style>
            <div class="timing-container">
                <h3>Timing Suitability</h3>
                <div class="recommendation-list"></div>
                <div class="ranges"></div>
            </div>
        `;
    }

    set timingData(data) {
        this._timingData = data;
        this._render();
    }

    get timingData() {
        return this._timingData;
    }

    _render() {
        const container = this.shadowRoot.querySelector('.timing-container');
        const listElement = this.shadowRoot.querySelector('.recommendation-list');
        const rangesElement = this.shadowRoot.querySelector('.ranges');

        listElement.innerHTML = ''; // Clear previous list
        rangesElement.innerHTML = ''; // Clear previous ranges

        if (!this._timingData || this._timingData.error) {
            listElement.innerHTML = `<div class="error-message">No timing data available or calculation failed: ${this._timingData?.error || 'Unknown error'}</div>`;
            return;
        }

        // Display detailed recommendations (scores)
        if (this._timingData.recommendations && Object.keys(this._timingData.recommendations).length > 0) {
            const timeOrder = ["Early Morning", "Morning", "Midday", "Afternoon", "Evening", "Night"];
            Object.entries(this._timingData.recommendations)
                .sort((a, b) => {
                    const indexA = timeOrder.indexOf(a[0]);
                    const indexB = timeOrder.indexOf(b[0]);
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    return b[1] - a[1]; // Fallback sort by score
                })
                .forEach(([time, score]) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.innerHTML = `
                        <span class="time-label">${formatString(time)}:</span>
                        <span class="score-display">${formatScoreWithBar(score, 100)}</span>
                    `;
                    listElement.appendChild(itemDiv);
                });
        } else {
            listElement.innerHTML = '<div>No suitability scores calculated.</div>';
        }

        // Display ideal ranges
        if (this._timingData.idealRanges && this._timingData.idealRanges.length > 0) {
            rangesElement.innerHTML = `<strong>Ideal Consumption Ranges (Score >= ${this._timingData.idealRanges[0]?.threshold || 70}%):</strong>`;
            this._timingData.idealRanges.forEach(range => {
                const rangeDiv = document.createElement('div');
                let rangeText;
                if (range.start === range.end) {
                    rangeText = formatString(range.start);
                } else {
                    rangeText = `${formatString(range.start)} to ${formatString(range.end)}`;
                }
                rangeDiv.textContent = `- ${rangeText} (Avg Score ${range.score}%)`;
                rangesElement.appendChild(rangeDiv);
            });
        } else {
             rangesElement.innerHTML = '<div>No specific ideal consumption ranges identified.</div>';
        }
    }

    connectedCallback() {
        // Initial render attempt if data was set before connection
        if (!this._timingData) {
            this._render(); // Render initial empty/loading state
        }
    }
}

// Define the custom element for the browser
customElements.define('tea-timing-visualizer', TeaTimingVisualizer);