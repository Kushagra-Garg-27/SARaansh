import { Case, AuditEvent } from '../types';

export const MOCK_TRANSACTIONS = [
  { id: 'TRX-8921', date: '2023-10-12', amount: 9800.00, currency: 'USD', counterparty: 'Cash Deposit', type: 'Cash', direction: 'Inbound', flagged: true, description: 'Branch deposit, just under threshold' },
  { id: 'TRX-8922', date: '2023-10-13', amount: 9500.00, currency: 'USD', counterparty: 'Cash Deposit', type: 'Cash', direction: 'Inbound', flagged: true, description: 'Branch deposit at different location' },
  { id: 'TRX-8925', date: '2023-10-15', amount: 19300.00, currency: 'USD', counterparty: 'Shell Corp LLC', type: 'Wire', direction: 'Outbound', flagged: true, description: 'Immediate transfer after aggregation' },
  { id: 'TRX-8940', date: '2023-10-18', amount: 500.00, currency: 'USD', counterparty: 'Coffee Shop', type: 'ACH', direction: 'Outbound', flagged: false },
  { id: 'TRX-8941', date: '2023-10-18', amount: 9900.00, currency: 'USD', counterparty: 'Cash Deposit', type: 'Cash', direction: 'Inbound', flagged: true, description: 'Structured deposit' },
  { id: 'TRX-8955', date: '2023-10-20', amount: 9900.00, currency: 'USD', counterparty: 'CryptoExchange Inc', type: 'Wire', direction: 'Outbound', flagged: true, description: 'High risk counterparty' },
] as const;

export const MOCK_CASES: Case[] = [
  {
    id: 'SAR-2023-001',
    customerName: 'Aries Import/Export Ltd.',
    customerId: 'CUST-8821',
    openedDate: '2023-10-22',
    riskScore: 92,
    riskLevel: 'High',
    status: 'In Review',
    assignee: 'Sarah Jenkins',
    transactions: [...MOCK_TRANSACTIONS],
    detectedTypologies: [
      {
        id: 'TYP-01',
        name: 'Structuring / Smurfing',
        description: 'Multiple cash deposits just under the $10,000 reporting threshold.',
        confidence: 0.98,
        relatedTransactionIds: ['TRX-8921', 'TRX-8922', 'TRX-8941'],
        rationale: [
          "Multiple cash deposits between $9,500 and $9,900 were identified across consecutive days.",
          "The aggregate cash volume of $29,200 within a 7-day period is inconsistent with the customer's historical monthly average of $4,500.",
          "Deposit activity occurred at multiple distinct branch locations, which may indicate an attempt to avoid localized detection."
        ]
      },
      {
        id: 'TYP-02',
        name: 'Rapid Movement of Funds',
        description: 'Funds are transferred out almost immediately after being deposited.',
        confidence: 0.85,
        relatedTransactionIds: ['TRX-8925', 'TRX-8955'],
        rationale: [
          "Inbound cash deposits were depleted via outgoing wire transfers within 24 hours of posting.",
          "Zero or near-zero end-of-day balances were maintained despite significant throughput.",
          "Transfers were directed to high-risk counterparty types (Crypto Exchange, Shell Company) lacking apparent commercial purpose for a Logistics entity."
        ]
      }
    ]
  },
  {
    id: 'SAR-2023-045',
    customerName: 'Northwest Consulting Group',
    customerId: 'CUST-1029',
    openedDate: '2023-10-25',
    riskScore: 75,
    riskLevel: 'Medium',
    status: 'Open',
    assignee: 'Unassigned',
    transactions: [],
    detectedTypologies: []
  },
  {
    id: 'SAR-2023-012',
    customerName: 'John Doe Enterprises',
    customerId: 'CUST-3312',
    openedDate: '2023-10-15',
    riskScore: 45,
    riskLevel: 'Low',
    status: 'Filed',
    assignee: 'Mike Ross',
    transactions: [],
    detectedTypologies: []
  }
];

export const MOCK_AUDIT_LOG: AuditEvent[] = [
  { id: 'LOG-001', timestamp: '2023-10-22 09:15:00', user: 'System', action: 'Case Created', details: 'Automated alert triggered from Transaction Monitoring System.' },
  { id: 'LOG-002', timestamp: '2023-10-22 09:16:30', user: 'System', action: 'Data Ingestion', details: 'Ingested 6 months of transaction history (58 records).' },
  { id: 'LOG-003', timestamp: '2023-10-22 09:17:00', user: 'System', action: 'Typology Scan', details: 'Detected Potential Structuring (98% confidence).' },
  { id: 'LOG-004', timestamp: '2023-10-22 10:30:00', user: 'Sarah Jenkins', action: 'Case Assignment', details: 'Case assigned to Sarah Jenkins.' },
];