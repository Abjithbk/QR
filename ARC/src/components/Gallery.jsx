import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Gallery({ eventId }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const q = query(
      collection(db, `events/${eventId}/photos`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(newPhotos);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching photos: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl">No photos yet!</p>
        <p className="mt-2">Be the first to capture a moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pb-24">
      {photos.map((photo) => (
        <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow">
          <img 
            src={photo.url} 
            alt="Event moment" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <a href={photo.url} target="_blank" rel="noreferrer" className="text-white bg-white/20 p-2 rounded-full hover:bg-white/40 backdrop-blur-sm">
                Download
             </a>
          </div>
        </div>
      ))}
    </div>
  );
}
