
// js/modules/autocomplete.js

/**
 * Creates and manages an autocomplete suggestion list for an input element.
 */
export class Autocomplete {
    constructor(inputElement, suggestionsContainer, sourceData = []) {
        this.input = inputElement;
        this.container = suggestionsContainer;
        this.source = sourceData; // Array of strings for suggestions
        this.onSelectCallback = null;
        this.currentFocus = -1; // Index of the currently focused suggestion

        this._bindEvents();
    }

    /**
     * Sets the source data for suggestions.
     * @param {string[]} data - An array of strings.
     */
    setSourceData(data) {
        this.source = Array.isArray(data) ? data : [];
    }

    /**
     * Registers a callback function to be called when a suggestion is selected.
     * @param {Function} callback - The function to call (receives the selected value).
     */
    onSelect(callback) {
        if (typeof callback === 'function') {
            this.onSelectCallback = callback;
        }
    }

    _bindEvents() {
        this.input.addEventListener('input', this._handleInput.bind(this));
        this.input.addEventListener('keydown', this._handleKeyDown.bind(this));
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== this.input && e.target !== this.container && !this.container.contains(e.target)) {
                this._hideSuggestions();
            }
        });
    }

    _handleInput() {
        const value = this.input.value.toLowerCase().trim();
        this.currentFocus = -1; // Reset focus on input change

        if (value.length < 1) { // Show suggestions even on 1 char input
            this._hideSuggestions();
            return;
        }

        const matches = this.source.filter(item =>
            item.toLowerCase().includes(value)
        );

        this._renderSuggestions(matches);
    }

    _handleKeyDown(e) {
        const suggestions = this.container.getElementsByClassName('autocomplete-suggestion');
        if (!suggestions.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault(); // Prevent cursor move
            this.currentFocus++;
            this._setActiveSuggestion(suggestions);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); // Prevent cursor move
            this.currentFocus--;
            this._setActiveSuggestion(suggestions);
        } else if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (this.currentFocus > -1) {
                // Simulate click on the focused item
                suggestions[this.currentFocus]?.click();
            } else {
                // If no suggestion focused, potentially add input value directly
                const inputValue = this.input.value.trim();
                 if (inputValue && this.onSelectCallback) {
                     // Allow adding custom value if Enter is pressed and no suggestion is selected
                     this.onSelectCallback(inputValue);
                     this.input.value = ''; // Clear input after adding
                     this._hideSuggestions();
                 }
            }
             this.currentFocus = -1; // Reset focus
        } else if (e.key === 'Escape') {
            this._hideSuggestions();
             this.currentFocus = -1; // Reset focus
        }
    }

    _setActiveSuggestion(suggestions) {
        if (!suggestions || suggestions.length === 0) return;

        // Remove 'selected' class from all suggestions
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].classList.remove('selected');
        }

        // Cycle through suggestions
        if (this.currentFocus >= suggestions.length) this.currentFocus = 0;
        if (this.currentFocus < 0) this.currentFocus = (suggestions.length - 1);

        // Add 'selected' class to the current focus
        suggestions[this.currentFocus].classList.add('selected');

        // Scroll into view if necessary
        suggestions[this.currentFocus].scrollIntoView({ block: 'nearest' });
    }


    _renderSuggestions(matches) {
        this.container.innerHTML = ''; // Clear previous suggestions

        if (matches.length === 0) {
            this._hideSuggestions();
            return;
        }

        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'autocomplete-suggestion';
            div.textContent = match;
            div.addEventListener('click', () => {
                this.input.value = ''; // Clear input
                this._hideSuggestions();
                if (this.onSelectCallback) {
                    this.onSelectCallback(match); // Pass selected value to callback
                }
            });
            this.container.appendChild(div);
        });

        this.container.style.display = 'block'; // Show suggestions container
    }

    _hideSuggestions() {
        this.container.innerHTML = '';
        this.container.style.display = 'none';
    }
}
