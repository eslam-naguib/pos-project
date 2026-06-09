import { db } from '../db/database';

/**
 * Handles the offline-first synchronization logic.
 * Detects network state changes and pushes locally cached database mutations
 * (e.g., pending sales) to the central backend server.
 */
class SyncService {
  private syncInterval: NodeJS.Timeout | null = null;

  /**
   * Scans the local database for records flagged as 'pending' syncStatus
   * and attempts to push them to the server.
   */
  async syncSales(): Promise<void> {
    if (!navigator.onLine) return;
    try {
      const pendingSales = await db.sales.where('syncStatus').equals('pending').toArray();
      if (pendingSales.length === 0) return;

      console.info(`Syncing ${pendingSales.length} offline sales to remote server...`);
      
      // TODO: Replace with actual REST POST request to backend API
      // Mock server sync latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      for (const sale of pendingSales) {
        await db.sales.update(sale.id, { syncStatus: 'synced' });
      }
      
      console.info('Background sync complete');
    } catch (err) {
      console.error('Background sync failed:', err);
    }
  }

  /**
   * Initializes a background daemon that periodically checks for pending records
   * if the device is online.
   */
  startBackgroundSync(): void {
    if (this.syncInterval) clearInterval(this.syncInterval);
    
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncSales();
      }
    }, 30000); // Check every 30s
  }

  /**
   * Stops the background sync daemon.
   */
  stopBackgroundSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

/** Global singleton instance of the sync service */
export const syncService = new SyncService();
