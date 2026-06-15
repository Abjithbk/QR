import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Zap, Shield, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
          <Camera className="w-8 h-8" />
          <span>ARC (Auto-Real-time Capture)</span>
        </div>
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600">How it Works</a>
        </nav>
        <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 shadow-md transition-colors">
          Dashboard
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
          Instant Photo Sharing <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            For Your Events
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          Create an event, generate a QR code, and let your guests instantly upload and view photos in a real-time gallery. No apps to download.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            Create an Event Now
          </Link>
          <a href="https://github.com/yourusername/arc" target="_blank" rel="noreferrer" className="bg-white text-gray-800 border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 shadow-sm transition-all">
            View on GitHub
          </a>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Why use ARC (Auto-Real-time Capture)?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-yellow-500" />}
              title="Real-time Sync"
              desc="Photos appear instantly for everyone at the event. No refreshing needed."
            />
            <FeatureCard 
              icon={<Users className="w-10 h-10 text-blue-500" />}
              title="Frictionless"
              desc="Guests just scan a QR code. No app downloads or account creation required."
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-green-500" />}
              title="Cost-Effective"
              desc="Built on Firebase with automatic 1-day photo deletion to keep storage costs near zero."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
