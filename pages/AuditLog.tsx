import React from 'react';
import { MOCK_AUDIT_LOG } from '../data/mockData';
import { History, Shield, User, Database, Eye } from 'lucide-react';

export const AuditLog: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-paper">
      <div className="px-8 py-8 bg-paper border-b border-neutral-200 z-10 opacity-0 animate-enter">
        <h1 className="text-3xl font-display font-bold text-ink-900 flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-ink-900 text-white">
                <Shield size={24} />
            </div>
            System Audit Log
        </h1>
        <p className="text-sm text-neutral-500 mt-4 max-w-2xl font-mono border-l-2 border-accent pl-4">
            IMMUTABLE RECORD // SEQ-2023-X
        </p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto bg-white border border-neutral-200 shadow-sharp p-1 opacity-0 animate-enter stagger-1">
             <table className="w-full text-left text-sm font-mono">
               <thead className="bg-neutral-100 text-ink-900 border-b border-neutral-300 uppercase tracking-widest text-[10px] font-bold">
                 <tr>
                   <th className="px-6 py-4">Timestamp</th>
                   <th className="px-6 py-4">Actor</th>
                   <th className="px-6 py-4">Action</th>
                   <th className="px-6 py-4">Details</th>
                   <th className="px-6 py-4 text-right">Hash</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-200">
                 {MOCK_AUDIT_LOG.map((log, index) => (
                   <tr
                      key={log.id} 
                      className="hover:bg-neutral-50 transition-colors group opacity-0 animate-enter"
                      style={{ animationDelay: `${index * 50}ms` }}
                   >
                     <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">
                       {log.timestamp}
                     </td>
                     <td className="px-6 py-4 flex items-center gap-3">
                        {log.user === 'System' ? (
                          <Database size={12} className="text-neutral-400" />
                        ) : (
                          <User size={12} className="text-neutral-400" />
                        )}
                        <span className="font-bold text-ink-900 text-xs uppercase">{log.user}</span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`inline-block px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wide ${
                         log.action.includes('Created') ? 'bg-ink-900 text-white border-ink-900' :
                         log.action.includes('Scan') ? 'bg-accent text-ink-900 border-accent' :
                         'bg-white text-ink-900 border-neutral-300'
                       }`}>
                         {log.action}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-neutral-600 text-xs">
                       {log.details}
                     </td>
                     <td className="px-6 py-4 text-right text-[10px] text-neutral-400">
                       {btoa(log.id + log.timestamp).substring(0, 12)}...
                     </td>
                   </tr>
                 ))}
                 {/* Simulated additional rows */}
                 <tr className="hover:bg-neutral-50 transition-colors opacity-40 animate-enter stagger-2">
                    <td className="px-6 py-4 text-neutral-500">2023-10-21 18:00:00</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                        <Database size={12} className="text-neutral-400"/>
                        <span className="font-bold text-ink-900 text-xs uppercase">System</span>
                    </td>
                    <td className="px-6 py-4"><span className="bg-white text-ink-900 border border-neutral-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">Daily Sync</span></td>
                    <td className="px-6 py-4 text-neutral-600 text-xs">Batch transaction ingestion complete.</td>
                    <td className="px-6 py-4 text-right text-[10px] text-neutral-400">a1b2c3d4e5f6...</td>
                 </tr>
               </tbody>
             </table>
        </div>
      </div>
    </div>
  );
};