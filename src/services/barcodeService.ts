/**
 * Calculates the EAN-13 checksum digit for a 12-digit base.
 * @param code The 12-digit string to calculate the checksum for.
 * @returns The calculated checksum digit as a string.
 */
const calculateEAN13Checksum = (code: string): string => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i], 10);
    // EAN-13 algorithm: alternating 1 and 3 multipliers
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const remainder = sum % 10;
  const checksum = remainder === 0 ? 0 : 10 - remainder;
  return checksum.toString();
};

/**
 * Generates an EAN-13 barcode standard string.
 * Supports both standard internal PLUs and Scale-generated weight barcodes.
 * 
 * @param plu - The internal product code.
 * @param weightGrams - Optional weight in grams. If provided, generates a weight-based barcode.
 * @returns A valid 13-digit EAN-13 string.
 */
export const generateEAN13 = (plu: string, weightGrams?: number): string => {
  if (weightGrams !== undefined) {
    // Weight-based barcode format: 02 + 5 digit PLU + 5 digit weight + checksum
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

/**
 * Interface representing the result of decoding a weight-based barcode.
 */
export interface DecodedWeightBarcode {
  plu: string;
  weightGrams: number;
}

/**
 * Decodes a scanned 13-digit scale barcode back into PLU and weight.
 * @param barcode - The scanned barcode string.
 * @returns An object containing PLU and weight in grams, or null if invalid.
 */
export const decodeWeightBarcode = (barcode: string): DecodedWeightBarcode | null => {
  // Validate standard length and standard '02' prefix used for internal weighted items
  if (barcode.length === 13 && barcode.startsWith('02')) {
    const plu = barcode.substring(2, 7);
    const weightGrams = parseInt(barcode.substring(7, 12), 10);
    return { plu, weightGrams };
  }
  return null;
};
