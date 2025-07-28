/**
 * Usage Examples for Multi-Credit Calculator
 * Demonstrates how to use the calculator with various scenarios
 */

import MultiCreditCalculator from './MultiCreditCalculator.js';

// Initialize the calculator
const calculator = new MultiCreditCalculator();

// Example 1: WOTC + R&D Credits (Can Stack)
console.log('=== Example 1: Tech Startup ===');
const techStartupInputs = {
  totalHires: 8,
  businessState: 'CA',
  businessZipCode: '94103',
  rdSpending: 75000,
  hasRDActivities: true,
  selectedCategories: ['veterans', 'snap'],
  estimatedPayrollTaxes: 45000
};

const techResults = calculator.calculateAll(techStartupInputs);
console.log('Total Credits:', techResults.totalCredit);
console.log('Breakdown:', techResults.breakdown);

// Example 2: Manufacturing Company in Empowerment Zone
console.log('\n=== Example 2: Manufacturing in EZ ===');
const manufacturingInputs = {
  totalHires: 15,
  businessState: 'IL',
  businessZipCode: '60612', // Chicago EZ
  rdSpending: 0,
  hasRDActivities: false,
  selectedCategories: ['empowerment_zone', 'long_term_unemployed'],
  estimatedPayrollTaxes: 85000
};

const manufacturingResults = calculator.calculateAll(manufacturingInputs);
console.log('Total Credits:', manufacturingResults.totalCredit);
console.log('Breakdown:', manufacturingResults.breakdown);

// Example 3: Small Service Business (WOTC + State Credits)
console.log('\n=== Example 3: Service Business ===');
const serviceInputs = {
  totalHires: 5,
  businessState: 'NY',
  businessZipCode: '10001',
  rdSpending: 0,
  hasRDActivities: false,
  selectedCategories: ['veterans', 'state_specific'],
  estimatedPayrollTaxes: 28000
};

const serviceResults = calculator.calculateAll(serviceInputs);
console.log('Total Credits:', serviceResults.totalCredit);
console.log('Breakdown:', serviceResults.breakdown);

// Example 4: Maximum Credit Scenario
console.log('\n=== Example 4: Maximum Credits ===');
const maxCreditInputs = {
  totalHires: 25,
  businessState: 'CA',
  businessZipCode: '90210',
  rdSpending: 200000,
  hasRDActivities: true,
  selectedCategories: ['veterans', 'snap', 'state_specific'],
  estimatedPayrollTaxes: 150000
};

const maxResults = calculator.calculateAll(maxCreditInputs);
console.log('Total Credits:', maxResults.totalCredit);
console.log('Breakdown:', maxResults.breakdown);

// Example 5: Input Validation
console.log('\n=== Example 5: Input Validation ===');
const invalidInputs = {
  totalHires: 0, // Invalid
  rdSpending: -5000 // Invalid
};

const validationErrors = calculator.validateInputs(invalidInputs);
console.log('Validation Errors:', validationErrors);

// Utility Functions for Frontend Integration
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCreditDescription = (creditType) => {
  const descriptions = {
    'wotc': 'Federal hiring incentives for targeted employee groups',
    'rd_payroll': 'Research & development expenses applied against payroll taxes',
    'empowerment_zone': 'Credits for employees in designated low-income areas',
    'state_credits': 'State-specific hiring and business incentive programs'
  };
  return descriptions[creditType] || 'Tax credit program';
};

// React Hook for Calculator Integration
export const useMultiCreditCalculator = (initialInputs = {}) => {
  const [inputs, setInputs] = React.useState({
    totalHires: '',
    businessState: '',
    businessZipCode: '',
    rdSpending: 0,
    hasRDActivities: false,
    selectedCategories: [],
    ...initialInputs
  });
  
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  
  const calculator = React.useMemo(() => new MultiCreditCalculator(), []);
  
  const calculateCredits = React.useCallback(async () => {
    setLoading(true);
    setErrors([]);
    
    try {
      const validationErrors = calculator.validateInputs(inputs);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      const processedInputs = {
        ...inputs,
        totalHires: parseInt(inputs.totalHires) || 0,
        estimatedPayrollTaxes: calculator.estimatePayrollTaxes(parseInt(inputs.totalHires) || 0)
      };
      
      const calculationResults = calculator.calculateAll(processedInputs);
      setResults(calculationResults);
    } catch (error) {
      setErrors(['Calculation error occurred. Please try again.']);
    } finally {
      setLoading(false);
    }
  }, [inputs, calculator]);
  
  const updateInput = React.useCallback((field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const resetCalculator = React.useCallback(() => {
    setInputs({
      totalHires: '',
      businessState: '',
      businessZipCode: '',
      rdSpending: 0,
      hasRDActivities: false,
      selectedCategories: []
    });
    setResults(null);
    setErrors([]);
  }, []);
  
  return {
    inputs,
    results,
    loading,
    errors,
    updateInput,
    calculateCredits,
    resetCalculator
  };
};

// Testing Suite
export const runTests = () => {
  console.log('\n=== Running Calculator Tests ===');
  
  const testCases = [
    {
      name: 'WOTC Only',
      inputs: {
        totalHires: 10,
        selectedCategories: ['veterans'],
        businessState: 'FL'
      },
      expectedMin: 5000
    },
    {
      name: 'R&D Only',
      inputs: {
        totalHires: 5,
        rdSpending: 50000,
        hasRDActivities: true,
        businessState: 'CA'
      },
      expectedMin: 6000
    },
    {
      name: 'Stacked Credits',
      inputs: {
        totalHires: 10,
        rdSpending: 100000,
        selectedCategories: ['veterans', 'snap'],
        businessState: 'CA'
      },
      expectedMin: 15000
    }
  ];
  
  testCases.forEach(testCase => {
    const processedInputs = {
      ...testCase.inputs,
      estimatedPayrollTaxes: calculator.estimatePayrollTaxes(testCase.inputs.totalHires)
    };
    
    const results = calculator.calculateAll(processedInputs);
    const passed = results.totalCredit >= testCase.expectedMin;
    
    console.log(`${testCase.name}: ${passed ? 'PASS' : 'FAIL'} (${results.totalCredit})`);
  });
};

// Run examples when script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests();
}