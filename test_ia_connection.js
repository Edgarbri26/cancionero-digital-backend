const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

async function testGeminiConnection() {
    console.log('🔌 Probando conexión con Google Gemini...');
    console.log('API Key configurada:', GEMINI_API_KEY ? 'Sí' : 'No');

    if (!GEMINI_API_KEY) {
        console.error('❌ Error: GEMINI_API_KEY no encontrada en variables de entorno.');
        console.error('Por favor agrega GEMINI_API_KEY=tu_api_key a tu archivo .env');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('🤖 Enviando prompt de prueba a gemini-1.5-flash...');
        const result = await model.generateContent('Di "Hola, funcionamiento correcto" si me escuchas.');
        const response = await result.response;
        const text = response.text();

        console.log('✅ Conexión exitosa!');
        console.log('Respuesta:', text);

    } catch (error) {
        console.error('❌ Error de conexión:');
        console.error(error.message);
    }
}

testGeminiConnection();
