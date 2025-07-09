
import React from 'react';
import { ClaimsManagement } from '@/components/ClaimsManagement';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Gestione Sinistri AI
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Sistema intelligente per la generazione automatica di bozze sinistri 
            a partire dalla documentazione caricata
          </p>
        </div>
        <ClaimsManagement />
      </div>
    </div>
  );
};

export default Index;
