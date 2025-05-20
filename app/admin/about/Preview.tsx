import React from "react";

type Block = {
  id: string;
  type: "text" | "image";
  content: string;
  row: number;
  column: 0 | 1;
  imageHeight?: number;
  imageWidth?: number;
  objectFit?: string;
};

export default function Preview({ blocks }: { blocks: Block[] }) {
  const grouped = React.useMemo(() => {
    return blocks.reduce((acc, b) => {
      acc[b.row] = acc[b.row] || [];
      acc[b.row].push(b);
      return acc;
    }, {} as Record<number, Block[]>);
  }, [blocks]);

  const sortedRows = React.useMemo(
    () =>
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b),
    [grouped]
  );

  return (
    <div style={{ marginTop: "3rem", background: "#111", padding: "2rem", borderRadius: "12px" }}>
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Previsualización</h2>
      {sortedRows.length === 0 && (
        <div>
          <p style={{ color: "#aaa" }}>No hay contenido para previsualizar.</p>
        </div>
      )}
      {sortedRows.map((rowIdx) => {
        const rowBlocks = (grouped[rowIdx] || []).sort((a, b) => a.column - b.column);
        return (
          <div
            key={rowIdx}
            style={{
              display: "flex",
              gap: "2rem",
              marginBottom: "2rem",
              alignItems: "flex-start",
            }}
          >
            {rowBlocks.map((block) =>
              block.type === "text" ? (
                <div
                  key={block.id}
                  style={{
                    flex: 1,
                    background: "#18181b",
                    borderRadius: "8px",
                    padding: "1rem",
                    color: "#fff",
                    minHeight: "120px",
                    border: "1px solid #333",
                    overflow: "auto",
                  }}
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              ) : (
                <div
                  key={block.id}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "120px",
                    background: "#18181b",
                    borderRadius: "8px",
                    border: "1px solid #333",
                  }}
                >
                  {block.content ? (
                    <img
                      src={block.content}
                      alt="preview"
                      style={{
                        width: block.imageWidth ? `${block.imageWidth}%` : "100%",
                        height: block.imageHeight ? `${block.imageHeight}px` : "220px",
                        objectFit: (block.objectFit || "contain") as React.CSSProperties["objectFit"],
                        borderRadius: "6px",
                        border: "1px solid #333",
                        display: "block",
                        margin: "0 auto",
                        background: "#222",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#555" }}>Sin imagen</span>
                  )}
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
