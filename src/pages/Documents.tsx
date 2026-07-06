import { useEffect, useState } from 'react';
import { deleteDocument, getDocuments } from '../services/documents';
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
    }
  }

  async function removeDocument(id: number) {
    try {
      await deleteDocument(id);
      await refreshDocuments();
    } catch {
      setError("Couldn't delete document.");
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchDocuments() {
      try {
        const data = await getDocuments();

        if (!ignore) {
          setDocuments(data);
          setError('');
        }
      } catch {
        if (!ignore) {
          setError("Couldn't load documents.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchDocuments();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📄 My Documents</h1>
        <p>Manage all of your uploaded documents.</p>
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
          <h3>No documents uploaded yet</h3>
          <p>Upload your first document to begin.</p>
        </div>
      )}

      <div className={styles.grid}>
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} onDelete={removeDocument} />
        ))}
      </div>
    </div>
  );
}

function DocumentCard({
  document,
  onDelete,
}: {
  document: DocumentItem;
  onDelete: (id: number) => void;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>📄</div>

      <div className={styles.content}>
        <h3>Document #{document.id}</h3>

        <p>{document.file}</p>

        <button
          className={styles.deleteButton}
          type="button"
          onClick={() => onDelete(document.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function DocumentUpload({ onUploaded }: { onUploaded: () => void }) {
  return (
    <div className={styles.uploadCard}>
      <button
        type="button"
        className={styles.uploadButton}
        onClick={onUploaded}
      >
        + Upload Document
      </button>
    </div>
  );
}
