/**
 * A minimal ESC/POS encoder wrapper.
 * Provides a fluid API to construct raw byte buffers for thermal POS printers
 * without relying on heavy Node.js dependencies that break in the browser.
 */
export class ESCPOS {
  private buffer: number[] = [];

  /** 
   * Initializes the printer buffer with ESC @ (Init command) 
   */
  initialize(): this {
    this.buffer.push(0x1b, 0x40); // ESC @
    return this;
  }

  /**
   * Sets the text alignment.
   * @param alignment 'left', 'center', or 'right'
   */
  align(alignment: 'left' | 'center' | 'right'): this {
    const alignMap: Record<'left' | 'center' | 'right', number> = { left: 0, center: 1, right: 2 };
    this.buffer.push(0x1b, 0x61, alignMap[alignment]);
    return this;
  }

  /**
   * Appends text to the print buffer.
   * Note: Currently uses basic ASCII encoding. Real implementations requiring
   * Arabic or other non-latin character sets should use an iconv-lite equivalent.
   * @param str The string to print.
   */
  text(str: string): this {
    for (let i = 0; i < str.length; i++) {
      // Basic ASCII cast
      this.buffer.push(str.charCodeAt(i) & 0xFF);
    }
    return this;
  }

  /**
   * Inserts a line feed character (LF).
   */
  newline(): this {
    this.buffer.push(0x0a);
    return this;
  }

  /**
   * Toggles bold text mode.
   * @param on true to enable bold, false to disable.
   */
  bold(on: boolean): this {
    this.buffer.push(0x1b, 0x45, on ? 1 : 0);
    return this;
  }

  /**
   * Adjusts the text size.
   * @param width Width multiplier (1-8)
   * @param height Height multiplier (1-8)
   */
  size(width: number, height: number): this {
    const n = (Math.max(1, Math.min(8, width)) - 1) * 16 + (Math.max(1, Math.min(8, height)) - 1);
    this.buffer.push(0x1d, 0x21, n);
    return this;
  }

  /**
   * Sends the paper cut command (GS V 0).
   */
  cut(): this {
    this.buffer.push(0x1d, 0x56, 0x00);
    return this;
  }
  
  /**
   * Sends the command to kick the cash drawer.
   */
  openDrawer(): this {
    // ESC p m t1 t2
    this.buffer.push(0x1b, 0x70, 0x00, 0x19, 0xfa);
    return this;
  }

  /**
   * Compiles the command buffer into a final Uint8Array payload.
   * @returns The raw byte array ready to be sent to a Serial/USB port.
   */
  encode(): Uint8Array {
    return new Uint8Array(this.buffer);
  }
}

/**
 * High-level function to print a receipt containing multiple lines of text.
 * @param lines Array of strings to print.
 * @param port Optional Web Serial API port. If null, mocks the print output to console.
 * @returns Boolean indicating success.
 */
export const printReceipt = async (lines: string[], port?: any | null): Promise<boolean> => {
  try {
    const encoder = new ESCPOS();
    encoder.initialize();
    
    for (const line of lines) {
      encoder.text(line).newline();
    }
    
    encoder.newline().newline().cut();
    const data = encoder.encode();

    if (port && 'writable' in port) {
      const writer = port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
      return true;
    }
    
    // Fallback: Console mock
    console.info('Mock Print Output:', lines);
    return true;
  } catch (err) {
    console.error('Print failed:', err);
    return false;
  }
};
