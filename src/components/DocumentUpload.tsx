import { useState } from 'react';
import { uploadDocument } from '../services/documents';

interface Props {
  onUploaded: () => void;
}

export default function DocumentUpload({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert('Please choose a file.');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('file', file);

      formData.append('doc_type', file.name.split('.')[0]);

      await uploadDocument(formData);

      setFile(null);

      onUploaded();

      alert('Document uploaded successfully.');
    } catch {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        padding: 20,
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,.08)',
        marginBottom: 25,
      }}
    >
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          marginLeft: 15,
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          padding: '10px 18px',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
