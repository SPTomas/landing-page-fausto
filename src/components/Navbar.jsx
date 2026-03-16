import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para cerrar el menú cuando hacen clic en un enlace
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-legal-black border-b border-legal-dark py-4 px-6 md:px-12 fixed w-full top-0 z-50">
      
      {/* Contenedor principal del Header. Le ponemos z-10 y bg-legal-black 
          para que quede SIEMPRE por encima del menú desplegable y lo tape si sube */}
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10 bg-legal-black">
        
        {/* Logo */}
        <a href="#" className="text-2xl font-bold tracking-widest text-legal-beige">
          ESTUDIO<span className="text-white font-light">JURÍDICO</span>
        </a>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-legal-light">
          <a href="#servicios" className="hover:text-legal-beige transition-colors duration-300">Servicios</a>
          <a href="#equipo" className="hover:text-legal-beige transition-colors duration-300">El Estudio</a>
          <a href="#contacto" className="hover:text-legal-beige transition-colors duration-300">Contacto</a>
        </nav>

        {/* Botón Desktop */}
        <div className="hidden md:block">
          <a href="#contacto" className="bg-legal-beige text-legal-black px-6 py-2 rounded-sm font-bold hover:bg-white transition-colors duration-300">
            Agendar Consulta
          </a>
        </div>

        {/* Botón Hamburguesa Mobile */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-legal-beige focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú Desplegable Mobile (Acá está la animación) 
        - quitamos el {isMenuOpen && ...}
        - transition-all duration-300 ease-in-out: le dice que cualquier cambio de estado dure 0.3 segundos y sea fluido.
        - Usamos un template string (` `) para inyectar clases condicionales dependiendo de si isMenuOpen es true o false.
      */}
      <div 
        className={`
          md:hidden absolute top-full left-0 w-full bg-legal-black border-b border-legal-dark 
          flex flex-col items-center py-8 gap-6 shadow-2xl
          transition-all duration-300 ease-in-out -z-10
          ${isMenuOpen 
            ? 'opacity-100 translate-y-0 visible pointer-events-auto' 
            : 'opacity-0 -translate-y-5 invisible pointer-events-none'
          }
        `}
      >
        {/* Explicación de las clases condicionales:
          - opacity-0 / opacity-100: Hace que se desvanezca o aparezca (fade).
          - -translate-y-5 / translate-y-0: Lo mueve un poquito hacia arriba cuando está oculto, creando un efecto de "caída" al abrir.
          - invisible / visible: Asegura que los lectores de pantalla no lo lean cuando está cerrado.
          - pointer-events-none: Evita que el usuario haga clic por accidente en los botones invisibles cuando el menú está cerrado.
        */}
        <a href="#servicios" onClick={closeMenu} className="text-legal-light text-lg hover:text-legal-beige transition-colors">Servicios</a>
        <a href="#equipo" onClick={closeMenu} className="text-legal-light text-lg hover:text-legal-beige transition-colors">El Estudio</a>
        <a href="#contacto" onClick={closeMenu} className="text-legal-light text-lg hover:text-legal-beige transition-colors">Contacto</a>
        <a href="#contacto" onClick={closeMenu} className="bg-legal-beige text-legal-black px-8 py-3 rounded-sm font-bold mt-4 hover:bg-white transition-colors">
          Agendar Consulta
        </a>
      </div>
    </header>
  );
}