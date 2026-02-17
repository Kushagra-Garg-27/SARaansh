import React from 'react';
import { RiskLevel, CaseStatus } from '../types';

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  // Monochrome/Accent System
  const styles = {
    High: 'bg-ink-900 text-white border-ink-900', // Solid Black
    Medium: 'bg-white text-ink-900 border-ink-900', // Outlined Black
    Low: 'bg-white text-neutral-500 border-neutral-300', // Subtle Gray
  };

  return (
    <span className={`inline-flex items-center justify-center px-3 py-0.5 text-xs font-semibold uppercase tracking-wider border ${styles[level]}`}>
      {level}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  // Minimalist status indicators
  const styles: Record<string, string> = {
    'Open': 'text-neutral-600 bg-neutral-100 border-neutral-200',
    'In Review': 'text-ink-900 bg-accent/20 border-accent/40',
    'Drafting': 'text-ink-900 bg-neutral-100 border-neutral-300 dashed-border',
    'QA Pending': 'text-ink-900 border-ink-900',
    'Filed': 'text-white bg-ink-900 border-ink-900',
    'Escalated': 'text-ink-900 bg-neutral-50 border-ink-900 underline decoration-1 underline-offset-2',
    'Ready for Filing': 'text-ink-900 bg-accent border-accent',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${styles[status] || 'text-neutral-500 border-neutral-200'}`}>
      {status}
    </span>
  );
};