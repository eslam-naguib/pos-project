// A minimal ESC/POS encoder since we dropped the dependency
export class ESCPOS {
  private buffer: number[] = [];

  initialize() {
    this.buffer.push(0x1b, 0x40); // ESC @
    return this;
  }

  align(alignment: 'left' | 'center' | 'right') {
    const alignMap = { left: 0, center: 1, right: 2 };
    this.buffer.push(0x1b, 0x61, alignMap[alignment]);
    return this;
  }

  text(str: string) {
    // Simple ASCII encoding for now. Real implementation needs iconv for Arabic etc.
    for (let i = 0; i < str.length; i++) {
      this.buffer.push(str.charCodeAt(i));
    }
    return this;
  }

  newline() {
    this.buffer.push(0x0a);
    return this;
  }

  bold(on: boolean) {
    this.buffer.push(0x1b, 0x45, on ? 1 : 0);
    return this;
  }

  size(width: number, height: number) {
    const n = (width - 1) * 16 + (height - 1);
    this.buffer.push(0x1d, 0x21, n);
    return this;
  }

  cut() {
    this.buffer.push(0x1d, 0x56, 0x00); // GS V 0
    return this;
  }
  
  openDrawer() {
    // ESC p m t1 t2
    this.buffer.push(0x1b, 0x70, 0x00, 0x19, 0xfa);
    return this;
  }

  encode() {
    return new Uint8Array(this.buffer);
  }
}

export const printReceipt = async (lines: string[], port?: any) => {
  try {
    const encoder = new ESCPOS();
    encoder.initialize();
    
    for (const line of lines) {
      encoder.text(line).newline();
    }
    
    encoder.newline().newline().cut();
    const data = encoder.encode();

    if (port) {
      const writer = port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      return true;
    }
    
    console.log('Mock print:', lines);
    return true;
  } catch (err) {
    console.error('Print failed:', err);
    return false;
  }
};
