import fs from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'data');
const ANUNCIOS_PATH = path.join(OUT_DIR, 'anuncios.json');
const EVENTOS_PATH = path.join(OUT_DIR, 'eventos.json');
const GALERIA_PATH = path.join(OUT_DIR, 'galeria.json');

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
            "id": "A-TEST-002",
            "titulo": "Campamento Semana Santa - Sapukai",
            "fecha": "2026-02-19",
            "categoria": "EVENTO",
            "resumen": "Prepárate para unos días increíbles en el Campamento Sapukai. ¡No te lo pierdas!",
            "contenido_md": "## Campamento Sapukai 2026\n\nNos vamos de retiro espiritual esta Semana Santa. Será un tiempo de desconexión, amigos y encuentro con Dios.\n\n**Fecha:** 2 al 5 de Abril\n**Costo:** A confirmar\n**Inscripciones:** Con los líderes.",
            "imagen_url": "",
            "estado": "PUBLISH"
        },
        {
            "id": "A-TEST-001",
            "titulo": "Bienvenidos a la nueva web de IBM Joven",
            "fecha": "2026-02-19",
            "categoria": "GENERAL",
            "resumen": "Estamos estrenando sitio web. Aquí podrás enterarte de todas nuestras actividades.",
            "contenido_md": "Este contenido es generado porque no se detectaron las URLs de los CSV.",
            "imagen_url": "",
            "estado": "PUBLISH"
        }
    ];
}

function getMockEventos() {
    return [
        {
            "id": "E-TEST-002",
            "titulo": "CiberPeña Cristiana",
            "fecha": "2026-03-03", // Next one in 2 weeks roughly
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
        },
        {
            "id": "GAL-004",
            "titulo": "Torneo Maranata",
            "url_album": "https://drive.google.com/drive/folders/1lDRTlo4pPYFfbv8lTChsEtvhjlUWZzX8?usp=drive_link",
            "foto_portada": "https://loremflickr.com/800/600/soccer,tournament,sports/all",
            "estado": "PUBLISH"
        }
    ];
}

async function fetchCsv(url, type) {
    if (!url) {
        console.warn(`[WARN] ${type}_CSV_URL no definida. Usando datos de prueba.`);
        if (type === 'ANUNCIOS') return getMockAnuncios();
        if (type === 'EVENTOS') return getMockEventos();
        if (type === 'GALERIA') return getMockGaleria();
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
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // ASC

        await fs.writeFile(EVENTOS_PATH, JSON.stringify(eventosPublished, null, 2));
        console.log(`✅ Saved ${eventosPublished.length} eventos to ${EVENTOS_PATH}`);

        // 3. GALERIA
        console.log('Fetching Galeria...');
        const galeria = await fetchCsv(process.env.GALERIA_CSV_URL, 'GALERIA');
        const galeriaPublished = galeria.filter(r => r.estado === 'PUBLISH');

        await fs.writeFile(GALERIA_PATH, JSON.stringify(galeriaPublished, null, 2));
        console.log(`✅ Saved ${galeriaPublished.length} albums to ${GALERIA_PATH}`);

    } catch (err) {
        console.error('❌ Error during sync:', err);
        process.exit(1);
    }
}

main();
