/**
 * Tea Frequency Analysis
 * Analyzes the frequency of processing methods and flavors across different tea types
 */

// In browser environment, the tea data will be loaded from script tags
// We're not using require() anymore but expecting global variables from included scripts

// Function to count frequencies of attributes in an array of tea objects
function countFrequencies(teas, attribute) {
    const frequencyMap = {};
    
    teas.forEach(tea => {
        const attributes = tea[attribute];
        if (Array.isArray(attributes)) {
            attributes.forEach(item => {
                frequencyMap[item] = (frequencyMap[item] || 0) + 1;
            });
        }
    });
    
    return frequencyMap;
}

// Function to sort frequency map by count (descending)
function sortFrequencyMap(frequencyMap) {
    return Object.entries(frequencyMap)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
}

// Function to calculate and format percentages
function calculatePercentages(frequencyMap, totalTeas) {
    const percentageMap = {};
    
    for (const [key, count] of Object.entries(frequencyMap)) {
        percentageMap[key] = {
            count: count,
            percentage: ((count / totalTeas) * 100).toFixed(1) + '%'
        };
    }
    
    return percentageMap;
}

// Analyze each tea type
function analyzeTea(teas, teaType) {
    const processingFrequencies = countFrequencies(teas, 'processingMethods');
    const flavorFrequencies = countFrequencies(teas, 'flavors');
    
    const sortedProcessingFrequencies = sortFrequencyMap(processingFrequencies);
    const sortedFlavorFrequencies = sortFrequencyMap(flavorFrequencies);
    
    const processingPercentages = calculatePercentages(sortedProcessingFrequencies, teas.length);
    const flavorPercentages = calculatePercentages(sortedFlavorFrequencies, teas.length);
    
    return {
        teaType: teaType,
        totalTeas: teas.length,
        processingMethods: processingPercentages,
        flavors: flavorPercentages
    };
}

// Function to run analysis once all tea data is loaded
function runAnalysis() {
    // Create analysis for each tea type
    const teaAnalysis = {
        green: analyzeTea(asianGreenTeas, 'Green Tea'),
        white: analyzeTea(asianWhiteTeas, 'White Tea'),
        oolong: analyzeTea(asianOolongTeas, 'Oolong Tea'),
        black: analyzeTea(asianBlackTeas, 'Black Tea'),
        yellow: analyzeTea(asianYellowTeas, 'Yellow Tea'),
        dark: analyzeTea(asianDarkTeas, 'Dark Tea')
    };
    
    return teaAnalysis;
}

// Function to display frequency analysis results in a formatted way
function displayFrequencyAnalysis(teaAnalysis) {
    const results = {};
    
    for (const [teaKey, analysis] of Object.entries(teaAnalysis)) {
        results[teaKey] = {
            teaType: analysis.teaType,
            totalTeas: analysis.totalTeas,
            topProcessingMethods: Object.entries(analysis.processingMethods)
                .slice(0, 10)
                .map(([method, stats]) => ({ 
                    method, 
                    count: stats.count, 
                    percentage: stats.percentage 
                })),
            topFlavors: Object.entries(analysis.flavors)
                .slice(0, 10)
                .map(([flavor, stats]) => ({ 
                    flavor, 
                    count: stats.count, 
                    percentage: stats.percentage 
                }))
        };
    }
    
    return results;
}

// Create a HTML output function for better visualization
function generateHtmlReport(teaAnalysis) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asian Tea Analysis</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #006400;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #008080;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        h3 {
            color: #4682B4;
            margin-top: 20px;
        }
        .tea-section {
            margin-bottom: 40px;
            padding: 20px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .chart-container {
            height: 300px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Asian Tea Processing Methods and Flavor Analysis</h1>
`;

    for (const [teaKey, analysis] of Object.entries(teaAnalysis)) {
        html += `
    <div class="tea-section">
        <h2>${analysis.teaType} Analysis (${analysis.totalTeas} teas)</h2>
        
        <div class="grid-container">
            <div>
                <h3>Top Processing Methods</h3>
                <table>
                    <tr>
                        <th>Processing Method</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
`;

        Object.entries(analysis.processingMethods).slice(0, 10).forEach(([method, stats]) => {
            html += `
                    <tr>
                        <td>${method}</td>
                        <td>${stats.count}</td>
                        <td>${stats.percentage}</td>
                    </tr>
`;
        });

        html += `
                </table>
            </div>
            
            <div>
                <h3>Top Flavors</h3>
                <table>
                    <tr>
                        <th>Flavor</th>
                        <th>Count</th>
                        <th>Percentage</th>
                    </tr>
`;

        Object.entries(analysis.flavors).slice(0, 10).forEach(([flavor, stats]) => {
            html += `
                    <tr>
                        <td>${flavor}</td>
                        <td>${stats.count}</td>
                        <td>${stats.percentage}</td>
                    </tr>
`;
        });

        html += `
                </table>
            </div>
        </div>
    </div>
`;
    }

    html += `
</body>
</html>
`;

    return html;
} 