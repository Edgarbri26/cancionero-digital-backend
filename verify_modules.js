// Script simple para verificar que el módulo se carga correctamente
console.log('Verificando carga de módulos...\n');

try {
    console.log('1. Cargando generate.controler...');
    const controller = require('./controllers/generate.controler');
    console.log('   ✓ Controller cargado:', Object.keys(controller));

    console.log('\n2. Cargando ai.service...');
    const aiService = require('./services/ai.service');
    console.log('   ✓ AI Service cargado:', Object.keys(aiService));

    console.log('\n3. Cargando chordpro.utils...');
    const chordProUtils = require('./utils/chordpro.utils');
    console.log('   ✓ ChordPro Utils cargado:', Object.keys(chordProUtils));

    console.log('\n4. Cargando generate.routes...');
    const generateRoutes = require('./routes/generate.routes');
    console.log('   ✓ Routes cargado');

    console.log('\n✓ Todos los módulos se cargaron correctamente');
} catch (error) {
    console.error('\n✗ Error al cargar módulos:', error.message);
    console.error(error.stack);
    process.exit(1);
}
