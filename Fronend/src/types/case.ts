export type CaseStatus = 'In Progress' | 'Resolved' | 'Breakpoint';

export interface Case {
  case_id: string;
  address: string;
  chain: string;
  status: CaseStatus;
  submitted_at: string; // ISO 8601 datetime string
}
