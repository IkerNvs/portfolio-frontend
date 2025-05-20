"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TiptapEditor from "@/components/TiptapEditor";

type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
};

export default function AdminProjects() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/projects`)
      .then((res) => setProjects(res.data))
      .catch(() => setError("Error al cargar los proyectos."));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm((prev) => ({ ...prev, image: file }));
      if (file) setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (html: string) => {
    setForm((prev) => ({ ...prev, description: html }));
  };

  const handleEdit = (project: Project) => {
    setEditId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      link: project.link,
      image: null,
    });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ title: "", description: "", link: "", image: null });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setSuccess("Proyecto eliminado correctamente.");
    } catch {
      setError("Error al eliminar el proyecto.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    if (form.image) formData.append("image", form.image);

    try {
      if (editId) {
        const res = await axios.put(`${API_URL}/api/projects/${editId}`, formData, config);
        setProjects((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
        setSuccess("Proyecto actualizado correctamente.");
      } else {
        const res = await axios.post(`${API_URL}/api/projects`, formData, config);
        setProjects((prev) => [res.data, ...prev]);
        setSuccess("Proyecto creado correctamente.");
      }
      setForm({ title: "", description: "", link: "", image: null });
      setImagePreview(null);
      setEditId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError(editId ? "Error al actualizar el proyecto." : "Error al crear el proyecto.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen pt-[140px] bg-gradient-to-br from-blue-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 px-6 sm:px-12">
        <h1 className="text-3xl font-extrabold mb-8 text-blue-700 dark:text-blue-300 text-center">
          Proyectos
        </h1>

        {/* FORMULARIO */}
        <form
          className="flex flex-col gap-5 mb-10 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow max-w-sm mx-auto w-full"
          onSubmit={handleSubmit}
        >
          <input
            id="title"
            name="title"
            placeholder="Título"
            className="px-4 py-2 rounded bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TiptapEditor
            value={form.description}
            onChange={handleDescriptionChange}
            className="bg-white dark:bg-gray-900 rounded min-h-[180px]"
          />
          <input
            id="link"
            name="link"
            placeholder="Enlace"
            className="px-4 py-2 rounded bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.link}
            onChange={handleChange}
            required
          />
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="px-4 py-2 rounded bg-white dark:bg-gray-900"
            onChange={handleChange}
            ref={fileInputRef}
          />
          {form.image && imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="mt-2 max-w-[128px] max-h-[128px] object-cover rounded border border-gray-400 mx-auto"
            />
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-bold transition"
              disabled={loading}
            >
              {loading ? (editId ? "Guardando..." : "Creando...") : editId ? "Guardar cambios" : "Crear Proyecto"}
            </button>
            {editId && (
              <button
                type="button"
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white rounded px-4 py-2 font-bold transition"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
        </form>

        {/* LISTADO */}
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="text-gray-500 text-center col-span-full">No hay proyectos.</div>
          ) : (
            projects.map((project) => (
              <div
  key={project._id}
  className="border-t border-white/20 py-6 flex flex-col items-center text-center"
>
  {project.image && (
    <div className="pb-4">
      <img
        src={
          project.image.startsWith("http")
            ? project.image
            : `${API_URL}${project.image.startsWith("/") ? project.image : "/" + project.image}`
        }
        alt={project.title}
      />
    </div>
  )}

  <h2 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">{project.title}</h2>
  <div
    className="text-sm text-gray-700 dark:text-gray-300 mb-3"
    dangerouslySetInnerHTML={{ __html: project.description }}
  />
  <a
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline text-sm mb-4 break-all"
  >
    {project.link}
  </a>
  <div className="flex gap-3">
    <button
      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded font-semibold text-sm transition"
      onClick={() => handleEdit(project)}
      disabled={loading}
    >
      Editar
    </button>
    <button
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
      onClick={() => handleDelete(project._id)}
      disabled={loading}
    >
      Eliminar
    </button>
  </div>
</div>

            ))
          )}
        </div>
      </div>
    </div>
  );
}
