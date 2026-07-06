import StatusBadge from './StatusBadge';
import type { DocumentItem } from '../types/document';

interface Props {
  document: DocumentItem;
  onDelete: (id: number) => void;
}

export default function DocumentCard({ document, onDelete }: Props) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 10px rgba(0,0,0,.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            color: '#1e3a8a',
          }}
        >
          {document.doc_type}
        </h3>

        <p
          style={{
            color: '#555',
            marginTop: 8,
          }}
        >
          {document.file}
        </p>

        <StatusBadge status={document.status} />

        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: '#777',
          }}
        >
          Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={() => onDelete(document.id)}
        style={{
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          padding: '10px 18px',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Delete
      </button>
    </div>
  );
}
