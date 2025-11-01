// js/app.js
import { storageService } from './services/storageService.js';
import { apiService } from './services/apiService.js';
import { recordHandler } from './modules/recordHandler.js';
import { FormUI } from './modules/formUI.js';
import { RecordListUI } from './modules/recordListUI.js';
import { GeoUI } from './modules/geoUI.js';
import { SidebarUI } from './modules/sidebarUI.js';
import { AnalysisDisplay } from './modules/analysisDisplay.js';
import { TeaTypeSelector } from './modules/teaTypeSelector.js';

class TeaApp {
    constructor() {
        this.sidebarUI = new SidebarUI('appSidebar', 'mainContent');

        // Initialization should still work as IDs are the same
        this.formUI = new FormUI(document.getElementById('teaForm')); // Finds the form inside the sidebar
        this.geoUI = new GeoUI('geographySection'); // Finds the geo section inside the form
        this.recordListUI = new RecordListUI('recordsList', 'recordModalOverlay'); // Finds the list in main content
        this.analysisDisplay = new AnalysisDisplay('mainContent'); // Display analysis in main content

        // Initialize tea type selector for proper type/subtype handling
        this.teaTypeSelector = new TeaTypeSelector('teaType', 'teaSubtype');

        this._bindEvents();
        this._loadInitialData();
    }

    _bindEvents() {
        // Form submission listener remains the same
        this.formUI.form.addEventListener('submit', this._handleSave.bind(this));

        // Delete listener remains the same
        this.recordListUI.onDelete(this._handleDeleteRequest.bind(this));

        // View record handler - show analysis in main content
        this.recordListUI.onView(this._handleViewRecord.bind(this));
    }

    _loadInitialData() {
        const records = storageService.loadRecords();
        this.recordListUI.render(records);
         // Optional: Hide welcome message if records exist
         document.getElementById('welcomeMessage').style.display = records.length > 0 ? 'none' : 'block';
    }
    async _handleSave(event) {
        event.preventDefault();
        console.log('🫖 Processing tea record and sending to API...');

        const formData = this.formUI.getFormData();
        const processingMethods = this.formUI.getSelectedProcessingMethods();
        const flavors = this.formUI.getSelectedFlavorProfiles();

        // Get altitude value
        const altitudeInput = this.geoUI?.elements?.altitudeInput || document.getElementById('originAltitude');
        const altitudeValue = altitudeInput ? altitudeInput.value : null;

        // Get geo data from geoUI
        const geoData = this.geoUI?.geoData || {};

        // Create the record object using the handler
        const newRecord = recordHandler.createTeaRecord(formData, processingMethods, flavors, altitudeValue);

        // Validate the created record
        const validation = recordHandler.validateTeaRecord(newRecord);

        if (!validation.isValid) {
            console.error('Validation failed:', validation.errors);
            alert(`Cannot save record. Errors:\n${validation.errors.map(err => `- ${err}`).join('\n')}`);
            return;
        }

        // Show loading state
        const saveButton = document.getElementById('saveButton');
        const originalButtonText = saveButton.textContent;
        saveButton.disabled = true;
        saveButton.textContent = '⏳ Analyzing...';

        try {
            // Send to API for analysis
            const analysis = await apiService.analyzeTea(
                formData,
                processingMethods,
                flavors,
                altitudeValue,
                geoData
            );

            // Attach the analysis to the record
            newRecord.analysis = analysis;
            newRecord.analyzedAt = new Date().toISOString();

            // Save the enriched record to local storage
            const success = storageService.saveRecord(newRecord);

            if (success) {
                console.log('✅ Tea record saved with analysis!');
                alert('✅ Tea analyzed and saved successfully!');

                // Reset form
                this.formUI.resetForm();
                this.geoUI.resetGeoFields();
                this._loadInitialData();

                // Keep form visible
                this.sidebarUI.expandSidebar('form');
                document.getElementById('welcomeMessage').style.display = 'none';
            } else {
                alert('⚠️ Analysis completed but failed to save locally.');
            }
        } catch (error) {
            console.error('❌ API Error:', error);
            alert(`❌ Analysis failed: ${error.message}\n\nWill save record locally without analysis.`);

            // Fallback: Save without analysis
            const success = storageService.saveRecord(newRecord);
            if (success) {
                this.formUI.resetForm();
                this.geoUI.resetGeoFields();
                this._loadInitialData();
                this.sidebarUI.expandSidebar('form');
                document.getElementById('welcomeMessage').style.display = 'none';
            }
        } finally {
            // Restore button state
            saveButton.disabled = false;
            saveButton.textContent = originalButtonText;
        }
    }

    _handleDeleteRequest(recordId) {
         if (confirm('Are you sure you want to delete this tea record? This action cannot be undone.')) {
            const success = storageService.deleteRecord(recordId);
            if (success) {
                console.log(`Record ${recordId} deleted.`);
                this._loadInitialData(); // Refresh list in main content
             // Optional: Hide welcome message if list becomes empty
             const records = storageService.loadRecords();
             document.getElementById('welcomeMessage').style.display = records.length > 0 ? 'none' : 'block';
            } else {
                alert('Failed to delete record.');
            }
        }
    }

    _handleViewRecord(recordId) {
        const records = storageService.loadRecords();
        const record = records.find(r => r.id === recordId);

        if (!record) {
            console.error(`Record with ID ${recordId} not found.`);
            return;
        }

        // Display the analysis in main content
        if (record.analysis) {
            this.analysisDisplay.display(record);
        } else {
            // If no analysis, show basic info
            this.analysisDisplay.container.innerHTML = `
                <div class="tea-info">
                    <h2>${record.name}</h2>
                    <p>No analysis available for this tea. Please submit it again to get analysis.</p>
                </div>
            `;
        }

        // Hide welcome message
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TeaApp();
});