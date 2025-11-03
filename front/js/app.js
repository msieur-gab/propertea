/**
 * Tea JSON Export Tool Script
 * Standardized implementation for exporting tea analysis data as JSON
 */

// Import necessary components and utilities
import './components/TestSection.js';
import './components/TeaSidebar.js';
import TeaDatabase from './data/TeaDatabase.js';

// Import TeaInsights
import { TeaInsights } from './TeaInsights.js';
//Basic Formatter
import { formatBasicTeaInfo } from './formatters/BasicInfoFormatter.js';
// Import Calculators formatters
import { formatTeaTypeAnalysis } from './formatters/TeaTypeFormatter.js';
import { formatCompoundAnalysis } from './formatters/CompoundFormatter.js';
import { formatProcessingAnalysis } from './formatters/ProcessingFormatter.js';
import { formatFlavorAnalysis } from './formatters/FlavorFormatter.js';
import { formatGeographyAnalysis } from './formatters/GeographyFormatter.js';

// Import Matchers formatters
import { formatTimingAnalysis } from './formatters/TimingFormatter.js';
import { formatSeasonalAnalysis } from './formatters/SeasonalFormatter.js';
import { formatFoodAnalysis } from './formatters/FoodFormatter.js';
import { formatBrewingAnalysis } from './formatters/BrewingFormatter.js';
import { formatActivityAnalysis } from './formatters/ActivityFormatter.js';
import { formatString, formatScoreWithBar } from './utils/markdownUtils.js';


// Import the new visualizer component

// import '../../shared/components/TeaTimingVisualizer.js';

// Current tea and JSON data
let currentTea = null;
let currentJsonData = null;
let sectionRefs = {};

// Create a single instance of TeaInsights
const teaInsightsInstance = new TeaInsights();

// Initialize the export tool
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    setupEventListeners();
    setupJsonExportPanel();
});

/**
 * Initialize the tea sidebar with the tea database
 */
function initializeSidebar() {
    const sidebar = document.querySelector('tea-sidebar');
    if (sidebar) {
        sidebar.teas = TeaDatabase.getAllTeas();
    }
}

/**
 * Set up event listeners for the export tool
 */
function setupEventListeners() {
    // Listen for tea selection events from the sidebar
    document.addEventListener('tea-selected', (event) => {
        const tea = event.detail.tea;
        if (tea) {
            currentTea = tea;
            
            // Clear existing test sections
            clearTestSections();
            
            // Generate new test sections for the selected tea
            generateTestSections(tea);
            
            // Generate JSON data
            generateJsonData(tea);
        }
    });

    // Event delegation for reference marker clicks
    document.addEventListener('click', (event) => {
        // Handle reference marker clicks
        if (event.target.classList.contains('reference-marker')) {
            const sectionId = event.target.dataset.section;
            if (sectionId && sectionRefs[sectionId]) {
                sectionRefs[sectionId].scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the section briefly
                sectionRefs[sectionId].classList.add('highlight');
                setTimeout(() => {
                    sectionRefs[sectionId].classList.remove('highlight');
                }, 2000);
            }
        }
        
        // Handle JSON expand/collapse toggles
        if (event.target.classList.contains('json-toggle')) {
            const targetId = event.target.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Toggle the collapsed class on the expandable content
                targetElement.classList.toggle('collapsed');
                
                // Toggle the collapsed class on the toggle button
                event.target.classList.toggle('collapsed');
                
                // Update the toggle symbol
                event.target.textContent = event.target.classList.contains('collapsed') ? '▶' : '▼';
            }
        }
    });
}

/**
 * Set up the JSON export panel and its controls
 */
