// js/app.js
import { storageService } from './services/storageService.js';
import { recordHandler } from './modules/recordHandler.js';
import { FormUI } from './modules/formUI.js';
import { RecordListUI } from './modules/recordListUI.js';
import { GeoUI } from './modules/geoUI.js';
import { SidebarUI } from './modules/sidebarUI.js';

class TeaApp {
    constructor() {
        this.sidebarUI = new SidebarUI('appSidebar', 'mainContent');

        // Initialization should still work as IDs are the same
        this.formUI = new FormUI(document.getElementById('teaForm')); // Finds the form inside the sidebar
        this.geoUI = new GeoUI('geographySection'); // Finds the geo section inside the form
        this.recordListUI = new RecordListUI('recordsList', 'recordModalOverlay'); // Finds the list in main content

        this._bindEvents();
        this._loadInitialData();
    }

    _bindEvents() {
        // Form submission listener remains the same
        this.formUI.form.addEventListener('submit', this._handleSave.bind(this));

        // Delete listener remains the same
        this.recordListUI.onDelete(this._handleDeleteRequest.bind(this));
    }

    _loadInitialData() {
        const records = storageService.loadRecords();
        this.recordListUI.render(records);
         // Optional: Hide welcome message if records exist
         document.getElementById('welcomeMessage').style.display = records.length > 0 ? 'none' : 'block';
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
            this.formUI.resetForm();
            this.geoUI.resetGeoFields(); // Resets fields within the form in the sidebar
            this._loadInitialData(); // Reload list in main content

            // Keep the form view active or collapse after saving
            this.sidebarUI.expandSidebar('form'); // Keep form visible to add another
            // OR
            // this.sidebarUI.collapseSidebar(); // Collapse after saving

             // Optional: Hide welcome message
             document.getElementById('welcomeMessage').style.display = 'none';
        } else {
            alert('Failed to save tea record. Please check the console.');
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
}

document.addEventListener('DOMContentLoaded', () => {
    new TeaApp();
});