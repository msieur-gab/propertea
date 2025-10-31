// js/modules/recordHandler.js
import { formatToTitleCase } from '../utils/formatters.js';

export const recordHandler = {
    /**
     * Creates a tea record object from form data and selected items,
     * matching the target JSON structure.
     * @param {FormData} formData - The form data object.
     * @param {string[]} selectedProcessingMethods - Array of selected processing method strings.
     * @param {string[]} selectedFlavorProfiles - Array of selected flavor profile strings.
     * @param {string | null} altitudeValue - The altitude value directly from the input field. // *** NEW PARAMETER ***
     * @returns {Object} The structured tea record object.
     */
    // *** MODIFIED FUNCTION SIGNATURE ***
    createTeaRecord(formData, selectedProcessingMethods, selectedFlavorProfiles, altitudeValue) {
    // *** END MODIFIED FUNCTION SIGNATURE ***
        const name = formData.get('teaName')?.trim() || '';
        const originalName = formData.get('originalName')?.trim() || '';
        const type = formData.get('teaType')?.trim() || '';
        const subType = '';

        const caffeineLevelStr = formData.get('caffeineLevel')?.trim();
        const lTheanineLevelStr = formData.get('lTheanineLevel')?.trim();

        // Origin details from specific fields populated by geoUI
        const location = formData.get('originLocation')?.trim() || '';
        const province = formData.get('originProvince')?.trim() || '';
        const country = formData.get('originCountry')?.trim() || '';
        const latitudeStr = formData.get('latitudeInput')?.trim();
        const longitudeStr = formData.get('longitudeInput')?.trim();
        // *** REMOVED: const altitudeStr = formData.get('originAltitude')?.trim(); ***
        const temperatureStr = formData.get('originTemperature')?.trim();
        const humidityStr = formData.get('originHumidity')?.trim();
        const solarRadiationStr = formData.get('originSolarRadiation')?.trim();

        // Helper to parse float or return null
        const parseFloatOrNull = (str) => {
            if (str === null || str === undefined || String(str).trim() === '') return null; // Added String() conversion for safety
            const num = parseFloat(str);
            return isNaN(num) ? null : num;
        };
        // Helper to parse integer or return null
        const parseIntOrNull = (str) => {
            if (str === null || str === undefined || String(str).trim() === '') return null; // Added String() conversion for safety
            const num = parseInt(str, 10);
            return isNaN(num) ? null : num;
        };


        const record = {
            id: Date.now().toString(),
            name,
            originalName,
            type,
            subType,
            caffeineLevel: parseFloatOrNull(caffeineLevelStr),
            lTheanineLevel: parseFloatOrNull(lTheanineLevelStr),
            flavorProfile: selectedFlavorProfiles || [],
            processingMethods: selectedProcessingMethods || [],
            geography: {
                location,
                province,
                country,
                latitude: parseFloatOrNull(latitudeStr),
                longitude: parseFloatOrNull(longitudeStr),
                // *** MODIFIED: Use the passed altitudeValue directly ***
                altitude: parseIntOrNull(altitudeValue),
                humidity: parseFloatOrNull(humidityStr),
                temperature: parseFloatOrNull(temperatureStr),
                solarRadiation: parseFloatOrNull(solarRadiationStr)
            },
            dateAdded: new Date().toISOString()
        };

        console.log('[RecordHandler] Created Record:', record);
        return record;
    },

    /**
     * Validates a tea record object.
     * @param {Object} record - The tea record object to validate.
     * @returns {{isValid: boolean, errors: string[]}} Validation result.
     */
    validateTeaRecord(record) {
        const errors = [];
        if (!record) {
            return { isValid: false, errors: ['Record object is missing.'] };
        }

        // Required fields
        if (!record.name?.trim()) errors.push('Tea Name is required.');
        if (!record.type?.trim()) errors.push('Tea Type is required.');

        // Validate nested geography object structure
        if (!record.geography) {
            errors.push('Geography data is missing.');
        } else {
            // Basic check for required geo fields if needed (e.g., country)
            // if (!record.geography.country?.trim()) errors.push('Origin Country is required.');

            // Validate numeric geography fields (check if they are numbers or null)
            const geoFields = ['latitude', 'longitude', 'altitude', 'humidity', 'temperature', 'solarRadiation'];
            geoFields.forEach(field => {
                const value = record.geography[field];
                if (value !== null && typeof value !== 'number') {
                    // Allow altitude to be potentially empty string if not entered/estimated, parseIntOrNull handles it
                    if (field === 'altitude' && value === '') {
                       // Allow empty string initially, parseIntOrNull makes it null
                    } else {
                       errors.push(`${formatToTitleCase(field)} must be a number or null.`);
                    }
                }
            });
        }

         // Validate top-level numeric fields
         const numericFields = ['caffeineLevel', 'lTheanineLevel'];
         numericFields.forEach(field => {
            const value = record[field];
            if (value !== null && typeof value !== 'number') {
                errors.push(`${formatToTitleCase(field)} must be a number or null.`);
            } else if (typeof value === 'number' && (value < 0 || value > 10)) {
                 errors.push(`${formatToTitleCase(field)} must be between 0 and 10.`);
            }
         });

        // Check if arrays are actually arrays
        if (!Array.isArray(record.flavorProfile)) errors.push('Flavor Profile must be an array.');
        if (!Array.isArray(record.processingMethods)) errors.push('Processing Methods must be an array.');


        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

     /**
     * Formats a record for display in the modal (example).
     * @param {Object} record - The tea record object.
     * @returns {Object} An object containing formatted strings/data for the modal.
     */
    formatRecordForDisplay(record) {
         // ... (rest of the function remains unchanged) ...
        if (!record) return {};

        const formatted = {
            id: record.id,
            name: record.name || 'N/A',
            originalName: record.originalName || '',
            typeName: record.type ? formatToTitleCase(record.type) + ' Tea' : 'Unknown Type',
            processingMethods: record.processingMethods?.map(formatToTitleCase) || [],
            flavorProfile: record.flavorProfile?.map(formatToTitleCase) || [],
            dateAdded: record.dateAdded ? new Date(record.dateAdded).toLocaleDateString() : 'N/A',
            // Geography specific formatting
            originString: [
                record.geography?.location,
                record.geography?.province,
                record.geography?.country
            ].filter(Boolean).join(', ') || 'N/A',
            coordinates: (record.geography?.latitude !== null && record.geography?.longitude !== null)
                ? `${record.geography.latitude.toFixed(2)}, ${record.geography.longitude.toFixed(2)}`
                : 'N/A',
            altitude: record.geography?.altitude !== null ? `${record.geography.altitude} m` : 'N/A',
            temperature: record.geography?.temperature !== null ? `${record.geography.temperature} °C` : 'N/A',
            humidity: record.geography?.humidity !== null ? `${record.geography.humidity} %` : 'N/A',
            solarRadiation: record.geography?.solarRadiation !== null ? `${record.geography.solarRadiation} W/m²` : 'N/A', // Assuming W/m² based on API
            // Other levels
            caffeineLevel: record.caffeineLevel !== null ? record.caffeineLevel : 'N/A',
            lTheanineLevel: record.lTheanineLevel !== null ? record.lTheanineLevel : 'N/A',
            // Raw record for JSON copy
            rawRecord: record
        };

        return formatted;
    }
};