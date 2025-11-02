/**
 * teaTypeSelector.js
 *
 * Handles tea type selection in the form with both Western and Chinese names
 * Manages main types and subtypes (e.g., Puerh Sheng vs Puerh Shou)
 */

import { TEA_TYPES, getTeaTypeLabel, getSubtypes } from '../utils/teaTypeData.js';

export class TeaTypeSelector {
  constructor(formElementId = 'teaType', subtypeElementId = null) {
    this.typeSelect = document.getElementById(formElementId);
    this.subtypeSelect = subtypeElementId ? document.getElementById(subtypeElementId) : null;
    this.initialized = false;

    if (this.typeSelect) {
      this.init();
    }
  }

  /**
   * Initialize the tea type selector with options
   */
  init() {
    this.populateTypeOptions();
    this.attachEventListeners();
    this.initialized = true;
  }

  /**
   * Populate the tea type dropdown with all available types
   */
  populateTypeOptions() {
    if (!this.typeSelect) return;

    // Clear existing options
    this.typeSelect.innerHTML = '<option value="" selected disabled>Select tea type...</option>';

    // Add all tea types
    TEA_TYPES.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = `${type.western} (${type.chinese})`;
      option.title = type.description;
      this.typeSelect.appendChild(option);
    });
  }

  /**
   * Populate the subtype dropdown for a given tea type
   * @param {string} teaTypeId - The tea type ID (e.g., 'dark')
   */
  populateSubtypeOptions(teaTypeId) {
    if (!this.subtypeSelect) return;

    // Clear existing options
    this.subtypeSelect.innerHTML = '';

    const subtypes = getSubtypes(teaTypeId);

    if (subtypes && subtypes.length > 0) {
      // Add default option
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select subtype...';
      defaultOption.selected = true;
      defaultOption.disabled = true;
      this.subtypeSelect.appendChild(defaultOption);

      // Add subtypes
      subtypes.forEach(subtype => {
        const option = document.createElement('option');
        option.value = subtype.subtype;
        option.textContent = `${subtype.western} (${subtype.chinese})`;
        option.title = subtype.description;
        this.subtypeSelect.appendChild(option);
      });

      // Show subtype selector if there are subtypes
      this.subtypeSelect.parentElement.style.display = 'block';
    } else {
      // Hide subtype selector if no subtypes
      this.subtypeSelect.parentElement.style.display = 'none';
      this.subtypeSelect.value = '';
    }
  }

  /**
   * Attach event listeners to the type selector
   */
  attachEventListeners() {
    if (!this.typeSelect) return;

    this.typeSelect.addEventListener('change', (e) => {
      const teaTypeId = e.target.value;
      if (this.subtypeSelect) {
        this.populateSubtypeOptions(teaTypeId);
      }
    });
  }

  /**
   * Get selected tea type
   * @returns {string} The canonical tea type ID
   */
  getSelectedType() {
    return this.typeSelect ? this.typeSelect.value : null;
  }

  /**
   * Get selected subtype
   * @returns {string|null} The subtype ID or null
   */
  getSelectedSubtype() {
    if (!this.subtypeSelect) return null;
    const value = this.subtypeSelect.value;
    return value ? value : null;
  }

  /**
   * Get both type and subtype as a combined object
   * @returns {Object} { type: string, subtype: string|null }
   */
  getSelection() {
    return {
      type: this.getSelectedType(),
      subtype: this.getSelectedSubtype()
    };
  }

  /**
   * Set the selected tea type and subtype
   * @param {string} typeId - Tea type ID
   * @param {string} subtypeId - Optional subtype ID
   */
  setSelection(typeId, subtypeId = null) {
    if (this.typeSelect) {
      this.typeSelect.value = typeId;

      // Trigger change event to populate subtypes
      this.typeSelect.dispatchEvent(new Event('change'));

      // Set subtype if provided
      if (subtypeId && this.subtypeSelect) {
        setTimeout(() => {
          this.subtypeSelect.value = subtypeId;
        }, 0);
      }
    }
  }

  /**
   * Get display label for current selection
   * @returns {string} User-friendly label
   */
  getDisplayLabel() {
    const type = this.getSelectedType();
    const subtype = this.getSelectedSubtype();
    return getTeaTypeLabel(type, subtype);
  }

  /**
   * Clear the selection
   */
  clear() {
    if (this.typeSelect) this.typeSelect.value = '';
    if (this.subtypeSelect) {
      this.subtypeSelect.value = '';
      this.subtypeSelect.parentElement.style.display = 'none';
    }
  }

  /**
   * Get tea type information object
   * @param {string} typeId - Tea type ID
   * @returns {Object|null} Tea type object with all metadata
   */
  getTeaTypeInfo(typeId = null) {
    const id = typeId || this.getSelectedType();
    return TEA_TYPES.find(t => t.id === id) || null;
  }
}

// Auto-initialize if form exists
export function initTeaTypeSelector() {
  const typeSelect = document.getElementById('teaType');
  if (typeSelect) {
    return new TeaTypeSelector('teaType', 'teaSubtype');
  }
  return null;
}
