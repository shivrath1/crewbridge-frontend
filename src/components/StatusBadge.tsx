interface StatusBadgeProps {
  status: string;
}

const colours: Record<string, string> = {
  VERIFIED: '#16a34a',
  PENDING: '#f59e0b',
  REJECTED: '#dc2626',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      style={{
        backgroundColor: colours[status] ?? '#6b7280',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}
