
export function validateDOTNumber(dotNumber: string | number): boolean {
  // Convert to string if number
  const dot = dotNumber.toString();
  
  // DOT numbers should be numeric and between 4-7 digits
  const dotRegex = /^\d{4,7}$/;
  
  if (!dotRegex.test(dot)) {
    console.error('Invalid DOT number format:', dot);
    return false;
  }
  
  return true;
}
