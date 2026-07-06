export interface DocumentItem {
  id: number;
  doc_type: string;
  file: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploaded_at: string;
}
