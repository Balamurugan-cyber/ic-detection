import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, Camera, FileSpreadsheet, Shield, Zap } from 'lucide-react';
import ImageAnalysis from './components/ImageAnalysis';
import ElectricalAnalysis from './components/ElectricalAnalysis';
import ResultsDashboard from './components/ResultsDashboard';
import Header from './components/Header';

export interface AnalysisResult {
  id: string;
  type: 'image' | 'electrical';
  filename: string;
  classification: 'authentic' | 'counterfeit' | 'anomaly_detected' | 'normal';
  confidence: number;
  timestamp: Date;
  details?: {
    dimensions?: string;
    material?: string;
    electricalSignature?: {
      voltage: number;
      resistance: number;
      current: number;
    };
  };
}

function App() {
  const [activeTab, setActiveTab] = useState<'image' | 'electrical' | 'results'>('image');
  const [results, setResults] = useState<AnalysisResult[]>([]);

  const addResult = (result: Omit<AnalysisResult, 'id' | 'timestamp'>) => {
    const newResult: AnalysisResult = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setResults(prev => [newResult, ...prev]);
  };

  const tabs = [
    { id: 'image', label: 'Image Detection', icon: Camera },
    { id: 'electrical', label: 'Electrical Analysis', icon: Zap },
    { id: 'results', label: 'Results Dashboard', icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-2xl shadow-lg p-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-1 my-1 ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'image' && <ImageAnalysis onResult={addResult} />}
          {activeTab === 'electrical' && <ElectricalAnalysis onResult={addResult} />}
          {activeTab === 'results' && <ResultsDashboard results={results} />}
        </div>
      </div>
    </div>
  );
}

export default App;