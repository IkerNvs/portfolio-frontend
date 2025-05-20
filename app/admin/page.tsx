"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "viewer" | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const viewer = localStorage.getItem("viewerAccess");

    if (token) {
      setRole("admin");
    } else if (viewer) {
      setRole("viewer");
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("viewerAccess");
    router.push("/login");
  };

  if (!role) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando...
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[64px] bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#2d2d37] flex flex-col items-center px-4 py-12">
      {/* Encabezado centrado */}
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-10 text-center">
        Panel de Administración
      </h1>

      {role === "viewer" && (
        <p className="mb-6 text-yellow-400 text-sm font-semibold text-center">
          Estás en modo lector: no puedes realizar cambios.
        </p>
      )}

      {/* Grid de 3 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {/* Tarjeta 1: Proyectos */}
        <Link
          href="/admin/projects"
          className="group no-underline flex flex-col items-center justify-center bg-[#2f2f38] hover:bg-[#3a3a44] rounded-2xl p-10 text-white shadow-md hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Gestionar Proyectos</h2>
          <p className="text-sm text-gray-300 text-center max-w-[260px]">
            {role === "admin"
              ? "Subir, editar o eliminar proyectos en tu portfolio profesional."
              : "Consulta la lista de proyectos del portfolio."}
          </p>
        </Link>

        {/* Tarjeta 2: Sobre mí */}
        <Link
          href="/admin/about"
          className="group no-underline flex flex-col items-center justify-center bg-[#2f2f38] hover:bg-[#3a3a44] rounded-2xl p-10 text-white shadow-md hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Editar "Sobre mí"</h2>
          <p className="text-sm text-gray-300 text-center max-w-[260px]">
            {role === "admin"
              ? "Modifica la biografía y presentación personal del sitio."
              : 'Visualiza la información de la sección "Sobre mí".'}
          </p>
        </Link>

        {/* Tarjeta 3: Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="group no-underline flex flex-col items-center justify-center bg-[#2f2f38] hover:bg-[#3a3a44] rounded-2xl p-10 text-white shadow-md hover:shadow-xl transition-all"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Cerrar sesión</h2>
          <p className="text-sm text-gray-300 text-center max-w-[260px]">
            Salir del panel de administración de forma segura.
          </p>
        </button>
      </div>
    </main>
  );
}
