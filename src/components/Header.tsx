import React from 'react';
import { Shield, Cpu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Counterfeit Detection System
              </h1>
              <p className="text-blue-200 text-sm">AI-Powered Component Authentication</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right hidden md:block">
              <div className="text-sm text-blue-200">Status</div>
              <div className="flex items-center text-emerald-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                AI Models Active
              </div>
            </div>
            <Cpu className="w-8 h-8 text-blue-300" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;