# Estudio Jurídico Iriarte - Landing Page

Una landing page moderna y profesional para el Estudio Jurídico Iriarte, desarrollada con *Astro*, *React* y *Tailwind CSS*.

## 📋 Descripción del Proyecto

Landing page integral para un estudio jurídico que incluye:
- **Presentación profesional** Áreas de práctica, Información del equipo
- **Formulario de contacto integrado** con Formspree
- **Diseño responsivo** y elegante
- **Tipografías profesionales**: ANDADA PRO (títulos) y MONTSERRAT (textos)
- **Paleta de colores corporativa**: Negro, Beige y tonos neutros

## 🚀 Características

✨ **Diseño Premium**
- Interfaz elegante y profesional
- Colores corporativos bien definidos (Negro #000000, Beige #E7D7BE)
- Animaciones y transiciones suaves

📱 **Responsivo**
- Optimizado para desktop, tablet y móvil
- Navegación adaptativa

⚡ **Alto Rendimiento**
- Construido con Astro (SSR/SSG)
- Optimización automática de imágenes
- Bundle size mínimo

📝 **Formulario de Contacto**
- Integración con Formspree
- Validación básica
- Mensajes de éxito/error

## 📁 Estructura del Proyecto

```
/
├── public/
│   └── assets estáticos
├── src/
│   ├── assets/
│   │   └── Imágenes (fotos del equipo)
│   ├── components/
│   │   ├── About.astro           (Sección "Conocé el Estudio")
│   │   ├── ContactForm.jsx       (Formulario de contacto)
│   │   ├── Footer.astro          (Pie de página)
│   │   ├── Header.astro          (Encabezado)
│   │   ├── Hero.astro            (Sección principal)
│   │   ├── Navbar.jsx            (Barra de navegación)
│   │   ├── Services.astro        (Áreas de práctica)
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro          (Layout principal)
│   ├── pages/
│   │   └── index.astro           (Página principal)
│   └── styles/
│       └── global.css            (Estilos globales + fuentes)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🛠️ Instalación y Uso

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Instalación

1. **Clonar o descargar el proyecto:**
```bash
cd landing-page
```

2. **Instalar dependencias:**
```bash
npm install
```

### Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Compila el proyecto para producción en `./dist/` |
| `npm run preview` | Vista previa de la compilación antes de publicar |
| `npm run astro check` | Valida errores de TypeScript |

### Desarrollo Local  

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## 🎨 Personalización

### Colores Corporativos
Editar en `src/styles/global.css`:
```css
--color-legal-black: #000000;
--color-legal-beige: #E7D7BE;
--color-legal-dark: #1A1A1A;
--color-legal-light: #FDFBF7;
```

### Información de Contacto
Actualizar en `src/components/ContactForm.jsx`:
- URL de Formspree
- Dirección del estudio
- Teléfono/WhatsApp

### Contenido
- **Servicios:** Modificar `src/components/Services.astro`
- **Sobre nosotros:** Editar `src/components/About.astro`
- **Texto principal:** Ajustar `src/components/Hero.astro`

## 📞 Configuración de Formspree

1. Ir a [formspree.io](https://formspree.io)
2. Crear un nuevo formulario
3. Copiar la URL del formulario
4. Reemplazar el valor de `FORMSPREE_URL` en `ContactForm.jsx`

## 🚀 Despliegue

El proyecto está listo para ser desplegado en:
- **Vercel** (recomendado para Astro)
- **Netlify**
- **GitHub Pages**
- **Cualquier servidor web estático**

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

## 📦 Dependencias

- **astro**: Framework principal
- **react**: Para componentes interactivos
- **tailwindcss**: Utility-first CSS
- Google Fonts: ANDADA PRO y MONTSERRAT

## 📝 Notas Importantes

- Las imágenes del equipo se cargan desde `src/assets/`
- El formulario requiere configuración en Formspree
- Los colores están definidos como CSS variables reutilizables
- Se utilizan clases de Tailwind para el diseño responsivo

## 🔗 Recursos Útiles

- [Documentación de Astro](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Formspree](https://formspree.io)

---

Desarrollado con ❤️ para el Estudio Jurídico Fausto
