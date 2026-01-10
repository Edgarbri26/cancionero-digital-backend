const aiService = require('./services/ai.service');

async function testSearch() {
    try {
        console.log('🔍 Probando searchSongByLyrics del servicio...\n');

        const result = await aiService.searchSongByLyrics(
            'Santo, santo, santo es el Señor',
            '',
            ''
        );

        console.log('\n✅ Resultado exitoso:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('\n❌ Error:');
        console.error(error.message);
        console.error(error.stack);
    }
}

testSearch();
