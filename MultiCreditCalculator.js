/**
 * Multi-Credit Tax Calculator
 * Modular system for calculating multiple stackable tax credits
 */

import creditConfigs from './credit_configs.json';

class BaseCalculator {
  constructor(creditType) {
    this.config = creditConfigs.credits[creditType];
    this.enabled = this.config?.enabled || false;
  }

  isEnabled() {
    return this.enabled;
  }

  roundToNearestHundred(amount) {
    return Math.round(amount / 100) * 100;
  }
}

class WOTCCalculator extends BaseCalculator {
  constructor() {
    super('wotc');
  }

  calculate(userInputs) {
    if (!this.isEnabled()) return { credit: 0, details: [] };

    const { totalHires, selectedCategories } = userInputs;
    
    if (!totalHires || !selectedCategories?.length) {
      return { credit: 0, details: [] };
    }

    // Find highest qualification rate among selected categories
    let highestRate = 0;
    let selectedCategory = null;

    selectedCategories.forEach(category => {
      const categoryConfig = this.config.categories[category];
      if (categoryConfig && categoryConfig.qualificationRate > highestRate) {
        highestRate = categoryConfig.qualificationRate;
        selectedCategory = category;
      }
    });

    if (!selectedCategory) {
      return { credit: 0, details: [] };
    }

    const categoryConfig = this.config.categories[selectedCategory];
    const qualifiedHires = Math.round(totalHires * highestRate);
    const totalCredit = qualifiedHires * categoryConfig.creditAmount;

    return {
      credit: this.roundToNearestHundred(totalCredit),
      details: [{
        category: categoryConfig.label,
        qualifiedHires,
        creditPerHire: categoryConfig.creditAmount,
        totalCredit: this.roundToNearestHundred(totalCredit)
      }],
      type: 'wotc'
    };
  }
}

class RDPayrollCalculator extends BaseCalculator {
  constructor() {
    super('rd_payroll');
  }

  calculate(userInputs) {
    if (!this.isEnabled()) return { credit: 0, details: [] };

    const { rdSpending, estimatedPayrollTaxes } = userInputs;
    
    if (!rdSpending || rdSpending < this.config.minimumSpending) {
      return { credit: 0, details: [] };
    }

    // Determine spending tier
    let tier = 'small';
    for (const [tierName, tierConfig] of Object.entries(this.config.spendingTiers)) {
      if (rdSpending >= tierConfig.range[0] && rdSpending <= tierConfig.range[1]) {
        tier = tierName;
        break;
      }
    }

    const tierConfig = this.config.spendingTiers[tier];
    const baseCredit = Math.min(rdSpending * this.config.creditRate, this.config.maxAnnualCredit);
    const payrollOffset = Math.min(baseCredit, estimatedPayrollTaxes || baseCredit);
    const conservativeCredit = payrollOffset * tierConfig.qualificationRate;

    return {
      credit: this.roundToNearestHundred(conservativeCredit),
      details: [{
        rdSpending,
        baseCredit: this.roundToNearestHundred(baseCredit),
        qualificationRate: tierConfig.qualificationRate,
        finalCredit: this.roundToNearestHundred(conservativeCredit)
      }],
      type: 'rd_payroll'
    };
  }
}

class EmpowermentZoneCalculator extends BaseCalculator {
  constructor() {
    super('empowerment_zone');
  }

  calculate(userInputs) {
    if (!this.isEnabled()) return { credit: 0, details: [] };

    const { totalHires, businessZipCode, selectedCategories } = userInputs;
    
    // Check if business is in empowerment zone
    const isInEmpowermentZone = this.isBusinessInEmpowermentZone(businessZipCode);
    const hasEmpowermentZoneHires = selectedCategories?.includes('empowerment_zone');
    
    if (!isInEmpowermentZone || !hasEmpowermentZoneHires || !totalHires) {
      return { credit: 0, details: [] };
    }

    const qualifiedEmployees = Math.round(totalHires * this.config.qualificationRate);
    const totalCredit = qualifiedEmployees * this.config.maxCreditPerEmployee;

    return {
      credit: this.roundToNearestHundred(totalCredit),
      details: [{
        qualifiedEmployees,
        creditPerEmployee: this.config.maxCreditPerEmployee,
        totalCredit: this.roundToNearestHundred(totalCredit),
        zone: this.getZoneByZipCode(businessZipCode)
      }],
      type: 'empowerment_zone'
    };
  }

  isBusinessInEmpowermentZone(zipCode) {
    if (!zipCode) return false;
    
    for (const [zone, zipCodes] of Object.entries(this.config.zipCodes)) {
      if (zipCodes.includes(zipCode)) {
        return true;
      }
    }
    return false;
  }

  getZoneByZipCode(zipCode) {
    for (const [zone, zipCodes] of Object.entries(this.config.zipCodes)) {
      if (zipCodes.includes(zipCode)) {
        return zone;
      }
    }
    return null;
  }
}

class StateCreditCalculator extends BaseCalculator {
  constructor() {
    super('state_credits');
  }

  calculate(userInputs) {
    if (!this.isEnabled()) return { credit: 0, details: [] };

    const { totalHires, businessState, selectedCategories } = userInputs;
    
    const stateConfig = this.config.states[businessState];
    if (!stateConfig?.enabled || !totalHires) {
      return { credit: 0, details: [] };
    }

    // Check if user selected state-specific categories
    const hasStateEligibleHires = selectedCategories?.some(category => 
      stateConfig.categories.includes(category) || category === 'state_specific'
    );

    if (!hasStateEligibleHires) {
      return { credit: 0, details: [] };
    }

    const qualifiedHires = Math.round(totalHires * stateConfig.qualificationRate);
    const totalCredit = qualifiedHires * stateConfig.maxCredit;

    return {
      credit: this.roundToNearestHundred(totalCredit),
      details: [{
        state: businessState,
        programName: stateConfig.name,
        qualifiedHires,
        creditPerHire: stateConfig.maxCredit,
        totalCredit: this.roundToNearestHundred(totalCredit)
      }],
      type: 'state_credits'
    };
  }
}

