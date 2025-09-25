import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle2, AlertTriangle, FileImage, X } from 'lucide-react';
import { AnalysisResult } from '../App';

interface Props {
  onResult: (result: Omit<AnalysisResult, 'id' | 'timestamp'>) => void;
}

const ImageAnalysis: React.FC<Props> = ({ onResult }) => {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
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
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock classification results
    const isCounterfeit = Math.random() < 0.3; // 30% chance of counterfeit
    const confidence = isCounterfeit ? 
      Math.random() * 0.25 + 0.75 : // 75-100% confidence for counterfeit
      Math.random() * 0.3 + 0.7;    // 70-100% confidence for authentic
    
    const result = {
      type: 'image' as const,
      filename: fileName,
      classification: isCounterfeit ? 'counterfeit' as const : 'authentic' as const,
      confidence: Math.round(confidence * 100),
      details: {
        dimensions: '14x14mm',
        material: isCounterfeit ? 'Substandard Silicon' : 'High-grade Silicon',
      }
    };

    onResult(result);
    setAnalyzing(false);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">IC Component Image Analysis</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Upload high-resolution images of IC components for AI-powered authenticity detection. 
          Our deep learning model analyzes visual markers, logos, and manufacturing signatures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <Camera className="w-6 h-6 mr-2 text-blue-600" />
            Image Upload
          </h3>

          {!uploadedImage ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">
                Drag and drop your IC component image here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Image
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded IC component"
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-600">
                  <FileImage className="w-5 h-5 mr-2" />
                  <span className="truncate">{fileName}</span>
                </div>
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    analyzing
                      ? 'bg-slate-400 text-white cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
                  }`}
                >
                  {analyzing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Component'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Guidelines */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Analysis Guidelines</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-800">High Resolution Images</p>
                <p className="text-sm text-slate-600">Use images with clear component markings and logos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Proper Lighting</p>
                <p className="text-sm text-slate-600">Ensure good lighting to capture surface details</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Multiple Angles</p>
                <p className="text-sm text-slate-600">Upload images from different perspectives when possible</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-slate-800">Avoid Reflections</p>
                <p className="text-sm text-slate-600">Minimize glare and reflections on component surface</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-xl">
            <h4 className="font-medium text-slate-800 mb-2">Detection Capabilities</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Logo authenticity and font analysis</li>
              <li>• Surface texture and finish quality</li>
              <li>• Pin alignment and manufacturing precision</li>
              <li>• Package dimensions and proportions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;