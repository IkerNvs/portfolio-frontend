'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useIsMobile } from '@/hooks/useIsMobile'

const SLIDE_WIDTH = 320
const SLIDE_HEIGHT = 600

type Project = {
  _id: string
  title: string
  description: string
  image: string
  link: string
  stack?: string[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useIsMobile()

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/projects`)
      .then((res) => {
        setProjects(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError("Error al cargar los proyectos.")
        setLoading(false)
      })
  }, [])

  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase()
    return (
      project.title.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      project.link?.toLowerCase().includes(term) ||
      project.stack?.join(" ").toLowerCase().includes(term)
    )
  })

  const chunkedProjects = []
  for (let i = 0; i < filteredProjects.length; i += 3) {
    chunkedProjects.push(filteredProjects.slice(i, i + 3))
  }

  return (
    <section className="mt-[120px] pt-4 pb-32 px-4 mb-20">
      <div className="max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-center">Proyectos</h2>
          <div className="w-24 h-1 bg-[#C84153] rounded-full mb-8"></div>
          <p className="text-xl text-gray-400 max-w-2xl text-center mb-8">
            Descubre mis desarrollos más destacados: soluciones prácticas, diseño funcional y código limpio.
          </p>

          <input
            type="text"
            placeholder="Buscar por título, descripción, tecnología..."
            className="w-full max-w-md px-6 py-3 text-base text-white bg-[#1a1a1a] rounded-full border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#C84153] placeholder-gray-500 transition duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-8 py-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full max-w-[320px] h-[600px] bg-gray-800 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No se encontraron proyectos para "{searchTerm}"
          </div>
        ) : (
          isMobile ? (
            <div className="flex flex-col items-center gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="w-full max-w-[320px] h-[600px] bg-[#181818] border-2 border-[#23272F] rounded-3xl flex flex-col transition-transform duration-300 hover:scale-105 relative"
                  style={{ minHeight: SLIDE_HEIGHT, maxHeight: SLIDE_HEIGHT, overflow: 'hidden' }}
                >
                  <div className="relative w-full h-[340px] overflow-hidden rounded-t-3xl">
                    <img
                      src={`${baseUrl}${project.image}`}
                      alt={project.title}
                      width={320}
                      height={340}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-center">{project.title}</h3>
                      <div
                        className="text-base text-gray-400 mb-4 text-center break-words max-w-[280px] mx-auto"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {project.stack?.slice(0, 3).map((tech) => (
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
                      href={project.link}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-12 py-4 text-2xl font-bold rounded-full text-white transition-all duration-200 focus:outline-none border-none no-underline shadow-none justify-center text-center hover:scale-105 hover:font-extrabold"
                      style={{ minWidth: 260, letterSpacing: "0.05em" }}
                    >
                      <span style={{ lineHeight: 5 }}>Ver proyecto</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-1" width={48} height={48} viewBox="-2 0 20 20" fill="white">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            chunkedProjects.map((group, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-8 py-12">
                {group.map((project) => (
                  <div
                    key={project._id}
                    className="w-[320px] h-[600px] bg-[#181818] border-2 border-[#23272F] rounded-3xl flex flex-col transition-transform duration-300 hover:scale-105 relative"
                    style={{ minHeight: SLIDE_HEIGHT, maxHeight: SLIDE_HEIGHT, overflow: 'hidden' }}
                  >
                    <div className="relative w-full h-[340px] overflow-hidden rounded-t-3xl">
                      <img
                        src={`${baseUrl}${project.image}`}
                        alt={project.title}
                        width={320}
                        height={340}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-center">{project.title}</h3>
                        <div
                          className="text-base text-gray-400 mb-4 text-center break-words max-w-[280px] mx-auto"
                          dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {project.stack?.slice(0, 3).map((tech) => (
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
                        href={project.link}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-12 py-4 text-2xl font-bold rounded-full text-white transition-all duration-200 focus:outline-none border-none no-underline shadow-none justify-center text-center hover:scale-105 hover:font-extrabold"
                        style={{ minWidth: 260, letterSpacing: "0.05em" }}
                      >
                        <span style={{ lineHeight: 5 }}>Ver proyecto</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1" width={48} height={48} viewBox="-2 0 20 20" fill="white">
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )
        )}
      </div>
    </section>
  )
}
