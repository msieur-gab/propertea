
// js/utils/clipboard.js

/**
 * Copies the given text to the clipboard.
 * Uses the modern Clipboard API with fallback to the legacy execCommand.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves on success or rejects on failure.
 */
export function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern Clipboard API (preferred, requires HTTPS or localhost)
            navigator.clipboard.writeText(text)
                .then(resolve)
                .catch(err => {
                    console.error('Clipboard API failed:', err);
                    // Attempt fallback if Clipboard API fails
                    legacyCopyToClipboard(text).then(resolve).catch(reject);
                });
        } else {
            // Use legacy method if Clipboard API is not available
            console.warn('Clipboard API not available, using legacy method.');
            legacyCopyToClipboard(text).then(resolve).catch(reject);
        }
    });
}

/**
 * Legacy method for copying text to the clipboard using execCommand.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves on success or rejects on failure.
 */
function legacyCopyToClipboard(text) {
    return new Promise((resolve, reject) => {
        let textArea = null;
        try {
            textArea = document.createElement('textarea');
            textArea.value = text;
            // Make the textarea out of viewport
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, textArea.value.length); // Ensure selection for mobile

            const successful = document.execCommand('copy');

            if (successful) {
                resolve();
            } else {
                console.error('Legacy copy command failed.');
                reject(new Error('Copy command failed'));
            }
        } catch (err) {
            console.error('Error during legacy copy:', err);
            reject(err);
        } finally {
            if (textArea) {
                document.body.removeChild(textArea);
            }
        }
    });
}
