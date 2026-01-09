const axios = require('axios');
require('dotenv').config();

const IA_API_URL = process.env.IA_API_URL || 'https://api-ia-nj05.onrender.com/api';
const IA_API_KEY = process.env.IA_API_KEY || '';

async function testSearchDirectly() {
    try {
        console.log('🔍 Probando búsqueda de canción directamente con la API de IA...\n');

        const lyricFragment = 'Santo, santo, santo es el Señor';

        const prompt = `Tu tarea es IDENTIFICAR una canción católica existente usando el fragmento de letra proporcionado.

Fragmento de letra:
"${lyricFragment}"

⚠️ REGLAS CRÍTICAS - DEBES SEGUIRLAS ESTRICTAMENTE:

1. SOLO puedes devolver canciones católicas que REALMENTE EXISTEN
2. NO PUEDES INVENTAR, CREAR o GENERAR canciones nuevas
3. Si NO RECONOCES la canción con certeza, DEBES responder con un error
4. La letra debe ser EXACTAMENTE como la canción original, palabra por palabra
5. NO modifiques, parafrasees o "mejores" la letra original

FORMATO DE RESPUESTA:

Si RECONOCES la canción (estás 100% seguro):
{
  "found": true,
  "title": "Título EXACTO de la canción real",
  "artist": "Artista/compositor REAL",
  "key": "Tono sugerido",
  "chordPro": "Letra ORIGINAL COMPLETA con acordes en formato ChordPro"
}

Si NO RECONOCES la canción o tienes dudas:
{
  "found": false,
  "error": "No se pudo identificar la canción con el fragmento proporcionado"
}

Responde SOLO con el objeto JSON, sin texto adicional.`;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (IA_API_KEY) {
            headers['Authorization'] = `Bearer ${IA_API_KEY}`;
        }

        console.log('📡 Enviando petición a:', `${IA_API_URL}/chat`);
        console.log('');

        const response = await axios.post(`${IA_API_URL}/chat`, {
            messages: [
                {
                    role: 'system',
                    content: 'Eres un asistente que SOLO identifica canciones católicas REALES que existen. NUNCA inventas o creas canciones nuevas. Si no reconoces una canción, SIEMPRE respondes con un error. Respondes únicamente en formato JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 2500
        }, { headers });

        console.log('✅ Respuesta recibida!');
        console.log('Status:', response.status);
        console.log('\nTipo de response.data:', typeof response.data);
        console.log('\nResponse.data completo:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testSearchDirectly();
