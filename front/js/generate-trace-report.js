// js/generate-trace-report.js
// Generates a detailed Markdown trace report for a single tea.

import TeaDatabase from './data/TeaDatabase.js';
// Import ALL calculators and matchers
import { TeaTypeCalculator } from './calculators/TeaTypeCalculator.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';
import { SeasonMatcher } from './derivation/SeasonMatcher.js';
import { ActivityMatcher } from './derivation/ActivityMatcher.js';
import { FoodMatcher } from './derivation/FoodMatcher.js';
import { TimeMatcher } from './derivation/TimeMatcher.js';
// Assuming markdownUtils exist
import { escapeMarkdown } from './utils/markdownUtils.js';

// --- Get DOM Elements ---
const generateTraceBtn = document.getElementById('generateTraceBtn');
const teaSelector = document.getElementById('teaSelectorForTrace');
const mdOutputArea = document.getElementById('md-output');
const statusDiv = document.getElementById('status'); // Assuming shared status

// --- Populate Tea Selector ---
function populateTeaSelector() {
    const allTeas = TeaDatabase.getAllTeas();
    allTeas.forEach(tea => {
        const option = document.createElement('option');
        option.value = tea.name;
        option.textContent = tea.name;
        teaSelector.appendChild(option);
    });
}

// --- Helper to Format Trace Data ---
// NOTE: This assumes calculators/matchers are modified to return a `trace` array.
// Each entry in `trace` could be like: { step: "Rule X", reason: "Heavy Roast", adjustment: "+20 Winter", score: 75 }
function formatTraceToMarkdown(componentName, result) {
    if (!result || !result.trace || !Array.isArray(result.trace)) {
        return `*No detailed trace available for ${componentName}. Calculator might need modification.*\n\n`;
    }
    if (result.trace.length === 0) {
        return `*No specific rules applied or trace steps recorded for ${componentName}.*\n\n`;
    }

    let md = `### ${componentName} Calculation Trace:\n\n`;
    result.trace.forEach((step, index) => {
        md += `<div class="step">`; // Use div for styling if needed
        md += `**Step ${index + 1}:** ${escapeMarkdown(step.step || 'N/A')}<br/>`;
        if (step.reason) md += `&nbsp;&nbsp;*Reason:* ${escapeMarkdown(step.reason)}<br/>`;
        if (step.adjustment) md += `&nbsp;&nbsp;*Adjustment:* ${escapeMarkdown(step.adjustment)}<br/>`;
        if (typeof step.score === 'number') md += `&nbsp;&nbsp;*Resulting Score:* ${step.score.toFixed(1)}\n`; // Example
        md += `</div>\n`;
    });
    md += '\n';
    return md;
}

