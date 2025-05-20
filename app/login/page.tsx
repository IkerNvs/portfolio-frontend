'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {

        username,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token); // acceso con edición
      } else if (res.data.role === 'viewer') {
        localStorage.setItem('viewerAccess', 'true');  // acceso sin edición
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <>
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          paddingTop: '64px',
          background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 20%, #c8415340 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        <div
          className="relative z-10 bg-[#23232b]/95 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full flex flex-col justify-center items-center"
          style={{ maxWidth: '400px', minHeight: '420px' }}
        >
          <div className="flex flex-col items-center mb-7">
            <div className="bg-[#C84153] rounded-full p-3 mb-2 shadow-lg animate-bounce-slow">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path fill="#fff" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Acceso de Administrador</h2>
            <p className="text-gray-400 text-xs">Introduce tus credenciales para continuar</p>
          </div>

          {error && (
            <p className="text-red-500 mb-3 text-xs text-center animate-shake">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="flex flex-col items-center gap-6 w-full max-w-[300px] mt-2">
            <div className="flex items-center gap-3 w-full">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path stroke="#C84153" strokeWidth="2" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z"/>
              </svg>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 border border-[#393949] bg-[#23232b] text-white rounded-lg px-3 py-2 placeholder-gray-400 text-sm focus:outline-none focus:ring-0 focus:border-[#C84153] transition"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3 w-full">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path stroke="#C84153" strokeWidth="2" d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-6V9a6 6 0 10-12 0v2a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2v-5a2 2 0 00-2-2zm-8-2a4 4 0 118 0v2H6V9z"/>
              </svg>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border border-[#393949] bg-[#23232b] text-white rounded-lg px-3 py-2 placeholder-gray-400 text-sm focus:outline-none focus:ring-0 focus:border-[#C84153] transition"
                required
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#C84153] text-white py-2 px-6 rounded-lg font-semibold shadow-md hover:bg-[#a82e3c] transition active:scale-95 text-sm mt-4"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path stroke="white" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Iniciar sesión
            </button>
          </form>
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-8px);}
          }
          .animate-bounce-slow {
            animation: bounce-slow 2.5s infinite;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0);}
            20%, 60% { transform: translateX(-6px);}
            40%, 80% { transform: translateX(6px);}
          }
          .animate-shake {
            animation: shake 0.4s;
          }
        `}</style>
      </main>
    </>
  );
}