class PaidLeaveCalculator extends BaseCalculator {
  constructor() {
    super('paid_leave');
  }

  calculate(userInputs) {
    if (!this.isEnabled()) return { credit: 0, details: [] };

    const { totalHires, businessState, offersPaidLeave } = userInputs;
    
    if (!offersPaidLeave || !totalHires || !this.config.statesEligible.includes(businessState)) {
      return { credit: 0, details: [] };
    }

    const qualifiedEmployees = Math.round(totalHires * this.config.qualificationRate);
    const baseCredit = qualifiedEmployees * this.config.averageCreditPerEmployee;
    const finalCredit = Math.min(baseCredit, this.config.maxAnnualCredit);
    
    return {
      credit: this.roundToNearestHundred(finalCredit),
      details: [{
        category: 'Paid Family/Medical Leave',
        qualifiedEmployees,
        creditPerEmployee: this.config.averageCreditPerEmployee,
        calculation: `${qualifiedEmployees} employees × $${this.config.averageCreditPerEmployee}`
      }],
      type: 'paid_leave'
    };
  }
}

class ChildcareSupportCalculator extends BaseCalculator {
  constructor() {
    super('childcare_support');
  }

  calculate(userInputs) {
    if (!this.isEnabled()) return { credit: 0, details: [] };

    const { totalHires, providesChildcareSupport } = userInputs;
    
    if (!providesChildcareSupport || !totalHires) {
      return { credit: 0, details: [] };
    }

    const qualifiedEmployees = Math.round(totalHires * this.config.qualificationRate);
    const baseCredit = Math.min(this.config.averageCredit, this.config.maxAnnualCredit);
    
    return {
      credit: this.roundToNearestHundred(baseCredit),
      details: [{
        category: 'Childcare Support',
        qualifiedEmployees,
        averageCredit: this.config.averageCredit,
        calculation: `Base credit for childcare support program`
      }],
      type: 'childcare_support'
    };
  }
}

class MultiCreditCalculator {
  constructor() {
    this.calculators = {
      wotc: new WOTCCalculator(),
      rd_payroll: new RDPayrollCalculator(),
      empowerment_zone: new EmpowermentZoneCalculator(),
      state_credits: new StateCreditCalculator(),
      paid_leave: new PaidLeaveCalculator(),
      childcare_support: new ChildcareSupportCalculator()
    };
    this.stackingRules = creditConfigs.stackingRules;
  }

  calculateAll(userInputs) {
    // Calculate individual credits
    const results = {};
    for (const [type, calculator] of Object.entries(this.calculators)) {
      results[type] = calculator.calculate(userInputs);
    }

    // Apply stacking rules
    const stackedResults = this.applyStackingRules(results);
    
    return {
      individualCredits: results,
      stackedCredits: stackedResults,
      totalCredit: this.calculateTotalCredit(stackedResults),
      breakdown: this.generateBreakdown(stackedResults)
    };
  }

  applyStackingRules(results) {
    const stacked = { ...results };

    // WOTC and Empowerment Zone are mutually exclusive per employee
    if (results.wotc.credit > 0 && results.empowerment_zone.credit > 0) {
      // Keep the higher credit
      if (results.wotc.credit >= results.empowerment_zone.credit) {
        stacked.empowerment_zone = { credit: 0, details: [], type: 'empowerment_zone' };
      } else {
        stacked.wotc = { credit: 0, details: [], type: 'wotc' };
      }
    }

    // All other combinations can stack
    return stacked;
  }

  calculateTotalCredit(stackedResults) {
    return Object.values(stackedResults)
      .reduce((total, result) => total + result.credit, 0);
  }

  generateBreakdown(stackedResults) {
    const breakdown = [];
    
    for (const [type, result] of Object.entries(stackedResults)) {
      if (result.credit > 0) {
        const config = creditConfigs.credits[type];
        breakdown.push({
          type,
          name: config.name,
          credit: result.credit,
          details: result.details
        });
      }
    }

    return breakdown.sort((a, b) => b.credit - a.credit);
  }

  // Utility method to estimate payroll taxes based on hires
  estimatePayrollTaxes(totalHires, averageWage = 45000) {
    const totalWages = totalHires * averageWage;
    const socialSecurityTax = totalWages * 0.062; // 6.2%
    const medicareTax = totalWages * 0.0145; // 1.45%
    const fuiTax = totalWages * 0.006; // 0.6% on first $7,000
    
    return socialSecurityTax + medicareTax + fuiTax;
  }

  // Validation helper
  validateInputs(userInputs) {
    const errors = [];
    
    if (!userInputs.totalHires || userInputs.totalHires < 1) {
      errors.push('Total hires must be at least 1');
    }
    
    if (userInputs.rdSpending && userInputs.rdSpending < 0) {
      errors.push('R&D spending cannot be negative');
    }
    
    return errors;
  }
}

// Export for use in applications
export { MultiCreditCalculator, WOTCCalculator, RDPayrollCalculator, EmpowermentZoneCalculator, StateCreditCalculator, PaidLeaveCalculator, ChildcareSupportCalculator };
export default MultiCreditCalculator;