import React, { useMemo } from "react";

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
  const grouped = useMemo(() => {
    return blocks.reduce((acc, b) => {
      acc[b.row] = acc[b.row] || [];
      acc[b.row].push(b);
      return acc;
    }, {} as Record<number, Block[]>);
  }, [blocks]);

  const sortedRows = useMemo(
    () =>
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b),
    [grouped]
  );

  return (
    <div className="pt-[100px] mt-12 bg-[#111] p-8 rounded-xl">
      <h2 className="text-white text-xl mb-4 font-semibold">Previsualización</h2>

      {sortedRows.length === 0 ? (
        <p className="text-gray-400">No hay contenido para previsualizar.</p>
      ) : (
        sortedRows.map((rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-8 mb-8 items-start flex-wrap sm:flex-nowrap"
          >
            {(grouped[rowIdx] || []).sort((a, b) => a.column - b.column).map((block) => (
              <div
                key={block.id}
                className="flex-1 min-h-[120px] rounded-lg border border-[#333] p-4 bg-[#18181b]"
              >
                {block.type === "text" ? (
                  <div
                    className="text-white"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                ) : block.content ? (
                  <img
                    src={block.content}
                    alt="preview"
                    style={{
                      width: `${block.imageWidth || 100}%`,
                      height: `${block.imageHeight || 220}px`,
                      objectFit: block.objectFit || "contain",
                      borderRadius: "6px",
                      display: "block",
                      margin: "0 auto",
                      background: "#222",
                    }}
                  />
                ) : (
                  <span className="text-gray-600">Sin imagen</span>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
