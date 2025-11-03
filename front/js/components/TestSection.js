class TestSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Create styles
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                margin-bottom: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                overflow: hidden;
            }
            
            .section-header {
                background-color: #f5f5f5;
                padding: 10px 15px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .section-title {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
            }
            
            .section-calculator {
                font-size: 14px;
                color: #666;
                margin: 0;
            }
            
            .section-data-flow {
                font-size: 12px;
                color: #888;
                margin-top: 5px;
            }
            
            .section-content {
                padding: 0;
                overflow: hidden;
            }
            
            .section-tabs {
                display: flex;
                border-bottom: 1px solid #ddd;
                background-color: #f9f9f9;
            }
            
            .tab {
                padding: 8px 15px;
                cursor: pointer;
                background-color: transparent;
                border: none;
                border-right: 1px solid #ddd;
                font-size: 14px;
            }
            
            .tab.active {
                background-color: #fff;
                border-bottom: 2px solid #4CAF50;
            }
            
            .tab-content {
                display: none;
                padding: 15px;
                overflow: auto;
                max-height: 500px;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .inference {
                // font-family: system-ui, -apple-system, sans-serif;
                  font-family: monospace;
                  line-height: 1.4;
            }
            
            .raw-output {
                font-family: monospace;
                white-space: pre-wrap;
                font-size: 12px;
                line-height: 1.4;
                background-color: #f8f8f8;
                padding: 10px;
                border-radius: 4px;
            }
            
            /* Markdown Styling */
            h1 {
                font-size: 24px;
                margin-top: 0;
            }
            
            h2 {
                font-size: 20px;
                margin-top: 15px;
                border-bottom: 1px solid #eee;
                padding-bottom: 5px;
            }
            
            h3 {
                font-size: 16px;
                margin-top: 15px;
            }
            
            p {
                margin: 10px 0;
            }
            
            ul, ol {
                padding-left: 20px;
            }
            
            code {
                background-color: #f0f0f0;
                padding: 2px 4px;
                border-radius: 3px;
                font-family: monospace;
            }
            
            pre {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 3px;
                overflow-x: auto;
            }
            
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
            }
            
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            
            th {
                background-color: #f2f2f2;
            }
            
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
        `;
        
        // Create the DOM structure
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="section-header">
                <div>
                    <h3 class="section-title"></h3>
                    <p class="section-calculator"></p>
                    <p class="section-data-flow"></p>
                </div>
            </div>
            <div class="section-content">
                <div class="section-tabs">
                    <button class="tab inference-tab active">Inference</button>
                    <button class="tab raw-tab">Raw Output</button>
                </div>
                <div class="tab-content inference-content active">
                    <div class="inference"></div>
                </div>
                <div class="tab-content raw-content">
                    <pre class="raw-output"></pre>
                </div>
            </div>
        `;
        
        // Attach to shadow DOM
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
        
        // Store references to elements
        this.titleElement = this.shadowRoot.querySelector('.section-title');
        this.calculatorElement = this.shadowRoot.querySelector('.section-calculator');
        this.dataFlowElement = this.shadowRoot.querySelector('.section-data-flow');
        this.inferenceElement = this.shadowRoot.querySelector('.inference');
        this.rawOutputElement = this.shadowRoot.querySelector('.raw-output');
        
        // Set up tab switching
        const tabs = this.shadowRoot.querySelectorAll('.tab');
        const tabContents = this.shadowRoot.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Activate the clicked tab and corresponding content
                tab.classList.add('active');
                
                if (tab.classList.contains('inference-tab')) {
                    this.shadowRoot.querySelector('.inference-content').classList.add('active');
                } else if (tab.classList.contains('raw-tab')) {
                    this.shadowRoot.querySelector('.raw-content').classList.add('active');
                }
            });
        });
    }
    
    // When component is connected to DOM
    connectedCallback() {
        this.render();
    }
    
    // Re-render when attributes change
    attributeChangedCallback() {
        this.render();
    }
    
    // Observed attributes
    static get observedAttributes() {
        return ['title', 'calculator', 'data-flow', 'inference', 'raw-output'];
    }
    
    // Getters and setters for properties
    get title() {
        return this.getAttribute('title') || '';
    }
    
    set title(value) {
        this.setAttribute('title', value || '');
    }
    
    get calculator() {
        return this.getAttribute('calculator') || '';
    }
    
    set calculator(value) {
        this.setAttribute('calculator', value || '');
    }
    
    get dataFlow() {
        return this.getAttribute('data-flow') || '';
    }
    
    set dataFlow(value) {
        this.setAttribute('data-flow', value || '');
    }
    
    get inference() {
        return this.getAttribute('inference') || '';
    }
    
    set inference(value) {
        this.setAttribute('inference', value || '');
    }
    
    get rawOutput() {
        return this.getAttribute('raw-output') || '';
    }
    
    set rawOutput(value) {
        this.setAttribute('raw-output', value || '');
    }
    
    // Render the component
    render() {
        // Update title and metadata
        this.titleElement.textContent = this.title;
        this.calculatorElement.textContent = `Calculator: ${this.calculator}`;
        this.dataFlowElement.textContent = this.dataFlow;
        
        // Parse and render markdown for inference
        this.renderMarkdown(this.inference);
        
        // Set raw output
        if (this.rawOutputElement) {
            console.log(`[TestSection ${this.id}] render() trying to set rawOutputElement.textContent. Value of this.rawOutput:`, this.rawOutput.substring(0, 100) + '...'); // Add/check this log
            this.rawOutputElement.textContent = this.rawOutput;
       } else {
            console.warn(`[TestSection ${this.id}] render() called but rawOutputElement not found.`);
            // Try finding it again
            const rawOutputElem = this.shadowRoot.querySelector('.raw-output');
            if (rawOutputElem) {
               this.rawOutputElement = rawOutputElem;
               console.log(`[TestSection ${this.id}] render() found rawOutputElement late, setting textContent now. Value:`, this.rawOutput.substring(0, 100) + '...'); // Add/check this log
               rawOutputElem.textContent = this.rawOutput;
            }
       }
//    }
    }
    
    // Simple markdown parsing for the inference content
    renderMarkdown(markdown) {
        if (!markdown) {
            this.inferenceElement.innerHTML = '';
            return;
        }
        
        // Convert markdown to HTML (simple version)
        let html = markdown
            // Headers
            // .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            // .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            // .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            
            // Bold
            // .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            
            // Italic
            // .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Line breaks
            .replace(/\n/g, '<br>');
        
        this.inferenceElement.innerHTML = html;
    }
}

// Register the custom element
customElements.define('test-section', TestSection);

export default TestSection; 