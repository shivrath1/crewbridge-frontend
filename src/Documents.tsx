import { useEffect, useState } from 'react';
import { type DocumentItem, deleteDocument, getDocuments } from './document';
import styles from '../src/Documents.module.css';

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadDocuments() {
    try {
      setLoading(true);
      setError('');

      const data = await getDocuments();
      setDocuments(data);
    } catch {
      setError("Couldn't load documents.");
    } finally {
      setLoading(false);
    }
  }

  async function removeDocument(id: number) {
    try {
      await deleteDocument(id);
      await loadDocuments();
    } catch {
      setError("Couldn't delete document.");
    }
  }

  useEffect(() => {
    void (async () => {
      await loadDocuments();
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1>My Documents</h1>

      <DocumentUpload onUploaded={loadDocuments} />

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && documents.length === 0 && <p>No documents uploaded yet.</p>}

      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={removeDocument} />
      ))}
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
      <div>{`Document ${document.id}`}</div>

      <button type="button" onClick={() => onDelete(document.id)}>
        Delete
      </button>
    </div>
  );
}

function DocumentUpload({ onUploaded }: { onUploaded: () => void }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <button type="button" onClick={onUploaded}>
        Upload Document
      </button>
    </div>
  );
}
