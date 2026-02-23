import React from 'react';
import { MOCK_CASES } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/Badge';
import { Filter, Search, ChevronRight, Plus } from 'lucide-react';

export const CasesList: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-paper">
      <div className="px-8 py-8 bg-paper border-b border-neutral-200 z-10 opacity-0 animate-enter">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink-900 tracking-tight">Active Cases</h1>
            <p className="text-sm text-neutral-500 mt-2 font-light">Manage and review ongoing AML investigations.</p>
          </div>
          <button className="bg-ink-900 text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-all shadow-sharp active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2 hover:-translate-y-0.5 duration-300">
            <Plus size={16} /> New Investigation
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-ink-900" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID, customer..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-ink-900 focus:ring-0 transition-all placeholder:text-neutral-400 font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-neutral-300 bg-white text-sm font-medium text-ink-900 hover:border-ink-900 transition-colors hover:bg-neutral-50">
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white border border-neutral-200 opacity-0 animate-enter stagger-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-ink-900 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-display">Case ID</th>
                <th className="px-6 py-4 font-display">Customer</th>
                <th className="px-6 py-4 font-display">Opened</th>
                <th className="px-6 py-4 font-display">Risk</th>
                <th className="px-6 py-4 font-display">Status</th>
                <th className="px-6 py-4 font-display">Assignee</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {MOCK_CASES.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-neutral-50 transition-colors cursor-pointer group opacity-0 animate-enter"
                  style={{ animationDelay: `${100 + (index * 50)}ms` }}
                  onClick={() => onNavigate('case-detail')}
                >
                  <td className="px-6 py-5 font-mono text-xs font-medium text-ink-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-sm text-ink-900">{item.customerName}</div>
                    <div className="text-xs text-neutral-500 font-mono mt-0.5">{item.customerId}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-neutral-600 font-mono text-xs">{item.openedDate}</td>
                  <td className="px-6 py-5">
                    <RiskBadge level={item.riskLevel} />
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-5 text-sm text-ink-900">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-ink-900">
                            {item.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-xs font-medium">{item.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <ChevronRight size={16} className="text-neutral-300 group-hover:text-ink-900 transition-all group-hover:translate-x-1 duration-300 ease-editorial" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};