// --- Main Function to Generate Trace Report ---
async function runTraceGeneration() {
    const selectedTeaName = teaSelector.value;
    if (!selectedTeaName) {
        statusDiv.textContent = 'Please select a tea first.';
        return;
    }

    const tea = TeaDatabase.findByName(selectedTeaName);
    if (!tea) {
        statusDiv.textContent = `Error: Tea "${selectedTeaName}" not found.`;
        return;
    }

    generateTraceBtn.disabled = true;
    mdOutputArea.innerHTML = ''; // Clear previous output
    statusDiv.textContent = `Generating detailed trace for ${tea.name}...`;
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow UI update

    // --- !! IMPORTANT !! ---
    // This assumes calculators/matchers are MODIFIED to return a `trace` array
    // along with their `data` and `inference` objects.
    // Example: teaTypeResult = { data: {...}, inference: "...", trace: [...] }
    // You need to implement this trace logging within each calculator/matcher.
    // -----------------------

    let fullMarkdown = `# Calculation Trace Report for: ${tea.name}\n\n`;

    try {
        // Instantiate Calculators and Matchers (assuming default config is ok)
        const config = {};
        const calculators = {
            teaType: new TeaTypeCalculator(config),
            compound: new CompoundCalculator(config),
            flavor: new FlavorCalculator(config),
            processing: new ProcessingCalculator(config),
            geography: new GeographyCalculator(config)
        };
        const matchers = {
            season: new SeasonMatcher(),
            activity: new ActivityMatcher(),
            food: new FoodMatcher(),
            time: new TimeMatcher()
        };

        // --- Run Calculations & Get Trace ---
        // (Modify these calls if your modified methods have different names/return structures)
        const teaTypeResult = calculators.teaType.calculate(tea); // Assume returns { data, inference, trace }
        fullMarkdown += formatTraceToMarkdown("Tea Type Analysis", teaTypeResult);

        const compoundResult = calculators.compound.calculate(tea);
        fullMarkdown += formatTraceToMarkdown("Compound Analysis", compoundResult);

        const processingResult = calculators.processing.calculate(tea);
        fullMarkdown += formatTraceToMarkdown("Processing Analysis", processingResult);

        const geographyResult = calculators.geography.calculate(tea);
        fullMarkdown += formatTraceToMarkdown("Geography Analysis", geographyResult);

        const flavorResult = calculators.flavor.calculate(tea);
        fullMarkdown += formatTraceToMarkdown("Flavor Analysis", flavorResult);

        // --- Run Matchers & Get Trace ---
        // (Extract inputs as before, assume matchers also return a `trace`)
        const geographyAnalysis = geographyResult.data?.geography || {};
        const processingAnalysis = processingResult.data?.processing || {}; // Use top-level object for processing
        const teaTypeAnalysis = teaTypeResult.data?.teaType || {};      // Use top-level object for tea type
        const flavorAnalysis = flavorResult.data?.flavor || {};       // Use top-level object for flavor
        const compoundAnalysis = compoundResult.data?.compounds || {};    // Use top-level object for compounds


        const seasonMatchResult = matchers.season.matchSeason(geographyAnalysis, processingAnalysis, teaTypeAnalysis, flavorAnalysis); // Pass complete objects
        fullMarkdown += formatTraceToMarkdown("Season Matching", seasonMatchResult);

        const activityMatchResult = matchers.activity.matchActivity(compoundAnalysis, teaTypeAnalysis, flavorAnalysis); // Pass complete objects
        fullMarkdown += formatTraceToMarkdown("Activity Matching", activityMatchResult);

        const foodMatchResult = matchers.food.matchFood(flavorAnalysis, processingAnalysis, teaTypeAnalysis); // Pass complete objects
        fullMarkdown += formatTraceToMarkdown("Food Matching", foodMatchResult);

        const timeMatchResult = matchers.time.matchTime(compoundAnalysis, teaTypeAnalysis, processingAnalysis); // Pass complete objects
        fullMarkdown += formatTraceToMarkdown("Time Matching", timeMatchResult);

        // --- Display Report ---
        mdOutputArea.innerHTML = fullMarkdown; // Use innerHTML to render Markdown/HTML structure
        mdOutputArea.style.display = 'block';
        statusDiv.textContent = `Detailed trace report generated for ${tea.name}.`;

    } catch (error) {
        console.error(`Error generating trace for ${tea.name}:`, error);
        statusDiv.textContent = `Error generating trace. See console.`;
        mdOutputArea.innerHTML = `<p style="color: red;">Error generating trace report. See console for details.</p>`;
        mdOutputArea.style.display = 'block';
    } finally {
        generateTraceBtn.disabled = false;
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    populateTeaSelector();
    generateTraceBtn.addEventListener('click', runTraceGeneration);
    teaSelector.addEventListener('change', () => {
        // Enable the trace button only if a tea is selected
        generateTraceBtn.disabled = !teaSelector.value;
        mdOutputArea.style.display = 'none'; // Hide output when selection changes
        statusDiv.textContent = 'Select a tea for detailed trace or generate full report.';
    });
});

// Export if needed, though likely self-contained for the HTML page
// export { runTraceGeneration };