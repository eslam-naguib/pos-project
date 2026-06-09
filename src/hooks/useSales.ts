import { db } from '../db/database';
import { usePopupStore } from '../store/popupStore';
import type { Sale } from '../db/models';

export function useSales() {
  const { showPopup } = usePopupStore();

  const handleRefund = async (sale: Sale) => {
    if (sale.status === 'refunded') return;
    
    showPopup({
      type: 'confirm',
      title: 'Confirm Refund',
      message: `Are you sure you want to refund invoice ${sale.invoiceNumber} for €${sale.total.toFixed(2)}?`,
      onConfirm: async () => {
        try {
          // Update sale status
          await db.sales.update(sale.id, { status: 'refunded', syncStatus: 'pending' });
          
          // Restore stock
          for (const item of sale.items) {
            const product = await db.products.get(item.productId);
            if (product) {
              await db.products.update(product.id, {
                stock: product.stock + item.quantity
              });
            }
          }

          showPopup({
            type: 'success',
            title: 'Refund Complete',
            message: `Invoice ${sale.invoiceNumber} has been successfully refunded and stock has been restored.`
          });
        } catch (error) {
          showPopup({
            type: 'error',
            title: 'Refund Failed',
            message: 'An error occurred while processing the refund.'
          });
          console.error(error);
        }
      }
    });
  };

  return { handleRefund };
}
