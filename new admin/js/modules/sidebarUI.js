// js/modules/sidebarUI.js

export class SidebarUI {
    constructor(sidebarId) {
        this.sidebar = document.getElementById(sidebarId);

        if (!this.sidebar) {
            console.error(`Sidebar element with ID "${sidebarId}" not found!`);
            return;
        }

        this.elements = this._cacheElements();
        this._bindEvents();
        this._initObserver(); // Initialize MutationObserver
        this._updateBodyClass(); // Set initial body class state
    }

    _cacheElements() {
        const getEl = (id) => document.getElementById(id); // Search document globally for these IDs
        return {
            toggleBtn: getEl('sidebarToggleBtn'), // The burger icon
            newTeaBtn: getEl('newTeaBtn'), // The "+ New Tea" button
            formContainer: getEl('sidebarFormContainer'), // The middle section holding the form
            // Add overlay if you are using it for mobile
            overlay: document.querySelector('.sidebar-overlay')
        };
    }

    _bindEvents() {
        // 1. Toggle Button (Burger Icon) - Toggles sidebar width
        this.elements.toggleBtn?.addEventListener('click', () => {
            this.toggleSidebarWidth();
        });

        // 2. New Tea Button - Expands sidebar (if needed) and shows form
        this.elements.newTeaBtn?.addEventListener('click', () => {
            this.showForm();
        });

        // 3. Optional: Close sidebar via overlay click on mobile
        this.elements.overlay?.addEventListener('click', () => {
            this.collapseSidebar();
        });
    }

    // Use MutationObserver to watch for class changes on the sidebar
    _initObserver() {
         if (!this.sidebar) return;
         const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this._updateBodyClass(); // Update body class whenever sidebar class changes
                }
            }
        });
        observer.observe(this.sidebar, { attributes: true });
    }

    // Update body class based on sidebar state (for mobile overflow/overlay)
     _updateBodyClass() {
        if (!this.sidebar) return;
        if (this.sidebar.classList.contains('sidebar-expanded') && window.innerWidth <= 768) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    }


    toggleSidebarWidth() {
        if (!this.sidebar) return;
        this.sidebar.classList.toggle('sidebar-expanded');
        this.sidebar.classList.toggle('sidebar-collapsed', !this.sidebar.classList.contains('sidebar-expanded'));

        // If collapsing, also ensure form is hidden
        if (!this.sidebar.classList.contains('sidebar-expanded')) {
            this.hideForm();
        }
        // No need to explicitly call _updateBodyClass here, MutationObserver handles it
    }

    expandSidebar() {
        if (!this.sidebar) return;
        this.sidebar.classList.add('sidebar-expanded');
        this.sidebar.classList.remove('sidebar-collapsed');
        // No need to explicitly call _updateBodyClass here, MutationObserver handles it
    }

    collapseSidebar() {
        if (!this.sidebar) return;
        this.sidebar.classList.remove('sidebar-expanded');
        this.sidebar.classList.add('sidebar-collapsed');
        this.hideForm(); // Also hide form when explicitly collapsing
        // No need to explicitly call _updateBodyClass here, MutationObserver handles it
    }

    showForm() {
        if (!this.sidebar) return;
        // Ensure sidebar is expanded first
        this.expandSidebar();
        // Add class to show the form container (CSS handles the display)
        this.sidebar.classList.add('form-active');

         // Optional: scroll the form container to the top
         if (this.elements.formContainer) {
            this.elements.formContainer.scrollTop = 0;
         }
    }

    hideForm() {
        if (!this.sidebar) return;
        this.sidebar.classList.remove('form-active');
    }
}