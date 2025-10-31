
// js/modules/formUI.js
import { teaTypes, processingMethodsList, flavorProfilesList, suggestionsByType } from './teaData.js';
import { Autocomplete } from './autocomplete.js';
import { formatToTitleCase } from '../utils/formatters.js';

export class FormUI {
    constructor(formElement) {
        this.form = formElement;
        this.elements = this._cacheElements();

        this.selectedProcessingMethods = new Set();
        this.selectedFlavorProfiles = new Set();

        this._initTeaTypeOptions();
        this._initAutocomplete();
        this._bindEvents();
    }

    _cacheElements() {
        const getEl = (id) => this.form.querySelector(`#${id}`);
        return {
            teaType: getEl('teaType'),
            processingMethodsContainer: getEl('processingMethods'),
            suggestedProcessingMethods: getEl('suggestedProcessingMethods'),
            customProcessingMethodInput: getEl('customProcessingMethod'),
            processingMethodSuggestionsContainer: getEl('processingMethodSuggestions'),

            flavorProfilesContainer: getEl('flavorProfiles'),
            suggestedFlavorProfiles: getEl('suggestedFlavorProfiles'),
            customFlavorInput: getEl('customFlavor'),
            flavorSuggestionsContainer: getEl('flavorSuggestions'),
            // Add other relevant form elements if needed for reset/validation
            teaName: getEl('teaName'),
            originalName: getEl('originalName'),
            caffeineLevel: getEl('caffeineLevel'),
            lTheanineLevel: getEl('lTheanineLevel'),
        };
    }

    _initTeaTypeOptions() {
        if (!this.elements.teaType) return;
        Object.entries(teaTypes).forEach(([key, name]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = name;
            this.elements.teaType.appendChild(option);
        });
    }

    _initAutocomplete() {
        // Processing Methods Autocomplete
        if (this.elements.customProcessingMethodInput && this.elements.processingMethodSuggestionsContainer) {
            this.processingAutocomplete = new Autocomplete(
                this.elements.customProcessingMethodInput,
                this.elements.processingMethodSuggestionsContainer,
                processingMethodsList
            );
            this.processingAutocomplete.onSelect((method) => {
                this.addProcessingMethod(method.trim().toLowerCase().replace(/\s+/g, '-')); // Ensure kebab-case
            });
        }

        // Flavor Profiles Autocomplete
        if (this.elements.customFlavorInput && this.elements.flavorSuggestionsContainer) {
             this.flavorAutocomplete = new Autocomplete(
                this.elements.customFlavorInput,
                this.elements.flavorSuggestionsContainer,
                flavorProfilesList
            );
            this.flavorAutocomplete.onSelect((flavor) => {
                 this.addFlavorProfile(flavor.trim().toLowerCase()); // Ensure consistent casing
            });
        }
    }

    _bindEvents() {
        if (this.elements.teaType) {
            this.elements.teaType.addEventListener('change', this._handleTeaTypeChange.bind(this));
        }
        // Event delegation for suggestion clicks
        if(this.elements.suggestedProcessingMethods) {
            this.elements.suggestedProcessingMethods.addEventListener('click', this._handleSuggestionClick.bind(this));
        }
        if(this.elements.suggestedFlavorProfiles) {
            this.elements.suggestedFlavorProfiles.addEventListener('click', this._handleSuggestionClick.bind(this));
        }
        // Event delegation for chip removal
        if (this.elements.processingMethodsContainer) {
            this.elements.processingMethodsContainer.addEventListener('click', this._handleChipRemove.bind(this));
        }
        if (this.elements.flavorProfilesContainer) {
            this.elements.flavorProfilesContainer.addEventListener('click', this._handleChipRemove.bind(this));
        }
    }

     _handleTeaTypeChange() {
        const selectedType = this.elements.teaType.value;
        // Do not clear selections on type change, allow user to refine
        // this.selectedProcessingMethods.clear();
        // this.selectedFlavorProfiles.clear();
        // this._renderProcessingMethods();
        // this._renderFlavorProfiles();

        this._renderSuggestions(selectedType);
    }

    _handleSuggestionClick(event) {
        if (event.target.classList.contains('suggestion')) {
            const value = event.target.dataset.value;
            const type = event.target.dataset.type; // 'processing' or 'flavor'

            if (type === 'processing') {
                this.addProcessingMethod(value);
            } else if (type === 'flavor') {
                this.addFlavorProfile(value);
            }
        }
    }

