// src/app/compra-exitosa/page.tsx

import React, { Suspense } from 'react';
import CompraExitosa from './CompraExitosa';

export const dynamic = 'force-dynamic'; // si quieres

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CompraExitosa />
    </Suspense>
  );
}
