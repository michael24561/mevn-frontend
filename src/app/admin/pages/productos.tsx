'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Ventas', path: '/admin/ventas' },
    { name: 'Haciendas', path: '/admin/haciendas' },
    { name: 'Clientes', path: '/admin/clientes' },
    { name: 'Gráficos', path: '/admin/graficos' },
    { name: 'Inventario', path: '/admin/inventario' },
    { name: 'Productos', path: '/admin/pages/productos' },
  ];

  const isActive = (path: string) => {
    return pathname?.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Panel de Administración</h1>
          <p className="text-sm text-gray-400">Control preciso, decisiones inteligentes</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center p-2 rounded hover:bg-gray-700 ${isActive(item.path) ? 'bg-gray-700' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}