import { useEffect, useState } from 'react';

import DocumentCard from '../components/DocumentCard';
import DocumentUpload from '../components/DocumentUpload';

import {
  deleteDocument as removeDocumentService,
  getDocuments,
} from '../services/documents';

import type { DocumentItem } from '../types/document';

import styles from '../styles/Documents.module.css';

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refreshDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data);
      setError('');
    } catch {
      setError("Couldn't load documents.");
    } finally {
      setLoading(false);
    }
  }

  async function removeDocument(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this document?'
    );

    if (!confirmed) return;

    try {
      await removeDocumentService(id);
      await refreshDocuments();
    } catch {
      setError("Couldn't delete document.");
    }
  }

  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await getDocuments();
        setDocuments(data);
        setError('');
      } catch {
        setError("Couldn't load documents.");
      } finally {
        setLoading(false);
      }
    }

    void loadDocuments();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📄 My Documents</h1>

        <p>Upload, manage and keep track of your employment documents.</p>
      </div>

      <div className={styles.uploadSection}>
        <DocumentUpload onUploaded={refreshDocuments} />
      </div>

      {loading && (
        <div className={styles.message}>
          <p>Loading documents...</p>
        </div>
      )}

      {!loading && error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && documents.length === 0 && (
        <div className={styles.empty}>
          <h3>No documents uploaded</h3>

          <p>Upload your first document using the button above.</p>
        </div>
      )}

      {!loading && !error && documents.length > 0 && (
        <div className={styles.grid}>
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={removeDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}
