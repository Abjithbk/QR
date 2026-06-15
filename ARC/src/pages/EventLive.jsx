import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import Gallery from '../components/Gallery';
import CameraCapture from '../components/CameraCapture';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { Camera, QrCode, Share2 } from 'lucide-react';

export default function EventLive() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  // The full URL to this event page
  const eventUrl = window.location.href;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEventData(docSnap.data());
        } else {
          console.error("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Not Found</h1>
        <p className="text-gray-500">The event you are looking for does not exist or has expired.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative pb-20">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Camera className="w-5 h-5" />
             </div>
             <h1 className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{eventData.name || 'Live Event'}</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowQR(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Show QR Code"
            >
              <QrCode className="w-6 h-6" />
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: eventData.name,
                    url: eventUrl
                  });
                } else {
                  navigator.clipboard.writeText(eventUrl);
                  alert("Link copied to clipboard!");
                }
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Gallery Area */}
      <main className="container mx-auto max-w-7xl pt-4">
        <Gallery eventId={eventId} />
      </main>

      {/* Floating Action Button for Camera Capture */}
      <CameraCapture eventId={eventId} userId={`guest-${Math.random().toString(36).substr(2, 9)}`} />

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
          <div onClick={e => e.stopPropagation()} className="relative">
             <button 
                onClick={() => setShowQR(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 font-bold text-xl"
             >
                Close
             </button>
             <QRCodeDisplay url={eventUrl} title={eventData.name} />
          </div>
        </div>
      )}
    </div>
  );
}
