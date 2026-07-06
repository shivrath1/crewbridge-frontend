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

      const data = await getDocuments();

      setDocuments(data);
    } catch {
      setError("Couldn't load documents.");
    } finally {
      setLoading(false);
    }
  }

  async function removeDocument(id: number) {
    await deleteDocument(id);

    loadDocuments();
  }

  useEffect(() => {
    loadDocuments();
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

function DocumentCard({ document, onDelete }: { document: DocumentItem; onDelete: (id: number) => void }) {
  return (
    <div>
      <div>{(document as any).title ?? `Document ${document.id}`}</div>
      <button type="button" onClick={() => onDelete(document.id)}>
        Delete
      </button>
    </div>
  );
}

function DocumentUpload({ onUploaded }: { onUploaded: () => void }) {
  // Minimal placeholder upload component to satisfy usage in Documents
  return (
    <div>
      <button type="button" onClick={onUploaded}>
        Upload Document
      </button>
    </div>
  );
}
