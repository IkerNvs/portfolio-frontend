"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';

// Tipado de proyecto
type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  link: string;
  stack: string[];
};

const HEADER_HEIGHT = 90;
const SLIDE_WIDTH = 320;
const SLIDE_HEIGHT = 600;
const SLIDE_SCALE = 1.05;
const PAGINATION_ACTIVE_COLOR = "#FFD6DB";
const PAGINATION_INACTIVE_COLOR = "#C84153";

const techGroups = [
  {
    title: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Bootstrap'],
    image: '/images/frontend.jpg',
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Python', 'PHP', 'Java', 'C', 'Laravel'],
    image: '/images/backend.jpg',
  },
  {
    title: 'Diseño',
    items: ['Figma'],
    image: '/images/design.jpg',
  },
  {
    title: 'Bases de datos',
    items: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQLite'],
    image: '/images/database.jpg',
  },
];

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const aboutSectionRef = useRef<HTMLElement | null>(null);

  // Slider state
  // Por defecto, el tercer slide (índice 2) está activo
  const [current, setCurrent] = useState(2);
  // hovered puede ser null (ninguno), o el índice del slide/paginación sobre el que se pasa el mouse
  const [hovered, setHovered] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`)
      .then((res) => {
        setProjects(res.data.slice(0, 5));
        setLoading(false);
        // Si hay al menos 3 proyectos, por defecto el tercero está activo
        if (res.data.length >= 3) setCurrent(2);
        else setCurrent(0);
      })
      .catch(() => {
        setError("Error al cargar los proyectos.");
        setProjects([]);
        setLoading(false);
      });
  }, []);

  // Eliminar cualquier margen/padding global del body/html
  React.useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.background = "none";
    document.documentElement.style.background = "none";
  }, []);

  // Función para hacer scroll a la sección Sobre mí, compensando el header
  const scrollToAbout = () => {
    if (aboutSectionRef.current) {
      const sectionTop = aboutSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionTop - HEADER_HEIGHT - 16,
        behavior: "smooth",
      });
    }
  };

  // Slider controls
  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => goTo((current - 1 + projects.length) % projects.length);
  const next = () => goTo((current + 1) % projects.length);

  // Centrar el slide activo
  useEffect(() => {
    if (sliderRef.current && projects.length > 0) {
      const slider = sliderRef.current;
      const slide = slider.querySelectorAll<HTMLDivElement>('.project-slide')[current];
      if (slide) {
        const sliderRect = slider.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();
        const scrollLeft = slider.scrollLeft;
        const offset = slideRect.left - sliderRect.left - (sliderRect.width / 2 - slideRect.width / 2);
        slider.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
      }
    }
  }, [current, projects.length]);

  // Determina el índice "activo" para oscurecimiento: hovered tiene prioridad sobre current
  const activeIdx = hovered !== null ? hovered : current;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#121212] via-[#151515] to-[#1a1a1a] text-white overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#121212] z-10"></div>
          <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#121212] to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-9xl md:text-[180px] lg:text-[220px] xl:text-[280px] font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#C84153] via-[#FF6B81] to-[#C84153] animate-gradient">
            Ikernvs
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-gray-200 tracking-wider">
            Full Stack Developer
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12">
            Transformando ideas en experiencias digitales de alto impacto. 
            <span className="text-[#C84153] font-semibold hover:text-[#FF6B81] transition-colors duration-300">
              ¡Construyamos el futuro juntos!
            </span>
          </p>
          <button
            aria-label="Bajar a Sobre mí"
            onClick={scrollToAbout}
            className="
              absolute bottom-20 left-0 right-0
              flex justify-center
              mx-auto
              cursor-pointer
              border-none outline-none
              bg-transparent hover:bg-transparent
              transition-transform duration-300
              hover:scale-110
            "
            style={{ zIndex: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-[#C84153] drop-shadow-lg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>


        </div>
      </section>

      <div className="py-10 px-0 md:px-0 w-full max-w-none mx-0">

        {/* SOBRE MÍ - PRIMERO */}
        <section
  id="sobre-mi"
  ref={aboutSectionRef}
  className="mb-20 py-16"
>
  <div className="flex flex-col items-center mb-12">
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-center">
      Sobre mí
    </h2>
    <div className="w-24 h-1 bg-[#C84153] rounded-full mb-8"></div>
  </div>

  <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto px-6">
    {/* Texto a la izquierda */}
    <div className="lg:w-3/5 text-left">
      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
        Soy Iker Navas, desarrollador web en formación con experiencia en proyectos reales y una gran pasión por la tecnología. 
        Aquí encontrarás una selección de mis trabajos, desde aplicaciones de escritorio hasta webs con backend propio y panel de administración.
      </p>
      <p className="text-xl text-gray-300 mb-8 leading-relaxed">
        Trabajo con herramientas modernas como React, MongoDB, PHP y Java, 
        y me esfuerzo por crear soluciones funcionales, accesibles y visualmente atractivas.
        Si buscas a alguien comprometido con seguir aprendiendo y aportar valor con código, estás en el lugar adecuado.
      </p>
      <a
        href="/about"
        className="inline-flex items-center gap-2 px-12 py-4 text-2xl font-bold rounded-full text-white transition-all duration-200 focus:outline-none border-none no-underline shadow-none justify-center text-center hover:scale-105 hover:font-extrabold"
        style={{
          minWidth: 260,
          letterSpacing: "0.05em",
        }}
      >
        <span style={{ lineHeight: 5 }}>Conoce más sobre mí</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1"
          width={48}
          height={48}
          viewBox="-2 0 20 20"
          fill="white"
          style={{ verticalAlign: "middle" }}
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>

    {/* Imagen a la derecha */}
    <div className="lg:w-2/5 flex justify-center items-center">
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-[#C84153] to-[#FF6B81] rounded-xl blur-lg opacity-30 group-hover:opacity-70 transition duration-700"></div>
        <img
          src="/images/iker2.jpg"
          alt="Perfil"
          width={600}
          height={600}
          className="relative rounded-xl object-cover w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] shadow-xl border-2 border-[#23272F] transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    </div>
  </div>
</section>


        {/* TECNOLOGÍAS - SEGUNDO */}
        <section className="mb-20 py-20 bg-gradient-to-br from-[#0a0a0a] to-[#161616] rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-[#1a1a1a]">
  <div className="flex flex-col items-center mb-16">
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-center bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text ">
      Tecnologías
    </h2>
    <h4 className="italic text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-center bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text">
      (Imágenes generadas por IA)
    </h4>
    <div className="w-32 h-1 bg-gradient-to-r from-[#C84153] to-[#FF6B81] rounded-full mb-8 shadow-lg"></div>
    <p className="text-lg md:text-xl text-gray-300 max-w-3xl text-center leading-relaxed">
      Herramientas y tecnologías que domino para crear soluciones completas y escalables
    </p>
  </div>

  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-6 max-w-6xl mx-auto">
      {techGroups.map((group, idx) => (
        <div
          key={group.title}
          className="group bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 rounded-3xl shadow-xl border border-[#2a2a2a] hover:border-[#C84153] transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl mb-4"
        >
          <div className={`flex flex-col items-center gap-6 lg:flex-row ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            {/* Imagen aumentada con padding */}
            <div className="flex justify-center w-full lg:w-auto">
              <div className="w-[260px] h-[260px] p-3 overflow-hidden rounded-xl bg-gradient-to-br from-[#1f1f1f] to-[#0a0a0a] shadow-md">
                <img
                  src={group.image}
                  alt={group.title}
                  className="object-contain rounded-md border border-[#333] transition-all duration-500 group-hover:scale-110 group-hover:rotate-1 group-hover:brightness-110"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    margin: 'auto',
                    padding: '12px',
                    backgroundColor: '#0a0a0a',
                  }}
                />
              </div>
            </div>

            {/* Título + tecnologías */}
            <div className="text-center lg:text-left flex-1 mt-4">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-white group-hover:text-[#FF6B81] transition-all duration-500">
                {group.title}
              </h3>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-3 mt-4">
              {group.items.map((item, i) => (
                <span
                  key={item}
                  className="px-3 py-1 text-xs font-semibold rounded-xl text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300 hover:text-yellow-200 cursor-pointer"
                  style={{
                    letterSpacing: '0.1em',
                    textShadow: '0 1px 4px rgba(84, 146, 2, 0.3)',
                  }}
                >
                  {item}{i < group.items.length - 1 && ','}
                </span>
              ))}
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Decorative elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#C84153] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FF6B81] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
  </div>
</section>

        {/* PROYECTOS DESTACADOS */}
        <section className="mb-20 py-16">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-center">
              Proyectos Destacados
            </h2>
            <div className="w-24 h-1 bg-[#C84153] rounded-full mb-8"></div>
            <p className="text-xl text-gray-400 max-w-2xl text-center">
              Una muestra de mis mejores creaciones y soluciones digitales
            </p>
          </div>
          <div className="relative max-w-full mx-auto px-4">
            {/* Slider */}
            <div
              ref={sliderRef}
              className="flex items-center justify-center gap-8 w-full max-w-full"
              style={{
                overflowX: "hidden",
                overflowY: "hidden",
                position: "relative",
                minHeight: SLIDE_HEIGHT * SLIDE_SCALE,
                height: SLIDE_HEIGHT * SLIDE_SCALE,
                userSelect: "none",
              }}
            >
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="project-slide w-[320px] h-[600px] bg-gray-800 animate-pulse rounded-3xl"></div>
                ))
              ) : error ? (
                <div className="w-full text-center py-12">
                  <p className="text-xl text-red-600 font-semibold">{error}</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="w-full text-center py-12">
                  <p className="text-xl text-gray-400">No hay proyectos disponibles actualmente.</p>
                </div>
              ) : (
                projects.map((project, idx) => {
                  const isDimmed = activeIdx !== idx;
                  return (
                    <div
                      key={project._id}
                      className={`project-slide w-[320px] h-[600px] bg-[#181818] border-2 border-[#23272F] rounded-3xl flex flex-col transition-transform duration-300
                        ${current === idx ? "z-30" : "z-10"}
                        ${activeIdx === idx ? "scale-105 shadow-2xl" : ""}
                        hover:scale-105
                        relative
                        `}
                      tabIndex={0}
                      aria-current={current === idx}
                      style={{
                        overflow: "hidden",
                        willChange: "transform",
                        transition: "transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, filter 0.2s",
                        filter: isDimmed ? "brightness(0.5) grayscale(0.2)" : "none",
                        pointerEvents: activeIdx !== null && activeIdx !== idx ? "auto" : "auto",
                        flex: "0 0 auto",
                        minWidth: SLIDE_WIDTH,
                        maxWidth: SLIDE_WIDTH,
                        minHeight: SLIDE_HEIGHT,
                        maxHeight: SLIDE_HEIGHT,
                        display: "flex",
                        alignItems: "stretch",
                        backgroundClip: "padding-box",
                      }}
                      onMouseEnter={() => setHovered(idx)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Overlay de superposición en hover */}
                      {activeIdx === idx && (
                        <div
                          className="absolute inset-0 rounded-3xl pointer-events-none"
                          style={{
                            boxShadow: "0 0 0 12px rgba(200,65,83,0.10), 0 8px 32px 0 rgba(0,0,0,0.25)",
                            zIndex: 40,
                          }}
                        />
                      )}
                      {/* Imagen del proyecto tamaño vertical */}
                      <div className="relative w-full h-[340px] overflow-hidden rounded-t-3xl">
                        <img
                          src={
                            project.image
                              ? (project.image.startsWith("http")
                                  ? project.image
                                  : `http://localhost:5050${project.image.startsWith("/") ? "" : "/"}${project.image}`)
                              : "/api/placeholder/512/512"
                          }
                          alt={project.title}
                          width={320}
                          height={340}
                          className="w-full h-full object-cover transition-transform duration-700"
                          style={{ minHeight: 200, maxHeight: 340 }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between p-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-center">{project.title}</h3>
                        <div
                          className="text-base text-gray-400 mb-4 text-center"
                          dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {project.stack && project.stack.slice(0, 3).map(tech => (
                            <span 
                              key={tech} 
                              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300 border border-transparent hover:border-[#C84153] hover:bg-[#18121a] hover:text-white transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.stack && project.stack.length > 3 && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300">
                              +{project.stack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={project.link || project.url}
                        target="_blank"
                        className="
                          inline-flex items-center gap-2
                          px-12 py-4
                          text-2xl font-bold
                          rounded-full
                          text-white
                          transition-all duration-200
                          focus:outline-none
                          border-none
                          no-underline
                          shadow-none
                          justify-center
                          text-center
                          hover:scale-105 hover:font-extrabold
                        "
                        style={{
                          minWidth: 260,
                          letterSpacing: "0.05em",
                          position: "relative",
                          zIndex: 50,
                        }}
                      >
                        <span style={{ lineHeight: 5 }}>Ver proyecto</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1"
                          width={48}
                          height={48}
                          viewBox="-2 0 20 20"
                          fill="white"
                          style={{ verticalAlign: "middle" }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {/* Slider Controls & Pagination */}
            {projects.length > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex justify-center items-center gap-4">
                  <button
                    aria-label="Anterior"
                    onClick={prev}
                    className="p-2 rounded-full bg-[#23272F] hover:bg-[#C84153] transition-colors text-white"
                    disabled={loading || projects.length === 0}
                  >
                    <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {/* Pagination lines */}
                  <div className="flex gap-2">
                    {projects.map((_, idx) => {
                      // Oscurecimiento sincronizado: hovered o current
                      const isActive = activeIdx === idx;
                      return (
                        <button
                          key={idx}
                          aria-label={`Ir al proyecto ${idx + 1}`}
                          className="focus:outline-none"
                          style={{
                            width: 32,
                            height: 6,
                            borderRadius: 3,
                            background: isActive ? PAGINATION_ACTIVE_COLOR : PAGINATION_INACTIVE_COLOR,
                            opacity: isActive ? 1 : 0.5,
                            border: "none",
                            transition: "background 0.2s, opacity 0.2s, filter 0.2s",
                            cursor: "pointer",
                            filter: !isActive ? "brightness(0.5) grayscale(0.2)" : "none",
                          }}
                          onClick={() => goTo(idx)}
                          onMouseEnter={() => setHovered(idx)}
                          onMouseLeave={() => setHovered(null)}
                        />
                      );
                    })}
                  </div>
                  <button
                    aria-label="Siguiente"
                    onClick={next}
                    className="p-2 rounded-full bg-[#23272F] hover:bg-[#C84153] transition-colors text-white"
                    disabled={loading || projects.length === 0}
                  >
                    <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* BOTÓN ROJO, TEXTO BLANCO, SVG PEQUEÑO Y MÁS GRANDE */}
          <div className="flex justify-center mt-12">
            <a
              href="/projects"
              className="
                inline-flex items-center gap-2
                px-12 py-4
                text-2xl font-bold
                rounded-full
                bg-[#fffff]
                text-white
                transition-all duration-200
                focus:outline-none
                border-none
                no-underline
                shadow-none
                justify-center
                text-center
                hover:scale-105 hover:font-extrabold
              "
              style={{
                minWidth: 260,
                letterSpacing: "0.05em",
              }}
            >
              <span style={{lineHeight: 5}}>Ver todos los proyectos</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
                width={48}
                height={48}
                viewBox="-2 0 20 20"
                fill="white"
                style={{ verticalAlign: "middle" }}
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* Contacto */}
        <section className="text-center mb-20 py-16">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-center">
              Contacta conmigo
            </h2>
            <div className="w-24 h-1 bg-[#C84153] rounded-full mb-8"></div>
            <p className="text-xl text-gray-400 max-w-2xl text-center mb-12">
              Trabajemos juntos en tu próximo proyecto
            </p>
          </div>
          <div className="mt-10 flex justify-center">
          <a
            href="/contact"
            className="
              inline-flex items-center gap-2
              px-12 py-4
              text-2xl font-bold
              rounded-full
              text-white
              transition-all duration-200
              focus:outline-none
              border-none
              no-underline
              shadow-none
              justify-center
              text-center
              hover:scale-105 hover:font-extrabold
            "
            style={{
              minWidth: 260,
              letterSpacing: "0.05em",
            }}
          >
            <span>¡Hablemos!</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
              width={48}
              height={48}
              viewBox="-2 0 20 20"
              fill="white"
              style={{ verticalAlign: "middle" }}
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
