
export const calculateUCRFee = (truckCount: number): number => {
  if (truckCount <= 2) return 176;
  if (truckCount <= 5) return 388;
  if (truckCount <= 20) return 609;
  if (truckCount <= 100) return 1449;
  if (truckCount <= 1000) return 6816;
  return 0; // For 1001+ trucks, we ask them to contact us
};
