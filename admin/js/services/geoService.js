
// js/services/geoService.js
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
// Using Open-Meteo's elevation API as open-elevation.com can be unreliable
const ELEVATION_URL = 'https://api.open-meteo.com/v1/elevation';

export const geoService = {
    /**
     * Search for locations based on a query string.
     * @param {string} query - The location name to search for.
     * @returns {Promise<Array>} A promise that resolves with an array of location results.
     */
    async searchLocation(query) {
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            throw new Error('Invalid search query provided.');
        }
        const url = `${GEOCODING_URL}/search?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`;
        console.log(`[GeoService] Searching location: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`[GeoService] Location search failed: ${response.status} ${response.statusText}`, errorData);
                throw new Error(`Failed to fetch location data: ${response.status} ${response.statusText}. ${errorData.reason || ''}`);
            }
            const data = await response.json();
            console.log("[GeoService] Location search results:", data.results);
            return data.results || [];
        } catch (error) {
            console.error('[GeoService] Error during location search:', error);
            // Rethrow a cleaner error message for the UI
            throw new Error(`Location search failed. Please check your connection or try again. (${error.message})`);
        }
    },

    /**
     * Get elevation for a given latitude and longitude using Open-Meteo's API.
     * @param {number} latitude - The latitude.
     * @param {number} longitude - The longitude.
     * @returns {Promise<number|null>} A promise that resolves with the elevation in meters, or null if not found/error.
     */
    async getElevation(latitude, longitude) {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon)) {
            console.error('[GeoService] Invalid coordinates for elevation request:', latitude, longitude);
            return null; // Return null for invalid input
        }

        const url = `${ELEVATION_URL}?latitude=${lat}&longitude=${lon}`;
        console.log(`[GeoService] Fetching elevation: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                 const errorText = await response.text();
                console.error(`[GeoService] Elevation fetch failed: ${response.status} ${response.statusText}`, errorText);
                // Don't throw, just return null - weather can proceed without exact elevation
                return null;
            }
            const data = await response.json();
             // Open-Meteo returns elevation in an array
            if (data.elevation && data.elevation.length > 0) {
                const elevation = Math.round(data.elevation[0]);
                console.log("[GeoService] Elevation data received:", elevation);
                return elevation;
            }
            console.warn("[GeoService] No elevation data found in response:", data);
            return null;
        } catch (error) {
            console.error('[GeoService] Error during elevation fetch:', error);
            return null; // Return null on fetch error
        }
    },

    /**
     * Fetch average weather data (temp, humidity, solar radiation) for given coordinates.
     * Calculates averages from daily data over the last few years for a general climate overview.
     * @param {number} latitude - The latitude.
     * @param {number} longitude - The longitude.
     * @returns {Promise<Object|null>} A promise resolving with { avgTemperature, avgHumidity, avgSolarRadiation } or null on error.
     */
    async fetchWeatherData(latitude, longitude) {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
         if (isNaN(lat) || isNaN(lon)) {
            console.error('[GeoService] Invalid coordinates for weather request:', latitude, longitude);
            return null; // Return null for invalid input
        }

        // Fetch daily data for a period to get averages (adjust dates if needed)
        // Using daily values: temperature_2m_mean, relative_humidity_2m_mean, shortwave_radiation_sum
        // shortwave_radiation_sum is in MJ/m²/day (kept in this format for GeographyTaxonomy compatibility)
        // Use the last available date within API range (2025-07-30 to 2025-11-15)
        const today = new Date();
        // If today is before 2025-07-30, use a reasonable default; otherwise use available range
        const endDate = new Date('2025-11-15'); // Use the latest available date
        const startDate = new Date('2025-07-30'); // Use the earliest available date in the range

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];


        const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_mean,relative_humidity_2m_mean,shortwave_radiation_sum&timezone=auto&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

        console.log(`[GeoService] Fetching weather data: ${url}`);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({}));
                console.error(`[GeoService] Weather fetch failed: ${response.status} ${response.statusText}`, errorData);
                throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}. ${errorData.reason || ''}`);
            }
            const data = await response.json();
            console.log("[GeoService] Weather data received:", data);

            if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
                console.warn("[GeoService] No daily weather data found in response:", data);
                return null;
            }

            const daily = data.daily;
            const count = daily.time.length;

            // Helper to calculate average, filtering out null/undefined values
            const calculateAverage = (arr) => {
                const validValues = arr.filter(v => v !== null && v !== undefined);
                if (validValues.length === 0) return null;
                return validValues.reduce((a, b) => a + b, 0) / validValues.length;
            };

            const avgTemp = calculateAverage(daily.temperature_2m_mean);
            const avgHum = calculateAverage(daily.relative_humidity_2m_mean);
            const avgSolarSumMJ = calculateAverage(daily.shortwave_radiation_sum);

            // Keep solar radiation in MJ/m²/day (matches GeographyTaxonomy expectations)
            // GeographyTaxonomy expects ranges like: 0-10, 10-15, 15-20, 20-25, 25-100 MJ/m²/day
            const avgSolarRadiation = avgSolarSumMJ;

            const weatherResult = {
                avgTemperature: avgTemp !== null ? Math.round(avgTemp * 10) / 10 : null, // Round to 1 decimal
                avgHumidity: avgHum !== null ? Math.round(avgHum * 10) / 10 : null, // Round to 1 decimal
                avgSolarRadiation: avgSolarRadiation !== null ? Math.round(avgSolarRadiation * 10) / 10 : null // Round to 1 decimal (MJ/m²/day)
            };

            console.log("[GeoService] Calculated weather averages:", weatherResult);
            return weatherResult;

        } catch (error) {
            console.error('[GeoService] Error during weather data fetch:', error);
            throw new Error(`Weather data fetch failed. Please check your connection or try again. (${error.message})`);
        }
    }
};
