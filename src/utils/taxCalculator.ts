// Tax calculation utility for farmer payments

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 250000, rate: 0 }, // Up to 2.5L: No tax
  { min: 250000, max: 500000, rate: 0.05 }, // 2.5L to 5L: 5%
  { min: 500000, max: 1000000, rate: 0.2 }, // 5L to 10L: 20%
];

export interface TaxCalculationResult {
  grossAmount: number;
  taxAmount: number;
  netAmount: number;
  taxBreakdown: {
    bracket: TaxBracket;
    taxableAmount: number;
    taxForBracket: number;
  }[];
}

export const calculateFarmerTax = (annualIncome: number): TaxCalculationResult => {
  let totalTax = 0;
  const taxBreakdown = [];

  // For incomes up to 5L, no tax is applicable as per agricultural income rules
  if (annualIncome <= 500000) {
    return {
      grossAmount: annualIncome,
      taxAmount: 0,
      netAmount: annualIncome,
      taxBreakdown: [{
        bracket: TAX_BRACKETS[0],
        taxableAmount: annualIncome,
        taxForBracket: 0
      }]
    };
  }

  let remainingIncome = annualIncome;

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const taxableInThisBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );

    const taxForBracket = taxableInThisBracket * bracket.rate;

    if (taxForBracket > 0) {
      taxBreakdown.push({
        bracket,
        taxableAmount: taxableInThisBracket,
        taxForBracket
      });
    }

    totalTax += taxForBracket;
    remainingIncome -= taxableInThisBracket;
  }

  return {
    grossAmount: annualIncome,
    taxAmount: totalTax,
    netAmount: annualIncome - totalTax,
    taxBreakdown
  };
};

export const calculateMSPPayment = (quantity: number, cropType: string): number => {
  // MSP rates per kg (example rates, should be updated with actual MSP rates)
  const MSP_RATES: Record<string, number> = {
    wheat: 20,
    rice: 18,
    corn: 15,
    sugarcane: 25,
    cotton: 30,
    // Add more crops and their MSP rates
  };

  const mspRate = MSP_RATES[cropType.toLowerCase()] || 20; // Default rate if crop not found
  return quantity * mspRate;
};