     _handleChipRemove(event) {
        const closeButton = event.target.closest('.chip-close');
        if (closeButton) {
            const chip = closeButton.closest('.chip');
            const value = chip.dataset.value;
            const type = chip.dataset.type; // 'processing' or 'flavor'

            if (type === 'processing') {
                this.removeProcessingMethod(value);
            } else if (type === 'flavor') {
                this.removeFlavorProfile(value);
            }
        }
    }

    // --- Public Methods ---

    addProcessingMethod(method) {
        if (method && !this.selectedProcessingMethods.has(method)) {
            this.selectedProcessingMethods.add(method);
            this._renderProcessingMethods();
            this._renderSuggestions(this.elements.teaType.value); // Update suggestions
        }
    }

    removeProcessingMethod(method) {
        if (this.selectedProcessingMethods.has(method)) {
            this.selectedProcessingMethods.delete(method);
            this._renderProcessingMethods();
             this._renderSuggestions(this.elements.teaType.value); // Update suggestions
        }
    }

     addFlavorProfile(flavor) {
        if (flavor && !this.selectedFlavorProfiles.has(flavor)) {
            this.selectedFlavorProfiles.add(flavor);
            this._renderFlavorProfiles();
             this._renderSuggestions(this.elements.teaType.value); // Update suggestions
        }
    }

    removeFlavorProfile(flavor) {
         if (this.selectedFlavorProfiles.has(flavor)) {
            this.selectedFlavorProfiles.delete(flavor);
            this._renderFlavorProfiles();
             this._renderSuggestions(this.elements.teaType.value); // Update suggestions
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        // Add selected items which are not standard form elements
        // These will be retrieved separately in the main app logic
        return formData;
    }

    getSelectedProcessingMethods() {
        return Array.from(this.selectedProcessingMethods);
    }

    getSelectedFlavorProfiles() {
        return Array.from(this.selectedFlavorProfiles);
    }


    resetForm() {
        this.form.reset(); // Resets standard form elements
        this.selectedProcessingMethods.clear();
        this.selectedFlavorProfiles.clear();
        this._renderProcessingMethods();
        this._renderFlavorProfiles();
        this._renderSuggestions(''); // Clear suggestions
        // Manually clear any other custom state if needed
    }

    // --- Private Rendering Methods ---

    _renderProcessingMethods() {
        this._renderChips(this.elements.processingMethodsContainer, this.selectedProcessingMethods, 'processing');
    }

     _renderFlavorProfiles() {
        this._renderChips(this.elements.flavorProfilesContainer, this.selectedFlavorProfiles, 'flavor');
    }

     _renderChips(container, selectedItems, type) {
        if (!container) return;
        container.innerHTML = ''; // Clear existing chips
        selectedItems.forEach(item => {
            const chip = this._createChipElement(item, type);
            container.appendChild(chip);
        });
    }

    _createChipElement(item, type) {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.dataset.value = item; // Store raw value
        chip.dataset.type = type;

        const chipText = document.createElement('span');
        chipText.className = 'chip-text';
        // Format for display, keep raw value in dataset
        chipText.textContent = formatToTitleCase(item);

        const closeBtn = document.createElement('span');
        closeBtn.className = 'chip-close';
        closeBtn.innerHTML = '&times;'; // Use HTML entity for 'x'

        chip.appendChild(chipText);
        chip.appendChild(closeBtn);
        return chip;
    }

    _renderSuggestions(teaType) {
        this._renderSuggestionGroup(
            this.elements.suggestedProcessingMethods,
            suggestionsByType.processing[teaType] || [],
            this.selectedProcessingMethods,
            'processing'
        );
        this._renderSuggestionGroup(
            this.elements.suggestedFlavorProfiles,
            suggestionsByType.flavor[teaType] || [],
            this.selectedFlavorProfiles,
            'flavor'
        );
    }

    _renderSuggestionGroup(container, suggestions, selectedItems, type) {
        if (!container) return;
        container.innerHTML = ''; // Clear existing suggestions
        if (!suggestions) return;

        suggestions.forEach(suggestion => {
            // Only show suggestion if it's not already selected
            if (!selectedItems.has(suggestion)) {
                const div = document.createElement('div');
                div.className = 'suggestion';
                div.textContent = formatToTitleCase(suggestion); // Format for display
                div.dataset.value = suggestion; // Store raw value
                div.dataset.type = type;
                container.appendChild(div);
            }
        });
    }
}
