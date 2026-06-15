import imageCompression from 'browser-image-compression';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from './firebase';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Fallback to original
  }
};

export const uploadPhoto = async (eventId, file, uploaderId) => {
  const compressedFile = await compressImage(file);
  const fileName = `${Date.now()}_${compressedFile.name}`;
  const storageRef = ref(storage, `events/${eventId}/${fileName}`);

  const uploadTask = uploadBytesResumable(storageRef, compressedFile);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // 1-day TTL: Appending expiresAt for Firestore TTL
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 1);

          const docRef = await addDoc(collection(db, `events/${eventId}/photos`), {
            url: downloadURL,
            uploadedBy: uploaderId,
            createdAt: serverTimestamp(),
            expiresAt: expiresAt,
          });
          resolve({ id: docRef.id, url: downloadURL });
        } catch (dbError) {
          console.error('Database record failed:', dbError);
          reject(dbError);
        }
      }
    );
  });
};
