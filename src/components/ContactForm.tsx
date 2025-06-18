// src/components/ContactForm.tsx
'use client';

import { FormEvent } from 'react';

export default function FormularioDeContacto() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
    console.log('Formulario enviado');
  };

  return (
    <form className="col-md-9 m-auto" method="post" role="form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group col-md-6 mb-3">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            className="form-control mt-1"
            id="name"
            name="name"
            placeholder="Tu nombre"
            required
          />
        </div>
        <div className="form-group col-md-6 mb-3">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            className="form-control mt-1"
            id="email"
            name="email"
            placeholder="tu@correo.com"
            required
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="subject">Asunto</label>
        <input
          type="text"
          className="form-control mt-1"
          id="subject"
          name="subject"
          placeholder="¿Sobre qué quieres hablar?"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="message">Mensaje</label>
        <textarea
          className="form-control mt-1"
          id="message"
          name="message"
          placeholder="Déjanos tu mensaje..."
          rows={8}
          required
        ></textarea>
      </div>
      <div className="row">
        <div className="col text-end mt-2">
          <button type="submit" className="btn btn-success btn-lg px-3">
            Enviar mensaje
          </button>
        </div>
      </div>
    </form>
  );
}