function setupJsonExportPanel() {
    const toggleButton = document.querySelector('.json-export-toggle');
    const panel = document.querySelector('.json-export-panel');
    const copyButton = document.getElementById('copy-json');
    const downloadButton = document.getElementById('download-json');

    // Toggle panel visibility
    if (toggleButton && panel) {
        toggleButton.addEventListener('click', () => {
            panel.classList.toggle('active');
            toggleButton.textContent = panel.classList.contains('active') 
                ? 'Hide JSON' 
                : 'Show JSON';
        });
    }

    // Copy JSON to clipboard
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            if (currentJsonData) {
                const jsonStr = JSON.stringify(currentJsonData, null, 2);
                
                // Try to use the Clipboard API if available
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(jsonStr)
                        .then(() => {
                            const originalText = copyButton.textContent;
                            copyButton.textContent = 'Copied!';
                            setTimeout(() => {
                                copyButton.textContent = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy with Clipboard API: ', err);
                            fallbackCopyToClipboard(jsonStr, copyButton);
                        });
                } else {
                    // Fallback for browsers that don't support the Clipboard API
                    fallbackCopyToClipboard(jsonStr, copyButton);
                }
            }
        });
    }

    // Download JSON file
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            if (currentJsonData && currentTea) {
                const fileName = `${normalizeString(currentTea.name)}_export.json`;
                const jsonStr = JSON.stringify(currentJsonData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    }
}

/**
 * Fallback method to copy text to clipboard using execCommand
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element to update
 */
