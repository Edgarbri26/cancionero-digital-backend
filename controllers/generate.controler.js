const prisma = require('../prismaClient');
const aiService = require('../services/ai.service');
const chordProUtils = require('../utils/chordpro.utils');

/**
 * Controlador para generar canciones con IA
 * 
 * Tipos de generación:
 * - "full": Genera una canción completa con letra y acordes
 * - "autocomplete": Agrega acordes a una letra existente
 * 
 * Body esperado:
 * {
 *   type: "full" | "autocomplete",
 *   title: string,
 *   tone: string (ej: "C", "G", "Am"),
 *   category?: string (para type="full", ej: "Entrada", "Comunión", "Salida"),
 *   lyrics?: string (solo para type="autocomplete")
 * }
 */
exports.generate = async (req, res) => {
    try {
        const { type, title, tone, category, lyrics, artist } = req.body;

        // Validación de parámetros
        if (!type || !title || !tone) {
            return res.status(400).json({
                error: 'Parámetros requeridos: type, title, tone'
            });
        }

        if (!['full', 'autocomplete'].includes(type)) {
            return res.status(400).json({
                error: 'El tipo debe ser "full" o "autocomplete"'
            });
        }

        if (type === 'autocomplete' && !lyrics) {
            return res.status(400).json({
                error: 'Para autocomplete se requiere el parámetro "lyrics"'
            });
        }

        let chordProResult = '';

        // Generar según el tipo solicitado
        if (type === 'full') {
            const artistInfo = artist ? ` de ${artist}` : '';
            console.log(`Generando canción completa: "${title}"${artistInfo} en tono ${tone}, categoría: ${category || 'Entrada'}`);
            chordProResult = await aiService.generateSongWithChords(
                title,
                tone,
                category || 'Entrada',
                artist || ''
            );
        } else if (type === 'autocomplete') {
            console.log(`Autocompletando acordes para: "${title}" en tono ${tone}`);
            chordProResult = await aiService.autocompleteChordsForLyrics(
                title,
                tone,
                lyrics
            );
        }

        // Validar que el resultado sea ChordPro válido
        if (!chordProUtils.isValidChordPro(chordProResult)) {
            console.warn('La IA no devolvió un formato ChordPro válido');
            // Intentar formatear el resultado
            chordProResult = chordProUtils.formatAsChordPro(chordProResult, {
                title,
                key: tone
            });
        }

        // Extraer información adicional
        const chords = chordProUtils.extractChords(chordProResult);
        const metadata = chordProUtils.extractMetadata(chordProResult);
        const validation = chordProUtils.validateChords(chords);

        // Responder con el resultado
        res.status(200).json({
            success: true,
            type,
            chordPro: chordProResult,
            metadata: {
                title: metadata.title || title,
                key: metadata.key || tone,
                ...metadata
            },
            chords: {
                list: chords,
                count: chords.length,
                validation
            }
        });

    } catch (error) {
        console.error('Error en generate controller:', error);
        res.status(500).json({
            error: 'Error al generar la canción',
            message: error.message
        });
    }
};

exports.autocompleteChordsForLyrics = async (req, res) => {
    try {
        const { title, tone, lyrics } = req.body;

        // Validación de parámetros
        if (!title || !tone || !lyrics) {
            return res.status(400).json({
                error: 'Parámetros requeridos: title, tone, lyrics'
            });
        }

        const chordProResult = await aiService.autocompleteChordsForLyrics(
            title,
            tone,
            lyrics
        );

        // Validar que el resultado sea ChordPro válido
        if (!chordProUtils.isValidChordPro(chordProResult)) {
            console.warn('La IA no devolvió un formato ChordPro válido');
            // Intentar formatear el resultado
            chordProResult = chordProUtils.formatAsChordPro(chordProResult, {
                title,
                key: tone
            });
        }

        // Extraer información adicional
        const chords = chordProUtils.extractChords(chordProResult);
        const metadata = chordProUtils.extractMetadata(chordProResult);
        const validation = chordProUtils.validateChords(chords);

        // Responder con el resultado
        res.status(200).json({
            success: true,
            type: 'autocomplete',
            chordPro: chordProResult,
            metadata: {
                title: metadata.title || title,
                key: metadata.key || tone,
                ...metadata
            },
            chords: {
                list: chords,
                count: chords.length,
                validation
            }
        });

    } catch (error) {
        console.error('Error en autocompleteChordsForLyrics controller:', error);
        res.status(500).json({
            error: 'Error al autocompletar acordes',
            message: error.message
        });
    }
};

/**
 * Busca una canción por fragmento de letra
 * 
 * Body esperado:
 * {
 *   lyricFragment: string (requerido),
 *   artist?: string (opcional),
 *   title?: string (opcional)
 * }
 */
exports.searchSongByLyrics = async (req, res) => {
    try {
        const { lyricFragment, artist, title } = req.body;

        // Validación de parámetros
        if (!lyricFragment || lyricFragment.trim().length === 0) {
            return res.status(400).json({
                error: 'Se requiere un fragmento de letra para buscar la canción'
            });
        }

        console.log(`Buscando canción por fragmento: "${lyricFragment.substring(0, 50)}..."`);
        if (artist) console.log(`  - Artista (pista): ${artist}`);
        if (title) console.log(`  - Título (pista): ${title}`);

        // Llamar al servicio de IA para buscar la canción
        const result = await aiService.searchSongByLyrics(
            lyricFragment,
            artist || '',
            title || ''
        );

        // El servicio ya devuelve un objeto con title, artist, key, chordPro
        const chordProResult = result.chordPro;

        // Validar que el resultado sea ChordPro válido
        let finalChordPro = chordProResult;
        if (!chordProUtils.isValidChordPro(chordProResult)) {
            console.warn('La IA no devolvió un formato ChordPro válido, intentando formatear...');
            finalChordPro = chordProUtils.formatAsChordPro(chordProResult, {
                title: result.title,
                key: result.key
            });
        }

        // Extraer información adicional
        const chords = chordProUtils.extractChords(finalChordPro);
        const metadata = chordProUtils.extractMetadata(finalChordPro);
        const validation = chordProUtils.validateChords(chords);

        // Responder con el resultado
        res.status(200).json({
            success: true,
            type: 'search',
            chordPro: finalChordPro,
            metadata: {
                title: result.title || metadata.title || 'Canción encontrada',
                artist: result.artist || metadata.artist || '',
                key: result.key || metadata.key || 'C',
                ...metadata
            },
            chords: {
                list: chords,
                count: chords.length,
                validation
            }
        });

    } catch (error) {
        console.error('Error en searchSongByLyrics controller:', error);
        res.status(500).json({
            error: 'Error al buscar la canción',
            message: error.message
        });
    }
};

