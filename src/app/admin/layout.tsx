// app/admin/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AdminLayoutClient from './AdminLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panel de Administración',
  description: 'Sistema de administración',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}