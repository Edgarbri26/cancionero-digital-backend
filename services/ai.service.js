const axios = require('axios');

const IA_API_URL = process.env.IA_API_URL || 'https://api-ia-nj05.onrender.com/api';
const IA_API_KEY = process.env.IA_API_KEY || '';

/**
 * Genera una canción completa con letra y acordes usando IA
 * @param {string} title - Título de la canción
 * @param {string} tone - Tono/tonalidad de la canción (ej: C, G, Am, etc.)
 * @param {string} category - Categoría de canto católico (ej: Entrada, Comunión, Salida, etc.)
 * @param {string} artist - Artista/autor de la canción (opcional)
 * @returns {Promise<string>} - Canción en formato ChordPro
 */
async function generateSongWithChords(title, tone = 'C', category = 'Entrada', artist = '') {
    try {
        const artistInfo = artist ? ` de ${artist}` : '';
        const prompt = `Busca la letra ORIGINAL de la canción católica "${title}"${artistInfo} y agrégale acordes en el tono de ${tone}.

IMPORTANTE: 
- Debes buscar y usar la letra ORIGINAL de la canción, NO inventes una nueva
- Si conoces la canción, usa su letra exacta
- Responde ÚNICAMENTE en formato ChordPro
- El formato ChordPro usa corchetes [] para los acordes sobre las letras y llaves {c: } para las secciones

Ejemplo de formato ChordPro:

{c: Intro}
[${tone}]    [G]    [Am]    [F]

{c: Verse 1}
[${tone}]Aquí va la [G]letra ORIGINAL de la can[Am]ción
Con los a[F]cordes sobre las pa[${tone}]labras

{c: Coro}
[Am]Este es el [F]coro
[${tone}]Con acordes [G]también

{c: Salida}
[${tone}]    [G]    [Am]    [F]    [${tone}]

Instrucciones:
- Busca la letra ORIGINAL completa de "${title}"${artistInfo}
- Agrega acordes apropiados para el tono ${tone}
- Identifica las secciones correctas ({c: Intro}, {c: Verse 1}, {c: Verse 2}, {c: Coro}, {c: Puente}, {c: Salida}, etc.)
- Cuando no hay letra (Intro, Salida), deja espacios entre acordes
- NO incluyas {title: } ni {key: } en tu respuesta

Responde SOLO con el formato ChordPro de la canción ORIGINAL, sin explicaciones adicionales.`;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (IA_API_KEY) {
            headers['Authorization'] = `Bearer ${IA_API_KEY}`;
        }

        const response = await axios.post(`${IA_API_URL}/chat`, {
            messages: [
                {
                    role: 'system',
                    content: 'Eres un compositor experto de música litúrgica católica que genera canciones en formato ChordPro. Siempre respondes únicamente en formato ChordPro sin texto adicional. Conoces bien la liturgia católica y las diferentes categorías de cantos.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.8,
            max_tokens: 2000
        }, { headers });

        // Extraer el contenido de la respuesta
        let content = '';
        if (response.data && response.data.choices && response.data.choices[0]) {
            content = response.data.choices[0].message.content;
        } else if (response.data && response.data.content) {
            content = response.data.content;
        } else if (typeof response.data === 'string') {
            content = response.data;
        }

        return content.trim();
    } catch (error) {
        console.error('Error al generar canción con IA:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw new Error(`Error al conectar con la IA: ${error.message}`);
    }
}

/**
 * Autocompleta acordes para una letra existente
 * @param {string} title - Título de la canción
 * @param {string} tone - Tono/tonalidad de la canción
 * @param {string} lyrics - Letra de la canción sin acordes
 * @returns {Promise<string>} - Canción con acordes en formato ChordPro
 */
async function autocompleteChordsForLyrics(title, tone = 'C', lyrics) {
    try {
        const prompt = `Tengo la siguiente letra de una canción católica y necesito que agregues los acordes en formato ChordPro.

Título: ${title}
Tono: ${tone}

Letra:
${lyrics}

IMPORTANTE: Debes responder ÚNICAMENTE en formato ChordPro. El formato ChordPro usa corchetes [] para los acordes sobre las letras.

Instrucciones:

1. Mantén EXACTAMENTE la misma letra que te proporcioné
2. Agrega acordes apropiados para el tono ${tone} usando corchetes []
3. Coloca los acordes sobre las palabras donde deben cambiar
4. Identifica las secciones ({c: Verse}, {c: Chorus}, {c: Bridge}, etc.)
5. no quiero que agregues {title: } y {key: } al inicio

Ejemplo de formato:

{c: Intro}
[${tone}]    [G]    [Am]    [F]

{c: Verse 1}
[${tone}]Aquí va la [G]letra original
Con los a[Am]cordes que tú agre[F]gas

{c: Coro}
[Am]Este es el [F]coro
[${tone}]Con acordes [G]también

Responde SOLO con el formato ChordPro, sin explicaciones adicionales.`;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (IA_API_KEY) {
            headers['Authorization'] = `Bearer ${IA_API_KEY}`;
        }

        const response = await axios.post(`${IA_API_URL}/chat`, {
            messages: [
                {
                    role: 'system',
                    content: 'Eres un músico experto que agrega acordes a letras de canciones católicas en formato ChordPro. Siempre respondes únicamente en formato ChordPro sin texto adicional.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2000
        }, { headers });

        // Extraer el contenido de la respuesta
        let content = '';
        if (response.data && response.data.choices && response.data.choices[0]) {
            content = response.data.choices[0].message.content;
        } else if (response.data && response.data.content) {
            content = response.data.content;
        } else if (typeof response.data === 'string') {
            content = response.data;
        }

        return content.trim();
    } catch (error) {
        console.error('Error al autocompletar acordes con IA:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        throw new Error(`Error al conectar con la IA: ${error.message}`);
    }
}

module.exports = {
    generateSongWithChords,
    autocompleteChordsForLyrics
};
