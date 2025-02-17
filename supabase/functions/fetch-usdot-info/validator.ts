
export function validateDOTNumber(dotNumber: string | number): boolean {
  // Convert to string and remove any non-digit characters
  const dot = dotNumber.toString().replace(/\D/g, '');
  
  // DOT numbers should be numeric and between 4-7 digits
  const dotRegex = /^\d{4,7}$/;
  
  if (!dotRegex.test(dot)) {
    console.error('Invalid DOT number format:', {
      original: dotNumber,
      cleaned: dot,
      length: dot.length,
      isNumeric: /^\d+$/.test(dot)
    });
    return false;
  }
  
  return true;
}
