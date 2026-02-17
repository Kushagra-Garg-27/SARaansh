import React, { useState, useEffect } from 'react';
import { MOCK_CASES, MOCK_TRANSACTIONS } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/Badge';
import { 
  CheckCircle, AlertTriangle, Play, FileText, Search, 
  ArrowRight, RefreshCw, Shield, ChevronDown, ChevronRight, Lock, History, X, Sparkles, FileCheck, CornerDownRight
} from 'lucide-react';
import { Transaction, CaseStatus } from '../types';

// Mock Agent Steps
type AgentStep = 'idle' | 'retrieving' | 'analyzing' | 'drafting' | 'complete' | 'fact_checking' | 'verified';

const GeneratedNarrative = ({ onHighlight, activeId }: { onHighlight: (ids: string[]) => void, activeId: string | null }) => {
  const sections = [
    {
      title: "1.0 Executive Summary",
      content: "A review of transaction activity for Aries Import/Export Ltd. (CUST-8821) was conducted following alerts for potential structuring. The customer has been a client since 2019 and operates in the logistics sector. The activity under review occurred between Oct 12, 2023, and Oct 20, 2023, totaling $48,600 in aggregate flows.",
      ids: []
    },
    {
      title: "2.0 Structuring Activity",
      content: "Between October 12 and October 18, 2023, the account received multiple cash deposits appearing to be structured to avoid CTA reporting thresholds. Specifically, a cash deposit of $9,800 was made on Oct 12 (TRX-8921), followed by $9,500 on Oct 13 (TRX-8922). A subsequent deposit of $9,900 occurred on Oct 18 (TRX-8941).",
      ids: ['TRX-8921', 'TRX-8922', 'TRX-8941']
    },
    {
      title: "3.0 Rapid Movement of Funds",
      content: "Following the accumulation of cash deposits, funds were immediately wired out to external entities. On Oct 15, $19,300 was wired to 'Shell Corp LLC' (TRX-8925). On Oct 20, an additional $9,900 was wired to 'CryptoExchange Inc' (TRX-8955), a high-risk counterparty type.",
      ids: ['TRX-8925', 'TRX-8955']
    },
    {
      title: "4.0 Conclusion",
      content: "The pattern of cash deposits falling just below the $10,000 threshold, combined with the immediate wire transfers to high-risk counterparties, is indicative of structuring and potential layering. This activity is inconsistent with the customer's historical profile. SAR filing is recommended.",
      ids: []
    }
  ];

  return (
    <div className="space-y-10 text-ink-900 font-serif leading-relaxed max-w-3xl mx-auto py-8 opacity-0 animate-enter duration-500">
      {sections.map((section, idx) => (
        <div key={idx} className="opacity-0 animate-enter" style={{ animationDelay: `${idx * 150}ms` }}>
          <h4 className="font-display font-bold text-ink-900 mb-4 text-base uppercase tracking-tight">{section.title}</h4>
          <p 
            className={`font-sans text-[15px] leading-8 text-neutral-800 transition-colors duration-300 ${
              section.ids.some(id => id === activeId) 
                ? 'bg-accent/10 -mx-4 px-4 py-2' 
                : ''
            }`}
            onClick={() => onHighlight(section.ids)}
          >
            {section.content.split(/(\(TRX-\d{4}\))/g).map((part, i) => {
               if (part.match(/\(TRX-\d{4}\)/)) {
                 const id = part.replace(/[()]/g, '');
                 return (
                   <span 
                     key={i}
                     className={`font-mono text-[11px] font-medium px-1 mx-0.5 border-b-2 cursor-pointer transition-all duration-200 ${
                       activeId === id 
                       ? 'bg-ink-900 text-white border-ink-900' 
                       : 'text-ink-900 border-neutral-300 hover:border-accent hover:text-accent'
                     }`}
                     onClick={(e) => {
                       e.stopPropagation();
                       onHighlight([id]);
                     }}
                   >
                     {id}
                   </span>
                 );
               }
               return part;
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

const InvestigationRationale: React.FC<{ rationale: string[] }> = ({ rationale }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!rationale || rationale.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-neutral-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-ink-900 transition-colors w-full group select-none"
      >
        <div className={`transition-transform duration-300 ease-editorial ${isOpen ? 'rotate-90' : ''}`}>
          <ChevronRight size={14} />
        </div>
        Investigation Rationale
      </button>
      
      {isOpen && (
        <div className="mt-4 pl-6 border-l border-neutral-300 opacity-0 animate-enter duration-300">
          <ul className="space-y-3">
            {rationale.map((reason, idx) => (
              <li key={idx} className="text-xs text-neutral-700 leading-relaxed font-mono">
                [NOTE] {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Toast = ({ message, visible, onClose }: { message: string, visible: boolean, onClose: () => void }) => {
  if (!visible) return null;
  return (
    <div className="fixed bottom-8 right-8 bg-ink-900 text-white px-6 py-4 shadow-sharp flex items-center gap-6 animate-enter z-50">
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export const CaseDetail: React.FC = () => {
  const caseData = MOCK_CASES[0];
  const [status, setStatus] = useState<CaseStatus>(caseData.status);
  const [agentState, setAgentState] = useState<AgentStep>('idle');
  const [activeTab, setActiveTab] = useState<'evidence' | 'typologies'>('evidence');
  const [highlightedTxIds, setHighlightedTxIds] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const handleEscalate = () => {
    setStatus('Escalated');
    showToast("Case escalated for senior review.");
  };

  const handleSubmitSAR = () => {
    if (agentState !== 'verified') return;
    setStatus('Ready for Filing');
    showToast("SAR approved and marked ready for filing.");
  };

  const isLocked = status === 'Ready for Filing' || status === 'Escalated';

  const runAgent = () => {
    setAgentState('retrieving');
    setLogs([]);
    setTimeout(() => {
      setLogs(prev => [...prev, "Querying Core Banking DB... Found 58 transactions."]);
      setAgentState('analyzing');
    }, 1500);
    setTimeout(() => {
      setLogs(prev => [...prev, "Loading Regulatory Typologies (FinCEN 2023)...", "Detected: Structuring (0.98), Layering (0.85)"]);
      setAgentState('drafting');
    }, 3500);
    setTimeout(() => {
      setLogs(prev => [...prev, "Synthesizing Narrative...", "Mapping Evidence IDs..."]);
      setAgentState('complete');
    }, 5500);
  };

  const runFactCheck = () => {
    setAgentState('fact_checking');
    setTimeout(() => {
      setLogs(prev => [...prev, "Verifying amounts against Source of Truth...", "Checking dates chronology..."]);
    }, 1000);
    setTimeout(() => {
      setAgentState('verified');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-paper relative">
      <Toast 
        message={toast.message} 
        visible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-8 py-5 flex items-center justify-between flex-shrink-0 z-10 opacity-0 animate-enter">
        <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-ink-900 text-white flex items-center justify-center font-display font-bold text-sm">
                {caseData.customerName.substring(0, 2).toUpperCase()}
            </div>
            <div>
            <div className="flex items-center gap-4 mb-1">
                <h1 className="text-xl font-display font-bold text-ink-900 tracking-tight">{caseData.id}</h1>
                <StatusBadge status={status} />
                <RiskBadge level={caseData.riskLevel} />
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-3 font-mono">
                <span>{caseData.customerName}</span> 
                <span className="text-neutral-300">|</span>
                <span>{caseData.customerId}</span>
            </div>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleEscalate}
            disabled={isLocked}
            className={`px-5 py-2.5 bg-white border border-neutral-300 text-ink-900 text-xs font-semibold hover:border-ink-900 transition-all hover:-translate-y-0.5 active:translate-y-0 ${
              isLocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Escalate Case
          </button>
          <button 
            onClick={handleSubmitSAR}
            disabled={isLocked || agentState !== 'verified'}
            className={`px-5 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 ${
              isLocked || agentState !== 'verified' 
                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed' 
                : 'bg-ink-900 text-white hover:bg-accent border border-ink-900 hover:border-accent'
            }`}
          >
            <FileCheck size={14} /> Submit SAR
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Narrative */}
        <div className="flex-1 flex flex-col border-r border-neutral-200 bg-white max-w-4xl relative z-0 opacity-0 animate-enter stagger-1">
          <div className="px-8 py-4 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <FileText className="text-ink-900" size={16} />
              <h2 className="font-display font-semibold text-sm text-ink-900 uppercase tracking-widest">Narrative Draft</h2>
              {isLocked && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 uppercase tracking-wide">
                  <Lock size={10} /> Locked
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {agentState === 'complete' && !isLocked && (
                <button 
                  onClick={runFactCheck}
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-white text-ink-900 border border-ink-900 hover:bg-ink-900 hover:text-white transition-colors"
                >
                  <Shield size={10} /> Fact Check
                </button>
              )}
              {agentState === 'verified' && (
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-ink-900 text-white animate-enter">
                  <CheckCircle size={10} /> Verified
                </span>
              )}
              <span className="text-xs font-mono text-neutral-400 ml-2">v1.2</span>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto p-12 relative ${isLocked ? 'opacity-80 grayscale' : ''}`}>
            
            {agentState === 'idle' ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 animate-enter">
                <div className="w-16 h-16 border-2 border-neutral-200 flex items-center justify-center mb-8">
                  <Sparkles size={24} className="text-neutral-300" />
                </div>
                <h3 className="text-ink-900 font-display font-bold text-xl mb-4">Generate Narrative</h3>
                <p className="mb-10 font-medium text-sm text-neutral-500 text-center max-w-xs leading-relaxed">
                    AI-powered analysis of transaction patterns and defensible narrative drafting.
                </p>
                <button 
                  onClick={runAgent}
                  disabled={isLocked}
                  className="px-8 py-3 bg-ink-900 text-white shadow-sharp hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
                >
                  <Play size={14} fill="currentColor" /> Start Generation
                </button>
              </div>
            ) : agentState === 'retrieving' || agentState === 'analyzing' || agentState === 'drafting' ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-10">
                  <div className="flex items-center justify-center mb-10">
                     <RefreshCw className="animate-spin text-ink-900" size={40} strokeWidth={1} />
                  </div>
                  <div className="space-y-6 border-l border-neutral-200 pl-8">
                    <LoadingStep 
                      label="Retrieving Data" 
                      status={agentState === 'retrieving' ? 'current' : 'done'} 
                    />
                    <LoadingStep 
                      label="Analyzing Patterns" 
                      status={agentState === 'analyzing' ? 'current' : (agentState === 'retrieving' ? 'waiting' : 'done')} 
                    />
                    <LoadingStep 
                      label="Drafting Narrative" 
                      status={agentState === 'drafting' ? 'current' : 'waiting'} 
                    />
                  </div>
                  <div className="h-32 bg-neutral-50 border border-neutral-200 p-4 font-mono text-[10px] text-ink-900 overflow-y-auto mt-8">
                    {logs.map((log, i) => (
                      <div key={i} className="mb-1 opacity-0 animate-enter" style={{animationDelay: `${i*100}ms`}}>
                        <span className="text-neutral-400 mr-2">&gt;</span>{log}
                      </div>
                    ))}
                    <div className="animate-pulse text-ink-900">_</div>
                  </div>
                </div>
              </div>
            ) : (
              <GeneratedNarrative 
                activeId={highlightedTxIds[0] || null} 
                onHighlight={setHighlightedTxIds} 
              />
            )}
          </div>
        </div>

        {/* Right Pane: Evidence Board */}
        <div className="w-[440px] flex-shrink-0 flex flex-col bg-paper border-l border-neutral-200 opacity-0 animate-enter stagger-2">
          <div className="flex border-b border-neutral-200 bg-white">
            <button 
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'evidence' ? 'border-ink-900 text-ink-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
              onClick={() => setActiveTab('evidence')}
            >
              Transactions
            </button>
            <button 
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'typologies' ? 'border-ink-900 text-ink-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
              onClick={() => setActiveTab('typologies')}
            >
              Typologies <span className="ml-1 bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-none text-[10px]">{caseData.detectedTypologies.length}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === 'evidence' && (
              <>
                <div className="relative mb-6 group opacity-0 animate-enter">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                  <input type="text" placeholder="Filter transactions..." className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-ink-900 bg-white transition-all placeholder:text-neutral-400" />
                </div>
                {caseData.transactions.map((tx, idx) => {
                  const isHighlighted = highlightedTxIds.includes(tx.id);
                  return (
                    <div 
                      key={tx.id}
                      className={`p-4 border text-sm transition-all duration-300 relative group cursor-default opacity-0 animate-enter ${
                        isHighlighted 
                          ? 'bg-ink-900 text-white border-ink-900 shadow-sharp scale-[1.02]' 
                          : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-paper'
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`font-mono text-[10px] font-medium px-1 border ${isHighlighted ? 'text-white border-white' : 'text-neutral-500 border-neutral-200'}`}>{tx.id}</span>
                        <span className={`text-[10px] font-medium ${isHighlighted ? 'text-neutral-400' : 'text-neutral-400'}`}>{tx.date}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold text-xs ${isHighlighted ? 'text-white' : 'text-ink-900'}`}>{tx.counterparty}</span>
                        <span className={`font-mono font-medium text-xs ${isHighlighted ? 'text-accent' : 'text-ink-900'}`}>
                          {tx.direction === 'Inbound' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </span>
                      </div>
                      {tx.flagged && (
                         <div className={`mt-3 pt-2 border-t ${isHighlighted ? 'border-neutral-700' : 'border-neutral-100'} flex items-center gap-2`}>
                            <AlertTriangle size={10} className={isHighlighted ? 'text-accent' : 'text-ink-900'} />
                            <span className={`text-[10px] uppercase tracking-wide font-bold ${isHighlighted ? 'text-accent' : 'text-ink-900'}`}>Flagged Activity</span>
                         </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'typologies' && (
              <div className="space-y-6">
                {caseData.detectedTypologies.map((typology, idx) => (
                  <div 
                    key={typology.id} 
                    className="bg-white p-5 border border-neutral-200 hover:border-ink-900 transition-all opacity-0 animate-enter duration-500 hover:shadow-paper"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display font-bold text-sm text-ink-900 uppercase tracking-tight">{typology.name}</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-ink-900 text-white">
                        {Math.floor(typology.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-serif">
                      {typology.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {typology.relatedTransactionIds.map(id => (
                        <button 
                          key={id}
                          className="text-[10px] font-mono bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-1 hover:bg-ink-900 hover:text-white transition-colors"
                          onClick={() => setHighlightedTxIds([id])}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                    {/* Integrated Investigation Rationale Component */}
                    <InvestigationRationale rationale={typology.rationale} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingStep = ({ label, status }: { label: string, status: 'waiting' | 'current' | 'done' }) => {
  return (
    <div className={`flex items-center gap-4 ${status === 'waiting' ? 'opacity-30' : 'opacity-100'}`}>
      <div className={`w-3 h-3 flex-shrink-0 transition-all duration-500 ${
        status === 'done' ? 'bg-ink-900' : 
        status === 'current' ? 'bg-accent animate-pulse' : 
        'bg-neutral-200'
      }`} />
      <span className={`text-sm font-display font-medium tracking-tight ${status === 'current' ? 'text-ink-900' : 'text-neutral-500'}`}>
        {label}
      </span>
    </div>
  );
};