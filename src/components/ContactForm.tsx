'use client';

import { FormEvent } from 'react';

export default function FormularioDeContacto() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Formulario enviado');
  };

  return (
    <div className="contact-card">
      <div className="contact-card-copy">
        <span className="eyebrow dark">Escríbenos</span>
        <h3>Consulta con nuestro equipo</h3>
        <p>Responderemos tu mensaje con asesoría personalizada para encontrar la mejor opción.</p>
      </div>

      <form className="luxury-form" method="post" role="form" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="tu@correo.com"
              required
            />
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="subject">Asunto</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            name="subject"
            placeholder="¿Sobre qué quieres hablar?"
            required
          />
        </div>

        <div className="mt-3">
          <label htmlFor="message">Mensaje</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            placeholder="Déjanos tu mensaje..."
            rows={7}
            required
          ></textarea>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button type="submit" className="btn luxury-button primary">
            Enviar mensaje
          </button>
        </div>
      </form>
    </div>
  );
}
