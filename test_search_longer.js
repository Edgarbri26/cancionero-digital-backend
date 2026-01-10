const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testSearchSongWithLongerFragment() {
    try {
        console.log('🔍 Probando endpoint de búsqueda con fragmento más largo...\n');

        const testData = {
            lyricFragment: `Santo, santo, santo es el Señor
Dios del universo
Llenos están el cielo y la tierra
de tu gloria, Señor`,
            artist: '',
            title: ''
        };

        console.log('Datos de prueba:');
        console.log(JSON.stringify(testData, null, 2));
        console.log('\n📡 Enviando petición a:', `${API_URL}/search/song`);

        const response = await axios.post(`${API_URL}/search/song`, testData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('\n✅ Respuesta exitosa!');
        console.log('Status:', response.status);
        console.log('\nDatos recibidos:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ Error en la prueba:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testSearchSongWithLongerFragment();
