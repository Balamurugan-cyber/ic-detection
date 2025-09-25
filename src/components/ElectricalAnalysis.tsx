import React, { useState, useRef } from 'react';
import { Upload, Zap, FileSpreadsheet, X, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalysisResult } from '../App';

interface Props {
  onResult: (result: Omit<AnalysisResult, 'id' | 'timestamp'>) => void;
}

interface ElectricalData {
  voltage: number;
  resistance: number;
  current: number;
  frequency?: number;
  temperature?: number;
}

const ElectricalAnalysis: React.FC<Props> = ({ onResult }) => {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ElectricalData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setUploadedFile(file);
    
    // Parse CSV (simplified mock parsing)
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const lines = csvData.split('\n').slice(1); // Skip header
      const mockData: ElectricalData[] = lines.slice(0, 10).map(() => ({
        voltage: 3.3 + (Math.random() - 0.5) * 0.4,
        resistance: 1000 + (Math.random() - 0.5) * 200,
        current: 0.1 + (Math.random() - 0.5) * 0.02,
        frequency: 1000 + (Math.random() - 0.5) * 100,
        temperature: 25 + (Math.random() - 0.5) * 10,
      }));
      setParsedData(mockData);
    };
    reader.readAsText(file);
  };

  const analyzeElectricalData = async () => {
    if (!uploadedFile || parsedData.length === 0) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const hasAnomaly = Math.random() < 0.4; // 40% chance of anomaly
    const confidence = hasAnomaly ? 
      Math.random() * 0.2 + 0.8 : // 80-100% confidence for anomaly
      Math.random() * 0.25 + 0.75;    // 75-100% confidence for normal
    
    const avgData = parsedData.reduce((acc, curr) => ({
      voltage: acc.voltage + curr.voltage / parsedData.length,
      resistance: acc.resistance + curr.resistance / parsedData.length,
      current: acc.current + curr.current / parsedData.length,
    }), { voltage: 0, resistance: 0, current: 0 });

    const result = {
      type: 'electrical' as const,
      filename: uploadedFile.name,
      classification: hasAnomaly ? 'anomaly_detected' as const : 'normal' as const,
      confidence: Math.round(confidence * 100),
      details: {
        electricalSignature: avgData
      }
    };

    onResult(result);
    setAnalyzing(false);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Electrical Signature Analysis</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Upload CSV files containing electrical test data for anomaly detection. 
          Our ML models identify abnormal patterns that may indicate counterfeit components.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-orange-600" />
            CSV Data Upload
          </h3>

          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">
                Drag and drop your electrical test data (CSV) here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Choose CSV File
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center text-slate-600">
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  <span className="truncate">{uploadedFile.name}</span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {parsedData.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-800">Data Preview</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm text-slate-600">Avg Voltage</div>
                      <div className="font-semibold text-blue-600">
                        {parsedData.length > 0 ? 
                          (parsedData.reduce((acc, curr) => acc + curr.voltage, 0) / parsedData.length).toFixed(2) + 'V' 
                          : '0V'}
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg text-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-sm text-slate-600">Avg Resistance</div>
                      <div className="font-semibold text-emerald-600">
                        {parsedData.length > 0 ? 
                          (parsedData.reduce((acc, curr) => acc + curr.resistance, 0) / parsedData.length).toFixed(0) + 'Ω' 
                          : '0Ω'}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <TrendingDown className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="text-sm text-slate-600">Avg Current</div>
                      <div className="font-semibold text-purple-600">
                        {parsedData.length > 0 ? 
                          (parsedData.reduce((acc, curr) => acc + curr.current, 0) / parsedData.length).toFixed(3) + 'A' 
                          : '0A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={analyzeElectricalData}
                disabled={analyzing || parsedData.length === 0}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  analyzing || parsedData.length === 0
                    ? 'bg-slate-400 text-white cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg'
                }`}
              >
                {analyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Analyzing Electrical Signature...
                  </div>
                ) : (
                  'Analyze Electrical Data'
                )}
              </button>
            </div>
          )}
        </div>

        {/* CSV Format Guidelines */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">CSV Format Requirements</h3>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-medium text-slate-800 mb-2">Required Columns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">voltage</span>
                  <span className="text-orange-600 font-mono">3.30V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">resistance</span>
                  <span className="text-orange-600 font-mono">1000Ω</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">current</span>
                  <span className="text-orange-600 font-mono">0.10A</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-medium text-slate-800 mb-2">Optional Parameters</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">frequency</span>
                  <span className="text-slate-500 font-mono">1000Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">temperature</span>
                  <span className="text-slate-500 font-mono">25°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">timestamp</span>
                  <span className="text-slate-500 font-mono">ISO8601</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 p-4 rounded-xl border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Sample CSV Header</h4>
              <code className="text-xs text-yellow-700 block">
                voltage,resistance,current,frequency,temperature<br/>
                3.30,1000,0.10,1000,25.0<br/>
                3.31,1001,0.10,1001,25.1
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricalAnalysis;