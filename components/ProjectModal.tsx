
/*"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import TiptapEditor from "@/components/TiptapEditor";

type FormState = {
  title: string;
  description: string;
  link: string;
};

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: FormState;
  setForm: (f: FormState) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  preview: string;
  setPreview: (p: string) => void;
  loading: boolean;
  isEdit: boolean;
  currentImage?: string;
}

export default function ProjectModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  file,
  setFile,
  preview,
  setPreview,
  loading,
  isEdit,
  currentImage,
}: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Asegura que el portal solo se monte cuando el DOM está listo y en cliente
  useEffect(() => {
    setIsClient(true);
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      setFile(null);
      setPreview("");
    }
  };

  const imageToShow = preview || currentImage || "";

  // Solo renderiza el modal si está abierto, en cliente y el portal existe
  if (!isClient || !open || !modalRoot) return null;

  return ReactDOM.createPortal(
    <>
      {/* Capa de fondo oscurecido y desenfocado */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity"></div>

      {/* Modal */}
      <div className="modal-wrapper fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={modalRef}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-xl flex flex-col gap-8 relative"
        >
          <div className="bg-red-600 rounded-xl p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-2xl text-gray-200 hover:text-white"
              type="button"
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">
              {isEdit ? "Editar proyecto" : "Crear nuevo proyecto"}
            </h2>
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <div>
                <label className="block text-white font-semibold mb-2">Título</label>
                <input
                  ref={inputRef}
                  className="w-full border-2 border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg text-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
                  placeholder="Ej: Mi proyecto increíble"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Descripción enriquecida</label>
                <TiptapEditor
                  value={form.description}
                  onChange={(desc) => setForm({ ...form, description: desc })}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Enlace del proyecto</label>
                <input
                  className="w-full border-2 border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg text-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-400"
                  placeholder="https://tuproyecto.com"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-2 border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg bg-white dark:bg-gray-800"
                />
                {imageToShow && (
                  <div className="flex justify-center mt-3">
                    <img
                      src={imageToShow}
                      alt="Vista previa"
                      className="object-contain rounded border bg-white shadow max-h-32"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-lg font-bold transition ${
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loader w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    {isEdit ? "Guardando..." : "Creando..."}
                  </span>
                ) : isEdit ? "Guardar Cambios" : "Crear Proyecto"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    modalRoot
  );
}
