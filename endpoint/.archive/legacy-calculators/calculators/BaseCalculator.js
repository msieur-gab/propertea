/**
 * BaseCalculator - Abstract base for all calculators
 *
 * Provides:
 * - Standard calculate() method signature
 * - Helper methods for common operations
 * - Consistent error handling
 */
export class BaseCalculator {

  constructor(name) {
    this.name = name;
  }

  /**
   * Main calculation method (implement in subclass)
   * @param {TeaModel} teaModel - The tea being analyzed
   * @returns {CalculatorResult}
   */
  calculate(teaModel) {
    throw new Error(`${this.name}.calculate() not implemented`);
  }

  // Helper: safely get nested property
  getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    return current;
  }

  // Helper: normalize string to lowercase
  normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  // Helper: calculate similarity between strings (0-1)
  similarity(str1, str2) {
    const a = this.normalize(str1);
    const b = this.normalize(str2);

    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.8;

    // Levenshtein distance
    const matrix = Array(b.length + 1).fill(null)
      .map(() => Array(a.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = 1 + Math.min(
            matrix[j - 1][i],
            matrix[j][i - 1],
            matrix[j - 1][i - 1]
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    return 1 - (distance / Math.max(a.length, b.length));
  }
}
