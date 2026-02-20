# 🌐 IBM Joven - Sitio Web Oficial

Este es el repositorio del sitio web de **Iglesia Bautista Maranata - Jóvenes (IBM Joven)**. Una plataforma moderna diseñada para mantener a la comunidad informada sobre anuncios, eventos y recuerdos de nuestras actividades.

---

## ✨ Características Principales

-   **🎨 Diseño Moderno:** Interfaz "Dark Mode" con una paleta de azules profundos, efectos de glassmorphism y animaciones sutiles.
-   **📅 Agenda Semanal:** Horarios actualizados con botones de "Agendar" vinculados a Google Calendar.
-   **🔄 Sincronización Dinámica:** El contenido de anuncios, eventos y galería se gestiona directamente desde Google Sheets (vía CSV).
-   **🖼️ Galería de Fotos:** Álbumes dinámicos conectados a Google Drive/Photos.
-   **📱 Contacto Directo:** Integración rápida con WhatsApp y redes sociales (Instagram/Facebook @ibmjoven).

---

## 🛠️ Stack Tecnológico

-   [**Astro**](https://astro.build/): Framework web para velocidad y excelente SEO.
-   [**Tailwind CSS**](https://tailwindcss.com/): Estilos modernos y responsivos.
-   [**Node.js**](https://nodejs.org/): Scripting para la sincronización de datos.
-   [**GitHub Actions**](https://github.com/features/actions): Despliegue automático y sincronización programada.

---

## 🚀 Inicio Rápido

### Requisitos Previos

-   Node.js (v20 o superior)
-   npm

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/J0nBennett/ibm-joven-web.git
    cd ibm-joven-web
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## 🔄 Sincronización de Datos

El sitio utiliza archivos JSON en `public/data/` que se autogeneran desde hojas de cálculo.

Para sincronizar manualmente:
```bash
npm run sync
```

> [!NOTE]
> Si las URLs de los CSV no están configuradas en las variables de entorno, el script utilizará **datos de prueba (mock data)** para el desarrollo local.

---

## 🤝 Contribuir

Si deseas reportar un error o sugerir una mejora, por favor abre un *Issue* o envía un *Pull Request*.

---

¡Hecho con ❤️ por la comunidad de **IBM Joven**!
