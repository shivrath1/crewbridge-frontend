import api from './api';

export interface DocumentItem {
  id: number;
  doc_type: string;
  file: string;
  status: string;
  uploaded_at: string;
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const response = await api.get('/documents/');
  return response.data;
}

export async function deleteDocument(id: number): Promise<void> {
  await api.delete(`/documents/${id}/`);
}
