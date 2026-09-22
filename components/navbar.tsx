'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/InicioSesion';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Ocultar la barra en la pantalla de Login
  if (pathname === '/login') return null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO Y BOTÓN VOLVER AL MENÚ */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="text-lg font-bold text-slate-800 flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="w-3 h-3 bg-amber-400 rounded-full inline-block"></span>
            Sistema de Gestión
          </Link>

          {pathname !== '/dashboard' && (
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ml-2"
            >
              ← Menú Principal
            </Link>
          )}
        </div>

        {/* USUARIO Y CERRAR SESIÓN */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs text-slate-500 hidden sm:inline">
              Hola, <strong className="text-slate-800">{user.nombre}</strong>
            </span>
          )}

          <button
            onClick={logout}
            className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </header>
  );
}