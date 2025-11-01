
// js/modules/geoUI.js
import { geoService } from '../services/geoService.js';
import { formatToTitleCase } from '../utils/formatters.js';

export class GeoUI {
    constructor(sectionElementId) {
        this.section = document.getElementById(sectionElementId);
        if (!this.section) {
            console.error(`Geo section element with ID "${sectionElementId}" not found.`);
            return; // Stop initialization if section not found
        }
        this.elements = this._cacheElements();
        this.currentLocationInfo = null; // Stores selected location data from search

        this._bindEvents();
        this._updateInitialUIState();
    }

    _cacheElements() {
        const getEl = (id) => this.section.querySelector(`#${id}`);
        return {
            // Search
            locationInput: getEl('locationInput'),
            searchButton: getEl('searchButton'),
            locationResultsContainer: getEl('locationResults'),
            // Details / Inputs (to be populated)
            countryInput: getEl('originCountry'),
            provinceInput: getEl('originProvince'),
            locationDetailInput: getEl('originLocation'), // Specific location name (city/area)
            altitudeInput: getEl('originAltitude'),
            latitudeInput: getEl('latitudeInput'), // Hidden input
            longitudeInput: getEl('longitudeInput'), // Hidden input
            temperatureInput: getEl('originTemperature'), // Readonly input
            humidityInput: getEl('originHumidity'), // Readonly input
            solarRadiationInput: getEl('originSolarRadiation'), // Readonly input (adjusted ID)
            // Controls & Feedback
            autoEstimateCheckbox: getEl('autoEstimateCheckbox'),
            estimatedLabel: getEl('estimatedLabel'),
            fetchWeatherButton: getEl('fetchWeatherButton'), // Renamed for clarity
            geoError: getEl('geoError'), // Specific error display for geo section
            locationDetailsSection: getEl('locationDetails'), // Container for details
            weatherDataSection: getEl('weatherData') // Container for weather readouts
        };
    }

