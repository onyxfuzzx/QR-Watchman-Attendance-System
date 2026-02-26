export interface AuditLog {
  id: string;
  action: string;
  tableName: string;
  recordId: string;
  adminName: string;
  createdAt: string;
  performedAt: string;
}
