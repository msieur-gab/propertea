/**
 * CalculatorResult - Standardized output for all calculators
 *
 * Purpose: Consistent response format
 * Used by: All calculators
 * Returned to: TeaRecommendationAPI
 */
export class CalculatorResult {
  constructor(calculatorName, data = {}) {
    this.calculator = calculatorName;
    this.success = true;
    this.data = data;                    // Calculator-specific output
    this.confidence = 0.5;               // 0-1, how certain we are
    this.reasoning = '';                 // Why this recommendation
    this.timestamp = new Date();
    this.version = '1.0';
  }

  // Set confidence level
  setConfidence(confidence) {
    this.confidence = Math.max(0, Math.min(1, confidence));
    return this;
  }

  // Set reasoning
  setReasoning(reasoning) {
    this.reasoning = reasoning;
    return this;
  }

  // Mark as failed
  fail(error) {
    this.success = false;
    this.error = error;
    this.data = null;
    return this;
  }

  // Fluent API
  toJSON() {
    return {
      calculator: this.calculator,
      success: this.success,
      data: this.data,
      confidence: this.confidence,
      reasoning: this.reasoning,
      error: this.error || undefined
    };
  }
}
