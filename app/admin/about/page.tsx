"use client";

import { useEffect, useState, useMemo, memo, useCallback, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TiptapEditor from "@/components/TiptapEditor";

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

export default function AboutEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const previewChannel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    previewChannel.current = new BroadcastChannel("about-preview");
    return () => previewChannel.current?.close();
  }, []);

  useEffect(() => {
    if (previewChannel.current) {
      previewChannel.current.postMessage(blocks);
    }
  }, [blocks]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);

    axios
      .get("http://localhost:5050/api/about/blocks")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const sorted = res.data.sort((a, b) => {
            if (a.row === b.row) return a.column - b.column;
            return a.row - b.row;
          });
          setBlocks(sorted);
        }
      })
      .catch(() => setBlocks([]));
  }, []);

  const handleAddRow = () => {
    const nextRow = Math.max(-1, ...blocks.map((b) => b.row)) + 1;
    const newLeft: Block = {
      id: uuidv4(),
      type: "text",
      content: "",
      row: nextRow,
      column: 0,
    };
    const newRight: Block = {
      id: uuidv4(),
      type: "image",
      content: "",
      row: nextRow,
      column: 1,
      imageHeight: 220,
      imageWidth: 100,
      objectFit: "contain",
    };
    setBlocks([...blocks, newLeft, newRight]);
  };

  const handleUpdateContent = useCallback(
    (
      id: string,
      content: string,
      imageHeight?: number,
      imageWidth?: number,
      objectFit?: string
    ) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                content,
                ...(imageHeight !== undefined ? { imageHeight } : {}),
                ...(imageWidth !== undefined ? { imageWidth } : {}),
                ...(objectFit !== undefined ? { objectFit } : {}),
              }
            : b
        )
      );
    },
    []
  );

  const handleFileChange = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, content: reader.result as string } : b
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const dragged = blocks.find((b) => b.id === active.id);
    const target = blocks.find((b) => b.id === over.id);
    if (!dragged || !target || dragged.row !== target.row) return;

    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === dragged.id) return { ...b, column: target.column };
        if (b.id === target.id) return { ...b, column: dragged.column };
        return b;
      })
    );
  };

  const handleSave = async () => {
    const rows = Object.values(
      blocks.reduce((acc, block) => {
        acc[block.row] = acc[block.row] || [];
        acc[block.row].push(block);
        return acc;
      }, {} as Record<number, Block[]>)
    ).map((row) => row.sort((a, b) => a.column - b.column));

    try {
      await axios.post("http://localhost:5050/api/about/blocks", rows, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Contenido guardado correctamente");
    } catch {
      alert("Error al guardar contenido.");
    }
  };

  const handleDeleteRow = (rowIdx: number) => {
    setBlocks((prev) => prev.filter((b) => b.row !== rowIdx));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

  const SortableItem = memo(({ block }: { block: Block }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: block.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      border: "2px solid #ef4444",
      borderRadius: "10px",
      background: "#18181b",
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.15)",
      padding: "16px",
      margin: "8px 0",
      minHeight: "140px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    };

    return (
      <div ref={setNodeRef} style={{ ...style, height: "100%" }} {...attributes}>
        <div
          {...listeners}
          style={{
            cursor: "grab",
            color: "#ef4444",
            fontWeight: "bold",
            marginBottom: "8px",
            fontSize: "14px",
          }}
        >
          ⠿ Arrastrar
        </div>
        <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
          {block.type === "text" ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Aquí deberías tener tu editor de texto enriquecido, por ejemplo TiptapEditor */}
              <TiptapEditor
                value={block.content}
                onChange={(content) => handleUpdateContent(block.id, content)}
                style={{ flex: 1 }}
              />
            </div>
          ) : (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "8px" }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    e.target.files && handleFileChange(block.id, e.target.files[0])
                  }
                  id={`file-input-${block.id}`}
                />
                <button
                  type="button"
                  style={{
                    background: "#222",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    width: "80%",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onClick={() => document.getElementById(`file-input-${block.id}`)?.click()}
                >
                  Seleccionar imagen
                </button>
              </label>
              {block.content && (
                <div style={{ height: "100%", width: "100%", flex: 1 }}>
                  <img
                    src={block.content}
                    alt="preview"
                    style={{
                      width: block.imageWidth ? `${block.imageWidth}%` : "100%",
                      height: block.imageHeight ? `${block.imageHeight}px` : "220px",
                      objectFit: block.objectFit || "contain",
                      borderRadius: "6px",
                      border: "1px solid #333",
                      display: "block",
                      margin: "0 auto",
                      background: "#222",
                    }}
                  />
                </div>
              )}
              {block.type === "image" && (
                <div style={{ margin: "8px 0" }}>
                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        color: "#fff",
                        fontSize: "12px",
                        marginBottom: "2px",
                      }}
                    >
                      Alto de imagen: {block.imageHeight || 220}px
                    </label>
                    <input
                      type="range"
                      min={80}
                      max={400}
                      value={block.imageHeight || 220}
                      onChange={(e) =>
                        handleUpdateContent(
                          block.id,
                          block.content,
                          Number(e.target.value),
                          block.imageWidth,
                          block.objectFit
                        )
                      }
                      style={{ width: "80%", display: "block", margin: "0 auto" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        color: "#fff",
                        fontSize: "12px",
                        marginBottom: "2px",
                      }}
                    >
                      Ancho de imagen: {block.imageWidth || 100}%
                    </label>
                    <input
                      type="range"
                      min={30}
                      max={100}
                      value={block.imageWidth || 100}
                      onChange={(e) =>
                        handleUpdateContent(
                          block.id,
                          block.content,
                          block.imageHeight,
                          Number(e.target.value),
                          block.objectFit
                        )
                      }
                      style={{ width: "80%", display: "block", margin: "0 auto" }}
                    />
                  </div>
                  <select
                    value={block.objectFit || "contain"}
                    onChange={(e) =>
                      handleUpdateContent(
                        block.id,
                        block.content,
                        block.imageHeight,
                        block.imageWidth,
                        e.target.value
                      )
                    }
                    style={{
                      width: "80%",
                      margin: "0 auto",
                      display: "block",
                      marginTop: "8px",
                    }}
                  >
                    <option value="contain">Encajar (ver todo)</option>
                    <option value="cover">Recortar (rellenar)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ marginTop: "12px" }}>
          <button
            onClick={() => handleDeleteBlock(block.id)}
            style={{
              color: "#ef4444",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Eliminar bloque
          </button>
          {block.type === "image" && block.content && (
            <button
              onClick={() => handleUpdateContent(block.id, "")}
              style={{
                color: "#60a5fa",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Borrar imagen
            </button>
          )}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div>
        <div>
          <a href="/admin">← Salir</a>
          <h1>Editar página Sobre mí</h1>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>

        <div>
          <button onClick={handleAddRow}>Añadir fila</button>
          <button onClick={handleSave}>Guardar cambios</button>
        </div>

        <div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div>
              {sortedRows.map((rowIdx) => {
                const rowBlocks = (grouped[rowIdx] || []).sort(
                  (a, b) => a.column - b.column
                );
                let blocksToRender = [...rowBlocks];
                if (rowBlocks.length < 2) {
                  const missingColumn =
                    rowBlocks.length === 1 && rowBlocks[0].column === 0 ? 1 : 0;
                  blocksToRender.push({
                    id: `empty-${rowIdx}`,
                    content: "",
                    row: rowIdx,
                    column: missingColumn,
                  } as Block);
                  blocksToRender = blocksToRender.sort(
                    (a, b) => a.column - b.column
                  );
                }

                return (
                  <div
                    key={rowIdx}
                    style={{ position: "relative", marginBottom: "2rem" }}
                  >
                    <SortableContext
                      items={blocksToRender.map((b) => b.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <button
                        onClick={() => handleDeleteRow(rowIdx)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 2,
                          background: "#18181b",
                          color: "#ef4444",
                          border: "none",
                          fontWeight: "bold",
                          padding: "6px 18px",
                          borderRadius: "0 0 0 10px",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                          marginRight: "12px",
                          marginTop: "8px",
                          fontSize: "15px",
                          letterSpacing: "0.5px",
                          transition: "background 0.2s, color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#2a2a2e";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#18181b";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                      >
                        Eliminar fila
                      </button>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "45% 45%",
                          gap: "1rem",
                          minHeight: "220px",
                          alignItems: "stretch",
                          paddingLeft: "2%",
                          paddingRight: "2%",
                        }}
                      >
                        {blocksToRender.map((block) =>
                          block.id.startsWith("empty-") ? (
                            <div key={block.id}></div>
                          ) : (
                            <SortableItem key={block.id} block={block} />
                          )
                        )}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
          </DndContext>
        </div>

        {sortedRows.length === 0 && (
          <div>
            <p>No hay contenido. Haz clic en "Añadir fila" para comenzar.</p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "10px 24px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
            onClick={() => window.open("/admin/about/preview", "_blank")}
          >
            Ver previsualización
          </button>
        </div>
      </div>
    </div>
  );
}