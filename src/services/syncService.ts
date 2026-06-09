import { db } from '../db/database';

export const syncService = {
  async syncSales() {
    if (!navigator.onLine) return;
    try {
      const pendingSales = await db.sales.where('syncStatus').equals('pending').toArray();
      if (pendingSales.length === 0) return;

      console.log(`Syncing ${pendingSales.length} sales to server...`);
      // Mock server sync
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      for (const sale of pendingSales) {
        await db.sales.update(sale.id, { syncStatus: 'synced' });
      }
      console.log('Sync complete');
    } catch (err) {
      console.error('Sync failed', err);
    }
  },

  startBackgroundSync() {
    setInterval(() => {
      if (navigator.onLine) {
        this.syncSales();
      }
    }, 30000); // Check every 30s
  }
};
