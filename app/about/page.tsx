"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Block } from "@/types/Block";

export default function AboutPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/about/blocks`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlocks(res.data);
        } else if (Array.isArray(res.data.blocks)) {
          setBlocks(res.data.blocks);
        }
      })
      .finally(() => setLoading(false));
  }, [baseUrl]);

  const sortedBlocks = React.useMemo(
    () =>
      [...blocks].sort((a, b) => {
        if (a.row === b.row) return a.column - b.column;
        return a.row - b.row;
      }),
    [blocks]
  );

  const grouped = React.useMemo(() => {
    return sortedBlocks.reduce((acc, b) => {
      acc[b.row] = acc[b.row] || [];
      acc[b.row].push(b);
      return acc;
    }, {} as Record<number, Block[]>);
  }, [sortedBlocks]);

  const sortedRows = React.useMemo(
    () =>
      Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b),
    [grouped]
  );

  if (loading) {
    return <div style={{ color: "#aaa", textAlign: "center", marginTop: "3rem" }}>Cargando...</div>;
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .about-container {
            padding-top: 100px;
          }
        }
      `}</style>

      <div className="about-container" style={{ marginTop: "3rem", background: "#111", padding: "2rem", borderRadius: "12px" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Sobre mí</h2>
        {sortedRows.length === 0 && (
          <div>
            <p style={{ color: "#aaa" }}>No hay contenido para mostrar.</p>
          </div>
        )}
        {sortedRows.map((rowIdx) => {
          const rowBlocks = grouped[rowIdx];
          return (
            <div
              key={rowIdx}
              style={{
                display: "flex",
                gap: "2rem",
                marginBottom: "2rem",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {rowBlocks.map((block) =>
                block.type === "text" ? (
                  <div
                    key={block.id}
                    style={{
                      flex: 1,
                      borderRadius: "8px",
                      padding: "1rem",
                      color: "#fff",
                      minHeight: "120px",
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
                      borderRadius: "8px",
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
    </>
  );
}
