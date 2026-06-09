import { ESCPOS } from './printerService';

/**
 * Sends a kick signal to a physical cash drawer connected via a POS thermal printer.
 * Uses the standard ESC/POS command for drawer kicking.
 * 
 * @param port Optional Web Serial API port. If null, mocks the kick action.
 * @returns Boolean indicating if the signal was successfully sent.
 */
export const openCashDrawer = async (port?: any | null): Promise<boolean> => {
  try {
    const encoder = new ESCPOS();
    encoder.initialize().openDrawer();
    const data = encoder.encode();

    if (port && 'writable' in port) {
      const writer = port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      return true;
    }

    // Fallback: Console mock
    console.info('Mock: Cash Drawer Open Signal Sent');
    return true;
  } catch (err) {
    console.error('Drawer open failed:', err);
    return false;
  }
};
