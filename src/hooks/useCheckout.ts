import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { usePopupStore } from '../store/popupStore';
import { db } from '../db/database';
import { openCashDrawer } from '../services/cashDrawerService';
import { printReceipt } from '../services/printerService';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to encapsulate the checkout and payment logic.
 */
export function useCheckout() {
  const { items, total, subtotal, taxAmount, clearCart, customerName } = useCartStore();
  const { settings } = useSettingsStore();
  const { i18n } = useTranslation();
  const { showPopup } = usePopupStore();

  const handlePay = async (method: 'cash' | 'card' | 'mixed') => {
    if (items.length === 0) return;
    
    if (method === 'cash') {
      await openCashDrawer();
    }

    const saleId = uuidv4();
    const invoiceNumber = `INV-${Date.now()}`;
    const currentLang = i18n.language as 'en' | 'ar' | 'nl';
    
    // Save to Database
    await db.sales.add({
      id: saleId,
      invoiceNumber,
      items,
      subtotal,
      taxAmount,
      discount: 0,
      total,
      paymentMethod: method,
      cashierId: '1', // Hardcoded for now
      invoiceLanguage: currentLang,
      status: 'completed',
      createdAt: new Date(),
      syncStatus: 'pending'
    });
    
    // Generate Receipt
    const footerText = settings.receiptFooter?.[currentLang] || settings.receiptFooter?.nl || 'Thank you!';
    const receiptLines = [
      settings.storeName[currentLang] || 'SmartPOS',
      settings.storeAddress || '',
      '--------------------------------',
      `Date: ${new Date().toLocaleString()}`,
      `Invoice: ${invoiceNumber}`,
      `Cashier: Admin`,
      customerName ? `Customer: ${customerName}` : '',
      '--------------------------------',
      ...items.map(i => `${i.name.padEnd(20)} €${i.total.toFixed(2).padStart(11)}`),
      '--------------------------------',
      `Subtotal:           €${subtotal.toFixed(2).padStart(11)}`,
      `Tax:                €${taxAmount.toFixed(2).padStart(11)}`,
      `TOTAL:              €${total.toFixed(2).padStart(11)}`,
      '--------------------------------',
      footerText,
      `[BARCODE]${invoiceNumber}`
    ].filter(Boolean);

    await printReceipt(receiptLines);
    
    // Sync Display & Show Success
    localStorage.setItem('cart-status', JSON.stringify({ status: 'paid', timestamp: Date.now() }));
    showPopup({
      type: 'success',
      title: 'Payment Complete',
      message: `Transaction for €${total.toFixed(2)} completed successfully via ${method}.`,
    });
    
    clearCart();
    
    // Reset display status
    setTimeout(() => {
      localStorage.setItem('cart-status', JSON.stringify({ status: 'idle', timestamp: Date.now() }));
    }, 5000);
  };

  return { handlePay };
}
