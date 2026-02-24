import fs from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'data');
const ANUNCIOS_PATH = path.join(OUT_DIR, 'anuncios.json');
const EVENTOS_PATH = path.join(OUT_DIR, 'eventos.json');
const GALERIA_PATH = path.join(OUT_DIR, 'galeria.json');
const CUMPLEANOS_PATH = path.join(OUT_DIR, 'cumpleanos.json');

// Simple CSV Parser that handles quoted fields
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = parseLine(lines[0]);

    return lines.slice(1).map(line => {
        const values = parseLine(line);
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
        }, {});
    });
}

function parseLine(text) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// --- MOCK DATA GENERATORS ---
function getMockAnuncios() {
    return [
        {
            "id": "A-TEST-001",
            "titulo": "¡Bienvenidos a nuestro nuevo espacio digital!",
            "fecha": "2026-02-20",
            "categoria": "GENERAL",
            "resumen": "Estamos felices de presentarte la nueva plataforma de IBM Joven, diseñada para mantenernos conectados y edificados.",
            "contenido_md": "## ¡Explora todo lo nuevo!\n\nEstamos muy emocionados de lanzar esta nueva versión de la web de **IBM Joven**. Nuestro objetivo es que este sea un punto de encuentro dinámico para toda la juventud de la Iglesia Bautista Maranata.\n\n**¿Qué encontrarás aquí?**\n\n*   **Versículo del Día:** Una dosis diaria de la Palabra de Dios directamente de 'La Buena Semilla'.\n*   **Próximos Cumpleaños:** No te pierdas ninguna celebración. ¡Festejamos juntos cada vida!\n*   **Calendario Activo:** Mantente al tanto de todas nuestras reuniones, deportes y eventos especiales.\n*   **Galería de Recuerdos:** Revive los mejores momentos de nuestros campamentos y actividades.\n\nTe invitamos a explorar cada sección y a compartir este espacio con otros jóvenes. ¡Que sea de mucha bendición para tu vida!",
            "imagen_url": "",
            "estado": "PUBLISH",
            "esFijo": true
        }
    ];
}

function getMockEventos() {
    return [
        {
            "id": "E-TEST-002",
            "titulo": "CiberPeña Cristiana",
            "fecha": "2026-03-03",
            "hora": "20:00",
            "lugar": "Google Meet / Discord",
            "resumen": "Reunión quincenal (Martes) para reflexionar juntos.",
            "descripcion_md": "Únete a nuestra **CiberPeña** de cada 15 días (Martes). Un espacio relajado para charlar, debatir temas de fe y orar unos por otros desde casa.",
            "imagen_url": "",
            "estado": "PUBLISH"
        }
    ];
}

function getMockGaleria() {
    return [
        {
            "id": "GAL-001",
            "titulo": "Campamento 2K22 Sapukai",
            "url_album": "https://drive.google.com/drive/folders/1BKmUqAfMdydONrEGqeQfX3IyvSy8fwCD?usp=drive_link",
            "foto_portada": "https://loremflickr.com/800/600/hill,activities/all",
            "estado": "PUBLISH"
        },
        {
            "id": "GAL-002",
            "titulo": "Corrida Primavera 2023",
            "url_album": "https://drive.google.com/drive/folders/163GxHdEH_o4OB0QdPOq3hmjURmvKevxS?usp=drive_link",
            "foto_portada": "https://loremflickr.com/800/600/flash,running/all",
            "estado": "PUBLISH"
        },
        {
            "id": "GAL-003",
            "titulo": "Retiro Cambyreta 2023",
            "url_album": "https://drive.google.com/drive/folders/1IrxnqSOepinY7w_ORJmXH-de_ExwCSBp?usp=drive_link",
            "foto_portada": "https://loremflickr.com/800/600/retreat,spiritual,prayer/all",
            "estado": "PUBLISH"
        }
    ];
}

