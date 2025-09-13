import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Solana DApp Test
          </h1>
          <p className="text-xl text-gray-600">
            Basic React app test - no wallet providers
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              App is Working!
            </h2>
            <p className="text-gray-600 mb-8">
              If you can see this, the basic React app is loading successfully.
            </p>
            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;