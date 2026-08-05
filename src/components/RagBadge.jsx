export function RagBadge({ tone = "blue", children }) {
  return <span className={`rag rag-${tone}`}>{children}</span>;
}
