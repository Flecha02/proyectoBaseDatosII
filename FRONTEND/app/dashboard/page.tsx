'use client';

import Link from 'next/link';

const MENU_OPTIONS = [
  {
    title: 'Gestión de Productos',
    description: 'Catálogo de pinturas, presentaciones, precios y niveles de stock.',
    href: '/productos',
    color: 'border-l-amber-500 bg-amber-50/30',
    badge: 'Inventario',
  },
  {
    title: 'Gestión de Proveedores',
    description: 'Directorio de distribuidores, marcas, números de NIT y contactos.',
    href: '/proveedores',
    color: 'border-l-blue-500 bg-blue-50/30',
    badge: 'Compras',
  },
  {
    title: 'Gestión de Clientes',
    description: 'Registro de clientes, datos de contacto e historial de compras.',
    href: '/clientes',
    color: 'border-l-emerald-500 bg-emerald-50/30',
    badge: 'Ventas',
  },
  {
    title: 'Gestión de Usuarios',
    description: 'Administración de accesos, roles y permisos de empleados.',
    href: '/usuarios',
    color: 'border-l-purple-500 bg-purple-50/30',
    badge: 'Seguridad',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="border-l-4 border-amber-400 pl-3 mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Menú Principal</h1>
          <p className="text-sm text-slate-500">Selecciona el módulo que deseas administrar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MENU_OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className={`block p-6 bg-white rounded-2xl border border-slate-200 border-l-4 ${option.color} hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {option.badge}
                </span>
                <span className="text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all text-sm font-semibold">
                  Ingresar →
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {option.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {option.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}