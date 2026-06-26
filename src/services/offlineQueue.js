import { openDB } from 'idb';

const DB_NAME = 'arc-offline-photos';
const STORE_NAME = 'photos';
const DOWNLOAD_STORE_NAME = 'downloads';

export async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db,oldVersion) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }

      if(oldVersion < 2 && !db.objectStoreNames.contains(DOWNLOAD_STORE_NAME)) {
        db.createObjectStore(DOWNLOAD_STORE_NAME,{keyPath:'id',autoIncrement:true});
      }
    },
  });
}

export async function savePhotoToQueue(photoData) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  
  await store.add({
    ...photoData,
    timestamp: Date.now()
  });
  
  await tx.done;
}

export async function getQueue() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return store.getAll();
}

export async function removeFromQueue(id) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
}

export async function getQueueCount() {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return store.count();
}

// Download Queue Functions

export async function saveDownloadToQueue(downloadData) {
  const db = await getDB();
  const tx = db.transaction(DOWNLOAD_STORE_NAME,'readwrite');
  const store = tx.objectStore(DOWNLOAD_STORE_NAME);

  await store.add({
    ...downloadData,
    timestamp:Date.now()
  });
  await tx.done;
}

export async function getDownloadQueue() {
  const db = await getDB();
  const tx = db.transaction(DOWNLOAD_STORE_NAME,'readonly');
  const store = tx.objectStore(DOWNLOAD_STORE_NAME);
  return store.getAll();
}

export async function removeFromDownloadQueue(id) {
  const db = await getDB();
  const tx = db.transaction(DOWNLOAD_STORE_NAME,'readwrite');
  const store = tx.objectStore(DOWNLOAD_STORE_NAME)
  await store.delete(id)
  await tx.done
}

export async function getDownloadQueueCount() {
  const db = await getDB()
  const tx = db.transaction(DOWNLOAD_STORE_NAME,'readonly')
  const store = tx.objectStore(DOWNLOAD_STORE_NAME)
  return store.count()
}
