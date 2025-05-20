"use client";
import React, { useEffect, useState } from "react";
import Preview from "../Preview"; // Importa el componente Preview

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

export default function AboutPreviewPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch("http://localhost:5050/api/about/blocks")
      .then((res) => res.json())
      .then((data) => setBlocks(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel("about-preview");
    channel.onmessage = (event) => {
      setBlocks(event.data);
    };
    return () => channel.close();
  }, []);

  return (
    <div>
      <a href="/admin/about" style={{ color: "#60a5fa" }}>← Volver al editor</a>
      <Preview blocks={blocks} />
    </div>
  );
}