
// js/services/storageService.js
const STORAGE_KEY = 'teaRecords';

export const storageService = {
    /**
     * Load all tea records from localStorage.
     * @returns {Array} An array of tea records.
     */
    loadRecords() {
        try {
            const savedRecords = localStorage.getItem(STORAGE_KEY);
            return savedRecords ? JSON.parse(savedRecords) : [];
        } catch (error) {
            console.error('Error loading records from localStorage:', error);
            return []; // Return empty array on error
        }
    },

    /**
     * Save a single tea record to localStorage.
     * Adds the new record to the existing list.
     * @param {Object} newRecord - The tea record object to save.
     * @returns {boolean} True if successful, false otherwise.
     */
    saveRecord(newRecord) {
        if (!newRecord || typeof newRecord !== 'object' || !newRecord.id) {
            console.error('Invalid record provided to saveRecord:', newRecord);
            return false;
        }
        try {
            const records = this.loadRecords();
            // Check if record already exists (by id) to prevent duplicates during potential re-saves
            const existingIndex = records.findIndex(rec => rec.id === newRecord.id);
            if (existingIndex > -1) {
                records[existingIndex] = newRecord; // Update existing
                console.warn(`Record with ID ${newRecord.id} already exists. Updating it.`);
            } else {
                records.push(newRecord); // Add new
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error('Error saving record to localStorage:', error);
            return false;
        }
    },

    /**
     * Save an entire array of tea records to localStorage.
     * Overwrites any existing records.
     * @param {Array} records - The array of tea records to save.
     * @returns {boolean} True if successful, false otherwise.
     */
    saveAllRecords(records) {
        if (!Array.isArray(records)) {
            console.error('Invalid data provided to saveAllRecords: must be an array.');
            return false;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error('Error saving all records to localStorage:', error);
            return false;
        }
    },

    /**
     * Delete a tea record by its ID.
     * @param {string} recordId - The ID of the record to delete.
     * @returns {boolean} True if successful, false otherwise.
     */
    deleteRecord(recordId) {
        if (!recordId) {
            console.error('No record ID provided for deletion.');
            return false;
        }
        try {
            let records = this.loadRecords();
            const initialLength = records.length;
            records = records.filter(record => record.id !== recordId);
            if (records.length < initialLength) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
                return true;
            } else {
                console.warn(`Record with ID ${recordId} not found for deletion.`);
                return false; // Record not found
            }
        } catch (error) {
            console.error('Error deleting record from localStorage:', error);
            return false;
        }
    }
};
