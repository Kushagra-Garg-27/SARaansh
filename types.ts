export type RiskLevel = 'High' | 'Medium' | 'Low';
export type CaseStatus = 'Open' | 'In Review' | 'Drafting' | 'QA Pending' | 'Filed' | 'Escalated' | 'Ready for Filing';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  counterparty: string;
  type: 'Wire' | 'ACH' | 'Cash' | 'Crypto';
  direction: 'Inbound' | 'Outbound';
  flagged: boolean;
  description?: string;
}

export interface Typology {
  id: string;
  name: string;
  description: string;
  confidence: number; // 0-1
  relatedTransactionIds: string[];
  rationale: string[]; // Defensible, regulator-safe reasoning
}

export interface Case {
  id: string;
  customerName: string;
  customerId: string;
  openedDate: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: CaseStatus;
  assignee: string;
  transactions: Transaction[];
  detectedTypologies: Typology[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  version?: string;
}

export interface NarrativeSection {
  id: string;
  title: string;
  content: string;
  citations: string[]; // Transaction IDs
}