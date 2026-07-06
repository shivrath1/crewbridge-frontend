import api from './api';
import type { DocumentItem } from '../types/document';

export async function getDocuments(): Promise<DocumentItem[]> {
  const response = await api.get('/documents/');
  return response.data;
}

export async function uploadDocument(formData: FormData) {
  const response = await api.post('/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function deleteDocument(id: number) {
  await api.delete(`/documents/${id}/`);
}
