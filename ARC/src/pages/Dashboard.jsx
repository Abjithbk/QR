import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, Calendar, Settings } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Dashboard() {
  const [eventName, setEventName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    try {
      setIsCreating(true);
      // In a real app, ensure user is authenticated first
      const docRef = await addDoc(collection(db, 'events'), {
        name: eventName,
        createdAt: serverTimestamp(),
        // ownerId: auth.currentUser.uid
      });
      
      navigate(`/event/${docRef.id}`);
    } catch (error) {
      console.error("Error creating event: ", error);
      alert("Failed to create event. Please check your Firebase configuration.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Camera className="w-6 h-6" />
          <span>ARC (Auto-Real-time Capture)</span>
        </div>
        <nav className="p-4 flex-1 space-y-2">
          <NavItem icon={<Calendar className="w-5 h-5" />} label="My Events" active />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white p-6 border-b border-gray-200 flex justify-between items-center md:hidden">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                <Camera className="w-6 h-6" />
                <span>ARC (Auto-Real-time Capture)</span>
            </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your photo-sharing events</p>
            </div>
          </div>

          {/* Create Event Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
                <Plus className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Event</h2>
                <p className="text-gray-500 mb-6">Start a new real-time photo gallery for your guests.</p>
                
                <form onSubmit={handleCreateEvent} className="flex gap-4 max-w-md">
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="E.g., Sarah's Birthday"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    disabled={isCreating}
                  />
                  <button
                    type="submit"
                    disabled={!eventName.trim() || isCreating}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {isCreating ? 'Creating...' : 'Create'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Placeholder for Event List */}
          <div className="mt-12">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Events</h3>
             <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No events found. Create one above!</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
      active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}>
      {icon}
      {label}
    </a>
  );
}
