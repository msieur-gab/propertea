// direct-calculator-demo.js
// Demonstrates how to use the new TeaInsights class without TeaEffectCalculator dependency

import { TeaInsights } from '../TeaInsights.js';
import TeaDatabase from '../data/TeaDatabase.js';

// Example usage of the TeaInsights system
class TeaInsightsDemo {
  constructor() {
    // Initialize the TeaInsights system
    this.teaInsights = new TeaInsights();
    this.allTeas = TeaDatabase.getAllTeas();
  }
  
  // Run a demonstration of the system
  runDemo() {
    console.log("=== Tea Insights Demonstration ===");
    
    // Get a sample tea
    const sencha = TeaDatabase.findByName("Sencha");
    const gyokuro = TeaDatabase.findByName("Gyokuro");
    const assam = TeaDatabase.findByName("Assam");
    
    if (!sencha || !gyokuro || !assam) {
      console.error("Could not find the sample teas");
      return;
    }
    
    // Demonstrate direct tea analysis
    console.log("\n1. Direct Tea Analysis");
    console.log("---------------------");
    const analysis = this.teaInsights.analyzeTea(sencha);
    console.log(`Analysis for ${sencha.name}:`, analysis);
    
    // Demonstrate timing recommendations
    console.log("\n2. Timing Recommendations");
    console.log("------------------------");
    const timingForSencha = this.teaInsights.getTimingRecommendations(sencha);
    const timingForGyokuro = this.teaInsights.getTimingRecommendations(gyokuro);
    const timingForAssam = this.teaInsights.getTimingRecommendations(assam);
    
    console.log(`${sencha.name}: Best time - ${timingForSencha.bestTime}`);
    console.log(`Explanation: ${timingForSencha.explanation}`);
    
    console.log(`\n${gyokuro.name}: Best time - ${timingForGyokuro.bestTime}`);
    console.log(`Explanation: ${timingForGyokuro.explanation}`);
    
    console.log(`\n${assam.name}: Best time - ${timingForAssam.bestTime}`);
    console.log(`Explanation: ${timingForAssam.explanation}`);
    
    // Demonstrate seasonal recommendations
    console.log("\n3. Seasonal Recommendations");
    console.log("---------------------------");
    const seasonalForSencha = this.teaInsights.getSeasonalRecommendations(sencha);
    const seasonalForGyokuro = this.teaInsights.getSeasonalRecommendations(gyokuro);
    const seasonalForAssam = this.teaInsights.getSeasonalRecommendations(assam);
    
    console.log(`${sencha.name}: Best season - ${seasonalForSencha.bestSeason}`);
    console.log(`Explanation: ${seasonalForSencha.explanation}`);
    
    console.log(`\n${gyokuro.name}: Best season - ${seasonalForGyokuro.bestSeason}`);
    console.log(`Explanation: ${seasonalForGyokuro.explanation}`);
    
    console.log(`\n${assam.name}: Best season - ${seasonalForAssam.bestSeason}`);
    console.log(`Explanation: ${seasonalForAssam.explanation}`);
    
    // Demonstrate activity recommendations
    console.log("\n4. Activity Recommendations");
    console.log("---------------------------");
    const activitiesForSencha = this.teaInsights.getActivityRecommendations(sencha);
    const activitiesForGyokuro = this.teaInsights.getActivityRecommendations(gyokuro);
    const activitiesForAssam = this.teaInsights.getActivityRecommendations(assam);
    
    console.log(`${sencha.name}: Top activities - ${activitiesForSencha.topActivities.join(', ')}`);
    console.log(`Explanation: ${activitiesForSencha.explanation}`);
    
    console.log(`\n${gyokuro.name}: Top activities - ${activitiesForGyokuro.topActivities.join(', ')}`);
    console.log(`Explanation: ${activitiesForGyokuro.explanation}`);
    
    console.log(`\n${assam.name}: Top activities - ${activitiesForAssam.topActivities.join(', ')}`);
    console.log(`Explanation: ${activitiesForAssam.explanation}`);
    
    // Demonstrate geography insights
    console.log("\n5. Geography Insights");
    console.log("---------------------");
    const geographyForSencha = this.teaInsights.getGeographyInsights(sencha);
    const geographyForGyokuro = this.teaInsights.getGeographyInsights(gyokuro);
    const geographyForAssam = this.teaInsights.getGeographyInsights(assam);
    
    console.log(`${sencha.name}: Origin - ${geographyForSencha.origin}`);
    console.log(`Explanation: ${geographyForSencha.explanation}`);
    
    console.log(`\n${gyokuro.name}: Origin - ${geographyForGyokuro.origin}`);
    console.log(`Explanation: ${geographyForGyokuro.explanation}`);
    
    console.log(`\n${assam.name}: Origin - ${geographyForAssam.origin}`);
    console.log(`Explanation: ${geographyForAssam.explanation}`);
    
    console.log("\n=== End of Demonstration ===");
  }
  
