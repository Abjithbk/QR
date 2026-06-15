import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ url, title = "Join Event" }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl max-w-sm w-full mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-inner mb-6">
        <QRCodeSVG 
          value={url} 
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"Q"}
          includeMargin={false}
        />
      </div>
      <p className="text-sm text-gray-500 text-center mb-4">
        Scan this QR code to join the event and start sharing photos!
      </p>
      <button 
        onClick={() => {
          navigator.clipboard.writeText(url);
        }}
        className="text-blue-600 font-medium hover:text-blue-700 hover:underline px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Copy Link
      </button>
    </div>
  );
}