    _bindEvents() {
         if (!this.elements.searchButton || !this.elements.locationInput) return; // Don't bind if core elements missing

        this.elements.searchButton.addEventListener('click', this._handleSearchClick.bind(this));
        // Allow search on Enter key press in location input
        this.elements.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent potential form submission
                this._handleSearchClick();
            }
        });
        // Event delegation for location results
        this.elements.locationResultsContainer?.addEventListener('click', this._handleResultClick.bind(this));
        // Altitude checkbox change
        this.elements.autoEstimateCheckbox?.addEventListener('change', this._handleAutoEstimateChange.bind(this));
        // Fetch weather button click
        this.elements.fetchWeatherButton?.addEventListener('click', this._handleFetchWeatherClick.bind(this));
    }

    _updateInitialUIState() {
        // Hide details and results initially
        if (this.elements.locationDetailsSection) this.elements.locationDetailsSection.style.display = 'none';
        if (this.elements.weatherDataSection) this.elements.weatherDataSection.style.display = 'none';
        if (this.elements.locationResultsContainer) this.elements.locationResultsContainer.style.display = 'none';

        // Set initial state based on checkbox
        this._handleAutoEstimateChange();
        this._updateFetchButtonState(); // Fetch button should be disabled initially
    }

    _handleSearchClick() {
        const query = this.elements.locationInput?.value.trim();
        if (!query) {
            this._showError('Please enter a location name to search.');
            return;
        }
        this._performLocationSearch(query);
    }

    _handleResultClick(event) {
        const item = event.target.closest('.location-item');
        if (item && item.dataset.locationData) {
            try {
                const locationData = JSON.parse(item.dataset.locationData);
                this._selectLocation(locationData);
            } catch (error) {
                console.error("Error parsing location data from element:", error);
                this._showError('Error selecting location.');
            }
        }
    }

    _handleAutoEstimateChange() {
        const isChecked = this.elements.autoEstimateCheckbox?.checked ?? false;
        if (this.elements.altitudeInput) {
            this.elements.altitudeInput.disabled = isChecked;
            // If checking, fetch altitude if location selected, or clear if no location
            if (isChecked) {
                if (this.currentLocationInfo) {
                    this._fetchAndSetAltitude(this.currentLocationInfo.latitude, this.currentLocationInfo.longitude, true); // Indicate it's an auto-estimate
                } else {
                     this.elements.altitudeInput.value = ''; // Clear if no location selected yet
                }
            }
        }
        if (this.elements.estimatedLabel) {
            this.elements.estimatedLabel.style.display = isChecked ? 'inline' : 'none';
        }
         this._updateFetchButtonState();
    }

     async _handleFetchWeatherClick() {
        if (!this.currentLocationInfo?.latitude || !this.currentLocationInfo?.longitude) {
            this._showError('Please select a location first.');
            return;
        }
        const lat = this.currentLocationInfo.latitude;
        const lon = this.currentLocationInfo.longitude;

        this._setLoadingState(this.elements.fetchWeatherButton, true, 'Fetching Weather...');
        this._clearError();
        this._clearWeatherFields(); // Clear previous weather data

        try {
            const weatherData = await geoService.fetchWeatherData(lat, lon);

            if (weatherData) {
                this._populateWeatherFields(weatherData);
                if (this.elements.weatherDataSection) {
                    this.elements.weatherDataSection.style.display = 'block';
                }
            } else {
                this._showError('Could not retrieve weather data.');
                 if (this.elements.weatherDataSection) {
                    this.elements.weatherDataSection.style.display = 'none';
                }
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            this._showError(error.message || 'Failed to fetch weather data.');
             if (this.elements.weatherDataSection) {
                this.elements.weatherDataSection.style.display = 'none';
            }
        } finally {
            this._setLoadingState(this.elements.fetchWeatherButton, false, 'Get Weather Data');
        }
    }


    async _performLocationSearch(query) {
        this._setLoadingState(this.elements.searchButton, true, 'Searching...');
        this._clearError();
        this._clearLocationResults();
        this.resetGeoFields(false); // Reset fields but keep search query

        try {
            const results = await geoService.searchLocation(query);
            this._displayLocationResults(results);
        } catch (error) {
            console.error("Error during location search:", error);
            this._showError(error.message || 'Location search failed.');
        } finally {
            this._setLoadingState(this.elements.searchButton, false, 'Search Location');
        }
    }

     _displayLocationResults(results) {
        this._clearLocationResults();
        const container = this.elements.locationResultsContainer;
        if (!container) return;

        if (!results || results.length === 0) {
            container.innerHTML = '<div class="no-results">No locations found.</div>';
            container.style.display = 'block';
            return;
        }

        results.forEach(location => {
            const item = document.createElement('div');
            item.className = 'location-item';
            item.textContent = this._formatLocationDisplay(location);
            // Store full location data on the element for easy retrieval on click
            item.dataset.locationData = JSON.stringify(location);
            container.appendChild(item);
        });
        container.style.display = 'block';
    }

    _formatLocationDisplay(location) {
        // Creates a display string like "Uji, Kyoto, Japan"
        return [
            location.name,
            location.admin2 && location.admin2 !== location.name ? location.admin2 : null, // Add admin2 (e.g., county) if different from name
            location.admin1 && location.admin1 !== location.admin2 ? location.admin1 : null, // Add admin1 (province/state) if different
            location.country
        ].filter(Boolean).join(', '); // Filter out null/empty parts and join
    }


     _selectLocation(location) {
        this.currentLocationInfo = location;
        console.log('[GeoUI] Location selected:', location);

        this._clearLocationResults();
        this._clearError();
        this._clearWeatherFields(); // Clear old weather data on new location select

        // Populate form fields
        if (this.elements.latitudeInput) this.elements.latitudeInput.value = location.latitude ?? '';
        if (this.elements.longitudeInput) this.elements.longitudeInput.value = location.longitude ?? '';
        if (this.elements.countryInput) this.elements.countryInput.value = location.country ?? '';
        if (this.elements.provinceInput) this.elements.provinceInput.value = location.admin1 ?? ''; // Use admin1 for province/state
        if (this.elements.locationDetailInput) {
             // Use name + admin2 (if different) for specific location
             let detail = location.name ?? '';
             if (location.admin2 && location.admin2 !== location.name) {
                 detail += `, ${location.admin2}`;
             }
             this.elements.locationDetailInput.value = detail;
        }


        // Show the details section
        if (this.elements.locationDetailsSection) {
            this.elements.locationDetailsSection.style.display = 'block';
        }
         if (this.elements.weatherDataSection) {
            this.elements.weatherDataSection.style.display = 'none'; // Hide weather until fetched
        }

        // Handle altitude based on checkbox state
        if (this.elements.autoEstimateCheckbox?.checked) {
            this._fetchAndSetAltitude(location.latitude, location.longitude, true);
        } else {
            // If manual entry, use provided elevation if available, otherwise clear
            if (this.elements.altitudeInput) {
                this.elements.altitudeInput.value = location.elevation ?? ''; // Use elevation from geocoding result if present
                this.elements.altitudeInput.disabled = false;
            }
             if (this.elements.estimatedLabel) this.elements.estimatedLabel.style.display = 'none';
        }

        this._updateFetchButtonState();
    }

     async _fetchAndSetAltitude(lat, lon, isAutoEstimate = false) {
         if (!this.elements.altitudeInput) return;

         // Set placeholder or visual cue while fetching if needed
         if (isAutoEstimate) {
             this.elements.altitudeInput.placeholder = 'Estimating...';
             this.elements.altitudeInput.value = ''; // Clear previous value
         }

        try {
             const altitude = await geoService.getElevation(lat, lon);
             if (this.elements.altitudeInput) { // Check again in case UI changed
                 this.elements.altitudeInput.value = altitude ?? '';
                 this.elements.altitudeInput.placeholder = 'Enter altitude'; // Reset placeholder
                 if (isAutoEstimate) {
                     this.elements.altitudeInput.disabled = true;
                     if(this.elements.estimatedLabel) this.elements.estimatedLabel.style.display = altitude !== null ? 'inline' : 'none';
                 }
                 this._updateFetchButtonState(); // Update button state after getting altitude
             }
        } catch (error) {
             console.error("Error fetching altitude:", error);
             if (this.elements.altitudeInput) {
                  this.elements.altitudeInput.placeholder = 'Enter altitude'; // Reset placeholder on error
                  if (isAutoEstimate && this.elements.estimatedLabel) this.elements.estimatedLabel.style.display = 'none';
             }
             // Optionally show a non-blocking warning?
        }
    }

     _populateWeatherFields(weatherData) {
        const setVal = (el, val, unit = '') => {
            if (el) el.value = (val !== null && val !== undefined) ? `${val}${unit}` : '';
        };
        setVal(this.elements.temperatureInput, weatherData.avgTemperature, '°C');
        setVal(this.elements.humidityInput, weatherData.avgHumidity, '%');
        setVal(this.elements.solarRadiationInput, weatherData.avgSolarRadiation, ' W/m²'); // Assuming W/m²
    }

    _clearWeatherFields() {
         const clearEl = (el) => { if (el) el.value = ''; };
         clearEl(this.elements.temperatureInput);
         clearEl(this.elements.humidityInput);
         clearEl(this.elements.solarRadiationInput);
         if (this.elements.weatherDataSection) this.elements.weatherDataSection.style.display = 'none';
    }


    _clearLocationResults() {
        if (this.elements.locationResultsContainer) {
            this.elements.locationResultsContainer.innerHTML = '';
            this.elements.locationResultsContainer.style.display = 'none';
        }
    }

    _setLoadingState(button, isLoading, loadingText = 'Loading...') {
        if (!button) return;
        const originalText = button.dataset.originalText || button.textContent;
        if (isLoading) {
            button.disabled = true;
            if (!button.dataset.originalText) {
                button.dataset.originalText = button.textContent; // Store original text only once
            }
            button.textContent = loadingText;
        } else {
            button.disabled = false;
            button.textContent = originalText; // Restore original text
        }
    }

     _updateFetchButtonState() {
        if (!this.elements.fetchWeatherButton) return;
        // Enable fetch button only if a location is selected (lat/lon are available)
        const hasLocation = !!this.currentLocationInfo?.latitude && !!this.currentLocationInfo?.longitude;
        this.elements.fetchWeatherButton.disabled = !hasLocation;
    }

     _showError(message) {
        if (this.elements.geoError) {
            this.elements.geoError.textContent = message;
        }
    }

    _clearError() {
        if (this.elements.geoError) {
            this.elements.geoError.textContent = '';
        }
    }

    // Public method to reset the entire geo section (e.g., after form save)
    resetGeoFields(resetSearchInput = true) {
        this.currentLocationInfo = null;
        this._clearLocationResults();
        this._clearError();
        this._clearWeatherFields();

        if (resetSearchInput && this.elements.locationInput) this.elements.locationInput.value = '';
        if (this.elements.countryInput) this.elements.countryInput.value = '';
        if (this.elements.provinceInput) this.elements.provinceInput.value = '';
        if (this.elements.locationDetailInput) this.elements.locationDetailInput.value = '';
        if (this.elements.altitudeInput) this.elements.altitudeInput.value = '';
        if (this.elements.latitudeInput) this.elements.latitudeInput.value = '';
        if (this.elements.longitudeInput) this.elements.longitudeInput.value = '';

        if (this.elements.autoEstimateCheckbox) this.elements.autoEstimateCheckbox.checked = true; // Reset to default checked state

        this._updateInitialUIState(); // Re-apply initial visibility and button states
    }

    // Public getter to return current geo data for API submission
    get geoData() {
        return {
            country: this.elements.countryInput?.value || '',
            province: this.elements.provinceInput?.value || '',
            location: this.elements.locationDetailInput?.value || '',
            latitude: this.elements.latitudeInput?.value ? parseFloat(this.elements.latitudeInput.value) : null,
            longitude: this.elements.longitudeInput?.value ? parseFloat(this.elements.longitudeInput.value) : null,
            altitude: this.elements.altitudeInput?.value ? parseFloat(this.elements.altitudeInput.value) : null,
            temperature: this.elements.temperatureInput?.value ? this._parseWeatherValue(this.elements.temperatureInput.value) : null,
            humidity: this.elements.humidityInput?.value ? this._parseWeatherValue(this.elements.humidityInput.value) : null,
            solarRadiation: this.elements.solarRadiationInput?.value ? this._parseWeatherValue(this.elements.solarRadiationInput.value) : null
        };
    }

    // Helper to parse weather values that might contain units
    _parseWeatherValue(value) {
        const numStr = value.replace(/[°C%\s W/m²]/g, '').trim();
        const parsed = parseFloat(numStr);
        return !isNaN(parsed) ? parsed : null;
    }
}