function fallbackCopyToClipboard(text, button) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select the text and copy
    let success = false;
    
    try {
        textarea.select();
        success = document.execCommand('copy');
        if (success) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } else {
            button.textContent = 'Copy failed';
            setTimeout(() => {
                button.textContent = 'Copy JSON';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy method failed:', err);
        button.textContent = 'Copy failed';
        setTimeout(() => {
            button.textContent = 'Copy JSON';
        }, 2000);
    }
    
    // Clean up
    document.body.removeChild(textarea);
}

/**
 * Clear all test sections from the page
 */
function clearTestSections() {
    const testSectionsContainer = document.querySelector('.test-sections');
    if (testSectionsContainer) {
        testSectionsContainer.innerHTML = '';
    }
    sectionRefs = {};
}

/**
 * Generate test sections using dedicated formatters.
 * @param {Object} tea - The tea to analyze
 */
function generateTestSections(tea) {
    if (!tea) return;
    console.log('Generating test sections for tea:', tea);

    const testSectionsContainer = document.querySelector('.test-sections');
    if (!testSectionsContainer) {
        console.error('Test sections container not found');
        return;
    }

    // 1. Get the comprehensive analysis object from TeaInsights
    const standardAnalysis = teaInsightsInstance.analyzeTea(tea);
    console.log('>>> Received standardAnalysis in app.js:', standardAnalysis); // <--- ADD THIS LINE

    console.log('Standardized analysis:', standardAnalysis);
    

    if (!standardAnalysis) {
        console.error('Failed to generate analysis for tea:', tea.name);
        // Display an error message in the UI
        const errorSection = createTestSectionComponent('Error', 'TeaInsights', `Failed to generate analysis for ${tea.name}. Check console.`, {}, 'error');
        testSectionsContainer.appendChild(errorSection);
        return;
    }

    

    // 2. Create sections using formatters and the standardAnalysis object
    //    Pass the relevant sub-object to each formatter.
    const sections = [

       
        {
            title: 'Tea Information',
            content: formatBasicTeaInfo(tea, tea.name), // Use basic info formatter
            type: 'teaData',
            source: 'TeaDatabase', // Source of the raw data being shown
            
        },
        {
            title: 'Tea Type Analysis',
            content: formatTeaTypeAnalysis(standardAnalysis.teaType, tea.name),
            type: 'teaType',
            source: 'TeaTypeCalculator'
        },
        {
            title: 'Compound Analysis',
            content: formatCompoundAnalysis(standardAnalysis.compounds, tea.name),
            type: 'compounds',
            source: 'CompoundCalculator'
        },
        {
            title: 'Flavor Analysis',
            content: formatFlavorAnalysis(standardAnalysis.flavor, tea.name),
            type: 'flavor',
            source: 'FlavorCalculator',
        },
        {
            title: 'Processing Analysis',
            content: formatProcessingAnalysis(standardAnalysis.processing, tea.name),
            type: 'processing',
            source: 'ProcessingCalculator',
        },
        {
            title: 'Geography Analysis',
            content: formatGeographyAnalysis(standardAnalysis.geography, tea.name),
            type: 'geography',
            source: 'GeographyCalculator',
        },

        {
            title: 'Timing Analysis',
            content: formatTimingAnalysis(standardAnalysis.timing, tea.name),
            type: 'timing',
            source: 'TimeMatcher'
        },
        {
            title: 'Seasonal Analysis',
            content: formatSeasonalAnalysis(standardAnalysis.seasonal, tea.name),
            type: 'seasonal',
            source: 'SeasonMatcher'
        },
        {
            title: 'Food Pairing Analysis',
            content: formatFoodAnalysis(standardAnalysis.food, tea.name),
            type: 'food',
            source: 'FoodMatcher'
        },
        {
            title: 'Brewing Analysis',
            content: formatBrewingAnalysis(standardAnalysis.brewing, tea.name),
            type: 'brewing',
            source: 'BrewingMatcher'
        },
        {
            title: 'Activities Analysis',
            content: formatActivityAnalysis(standardAnalysis.activities, tea.name),
            type: 'activities',
            source: 'ActivityMatcher'
        }
    ];

    sections.forEach((section) => {
        let rawDataForSection; // Declare variable to hold the raw data

    if (section.type === 'teaData') {
        // For the 'Tea Information' section, the raw data IS the original 'tea' object
        rawDataForSection = tea;
    } else {
        // For all other analysis sections, get data from the standardAnalysis object
        rawDataForSection = standardAnalysis[section.type]; // Use the section type as the key
    }
        testSectionsContainer.appendChild(createTestSectionComponent(
            section.title,
            section.source,
            section.content,
            // standardAnalysis[section.type],
            rawDataForSection,
            section.type
        ));
    });

}

/**
 * Helper function to create and configure a test-section component.
 */
function createTestSectionComponent(title, calculatorName, markdownContent, rawData, sectionIdBase) {
    const section = document.createElement('test-section');
    section.title = title;
    section.calculator = calculatorName;
    section.dataFlow = `${calculatorName} → ${currentTea?.name || 'Tea'} → ${title}`;
    section.inference = markdownContent || `*No content generated for ${title}*`;
    section.rawOutput = JSON.stringify(rawData, null, 2);
    section.id = `section-${sectionIdBase}`;
    sectionRefs[sectionIdBase] = section; // Store reference for linking/highlighting
    
console.log(`[DEBUG] Raw data for '${title}':`, rawData); // <--- Add this log
return section;

}


/**
 * Generate JSON data for a given tea
 * @param {Object} tea - The tea to generate JSON data for
 */
function generateJsonData(tea) {
    if (!tea) return;

    // Get standardized analysis from TeaInsights
    const standardAnalysis = teaInsightsInstance.analyzeTea(tea);
    if (!standardAnalysis) {
        console.error('Failed to generate analysis for JSON data for tea:', tea.name);
        currentJsonData = { error: `Failed to generate analysis for ${tea.name}` };
        displayJsonWithReferences(currentJsonData);
        return;
    }

    currentJsonData = standardAnalysis;
    currentJsonData.calculatedAt = new Date().toISOString();
    displayJsonWithReferences(currentJsonData);
}

/**
 * Display formatted JSON with clickable references
 * @param {Object} jsonData - The JSON data to display
 */
function displayJsonWithReferences(jsonData) {
    const jsonContainer = document.getElementById('json-container');
    if (!jsonContainer) return;

    const formattedJson = formatJsonWithReferences(jsonData);
    jsonContainer.innerHTML = formattedJson;
}

/**
 * Format JSON with clickable references
 */
function formatJsonWithReferences(obj, indent = 0, path = '', nestLevel = 0) {
    let html = '';
    const indentStr = '\t'.repeat(indent);
    const padding = indent * 8;
    
    // Create a unique ID for references
    const pathId = path ? path.replace(/\./g, '-').replace(/\[/g, '_').replace(/\]/g, '_') : 'root';
    
    if (Array.isArray(obj)) {
        // Display an array
        if (obj.length === 0) {
            html += `<span class="json-syntax">[</span><span class="json-syntax">]</span>`;
        } else {
            // Determine if this node should be collapsible
            const isCollapsible = nestLevel <= 2;
            
            // Determine if this node should be collapsed by default
            const isCollapsed = nestLevel === 2;
            
            // Add appropriate classes based on collapsibility and collapse state
            if (isCollapsible) {
                html += `<span class="json-toggle ${isCollapsed ? 'collapsed' : ''}" data-target="json-${pathId}">${isCollapsed ? '▶' : '▼'}</span>`;
            }
            
            html += `<span class="json-syntax">[</span>`;
            
            if (isCollapsible) {
                html += `<div id="json-${pathId}" class="json-expandable ${isCollapsed ? 'collapsed' : ''}">`;
            }
            
            // Process each item in the array
            obj.forEach((item, index) => {
                html += `<div style="padding-left: ${padding + 8}px;">`;
                html += formatJsonWithReferences(item, indent + 1, `${path}[${index}]`, nestLevel + 1);
                if (index < obj.length - 1) {
                    html += '<span class="json-syntax">,</span>';
                }
                html += '</div>';
            });
            
            if (isCollapsible) {
                html += `</div>`;
            }
            
            html += `<div style="padding-left: ${padding}px;"><span class="json-syntax">]</span></div>`;
        }
    } else if (obj !== null && typeof obj === 'object') {
        // Display an object
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            html += `<span class="json-syntax">{</span><span class="json-syntax">}</span>`;
        } else {
            // Determine if this node should be collapsible
            const isCollapsible = nestLevel <= 2;
            
            // Determine if this node should be collapsed by default
            const isCollapsed = nestLevel === 2;
            
            // Add appropriate classes based on collapsibility and collapse state
            if (isCollapsible) {
                html += `<span class="json-toggle ${isCollapsed ? 'collapsed' : ''}" data-target="json-${pathId}">${isCollapsed ? '▶' : '▼'}</span>`;
            }
            
            html += `<span class="json-syntax">{</span>`;
            
            if (isCollapsible) {
                html += `<div id="json-${pathId}" class="json-expandable ${isCollapsed ? 'collapsed' : ''}">`;
            }
            
            // Process each key-value pair in the object
            keys.forEach((key, index) => {
                const value = obj[key];
                const newPath = path ? `${path}.${key}` : key;
                
                // Add reference markers for specific sections
                let sectionRef = null;
                if (key === '_sectionRef') {
                    sectionRef = value;
                } else if (path === '' && typeof value === 'object' && value !== null && key !== 'tea') {
                    sectionRef = value._sectionRef || obj._sectionRef?.[key];
                }
                
                html += `<div style="padding-left: ${padding + 8}px;">`;
                
                // Add anchor icon before the key if this is a main section
                if (sectionRef) {
                    html += `<span class="reference-marker" data-section="${sectionRef}" title="View in analysis">⚓</span> `;
                }
                
                html += `<span class="key">"${key}"</span><span class="json-syntax">: </span>`;
                html += formatJsonWithReferences(value, indent + 1, newPath, nestLevel + 1);
                if (index < keys.length - 1) {
                    html += '<span class="json-syntax">,</span>';
                }
                html += '</div>';
            });
            
            if (isCollapsible) {
                html += `</div>`;
            }
            
            html += `<div style="padding-left: ${padding}px;"><span class="json-syntax">}</span></div>`;
        }
    } else if (typeof obj === 'string') {
        // Display a string
        html += `<span class="string">"${escapeHtml(obj)}"</span>`;
    } else if (typeof obj === 'number') {
        // Display a number
        html += `<span class="number">${obj}</span>`;
    } else if (typeof obj === 'boolean') {
        // Display a boolean
        html += `<span class="boolean">${obj}</span>`;
    } else if (obj === null) {
        // Display null
        html += `<span class="null">null</span>`;
    }
    
    return html;
}

/**
 * Helper: Get month name from month number
 */
// function getMonthName(monthNumber) {
//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     return months[monthNumber - 1] || 'Unknown';
// }



/**
 * Helper: Normalize string for filenames
 */
function normalizeString(str) {
    if (!str) return 'unknown';
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}



export default {
    initializeSidebar,
    generateJsonData,
    displayJsonWithReferences,
}; 