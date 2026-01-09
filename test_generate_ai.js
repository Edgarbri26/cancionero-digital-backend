/**
 * Script de prueba para el endpoint de generación de canciones con IA
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/generate';

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m'
};

async function testFullGeneration() {
    console.log(`\n${colors.blue}=== Test 1: Generación Completa ===${colors.reset}`);

    try {
        const response = await axios.post(API_URL, {
            type: 'full',
            title: 'Cordero de Dios',
            tone: 'G',
            category: 'Comunión'
        });

        console.log(`${colors.green}✓ Generación completa exitosa${colors.reset}`);
        console.log('\nMetadata:', JSON.stringify(response.data.metadata, null, 2));
        console.log('\nAcordes encontrados:', response.data.chords.list.join(', '));
        console.log('\nChordPro generado:');
        console.log(colors.yellow + response.data.chordPro + colors.reset);

        return true;
    } catch (error) {
        console.error(`${colors.red}✗ Error en generación completa:${colors.reset}`, error.response?.data || error.message);
        return false;
    }
}

async function testAutocomplete() {
    console.log(`\n${colors.blue}=== Test 2: Autocomplete de Acordes ===${colors.reset}`);

    const lyrics = `Verso 1:
En la noche estrellada
Pienso en ti sin parar
Tu recuerdo me acompaña
Y no te puedo olvidar

Coro:
Eres mi luz en la oscuridad
Mi razón para continuar
Siempre estarás en mi corazón
Eres mi eterna canción`;

    try {
        const response = await axios.post(API_URL, {
            type: 'autocomplete',
            title: 'Mi Canción',
            tone: 'C',
            lyrics: lyrics
        });

        console.log(`${colors.green}✓ Autocomplete exitoso${colors.reset}`);
        console.log('\nMetadata:', JSON.stringify(response.data.metadata, null, 2));
        console.log('\nAcordes agregados:', response.data.chords.list.join(', '));
        console.log('\nChordPro con acordes:');
        console.log(colors.yellow + response.data.chordPro + colors.reset);

        return true;
    } catch (error) {
        console.error(`${colors.red}✗ Error en autocomplete:${colors.reset}`, error.response?.data || error.message);
        return false;
    }
}

async function testValidation() {
    console.log(`\n${colors.blue}=== Test 3: Validación de Parámetros ===${colors.reset}`);

    try {
        // Test sin parámetros requeridos
        await axios.post(API_URL, {
            type: 'full'
        });
        console.log(`${colors.red}✗ Debería haber fallado sin parámetros${colors.reset}`);
        return false;
    } catch (error) {
        if (error.response?.status === 400) {
            console.log(`${colors.green}✓ Validación de parámetros funciona correctamente${colors.reset}`);
            console.log('Error esperado:', error.response.data.error);
            return true;
        }
        console.error(`${colors.red}✗ Error inesperado:${colors.reset}`, error.message);
        return false;
    }
}

async function runAllTests() {
    console.log(`${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Tests de Generación de Canciones IA  ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}`);

    const results = [];

    results.push(await testFullGeneration());
    results.push(await testAutocomplete());
    results.push(await testValidation());

    console.log(`\n${colors.blue}=== Resumen ===${colors.reset}`);
    const passed = results.filter(r => r).length;
    const total = results.length;

    if (passed === total) {
        console.log(`${colors.green}✓ Todos los tests pasaron (${passed}/${total})${colors.reset}`);
    } else {
        console.log(`${colors.yellow}⚠ Algunos tests fallaron (${passed}/${total})${colors.reset}`);
    }
}

// Ejecutar tests
runAllTests().catch(error => {
    console.error(`${colors.red}Error fatal:${colors.reset}`, error);
    process.exit(1);
});
