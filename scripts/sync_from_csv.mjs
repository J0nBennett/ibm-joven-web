import fs from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'data');
const ANUNCIOS_PATH = path.join(OUT_DIR, 'anuncios.json');
const EVENTOS_PATH = path.join(OUT_DIR, 'eventos.json');

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

async function fetchAndSave() {
    const { ANUNCIOS_CSV_URL, EVENTOS_CSV_URL } = process.env;

    // FALLBACK: Use Mock Data if Env Vars are missing
    if (!ANUNCIOS_CSV_URL || !EVENTOS_CSV_URL) {
        console.warn('⚠️  Variable(s) de entorno ANUNCIOS_CSV_URL o EVENTOS_CSV_URL faltantes.');
        console.warn('⚠️  Generando DATOS DE PRUEBA (Mock Data)...');

        await generateMockData();
        return;
    }

    try {
        // Ensure output directory exists
        await fs.mkdir(OUT_DIR, { recursive: true });

        // 1. Process Anuncios
        console.log('Fetching Anuncios...');
        const anunciosRes = await fetch(ANUNCIOS_CSV_URL);
        if (!anunciosRes.ok) throw new Error(`Failed to fetch anuncios: ${anunciosRes.statusText}`);
        const anunciosText = await anunciosRes.text();
        const anuncios = parseCSV(anunciosText)
            .filter(item => item.estado === 'PUBLISH')
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // DESC

        await fs.writeFile(ANUNCIOS_PATH, JSON.stringify(anuncios, null, 2));
        console.log(`✅ Saved ${anuncios.length} anuncios to ${ANUNCIOS_PATH}`);

        // 2. Process Eventos
        console.log('Fetching Eventos...');
        const eventosRes = await fetch(EVENTOS_CSV_URL);
        if (!eventosRes.ok) throw new Error(`Failed to fetch eventos: ${eventosRes.statusText}`);
        const eventosText = await eventosRes.text();
        const eventos = parseCSV(eventosText)
            .filter(item => item.estado === 'PUBLISH')
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // ASC

        await fs.writeFile(EVENTOS_PATH, JSON.stringify(eventos, null, 2));
        console.log(`✅ Saved ${eventos.length} eventos to ${EVENTOS_PATH}`);

    } catch (err) {
        console.error('❌ Error during sync:', err);
        process.exit(1);
    }
}

async function generateMockData() {
    await fs.mkdir(OUT_DIR, { recursive: true });

    const mockAnuncios = [
        {
            "id": "A-TEST-001",
            "titulo": "Bienvenidos a la nueva web (TEST)",
            "fecha": "2026-02-19",
            "categoria": "GENERAL",
            "resumen": "Estamos estrenando sitio web. Estos son datos de prueba generados localmente.",
            "contenido_md": "Este contenido es generado porque no se detectaron las URLs de los CSV.",
            "imagen_url": "",
            "estado": "PUBLISH"
        }
    ];

    const mockEventos = [
        {
            "id": "E-TEST-001",
            "titulo": "Evento de Prueba",
            "fecha": "2026-02-28",
            "hora": "20:00",
            "lugar": "LocalHost",
            "descripcion_md": "Este es un evento de prueba generado automáticamente.",
            "imagen_url": "",
            "estado": "PUBLISH"
        }
    ];

    await fs.writeFile(ANUNCIOS_PATH, JSON.stringify(mockAnuncios, null, 2));
    console.log(`✅ (MOCK) Guardados ${mockAnuncios.length} anuncios de prueba.`);

    await fs.writeFile(EVENTOS_PATH, JSON.stringify(mockEventos, null, 2));
    console.log(`✅ (MOCK) Guardados ${mockEventos.length} eventos de prueba.`);
}

fetchAndSave();
