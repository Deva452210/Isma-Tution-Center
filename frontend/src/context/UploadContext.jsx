'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const UploadContext = createContext();

export const useUpload = () => useContext(UploadContext);

export const UploadProvider = ({ children }) => {
  const [uploads, setUploads] = useState([]);

  const startUpload = useCallback(async ({ id, title, url, payload, type }) => {
    const newUpload = { id, title, type, status: 'uploading', progress: 0 };
    setUploads(prev => [...prev, newUpload]);

    // Fake progress interval - goes up to 90%
    const interval = setInterval(() => {
      setUploads(prev => prev.map(u => {
        if (u.id === id && u.progress < 90) {
          // Add random amount between 5 and 15
          return { ...u, progress: u.progress + Math.floor(Math.random() * 10) + 5 };
        }
        return u;
      }));
    }, 500);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      clearInterval(interval);

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to upload');
      }

      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'success', progress: 100 } : u));
    } catch (err) {
      clearInterval(interval);
      setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error', error: err.message, progress: 100 } : u));
    }

    // Automatically remove after 5 seconds on success or error
    setTimeout(() => {
      setUploads(prev => prev.filter(u => u.id !== id));
    }, 5000);

  }, []);

  const removeUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  return (
    <UploadContext.Provider value={{ startUpload }}>
      {children}
      {/* Upload UI Bottom Right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end">
        {uploads.map(u => (
          <div key={u.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 shadow-2xl text-white transform transition-all duration-300 flex items-center gap-3">
            {u.status === 'uploading' && <Loader2 className="w-5 h-5 animate-spin text-brand flex-shrink-0" />}
            {u.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
            {u.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            <div className="flex flex-col justify-center">
              <span className="font-bold text-sm max-w-[220px] truncate">
                {u.status === 'uploading' ? `Uploading ${u.title}...` : u.status === 'success' ? `${u.title} Added!` : 'Upload Failed'}
              </span>
              {u.status === 'error' && <span className="text-xs text-red-400 font-medium truncate max-w-[220px]">{u.error}</span>}
            </div>
            {u.status === 'error' && (
              <button onClick={() => removeUpload(u.id)} className="ml-2 text-gray-500 hover:text-white transition-colors bg-gray-800 rounded-full p-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </UploadContext.Provider>
  );
};
