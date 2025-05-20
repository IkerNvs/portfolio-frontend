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
  const sensors = useSensors(useSensor(PointerSensor));
  const previewChannel = useRef<BroadcastChannel | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

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
      .get(`${baseUrl}/api/about/blocks`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const sorted = res.data.sort((a, b) =>
            a.row === b.row ? a.column - b.column : a.row - b.row
          );
          setBlocks(sorted);
        }
      })
      .catch(() => setBlocks([]));
  }, [baseUrl]);

  const handleSave = async () => {
    const rows = Object.values(
      blocks.reduce((acc, block) => {
        acc[block.row] = acc[block.row] || [];
        acc[block.row].push(block);
        return acc;
      }, {} as Record<number, Block[]>)
    ).map((row) => row.sort((a, b) => a.column - b.column));

    try {
      await axios.post(`${baseUrl}/api/about/blocks`, rows, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Contenido guardado correctamente");
    } catch {
      alert("Error al guardar contenido.");
    }
  };

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

  const handleDeleteRow = (rowIdx: number) => {
    setBlocks((prev) => prev.filter((b) => b.row !== rowIdx));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          border: "2px solid #ef4444",
          borderRadius: "10px",
          background: "#18181b",
          padding: "16px",
          margin: "8px 0",
          minHeight: "140px",
        }}
        {...attributes}
      >
        <div {...listeners} style={{ cursor: "grab", color: "#ef4444", fontWeight: "bold" }}>
          ⠿ Arrastrar
        </div>
        {block.type === "text" ? (
          <TiptapEditor
            value={block.content}
            onChange={(content) => handleUpdateContent(block.id, content)}
          />
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              style={{ margin: "8px 0" }}
              onChange={(e) =>
                e.target.files && handleFileChange(block.id, e.target.files[0])
              }
            />
            {block.content && (
              <img
                src={block.content}
                alt="preview"
                style={{
                  width: `${block.imageWidth || 100}%`,
                  height: `${block.imageHeight || 220}px`,
                  background: "#222",
                  borderRadius: "6px",
                }}
              />
            )}
          </>
        )}
        <button onClick={() => handleDeleteBlock(block.id)} style={{ color: "red" }}>
          Eliminar bloque
        </button>
      </div>
    );
  });

  return (
    <div>
      <a href="/admin">← Salir</a>
      <h1>Editor Sobre mí</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <button onClick={handleAddRow}>Añadir fila</button>
      <button onClick={handleSave}>Guardar cambios</button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {sortedRows.map((rowIdx) => {
          const rowBlocks = grouped[rowIdx].sort((a, b) => a.column - b.column);
          return (
            <div key={rowIdx} style={{ display: "flex", gap: "2rem", margin: "2rem 0" }}>
              <SortableContext items={rowBlocks.map((b) => b.id)} strategy={horizontalListSortingStrategy}>
                {rowBlocks.map((block) => (
                  <SortableItem key={block.id} block={block} />
                ))}
              </SortableContext>
              <button onClick={() => handleDeleteRow(rowIdx)}>🗑️ Eliminar fila</button>
            </div>
          );
        })}
      </DndContext>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={() => window.open("/admin/about/preview", "_blank")}>
          Ver previsualización
        </button>
      </div>
    </div>
  );
}