function getMockCumpleanos() {
    return [
        { "id": "C-000", "nombre": "Jon Bennett", "dia": 20, "mes": 2, "estado": "PUBLISH" },
        { "id": "C-MAR-001", "nombre": "ESTEBAN GALEANO", "dia": 2, "mes": 3, "estado": "PUBLISH" },
        { "id": "C-MAR-002", "nombre": "ARMANDO TORRES", "dia": 5, "mes": 3, "estado": "PUBLISH" },
        { "id": "C-MAR-003", "nombre": "OSVALDO MIRANDA", "dia": 6, "mes": 3, "estado": "PUBLISH" },
        { "id": "C-MAR-004", "nombre": "ZOE AYALA", "dia": 11, "mes": 3, "estado": "PUBLISH" },
        { "id": "C-MAR-005", "nombre": "SOFIA MORINIGO", "dia": 16, "mes": 3, "estado": "PUBLISH" },
        { "id": "C-MAR-006", "nombre": "HERMINIA VIANA", "dia": 17, "mes": 3, "estado": "PUBLISH" },
        { "id": "C-MAR-007", "nombre": "EZEQUIEL GALEANO", "dia": 19, "mes": 3, "estado": "PUBLISH" }
    ];
}

async function fetchCsv(url, type) {
    if (!url) {
        console.warn(`[WARN] ${type}_CSV_URL no definida. Usando datos de prueba.`);
        if (type === 'ANUNCIOS') return getMockAnuncios();
        if (type === 'EVENTOS') return getMockEventos();
        if (type === 'GALERIA') return getMockGaleria();
        if (type === 'CUMPLEANOS') return getMockCumpleanos();
        return [];
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error(`[ERROR] Falló descarga de ${type}:`, error.message);
        return [];
    }
}

async function main() {
    try {
        // Ensure output directory exists
        await fs.mkdir(OUT_DIR, { recursive: true });

        // 1. ANUNCIOS
        console.log('Fetching Anuncios...');
        const anuncios = await fetchCsv(process.env.ANUNCIOS_CSV_URL, 'ANUNCIOS');
        const anunciosPublished = anuncios
            .filter(r => r.estado === 'PUBLISH')
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // DESC

        await fs.writeFile(ANUNCIOS_PATH, JSON.stringify(anunciosPublished, null, 2));
        console.log(`✅ Saved ${anunciosPublished.length} anuncios to ${ANUNCIOS_PATH}`);

        // 2. EVENTOS
        console.log('Fetching Eventos...');
        const eventos = await fetchCsv(process.env.EVENTOS_CSV_URL, 'EVENTOS');
        const eventosPublished = eventos
            .filter(r => r.estado === 'PUBLISH')
            .sort((a, b) => new Date(a.fecha) - new Date(a.fecha)); // ASC

        await fs.writeFile(EVENTOS_PATH, JSON.stringify(eventosPublished, null, 2));
        console.log(`✅ Saved ${eventosPublished.length} eventos to ${EVENTOS_PATH}`);

        // 3. GALERIA
        console.log('Fetching Galeria...');
        const galeria = await fetchCsv(process.env.GALERIA_CSV_URL, 'GALERIA');
        const galeriaPublished = galeria.filter(r => r.estado === 'PUBLISH');

        await fs.writeFile(GALERIA_PATH, JSON.stringify(galeriaPublished, null, 2));
        console.log(`✅ Saved ${galeriaPublished.length} albums to ${GALERIA_PATH}`);

        // 4. CUMPLEANOS
        console.log('Fetching Cumpleaños...');
        const cumpleanos = await fetchCsv(process.env.CUMPLEANOS_CSV_URL, 'CUMPLEANOS');
        const cumpleanosPublished = cumpleanos
            .filter(r => r.estado === 'PUBLISH')
            .sort((a, b) => parseInt(a.dia) - parseInt(b.dia)); // Sort by day

        await fs.writeFile(CUMPLEANOS_PATH, JSON.stringify(cumpleanosPublished, null, 2));
        console.log(`✅ Saved ${cumpleanosPublished.length} cumpleañeros to ${CUMPLEANOS_PATH}`);

    } catch (err) {
        console.error('❌ Error during sync:', err);
        process.exit(1);
    }
}

main();
