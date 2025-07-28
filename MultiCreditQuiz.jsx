/**
 * Multi-Credit Tax Calculator Quiz Component
 * React component for the enhanced tax credit calculator
 */

import React, { useState, useEffect } from 'react';
import MultiCreditCalculator from './MultiCreditCalculator.js';

const MultiCreditQuiz = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userInputs, setUserInputs] = useState({
    totalHires: '',
    businessState: '',
    businessZipCode: '',
    rdSpending: 0,
    hasRDActivities: false,
    offersPaidLeave: false,
    providesChildcareSupport: false,
    selectedCategories: []
  });
  const [results, setResults] = useState(null);
  const [calculator] = useState(new MultiCreditCalculator());

  // State options for dropdown
  const states = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    // Add more states as needed
  ];

  // Dynamic categories based on business state and location
  const getAvailableCategories = () => {
    const baseCategories = [
      { id: 'veterans', label: 'Military Veterans', credit: '$5,600', type: 'wotc' },
      { id: 'snap', label: 'SNAP (food stamp) recipients', credit: '$2,400', type: 'wotc' },
      { id: 'long_term_unemployed', label: 'Long-Term Unemployed (27+ weeks)', credit: '$2,400', type: 'wotc' },
      { id: 'vocational_rehab', label: 'Vocational Rehab Referrals', credit: '$2,400', type: 'wotc' },
    ];

    // Add empowerment zone option if applicable
    if (isInEmpowermentZone(userInputs.businessZipCode)) {
      baseCategories.push({
        id: 'empowerment_zone',
        label: 'Residents of designated low-income areas',
        credit: '$3,000',
        type: 'empowerment_zone'
      });
    }

    // Add state-specific categories
    if (userInputs.businessState && ['CA', 'NY', 'TX'].includes(userInputs.businessState)) {
      const stateLabels = {
        'CA': 'California target groups (veterans, ex-offenders)',
        'NY': 'New York strategic industry workers',
        'TX': 'Texas enterprise zone local hires'
      };
      
      baseCategories.push({
        id: 'state_specific',
        label: stateLabels[userInputs.businessState],
        credit: getStateCreditAmount(userInputs.businessState),
        type: 'state_credits'
      });
    }

    baseCategories.push({
      id: 'not_sure',
      label: 'Not Sure',
      credit: '$1,200',
      type: 'wotc'
    });

    return baseCategories;
  };

  const isInEmpowermentZone = (zipCode) => {
    // Simplified check - in real implementation, use the config
    const ezZipCodes = ['30309', '21201', '60612', '44103', '48201', '10026', '19132'];
    return ezZipCodes.includes(zipCode);
  };

  const getStateCreditAmount = (state) => {
    const amounts = { 'CA': '$5,000', 'NY': '$3,000', 'TX': '$2,500' };
    return amounts[state] || '$2,000';
  };

  // Real-time calculation
  useEffect(() => {
    if (userInputs.totalHires && currentStep >= 3) {
      const inputs = {
        ...userInputs,
        totalHires: parseInt(userInputs.totalHires),
        estimatedPayrollTaxes: calculator.estimatePayrollTaxes(parseInt(userInputs.totalHires))
      };
      
      const calculationResults = calculator.calculateAll(inputs);
      setResults(calculationResults);
    }
  }, [userInputs, calculator, currentStep]);

  const handleInputChange = (field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    setUserInputs(prev => ({
      ...prev,
      selectedCategories: checked 
        ? [...prev.selectedCategories, categoryId]
        : prev.selectedCategories.filter(id => id !== categoryId)
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="multi-credit-calculator">
      <div className="calculator-header">
        <h1>Unlock $10,000+ in Combined Tax Credits</h1>
        <p>Discover all the payroll tax credits your business qualifies for</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="calculator-content">
        {/* Step 1: Total Hires */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>How many people have you hired in the last 12 months?</h2>
            <input
              type="number"
              value={userInputs.totalHires}
              onChange={(e) => handleInputChange('totalHires', e.target.value)}
              placeholder="Enter number of hires"
              min="1"
              className="hire-count-input"
            />
            <button 
              onClick={nextStep}
              disabled={!userInputs.totalHires}
              className="next-button"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Business Location & R&D */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Tell us about your business</h2>
            
            <div className="form-group">
              <label>What state is your business located in?</label>
              <select
                value={userInputs.businessState}
                onChange={(e) => handleInputChange('businessState', e.target.value)}
                className="state-select"
              >
                <option value="">Select your state</option>
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Business ZIP code (optional)</label>
              <input
                type="text"
                value={userInputs.businessZipCode}
                onChange={(e) => handleInputChange('businessZipCode', e.target.value)}
                placeholder="Enter ZIP code"
                maxLength="5"
                className="zip-input"
              />
            </div>

            <div className="form-group">
              <label>Did your business spend money on research & development in 2024?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="hasRD"
                    checked={userInputs.hasRDActivities === true}
                    onChange={() => handleInputChange('hasRDActivities', true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasRD"
                    checked={userInputs.hasRDActivities === false}
                    onChange={() => handleInputChange('hasRDActivities', false)}
                  />
                  No
                </label>
              </div>
            </div>

            {userInputs.hasRDActivities && (
              <div className="form-group">
                <label>Approximately how much did you spend on R&D?</label>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="1000"
                  value={userInputs.rdSpending}
                  onChange={(e) => handleInputChange('rdSpending', parseInt(e.target.value))}
                  className="rd-slider"
                />
                <div className="slider-value">
                  ${userInputs.rdSpending.toLocaleString()}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Do you offer paid family/medical leave?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paidLeave"
                    checked={userInputs.offersPaidLeave === true}
                    onChange={() => handleInputChange('offersPaidLeave', true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="paidLeave"
                    checked={userInputs.offersPaidLeave === false}
                    onChange={() => handleInputChange('offersPaidLeave', false)}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Do you provide childcare support for employees?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="childcareSupport"
                    checked={userInputs.providesChildcareSupport === true}
                    onChange={() => handleInputChange('providesChildcareSupport', true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="childcareSupport"
                    checked={userInputs.providesChildcareSupport === false}
                    onChange={() => handleInputChange('providesChildcareSupport', false)}
                  />
                  No
                </label>
              </div>
            </div>

            <div className="step-navigation">
              <button onClick={prevStep} className="prev-button">Back</button>
              <button onClick={nextStep} className="next-button">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Employee Categories */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Did you hire anyone from these groups in the last 12 months?</h2>
            <p className="step-subtitle">Select all that apply - each group qualifies for different tax credits</p>
            
            <div className="category-grid">
              {getAvailableCategories().map(category => (
                <div key={category.id} className={`category-card ${category.type}`}>
                  <label className="category-label">
                    <input
                      type="checkbox"
                      checked={userInputs.selectedCategories.includes(category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    />
                    <div className="category-content">
                      <h3>{category.label}</h3>
                      <div className="credit-amount">Up to {category.credit}</div>
                      <div className="credit-type">{category.type.replace('_', ' ').toUpperCase()}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="step-navigation">
              <button onClick={prevStep} className="prev-button">Back</button>
              <button 
                onClick={nextStep}
                disabled={userInputs.selectedCategories.length === 0}
                className="next-button"
              >
                Calculate My Credits
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && results && (
          <div className="step-content results-step">
            <div className="results-header">
              <h2>🎯 Your Tax Credit Potential</h2>
              <div className="total-credit">
                <div className="total-amount">
                  ${results.totalCredit.toLocaleString()}
                </div>
                <div className="total-label">Total Annual Credits</div>
              </div>
            </div>

            <div className="credit-breakdown">
              <h3>Credit Breakdown:</h3>
              {results.breakdown.map((credit, index) => (
                <div key={index} className="credit-item">
                  <div className="credit-name">
                    {credit.name}
                  </div>
                  <div className="credit-amount">
                    ${credit.credit.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="results-cta">
              <div className="cta-content">
                <h3>Ready to claim your credits?</h3>
                <p>We'll find your eligible tax credits, or your first payroll is free!</p>
                <button className="claim-button">
                  Claim Your 90-Day Guarantee
                </button>
              </div>
            </div>

            <div className="disclaimer">
              <p>
                <strong>Disclaimer:</strong> Estimates only. Based on federal and state tax credit programs. 
                Actual credits subject to IRS and state agency qualification verification.
              </p>
            </div>

            <div className="step-navigation">
              <button onClick={prevStep} className="prev-button">Back</button>
            </div>
          </div>
        )}
      </div>

      {/* Live Results Preview (Steps 3-4) */}
      {currentStep >= 3 && results && currentStep < 4 && (
        <div className="results-preview">
          <div className="preview-content">
            <h4>Your Estimated Credits:</h4>
            <div className="preview-total">
              ${results.totalCredit.toLocaleString()}
            </div>
            <div className="preview-breakdown">
              {results.breakdown.slice(0, 3).map((credit, index) => (
                <div key={index} className="preview-item">
                  {credit.name}: ${credit.credit.toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiCreditQuiz;