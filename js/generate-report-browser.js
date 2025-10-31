// js/generate-report-browser.js
// Browser version to generate a full analysis report for all teas.

// Data
import TeaDatabase from './data/TeaDatabase.js';

// Calculators
import { TeaTypeCalculator } from './calculators/TeaTypeCalculator.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';

// Matchers (Derivations)
import { SeasonMatcher } from './derivation/SeasonMatcher.js';
import { ActivityMatcher } from './derivation/ActivityMatcher.js';
import { FoodMatcher } from './derivation/FoodMatcher.js';
import { TimeMatcher } from './derivation/TimeMatcher.js';

// --- Get DOM Elements ---
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const outputArea = document.getElementById('output');
const statusDiv = document.getElementById('status');
const outputControlsDiv = document.querySelector('.output-controls');

let fullReportData = null; // To store the generated data for copy/download

// --- Core Calculation Logic ---
function calculateAllDataForTea(tea, calculators, matchers) {
    // Destructure calculators and matchers
    const {
        teaTypeCalculator, compoundCalculator, flavorCalculator,
        processingCalculator, geographyCalculator
    } = calculators;
    const {
        seasonMatcher, activityMatcher, foodMatcher, timeMatcher
    } = matchers;

    try {
        // 1. Run Calculators
        const teaTypeResult = teaTypeCalculator.calculate(tea);
        const compoundResult = compoundCalculator.calculate(tea);
        const flavorResult = flavorCalculator.calculate(tea);
        const processingResult = processingCalculator.calculate(tea);
        const geographyResult = geographyCalculator.calculate(tea);

        // 2. Extract Analysis Inputs for Matchers
        const geographyAnalysis = geographyResult.data?.geography || {};
        const processingAnalysis = processingResult.data?.processing || {};
        const teaTypeAnalysis = teaTypeResult.data?.teaType || {};
        const flavorAnalysis = flavorResult.data?.flavor || {};
        const compoundAnalysis = compoundResult.data?.compounds || {};

        // 3. Run Matchers
        const seasonMatchResult = seasonMatcher.matchSeason(
            geographyAnalysis, processingAnalysis, teaTypeAnalysis, flavorAnalysis
        );
        const activityMatchResult = activityMatcher.matchActivity(
            compoundAnalysis, teaTypeAnalysis, flavorAnalysis
        );
        const foodMatchResult = foodMatcher.matchFood(
            flavorAnalysis, processingAnalysis, teaTypeAnalysis
        );
        const timeMatchResult = timeMatcher.matchTime(
            compoundAnalysis, teaTypeAnalysis, processingAnalysis
        );

        // 4. Assemble Result (excluding insights generation for simplicity here)
        return {
            tea: tea,
            analysis: {
                teaType: teaTypeResult.data,
                compounds: compoundResult.data,
                processing: processingResult.data,
                geography: geographyResult.data,
                flavors: flavorResult.data,
                seasonMatch: seasonMatchResult,
                activityMatch: activityMatchResult,
                foodMatch: foodMatchResult,
                timeMatch: timeMatchResult,
            },
            calculatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error analyzing ${tea.name}:`, error);
        statusDiv.innerHTML += `<br/><span style="color: red;">Error analyzing ${tea.name}. See console.</span>`;
        return null; // Return null on error for this tea
    }
}

// --- Main Function to Generate Report ---
async function runReportGeneration() {
    generateBtn.disabled = true;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    outputArea.value = ''; // Clear previous output
    statusDiv.textContent = 'Initializing calculators...';
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow UI update

    // Instantiate Calculators and Matchers
    const config = {}; // Use default configs
    const calculators = {
        teaTypeCalculator: new TeaTypeCalculator(config),
        compoundCalculator: new CompoundCalculator(config),
        flavorCalculator: new FlavorCalculator(config),
        processingCalculator: new ProcessingCalculator(config),
        geographyCalculator: new GeographyCalculator(config)
    };
    const matchers = {
        seasonMatcher: new SeasonMatcher(),
        activityMatcher: new ActivityMatcher(),
        foodMatcher: new FoodMatcher(),
        timeMatcher: new TimeMatcher()
    };

    const allTeas = TeaDatabase.getAllTeas();
    const reportData = [];
    statusDiv.textContent = `Analyzing ${allTeas.length} teas...`;
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow UI update

    // Loop and Analyze
    for (let i = 0; i < allTeas.length; i++) {
        const tea = allTeas[i];
        statusDiv.textContent = `Analyzing ${i + 1}/${allTeas.length}: ${tea.name}...`;
        // Use setTimeout to allow the browser UI to update between tea analyses
        await new Promise(resolve => setTimeout(resolve, 0));

        const teaResult = calculateAllDataForTea(tea, calculators, matchers);
        if (teaResult) {
            reportData.push(teaResult);
        }
    }

    // --- Display and Enable Controls ---
    statusDiv.textContent = `Report generation complete! (${reportData.length} teas processed)`;
    fullReportData = reportData; // Store for copy/download
    outputArea.value = JSON.stringify(fullReportData, null, 2); // Display pretty JSON
    outputControlsDiv.style.display = 'block'; // Show buttons
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    generateBtn.disabled = false;
}

// --- Button Event Listeners ---
generateBtn.addEventListener('click', runReportGeneration);

copyBtn.addEventListener('click', () => {
    if (outputArea.value) {
        navigator.clipboard.writeText(outputArea.value).then(() => {
            statusDiv.textContent = 'JSON copied to clipboard!';
            setTimeout(() => { statusDiv.textContent = `Report generated. (${fullReportData.length} teas processed)`; }, 2000);
        }).catch(err => {
            console.error('Failed to copy JSON: ', err);
            statusDiv.textContent = 'Failed to copy JSON. See console.';
        });
    }
});

downloadBtn.addEventListener('click', () => {
    if (outputArea.value) {
        const blob = new Blob([outputArea.value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tea_analysis_report.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        statusDiv.textContent = 'Report download initiated.';
    }
});