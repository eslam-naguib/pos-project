import { ESCPOS } from './printerService';

export const openCashDrawer = async (port?: any) => {
  try {
    const encoder = new ESCPOS();
    encoder.initialize().openDrawer();
    const data = encoder.encode();

    if (port) {
      const writer = port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      return true;
    }

    console.log('Mock: Cash Drawer Opened');
    return true;
  } catch (err) {
    console.error('Drawer open failed:', err);
    return false;
  }
};
