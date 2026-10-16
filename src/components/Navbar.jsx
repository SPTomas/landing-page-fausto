import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logoBlanco.png';

const links = [
  ['#equipo', 'El estudio'],
  ['#servicios', 'Áreas de práctica'],
  ['#cobertura', 'Cobertura'],
  ['#contacto', 'Contacto'],
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const media = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (media.matches) setIsMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', closeOnDesktop);
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="site-container nav-inner">
        <a href="#inicio" aria-label="Estudio Jurídico Iriarte — Inicio" onClick={() => setIsMenuOpen(false)}>
          <img src={logo.src} width={logo.width} height={logo.height} alt="Abogado Fausto Iriarte" className="nav-logo" />
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a href="#contacto" className="nav-cta">Agendar consulta <span aria-hidden="true">↗</span></a>
        <button ref={toggleRef} type="button" className="menu-toggle" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={isMenuOpen ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'} /></svg>
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegación móvil" hidden={!isMenuOpen}>
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setIsMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
      </nav>
    </header>
  );
}
