export const generateEAN13 = (plu: string, weightGrams?: number): string => {
  if (weightGrams !== undefined) {
    // Weight-based barcode: 02 + 5 digit PLU + 5 digit weight + checksum
    const prefix = '02';
    const pluStr = plu.padStart(5, '0').slice(0, 5);
    const weightStr = weightGrams.toString().padStart(5, '0').slice(0, 5);
    const base = prefix + pluStr + weightStr;
    const checksum = calculateEAN13Checksum(base);
    return base + checksum;
  }
  
  // Regular standard 13-digit generation
  const base = plu.padStart(12, '0').slice(0, 12);
  const checksum = calculateEAN13Checksum(base);
  return base + checksum;
};

export const decodeWeightBarcode = (barcode: string) => {
  if (barcode.length === 13 && barcode.startsWith('02')) {
    const plu = barcode.substring(2, 7);
    const weightGrams = parseInt(barcode.substring(7, 12), 10);
    return { plu, weightGrams };
  }
  return null;
};

const calculateEAN13Checksum = (code: string): string => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const remainder = sum % 10;
  const checksum = remainder === 0 ? 0 : 10 - remainder;
  return checksum.toString();
};
