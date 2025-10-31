class TeaSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Initialize tea list
        this._teas = [];
        
        // Create styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                font-family: system-ui, -apple-system, sans-serif;
            }
            
            .sidebar {
                background-color: #f9f9f9;
                border-radius: 5px;
                border: 1px solid #ddd;
                padding: 15px;
            }
            
            h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #333;
                font-size: 16px;
            }
            
            .filter-input {
                width: 100%;
                padding: 8px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }
            
            .tea-list {
                list-style: none;
                padding: 0;
                margin: 0;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .tea-item {
                padding: 8px 10px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .tea-item:hover {
                background-color: #f0f0f0;
            }
            
            .tea-item.selected {
                background-color: #e6f7ff;
                border-left: 3px solid #1890ff;
            }
            
            .tea-type {
                font-size: 12px;
                color: #666;
                margin-top: 3px;
            }
            
            .no-results {
                padding: 10px;
                color: #666;
                font-style: italic;
                text-align: center;
            }
        `;
        
        // Create the DOM structure
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="sidebar">
                <h3>Tea Selection</h3>
                <input type="text" class="filter-input" placeholder="Search teas...">
                <ul class="tea-list"></ul>
            </div>
        `;
        
        // Attach to shadow DOM
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
        
        // Store references to elements
        this.teaListElement = this.shadowRoot.querySelector('.tea-list');
        this.filterInput = this.shadowRoot.querySelector('.filter-input');
        
        // Set up event listeners
        this.filterInput.addEventListener('input', () => {
            this.filterTeas(this.filterInput.value);
        });
    }
    
    connectedCallback() {
        this.render();
    }
    
    get teas() {
        return this._teas;
    }
    
    set teas(value) {
        if (Array.isArray(value)) {
            this._teas = value;
            if (this.isConnected) {
                this.render();
            }
        }
    }
    
    render() {
        // Clear the list
        this.teaListElement.innerHTML = '';
        
        // Get filter value
        const filterValue = this.filterInput ? this.filterInput.value.toLowerCase() : '';
        
        // Filter and sort teas
        const filteredTeas = this._teas
            .filter(tea => {
                if (!filterValue) return true;
                return (
                    (tea.name && tea.name.toLowerCase().includes(filterValue)) ||
                    (tea.type && tea.type.toLowerCase().includes(filterValue)) ||
                    (tea.origin && tea.origin.toLowerCase().includes(filterValue))
                );
            })
            .sort((a, b) => a.name.localeCompare(b.name));
        
        // Show message if no results
        if (filteredTeas.length === 0) {
            const noResults = document.createElement('li');
            noResults.className = 'no-results';
            noResults.textContent = 'No teas found';
            this.teaListElement.appendChild(noResults);
            return;
        }
        
        // Create list items
        filteredTeas.forEach(tea => {
            const listItem = document.createElement('li');
            listItem.className = 'tea-item';
            listItem.innerHTML = `
                <div>${tea.name}</div>
                <div class="tea-type">${tea.type} - ${tea.origin || 'Unknown'}</div>
            `;
            
            // Add click handler
            listItem.addEventListener('click', () => {
                // Dispatch custom event with selected tea
                const event = new CustomEvent('tea-selected', {
                    bubbles: true,
                    composed: true,
                    detail: { tea }
                });
                this.dispatchEvent(event);
                
                // Update selected state
                this.shadowRoot.querySelectorAll('.tea-item').forEach(item => {
                    item.classList.remove('selected');
                });
                listItem.classList.add('selected');
            });
            
            this.teaListElement.appendChild(listItem);
        });
    }
    
    filterTeas(searchTerm) {
                this.render();
    }
}

// Register the custom element
customElements.define('tea-sidebar', TeaSidebar);

export default TeaSidebar; 