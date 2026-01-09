const axios = require('axios');

const IA_API_URL = process.env.IA_API_URL || 'https://api-ia-nj05.onrender.com/api';
const IA_API_KEY = process.env.IA_API_KEY || '';

async function testIAConnection() {
    try {
        console.log('🔌 Probando conexión con la API de IA...');
        console.log('URL:', IA_API_URL);
        console.log('API Key configurada:', IA_API_KEY ? 'Sí' : 'No');
        console.log('');

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
                    content: 'Eres un asistente útil.'
                },
                {
                    role: 'user',
                    content: 'Di "hola" en formato JSON: {"message": "tu respuesta"}'
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 100
        }, { headers });

        console.log('✅ Conexión exitosa!');
        console.log('Status:', response.status);
        console.log('Respuesta:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ Error de conexión:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testIAConnection();
