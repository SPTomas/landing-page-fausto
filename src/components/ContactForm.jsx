import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    _gotcha: '' // <-- ¡Esta es la trampa para bots!
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // ¡Acá vas a poner la URL que te dé Formspree en el paso 2!
  const FORMSPREE_URL = "https://formspree.io/f/xreynepn";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    // 1. Vemos a dónde está intentando mandar
    console.log("Intentando enviar a:", FORMSPREE_URL);
    
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // 2. Vemos qué nos responde Formspree
      console.log("Estado de la respuesta:", response.status);

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '', _gotcha: '' });
      } else {
        // 3. Si falla, leemos el mensaje de error exacto
        const dataError = await response.json();
        console.error("Error devuelto por Formspree:", dataError);
        setError(true);
      }
    } catch (err) {
      console.error("Error de conexión/red:", err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-legal-black border-t border-legal-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Agendá tu <span className="text-legal-beige font-bold">Consulta</span></h2>
          <p className="text-legal-light opacity-80 max-w-2xl mx-auto text-lg">
            Dejanos tus datos y un breve resumen de tu caso. Nos pondremos en contacto a la brevedad para asesorarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
{/* Columna 1: Información de Contacto Directa */}
          <div className="bg-legal-dark border border-legal-beige/10 p-8 md:p-10 rounded-sm shadow-2xl flex flex-col justify-center h-full">
            {/* Le cambiamos el borde de abajo al título para que combine con la nueva tarjeta */}
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-legal-beige/10 pb-4">Información del Estudio</h3>
            
            <div className="space-y-8">
              {/* Dirección */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-12 h-12 bg-legal-dark rounded-full flex items-center justify-center shrink-0 border border-legal-beige/5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-legal-beige">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Dirección</h4>
                  <p className="text-legal-light opacity-70 mt-1">Av. Ibarbalz 752<br />Córdoba Capital, CP 5000</p>
                </div>
              </div>

              {/* Teléfono / WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-12 h-12 bg-legal-dark rounded-full flex items-center justify-center shrink-0 border border-legal-beige/5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-legal-beige">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Línea Directa (WhatsApp)</h4>
                  <p className="text-legal-light opacity-70 mt-1">+54 9 351 786-9351</p>
                  <a href="https://wa.me/5493517869351" target="_blank" rel="noopener noreferrer" className="text-legal-beige text-sm hover:underline mt-2 inline-block font-semibold">Enviar mensaje ahora &rarr;</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-12 h-12 bg-legal-dark rounded-full flex items-center justify-center shrink-0 border border-legal-beige/5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-legal-beige">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Correo Electrónico</h4>
                  <p className="text-legal-light opacity-70 mt-1">abogadofaustoiriarte@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
    {/* Columna 2: El Formulario Funcional */}
    <div className="bg-legal-dark border border-legal-beige/10 p-8 md:p-10 rounded-sm shadow-2xl relative">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Consulta Enviada</h3>
                <p className="text-legal-light opacity-80">
                  Recibimos tu mensaje. Nos comunicaremos a la brevedad.
                </p>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 text-legal-beige hover:underline text-sm">
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* EL HONEYPOT: Campo oculto con CSS. Los humanos no lo ven, los bots sí. */}
                <input 
                  type="text" 
                  name="_gotcha" 
                  style={{ display: 'none' }} 
                  value={formData._gotcha}
                  onChange={handleChange}
                  tabIndex="-1" 
                  autoComplete="off" 
                />

                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-legal-light opacity-80 mb-2">Nombre Completo</label>
                  <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} className="w-full bg-legal-black border border-legal-beige/20 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-legal-beige transition-colors" placeholder="Ej. Juan Pérez" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-legal-light opacity-80 mb-2">Correo Electrónico</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-legal-black border border-legal-beige/20 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-legal-beige transition-colors" placeholder="ejemplo@correo.com" />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-legal-light opacity-80 mb-2">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-legal-black border border-legal-beige/20 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-legal-beige transition-colors" placeholder="Cod. Área + Número" />
                  </div>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-legal-light opacity-80 mb-2">Resumen del Caso</label>
                  <textarea id="mensaje" name="mensaje" required rows="4" value={formData.mensaje} onChange={handleChange} className="w-full bg-legal-black border border-legal-beige/20 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-legal-beige transition-colors resize-none" placeholder="Describí brevemente tu caso..."></textarea>
                </div>

                {error && (
                  <p className="text-red-400 text-sm mt-2">Hubo un error al enviar el mensaje. Por favor, intentá de nuevo.</p>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full font-bold py-4 rounded-sm transition-all duration-300 mt-2 flex justify-center items-center gap-2
                    ${isSubmitting ? 'bg-legal-beige/70 text-legal-black/70 cursor-not-allowed' : 'bg-legal-beige text-legal-black hover:bg-white'}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-legal-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Consulta'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}