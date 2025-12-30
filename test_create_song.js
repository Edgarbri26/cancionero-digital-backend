async function testCreateSong() {
    try {
        const response = await fetch('http://localhost:3000/api/songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Test Song Script 2',
                artist: 'Test Artist',
                content: 'C G Am F',
                key: 'C',
                url_song: 'https://test.com',
                categoryId: 1
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Error:', response.status, err);
        } else {
            const data = await response.json();
            console.log('Success:', data);
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

testCreateSong();
