import api from './api';

export interface DocumentItem {
  id: number;
  doc_type: string;
  file: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploaded_at: string;
}

export const getDocuments = async () => {
  const response = await api.get<DocumentItem[]>('/documents/');
  return response.data;
};

export const uploadDocument = async (docType: string, file: File) => {
  const formData = new FormData();

  formData.append('doc_type', docType);
  formData.append('file', file);

  const response = await api.post('/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteDocument = async (id: number) => {
  await api.delete(`/documents/${id}/`);
};
