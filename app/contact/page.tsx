'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading('Enviando mensaje...')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Mensaje enviado correctamente ✅', { id: toastId })
        setName('')
        setEmail('')
        setMessage('')
      } else {
        toast.error(data?.message || 'Error al enviar el mensaje ❌', { id: toastId })
      }
    } catch (err) {
      toast.error('Error al conectar con el servidor ❌', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen pt-[90px] px-4 flex justify-center items-start bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-black text-white">
      <div className="w-full max-w-xl bg-[#141414] border border-[#2c2c2c] rounded-2xl shadow-lg p-10 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2 tracking-tight">Contacto</h2>
          <p className="text-sm text-gray-400">
            ¿Tienes un proyecto o quieres decir hola? Escríbeme un mensaje.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-sm text-gray-300 font-semibold">
              Tu nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nombre completo"
              className="w-full px-4 py-3 rounded-md bg-[#0e0e0e] text-white placeholder-gray-500 text-sm border border-[#2c2c2c] focus:ring-2 focus:ring-[#C84153] focus:outline-none transition-all duration-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm text-gray-300 font-semibold">
              Tu correo
            </label>
            <input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              className="w-full px-4 py-3 rounded-md bg-[#0e0e0e] text-white placeholder-gray-500 text-sm border border-[#2c2c2c] focus:ring-2 focus:ring-[#C84153] focus:outline-none transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="message" className="text-sm text-gray-300 font-semibold">
              Tu mensaje
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="Escribe tu mensaje..."
              className="w-full px-4 py-3 rounded-md bg-[#0e0e0e] text-white placeholder-gray-500 text-sm border border-[#2c2c2c] focus:ring-2 focus:ring-[#C84153] focus:outline-none transition-all duration-300 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-10 py-3 rounded-full text-sm font-bold transition-transform transform hover:scale-105 focus:outline-none ${
                isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#C84153] hover:bg-[#FF6B81]'
              } text-white`}
            >
              {isLoading ? 'Enviando...' : 'Enviar mensaje'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
