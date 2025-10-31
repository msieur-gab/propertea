
// js/modules/recordListUI.js
import { formatToTitleCase, formatLocalDate } from '../utils/formatters.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { recordHandler } from './recordHandler.js'; // To format record for display

export class RecordListUI {
    constructor(listElementId, modalElementId) {
        this.listElement = document.getElementById(listElementId);
        this.modalOverlay = document.getElementById(modalElementId); // The overlay div
        this.modalContent = this.modalOverlay?.querySelector('.record-modal-content'); // The content div
        this.records = []; // Local cache of records for modal display

        if (!this.listElement) {
            console.error(`Record list element with ID "${listElementId}" not found.`);
        }
         if (!this.modalOverlay || !this.modalContent) {
            console.error(`Modal overlay or content element with ID "${modalElementId}" not found.`);
        }

        this._bindEvents();
    }

    _bindEvents() {
        if (this.listElement) {
            this.listElement.addEventListener('click', this._handleListClick.bind(this));
        }
        if (this.modalOverlay) {
             // Close modal via button or clicking outside content
             this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay || e.target.classList.contains('close-modal')) {
                    this.hideModal();
                }
             });
        }
         // Optional: Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay?.classList.contains('visible')) {
                this.hideModal();
            }
        });
    }

    _handleListClick(event) {
        const button = event.target.closest('button');
        if (!button) return;

        const recordItem = button.closest('.record-item');
        const recordId = recordItem?.dataset.recordId;

        if (!recordId) return;

        if (button.classList.contains('view-button')) {
            this.viewRecord(recordId);
        } else if (button.classList.contains('delete-button')) {
            // Confirmation is handled in the app logic before calling delete
             this.onDeleteCallback && this.onDeleteCallback(recordId);
        }
    }

    // --- Public Methods ---

    /**
     * Sets the callback function to be executed when the delete button is clicked.
     * @param {Function} callback - The callback function (receives recordId).
     */
    onDelete(callback) {
        if (typeof callback === 'function') {
            this.onDeleteCallback = callback;
        }
    }

    /**
     * Renders the list of saved tea records.
     * @param {Array<Object>} records - An array of tea record objects.
     */
    render(records) {
        this.records = records || []; // Update local cache
        if (!this.listElement) return;

        this.listElement.innerHTML = ''; // Clear previous list

        if (this.records.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tea records yet. Add one using the form!';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#777';
            this.listElement.appendChild(emptyMessage);
            return;
        }

        this.records.forEach(record => {
            const item = this._createRecordListItem(record);
            this.listElement.appendChild(item);
        });
    }

     /**
     * Displays the details of a specific record in the modal.
     * @param {string} recordId - The ID of the record to view.
     */
    viewRecord(recordId) {
        const record = this.records.find(rec => rec.id === recordId);
        if (!record) {
            console.error(`Record with ID ${recordId} not found.`);
            alert('Could not find the record to view.');
            return;
        }

        this._populateModal(record);
        this.showModal();
    }

    showModal() {
         if (this.modalOverlay) {
             this.modalOverlay.classList.add('visible');
             // Focus the close button for accessibility
             this.modalOverlay.querySelector('.close-modal')?.focus();
         }
    }

    hideModal() {
         if (this.modalOverlay) {
             this.modalOverlay.classList.remove('visible');
         }
    }


    // --- Private Helper Methods ---

    _createRecordListItem(record) {
        const li = document.createElement('li');
        li.className = 'record-item';
        li.dataset.recordId = record.id; // Store ID for event handling

        const infoDiv = document.createElement('div');
        infoDiv.className = 'record-info';

        const nameH3 = document.createElement('h3');
        nameH3.textContent = record.name || 'Unnamed Tea';

        const typeP = document.createElement('p');
        typeP.textContent = record.type ? `Type: ${formatToTitleCase(record.type)} Tea` : 'Type: Unknown';

        infoDiv.appendChild(nameH3);
        infoDiv.appendChild(typeP);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'record-actions';

        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.className = 'view-button'; // Add class for easier selection

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button'; // Add class
        deleteButton.style.backgroundColor = 'var(--error-color)'; // Style delete button
        deleteButton.style.marginLeft = '10px';


        actionsDiv.appendChild(viewButton);
        actionsDiv.appendChild(deleteButton);

        li.appendChild(infoDiv);
        li.appendChild(actionsDiv);

        return li;
    }

     _populateModal(record) {
        if (!this.modalContent || !record) return;

        const displayData = recordHandler.formatRecordForDisplay(record);

        const findEl = (selector) => this.modalContent.querySelector(selector);

        // --- Populate Modal Elements ---
        const nameEl = findEl('#modalTeaName');
        if (nameEl) {
            nameEl.textContent = displayData.name;
            if (displayData.originalName) {
                const originalSpan = document.createElement('span');
                originalSpan.className = 'original-name';
                originalSpan.textContent = `(${displayData.originalName})`;
                nameEl.appendChild(originalSpan);
            }
        }

        const typeEl = findEl('#modalTeaType');
        if (typeEl) typeEl.innerHTML = `<strong>Type:</strong> ${displayData.typeName}`;

        // Geography Section
        const originInfoEl = findEl('#modalOriginInfo');
        if (originInfoEl) {
            originInfoEl.innerHTML = `
                <p><strong>Location:</strong> ${displayData.originString}</p>
                <p><strong>Coordinates:</strong> ${displayData.coordinates}
                    ${(displayData.coordinates !== 'N/A' && record.geography?.latitude && record.geography?.longitude) ?
                        ` <button class="map-view-button" data-lat="${record.geography.latitude}" data-lon="${record.geography.longitude}">View on Map</button>` : ''}
                </p>
                <p><strong>Altitude:</strong> ${displayData.altitude}</p>
                <p><strong>Avg. Temp:</strong> ${displayData.temperature}</p>
                <p><strong>Avg. Humidity:</strong> ${displayData.humidity}</p>
                <p><strong>Avg. Solar Radiation:</strong> ${displayData.solarRadiation}</p>
            `;
             // Add event listener for the map button within the modal
            const mapButton = originInfoEl.querySelector('.map-view-button');
            if (mapButton) {
                mapButton.addEventListener('click', (e) => {
                    const lat = e.target.dataset.lat;
                    const lon = e.target.dataset.lon;
                    if (lat && lon) {
                        // Use a standard mapping service URL
                        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
                    }
                });
            }
        }


        // Processing Methods Section
        const processingEl = findEl('#modalProcessingMethods');
        if (processingEl) {
            processingEl.innerHTML = ''; // Clear previous
            if (displayData.processingMethods.length > 0) {
                displayData.processingMethods.forEach(method => {
                    const li = document.createElement('li');
                    li.textContent = method;
                    processingEl.appendChild(li);
                });
            } else {
                processingEl.innerHTML = '<li>No processing methods specified.</li>';
            }
        }

        // Flavor Profiles Section
        const flavorEl = findEl('#modalFlavorProfiles');
        if (flavorEl) {
            flavorEl.innerHTML = ''; // Clear previous
            if (displayData.flavorProfile.length > 0) {
                displayData.flavorProfile.forEach(flavor => {
                    const li = document.createElement('li');
                    li.textContent = flavor;
                    flavorEl.appendChild(li);
                });
            } else {
                flavorEl.innerHTML = '<li>No flavor profiles specified.</li>';
            }
        }

        // Other levels Section (Example)
        const levelsEl = findEl('#modalCompoundLevels'); // Assuming an element with this ID exists
         if (levelsEl) {
            levelsEl.innerHTML = `
                <p><strong>Caffeine Level:</strong> ${displayData.caffeineLevel}</p>
                <p><strong>L-Theanine Level:</strong> ${displayData.lTheanineLevel}</p>
            `;
        }


        // Date Added Section
        const dateEl = findEl('#modalDate');
        if (dateEl) dateEl.textContent = `Record Added: ${displayData.dateAdded}`;

        // Copy JSON Button
        const copyButton = findEl('#copyJsonButton');
        if (copyButton) {
            // Remove previous listener to avoid duplicates
            const newCopyButton = copyButton.cloneNode(true);
            copyButton.parentNode.replaceChild(newCopyButton, copyButton);

            newCopyButton.textContent = 'Copy JSON'; // Reset text/state
            newCopyButton.classList.remove('copied');

            newCopyButton.addEventListener('click', () => {
                const jsonString = JSON.stringify(displayData.rawRecord, null, 2);
                copyToClipboard(jsonString)
                    .then(() => {
                        newCopyButton.textContent = 'JSON Copied!';
                        newCopyButton.classList.add('copied');
                        setTimeout(() => {
                            newCopyButton.textContent = 'Copy JSON';
                            newCopyButton.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy JSON:', err);
                        alert('Failed to copy JSON to clipboard. Please check console.');
                    });
            });
        }
    }
}
