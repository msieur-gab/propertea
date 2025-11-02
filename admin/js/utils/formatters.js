
// js/utils/formatters.js

/**
 * Formats a kebab-case or snake_case string into Title Case.
 * Example: 'pan-fired' -> 'Pan Fired', 'nutty_and_toasty' -> 'Nutty And Toasty'
 * @param {string} str - The input string.
 * @returns {string} The formatted string.
 */
export function formatToTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .split(/[-_]/) // Split by hyphen or underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Formats a date object or ISO string into a locale-specific date string.
 * @param {Date|string} dateInput - The date object or ISO string.
 * @returns {string} Formatted date string (e.g., "4/17/2025") or empty string if invalid.
 */
export function formatLocalDate(dateInput) {
    if (!dateInput) return '';
    try {
        const date = new Date(dateInput);
        // Check if date is valid before formatting
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toLocaleDateString(undefined, { // Use browser's default locale
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return '';
    }
}
