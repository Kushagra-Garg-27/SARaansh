import React from 'react';
import { MOCK_CASES } from '../data/mockData';
import { ArrowUpRight, CheckCircle, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend, delay }: any) => (
  <div 
    className="bg-white p-6 border border-neutral-200 hover:border-ink-900 transition-all duration-300 opacity-0 animate-enter hover:-translate-y-1 hover:shadow-paper"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-start justify-between mb-6">
      <Icon size={20} className="text-ink-900" />
      <span className="font-mono text-xs text-neutral-500 bg-neutral-50 px-2 py-1 border border-neutral-100">
        {trend}
      </span>
    </div>
    <div>
      <h3 className="text-4xl font-display font-bold text-ink-900 tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-neutral-500 mt-2 uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const highRiskCount = MOCK_CASES.filter(c => c.riskLevel === 'High').length;
  const openCount = MOCK_CASES.filter(c => c.status !== 'Filed').length;

  return (
    <div className="p-8 lg:p-12 space-y-12 overflow-y-auto h-full bg-paper">
      <header className="flex justify-between items-end border-b border-neutral-200 pb-8 opacity-0 animate-enter">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink-900 tracking-tight">Executive Overview</h1>
          <p className="text-neutral-500 mt-2 text-base font-light">AML Alert & SAR Generation Status</p>
        </div>
        <div className="flex gap-2">
            <span className="font-mono text-xs text-neutral-400">
                UPDATED: {new Date().toLocaleTimeString()}
            </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-neutral-200">
        <div className="border-r border-b border-neutral-200">
            <StatCard label="Open Cases" value={openCount} icon={Clock} trend="+12%" delay="100ms" />
        </div>
        <div className="border-r border-b border-neutral-200">
            <StatCard label="High Risk Alerts" value={highRiskCount} icon={AlertTriangle} trend="+4%" delay="150ms" />
        </div>
        <div className="border-r border-b border-neutral-200">
            <StatCard label="SARs Filed" value="142" icon={CheckCircle} trend="+8%" delay="200ms" />
        </div>
        <div className="border-r border-b border-neutral-200">
            <StatCard label="Avg. Resolution" value="4.2d" icon={Activity} trend="-2%" delay="250ms" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col opacity-0 animate-enter stagger-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold text-xl text-ink-900">Priority Investigations</h3>
            <button 
              onClick={() => onNavigate('cases')}
              className="text-sm text-ink-900 font-medium hover:text-accent transition-colors underline decoration-1 underline-offset-4"
            >
              View All Cases
            </button>
          </div>
          
          <div className="bg-white border border-neutral-200">
            {MOCK_CASES.filter(c => c.riskLevel === 'High').map((c, idx) => (
              <div 
                key={c.id} 
                className={`p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors group cursor-pointer ${idx !== MOCK_CASES.filter(x=>x.riskLevel==='High').length-1 ? 'border-b border-neutral-200' : ''}`}
                onClick={() => onNavigate('case-detail')}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-ink-900 font-display font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                    {c.customerName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900 text-base">{c.customerName}</div>
                    <div className="text-xs text-neutral-500 mt-1 flex items-center gap-3">
                        <span className="font-mono">{c.id}</span>
                        <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                        <span>{c.detectedTypologies.length} Typologies</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-900 bg-accent px-2 py-1">
                        High Risk
                    </span>
                    <ArrowUpRight size={18} className="text-neutral-300 group-hover:text-ink-900 transition-colors group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 ease-editorial" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink-900 p-8 text-white flex flex-col relative overflow-hidden opacity-0 animate-enter stagger-4 hover:shadow-2xl transition-shadow duration-500">
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8">
                <Activity size={24} className="text-accent mb-4" />
                <h3 className="font-display font-bold text-2xl">System Status</h3>
                <p className="text-sm text-neutral-400 mt-1">Intelligence Engine</p>
            </div>
            
            <div className="space-y-6 flex-1 border-t border-neutral-800 pt-6">
              <div className="flex items-center justify-between group">
                <span className="text-neutral-400 text-sm">Model Version</span>
                <span className="font-mono text-xs text-white">LLaMA 3.1 70B</span>
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-neutral-400 text-sm">RAG Status</span>
                <span className="text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                   Online <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
                </span>
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-neutral-400 text-sm">Typology Engine</span>
                <span className="text-white text-xs font-mono">v2.4.1</span>
              </div>
              
              <div className="pt-8 mt-auto">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">System Load</div>
                    <div className="text-xs font-mono text-accent">35%</div>
                </div>
                <div className="h-1 bg-neutral-800 w-full">
                  <div className="h-full bg-accent w-[35%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};