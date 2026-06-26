import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  getQueue, 
  removeFromQueue, 
  getQueueCount, 
  getDownloadQueue, 
  removeFromDownloadQueue, 
  getDownloadQueueCount 
} from '../services/offlineQueue';
import { uploadPhoto } from '../services/storage';

const SyncContext = createContext();

// Global lock state for preventing running functions more than once
let isSyncingUploads = false;
let isSyncingDownloads = false;

export function SyncProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);
  const [downloadQueueCount, setDownloadQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const updateQueueCount = useCallback(async () => {
    try {
      const count = await getQueueCount();
      setQueueCount(count);
    } catch (e) {
      console.error("Could not read offline queue count", e);
    }
  }, []);

  const updateDownloadQueueCount = useCallback(async () => {
    try {
      const count = await getDownloadQueueCount();
      setDownloadQueueCount(count);
    } catch (e) {
      console.error("Could not read offline download queue count", e);
    }
  }, []);

  const syncQueue = useCallback(async () => {
    // Use the global lock variable
    if (!navigator.onLine || isSyncingUploads) return;
    
    isSyncingUploads = true;
    setSyncing(true);
    
    try {
      const queue = await getQueue();
      for (const item of queue) {
        try {
          await uploadPhoto(item.eventId, item.file, item.uploader, { preventRequeue: true });
          await removeFromQueue(item.id);
        } catch (error) {
          console.error("Failed to sync item", item.id, error);
          if (error.message === 'Failed to fetch' || !navigator.onLine) {
            break;
          }
        }
      }
    } catch (err) {
      console.error("Sync process failed", err);
    } finally {
      isSyncingUploads = false;
      setSyncing(false);
      await updateQueueCount();
    }
  }, [updateQueueCount]);

  const syncDownloadQueue = useCallback(async () => {
    
    if (!navigator.onLine || isSyncingDownloads) return;
    
    isSyncingDownloads = true;
    setDownloading(true);
    
    try {
      const queue = await getDownloadQueue();
      for (const item of queue) {
        try {
          const response = await fetch(item.url);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = item.filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(blobUrl);

          await removeFromDownloadQueue(item.id);
        } catch (error) {
          console.error("Failed to sync download item", item.id, error);
          if (error.message === 'Failed to fetch' || !navigator.onLine) {
            break;
          }
        }
      }
    } catch (err) {
      console.error("Download sync process failed", err);
    } finally {
      isSyncingDownloads = false;
      setDownloading(false);
      await updateDownloadQueueCount();
    }
  }, [updateDownloadQueueCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
      syncDownloadQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    updateQueueCount();
    updateDownloadQueueCount();
    
    if (navigator.onLine) {
      syncQueue();
      syncDownloadQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue, syncDownloadQueue, updateQueueCount, updateDownloadQueueCount]);

  const notifyItemQueued = useCallback(() => {
    updateQueueCount();
  }, [updateQueueCount]);

  const notifyDownloadQueued = useCallback(() => {
    updateDownloadQueueCount();
  }, [updateDownloadQueueCount]);

  return (
    <SyncContext.Provider value={{ 
      isOnline, 
      queueCount, 
      downloadQueueCount, 
      syncing, 
      downloading,
      syncQueue, 
      syncDownloadQueue,
      notifyItemQueued, 
      notifyDownloadQueued 
    }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}