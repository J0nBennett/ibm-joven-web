# Changelog

## [2.0.0] - 2026-02-23
### Nuevas Funcionalidades
- **Cuenta Regresiva en Vivo**: Muestra el tiempo restante hasta la próxima reunión del sábado a las 19:30 hs.
- **Trivia Bíblica Semanal**: Mini-juego con un banco de 20 preguntas que rota automáticamente cada semana según el número de semana del año.

### Mejoras Visuales (Dark Theme V2)
- Fondo general migrado a tema oscuro (`slate-950`) en todo el sitio.
- Nuevo sistema de diseño con variables CSS: `glass-card`, `text-glow`, `mesh-gradient-vibrant`, `hover-glow`.
- Animaciones de neón (amber y emerald) en tarjetas destacadas y secciones interactivas.
- Títulos y textos de todas las páginas actualizados para máxima legibilidad en el fondo oscuro.
- Navegación y Footer actualizados con estados activos vibrantes.

### Cambios
- **Eliminado**: Muro de Conexión (por motivos de moderación).
- **Galería**: Eliminado el álbum "Torneo Maranata" (datos desactualizados).
- Intensidad del brillo de texto (`text-glow`) reducida para un look más elegante.

### Correcciones
- Secciones de Anuncios y Eventos en el inicio se mostraban vacías por un error de placeholders.
- Texto oscuro (`text-gray-*`) visible sobre fondo oscuro en múltiples páginas corregido.

---


## [1.0.0] - 2026-02-23
### Added
- **Core Site Structure**: Built with Astro 5 and Tailwind CSS 4.
- **Dynamic Devocional**: Automatic fetching (scraping) of the daily verse from external sources.
- **Event Calendar**: List of upcoming events with 'Add to Google Calendar' functionality.
- **Announcements System**: Support for Markdown-based news and announcements.
- **Birthday Section**: Automatic sorting and display of monthly birthdays.
- **Responsive Navigation**: Mobile-friendly navigation menu with glassmorphism effects.
- **Information Pages**: "Nosotros", "Contacto", "Galería" and "Eventos" fully functional.
- **Local SEO**: Optimized meta tags for "Ministerio de Jóvenes - Luque, Paraguay".
