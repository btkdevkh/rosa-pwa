const standardDeviationRound = (value: number): number => {
  // Check is value is Infinity, -Infinity, NaN or not a number
  if (value == null || isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }

  const integerPart = Math.trunc(value); // Get integer part safely
  const decimalPart = value - integerPart; // Extract decimal part

  return decimalPart >= 0.5 ? integerPart + 1 : integerPart;
};

export default standardDeviationRound;
