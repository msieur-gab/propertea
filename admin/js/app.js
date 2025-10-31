// js/app.js
import { storageService } from './services/storageService.js';
import { recordHandler } from './modules/recordHandler.js';
import { FormUI } from './modules/formUI.js';
import { RecordListUI } from './modules/recordListUI.js';
import { GeoUI } from './modules/geoUI.js';

class TeaApp {
    constructor() {
        this.formUI = new FormUI(document.getElementById('teaForm'));
        this.geoUI = new GeoUI('geographySection');
        this.recordListUI = new RecordListUI('recordsList', 'recordModalOverlay');

        this._bindEvents();
        this._loadInitialData();
    }

    _bindEvents() {
        // Handle form submission
        this.formUI.form.addEventListener('submit', this._handleSave.bind(this));

        // Handle record deletion request from the list UI
        this.recordListUI.onDelete(this._handleDeleteRequest.bind(this));
    }

    _loadInitialData() {
        const records = storageService.loadRecords();
        this.recordListUI.render(records);
    }

    _handleSave(event) {
        event.preventDefault(); // Prevent default form submission
        console.log('Attempting to save...');

        const formData = this.formUI.getFormData();
        const processingMethods = this.formUI.getSelectedProcessingMethods();
        const flavors = this.formUI.getSelectedFlavorProfiles();

        // *** NEW: Get altitude value directly from the input element ***
        // Use the cached element from geoUI if available, otherwise query the DOM
        const altitudeInput = this.geoUI?.elements?.altitudeInput || document.getElementById('originAltitude');
        const altitudeValue = altitudeInput ? altitudeInput.value : null; // Get the actual value property
        // *** END NEW ***

        // Create the record object using the handler
        // Pass the directly retrieved altitudeValue as a new argument
        // *** MODIFIED LINE ***
        const newRecord = recordHandler.createTeaRecord(formData, processingMethods, flavors, altitudeValue);
        // *** END MODIFIED LINE ***

        // Validate the created record
        const validation = recordHandler.validateTeaRecord(newRecord);

        if (!validation.isValid) {
            console.error('Validation failed:', validation.errors);
            alert(`Cannot save record. Errors:\n${validation.errors.map(err => `- ${err}`).join('\n')}`);
            return;
        }

        // Save using storage service
        const success = storageService.saveRecord(newRecord);

        if (success) {
            alert('Tea record saved successfully!');
            this.formUI.resetForm(); // Reset main form fields and chip selections
            this.geoUI.resetGeoFields(); // Reset geo section fields
            this._loadInitialData(); // Reload and render the updated list
        } else {
            alert('Failed to save tea record. Please check the console.');
        }
    }

    _handleDeleteRequest(recordId) {
         if (confirm('Are you sure you want to delete this tea record? This action cannot be undone.')) {
            const success = storageService.deleteRecord(recordId);
            if (success) {
                console.log(`Record ${recordId} deleted.`);
                this._loadInitialData(); // Refresh the list
            } else {
                alert('Failed to delete record.');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TeaApp();
});