  // Generate an HTML report for display in a web page
  generateHTMLReport(teaName) {
    const tea = TeaDatabase.findByName(teaName);
    if (!tea) {
      return `<div class="error">Tea "${teaName}" not found</div>`;
    }
    
    // Get all insights
    const analysis = this.teaInsights.analyzeTea(tea);
    const timing = this.teaInsights.getTimingRecommendations(tea);
    const seasonal = this.teaInsights.getSeasonalRecommendations(tea);
    const activities = this.teaInsights.getActivityRecommendations(tea);
    const geography = this.teaInsights.getGeographyInsights(tea);
    
    // Build HTML
    let html = `
      <div class="tea-insights-report">
        <h2>${tea.name} Analysis Report</h2>
        
        <div class="section">
          <h3>Basic Information</h3>
          <p><strong>Type:</strong> ${tea.type}</p>
          <p><strong>Origin:</strong> ${tea.origin || 'Unknown'}</p>
          <p><strong>Caffeine Level:</strong> ${tea.caffeineLevel || 'Unknown'}/10</p>
        </div>
        
        <div class="section">
          <h3>Best Time to Enjoy</h3>
          <div class="recommendation">
            <div class="highlight">${timing.bestTime.toUpperCase()}</div>
            <p>${timing.explanation}</p>
          </div>
          <div class="score-bars">
            ${Object.entries(timing.recommendations).map(([time, score]) => `
              <div class="score-item">
                <span>${time}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${score}%"></div>
                </div>
                <span>${score}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h3>Seasonal Recommendations</h3>
          <div class="recommendation">
            <div class="highlight">${seasonal.bestSeason.toUpperCase()}</div>
            <p>${seasonal.explanation}</p>
          </div>
          <div class="score-bars">
            ${Object.entries(seasonal.recommendations).map(([season, score]) => `
              <div class="score-item">
                <span>${season}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${score}%"></div>
                </div>
                <span>${score}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h3>Recommended Activities</h3>
          <div class="recommendation">
            <div class="highlight">${activities.topActivities[0].toUpperCase()}</div>
            <p>${activities.explanation}</p>
          </div>
          <div class="score-bars">
            ${Object.entries(activities.recommendations).map(([activity, score]) => `
              <div class="score-item">
                <span>${activity}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${score}%"></div>
                </div>
                <span>${score}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h3>Geography Insights</h3>
          <p>${geography.explanation}</p>
        </div>
      </div>
    `;
    
    return html;
  }
}

// Initialize and run the demo if in a browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.teaInsightsDemo = new TeaInsightsDemo();
    
    // Add demo button to page if element exists
    const demoButton = document.getElementById('run-demo-button');
    if (demoButton) {
      demoButton.addEventListener('click', () => {
        window.teaInsightsDemo.runDemo();
      });
    }
    
    // Add report generation if element exists
    const reportContainer = document.getElementById('tea-report-container');
    const teaSelector = document.getElementById('tea-selector');
    if (reportContainer && teaSelector) {
      // Populate tea selector
      const allTeas = TeaDatabase.getAllTeas();
      allTeas.forEach(tea => {
        const option = document.createElement('option');
        option.value = tea.name;
        option.textContent = tea.name;
        teaSelector.appendChild(option);
      });
      
      // Generate report on tea selection
      teaSelector.addEventListener('change', (event) => {
        const selectedTea = event.target.value;
        reportContainer.innerHTML = window.teaInsightsDemo.generateHTMLReport(selectedTea);
      });
      
      // Generate initial report if teas are available
      if (allTeas.length > 0) {
        reportContainer.innerHTML = window.teaInsightsDemo.generateHTMLReport(allTeas[0].name);
      }
    }
  });
}

// Export the demo class
export { TeaInsightsDemo }; 