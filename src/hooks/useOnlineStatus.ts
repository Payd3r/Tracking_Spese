import { useState, useEffect } from 'react';

interface OnlineStatus {
  isOnline: boolean;
  lastSync: Date | null;
  isSyncing: boolean;
  pendingSync: number;
}

export const useOnlineStatus = () => {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    isSyncing: false,
    pendingSync: 0
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      // Trigger sync when coming back online
      triggerSync();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial sync status
    checkSyncStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkSyncStatus = async () => {
    try {
      const lastSync = localStorage.getItem('lastSync');
      const pendingSync = await getPendingSyncCount();
      
      setStatus(prev => ({
        ...prev,
        lastSync: lastSync ? new Date(lastSync) : null,
        pendingSync
      }));
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  const getPendingSyncCount = async (): Promise<number> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('TrackingSpeseDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['offlineData'], 'readonly');
        const store = transaction.objectStore('offlineData');
        const countRequest = store.count();
        
        countRequest.onsuccess = () => {
          resolve(countRequest.result);
        };
        
        countRequest.onerror = () => resolve(0);
      };
      
      request.onerror = () => resolve(0);
    });
  };

  const triggerSync = async () => {
    if (!status.isOnline || status.isSyncing) return;

    setStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
      }

      // Update last sync time
      const now = new Date();
      localStorage.setItem('lastSync', now.toISOString());
      
      setStatus(prev => ({
        ...prev,
        lastSync: now,
        isSyncing: false,
        pendingSync: 0
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      setStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const addPendingSync = async (data: any) => {
    try {
      const request = indexedDB.open('TrackingSpeseDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['offlineData'], 'readwrite');
        const store = transaction.objectStore('offlineData');
        
        const offlineData = {
          id: Date.now().toString(),
          ...data,
          timestamp: new Date().toISOString()
        };
        
        store.add(offlineData);
        
        setStatus(prev => ({
          ...prev,
          pendingSync: prev.pendingSync + 1
        }));
      };
    } catch (error) {
      console.error('Error adding pending sync:', error);
    }
  };

  return {
    ...status,
    triggerSync,
    addPendingSync,
    checkSyncStatus
  };
}; 