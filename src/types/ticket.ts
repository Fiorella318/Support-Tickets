// src/types/ticket.ts
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Open' | 'In Progress' | 'Resolved';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}