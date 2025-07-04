// src/App.jsx
import React from 'react';
import SignalForm from './components/SignalForm';

export default function App() {
  console.log('✅ App loaded'); // This will appear in the browser console if React is working

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <SignalForm />
    </div>
  );
}
