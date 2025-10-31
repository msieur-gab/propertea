/**
 * apiService.js - Tea Analysis API Integration
 *
 * Handles communication with the Netlify Functions tea analysis API
 * Converts admin form data to API format and processes responses
 */

export class APIService {
    constructor(apiBaseUrl = null) {
        // Use provided URL or auto-detect based on environment
        this.apiBaseUrl = apiBaseUrl || this._detectApiUrl();
        this.analyzeEndpoint = `${this.apiBaseUrl}/analyze`;
        this.timeout = 10000; // 10 second timeout
    }

    /**
     * Auto-detect API base URL based on environment
     */
    _detectApiUrl() {
        if (typeof window === 'undefined') return '';

        // Production: Use Netlify Functions at same domain
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return '/.netlify/functions';
        }

        // Local development: Use netlify dev
        return 'http://localhost:8888/.netlify/functions';
    }

    /**
     * Convert admin form data to API format
     */
    _formatRequestData(formData, processingMethods, flavors, altitudeValue, geoData = {}) {
        // Convert FormData to plain object if needed
        const formObj = formData instanceof FormData
            ? Object.fromEntries(formData.entries())
            : formData;

        return {
            name: formObj.teaName || '',
            originalName: formObj.originalName || '',
            type: formObj.teaType || 'unknown',
            subType: formObj.subType || '',
            origin: geoData.location || '',

            // Compounds
            caffeineLevel: this._parseFloat(formObj.caffeineLevel, 0),
            lTheanineLevel: this._parseFloat(formObj.lTheanineLevel, 0),

            // Flavor
            flavorProfile: Array.isArray(flavors) ? flavors : [],

            // Processing
            processingMethods: Array.isArray(processingMethods) ? processingMethods : [],

            // Geography
            geography: {
                country: geoData.country || formObj.country || '',
                province: geoData.province || formObj.province || '',
                location: geoData.location || formObj.location || '',
                altitude: this._parseFloat(altitudeValue || geoData.altitude, null),
                humidity: this._parseFloat(geoData.humidity || formObj.humidity, null),
                latitude: this._parseFloat(geoData.latitude || formObj.latitude, null),
                longitude: this._parseFloat(geoData.longitude || formObj.longitude, null),
                temperature: this._parseFloat(geoData.temperature || formObj.temperature, null),
                solarRadiation: this._parseFloat(geoData.solarRadiation || formObj.solarRadiation, null),
                harvestMonth: this._parseInt(formObj.harvestMonth, null)
            }
        };
    }

    /**
     * Safe float parsing
     */
    _parseFloat(value, fallback = 0) {
        if (value === null || value === undefined || value === '') return fallback;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? fallback : parsed;
    }

    /**
     * Safe integer parsing
     */
    _parseInt(value, fallback = null) {
        if (value === null || value === undefined || value === '') return fallback;
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
    }

    /**
     * Main method: Send tea data to API and get complete analysis
     *
     * @param {Object} formData - Form data from admin UI
     * @param {Array} processingMethods - Selected processing methods
     * @param {Array} flavors - Selected flavor profiles
     * @param {string|number} altitudeValue - Altitude value
     * @param {Object} geoData - Geo data from location service
     * @returns {Promise<Object>} API response with analysis
     */
    async analyzeTea(formData, processingMethods, flavors, altitudeValue, geoData = {}) {
        try {
            // Format the request
            const requestData = this._formatRequestData(
                formData,
                processingMethods,
                flavors,
                altitudeValue,
                geoData
            );

            console.log('📤 Sending to API:', requestData);

            // Send request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(this.analyzeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Handle response
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error || `API error: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'API returned success: false');
            }

            console.log('✅ API Response received:', result.data);
            return result.data; // Return just the analysis data
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error(`API request timed out (${this.timeout}ms)`);
            }
            console.error('❌ API Error:', error);
            throw error;
        }
    }

    /**
     * Download analysis JSON to file
     */
    downloadAnalysisJSON(analysis, teaName = 'tea_analysis') {
        try {
            const filename = `${teaName.replace(/\s+/g, '_')}_analysis.json`;
            const dataStr = JSON.stringify(analysis, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`✅ Downloaded: ${filename}`);
            return true;
        } catch (error) {
            console.error('❌ Download error:', error);
            throw error;
        }
    }

    /**
     * Copy analysis JSON to clipboard
     */
    async copyToClipboard(analysis) {
        try {
            const jsonStr = JSON.stringify(analysis, null, 2);
            await navigator.clipboard.writeText(jsonStr);
            console.log('✅ Copied to clipboard');
            return true;
        } catch (error) {
            console.error('❌ Clipboard error:', error);
            throw error;
        }
    }
}

// Export singleton
export const apiService = new APIService();
