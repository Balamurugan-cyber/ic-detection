import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, FileImage, FileSpreadsheet, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '../App';

interface Props {
  results: AnalysisResult[];
}

const ResultsDashboard: React.FC<Props> = ({ results }) => {
  const getStatusIcon = (classification: string, type: string) => {
    if (type === 'image') {
      return classification === 'authentic' ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
      ) : (
        <AlertTriangle className="w-6 h-6 text-red-500" />
      );
    } else {
      return classification === 'normal' ? (
        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
      ) : (
        <AlertTriangle className="w-6 h-6 text-orange-500" />
      );
    }
  };

  const getStatusText = (classification: string, type: string) => {
    if (type === 'image') {
      return classification === 'authentic' ? 'Authentic' : 'Counterfeit Detected';
    } else {
      return classification === 'normal' ? 'Normal Pattern' : 'Anomaly Detected';
    }
  };

  const getStatusColor = (classification: string, type: string) => {
    if (type === 'image') {
      return classification === 'authentic' ? 'text-emerald-600' : 'text-red-600';
    } else {
      return classification === 'normal' ? 'text-emerald-600' : 'text-orange-600';
    }
  };

  const getBackgroundColor = (classification: string, type: string) => {
    if (type === 'image') {
      return classification === 'authentic' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
    } else {
      return classification === 'normal' ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200';
    }
  };

  const stats = {
    total: results.length,
    authentic: results.filter(r => r.type === 'image' && r.classification === 'authentic').length,
    counterfeit: results.filter(r => r.type === 'image' && r.classification === 'counterfeit').length,
    normal: results.filter(r => r.type === 'electrical' && r.classification === 'normal').length,
    anomaly: results.filter(r => r.type === 'electrical' && r.classification === 'anomaly_detected').length,
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Analysis Results Dashboard</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Comprehensive overview of all component authentication and electrical signature analyses.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-sm text-slate-600">Total Tests</div>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-emerald-600">{stats.authentic}</div>
          <div className="text-sm text-slate-600">Authentic</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{stats.counterfeit}</div>
          <div className="text-sm text-slate-600">Counterfeit</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{stats.normal}</div>
          <div className="text-sm text-slate-600">Normal</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{stats.anomaly}</div>
          <div className="text-sm text-slate-600">Anomalies</div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800">Recent Analysis Results</h3>
        </div>
        
        {results.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Results Yet</h3>
            <p className="text-slate-500">
              Start by uploading images or electrical data for analysis.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {results.map((result) => (
              <div key={result.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl border ${getBackgroundColor(result.classification, result.type)}`}>
                      {result.type === 'image' ? (
                        <FileImage className="w-6 h-6 text-blue-600" />
                      ) : (
                        <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-slate-800">{result.filename}</h4>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                          {result.type === 'image' ? 'Image Analysis' : 'Electrical Analysis'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.classification, result.type)}
                          <span className={`font-medium ${getStatusColor(result.classification, result.type)}`}>
                            {getStatusText(result.classification, result.type)}
                          </span>
                        </div>
                        <div className="text-slate-500 text-sm">
                          Confidence: {result.confidence}%
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-500">
                        {result.timestamp.toLocaleString()}
                      </div>
                      
                      {result.details && (
                        <div className="mt-3 text-sm text-slate-600">
                          {result.type === 'image' && result.details.dimensions && (
                            <div>Dimensions: {result.details.dimensions}</div>
                          )}
                          {result.type === 'image' && result.details.material && (
                            <div>Material: {result.details.material}</div>
                          )}
                          {result.type === 'electrical' && result.details.electricalSignature && (
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="bg-blue-50 p-2 rounded">
                                <div className="text-xs text-slate-500">Voltage</div>
                                <div className="font-medium text-blue-600">
                                  {result.details.electricalSignature.voltage.toFixed(2)}V
                                </div>
                              </div>
                              <div className="bg-emerald-50 p-2 rounded">
                                <div className="text-xs text-slate-500">Resistance</div>
                                <div className="font-medium text-emerald-600">
                                  {result.details.electricalSignature.resistance.toFixed(0)}Ω
                                </div>
                              </div>
                              <div className="bg-purple-50 p-2 rounded">
                                <div className="text-xs text-slate-500">Current</div>
                                <div className="font-medium text-purple-600">
                                  {result.details.electricalSignature.current.toFixed(3)}A
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBackgroundColor(result.classification, result.type)} ${getStatusColor(result.classification, result.type)}`}>
                      {result.confidence}% confident
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;