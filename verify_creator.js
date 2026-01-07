

const BASE_URL = 'http://localhost:3000/api';

async function verifyCreator() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@admin.com', password: 'password123' })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${await loginRes.text()}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token acquired:', token);

        // 2. Create Song
        console.log('Creating song...');
        const createRes = await fetch(`${BASE_URL}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Creator Validated Song',
                artist: 'Test Artist',
                content: 'C G Am F',
                key: 'C',
                url_song: 'https://test.com',
                categoryId: 1
            })
        });

        if (!createRes.ok) {
            throw new Error(`Create song failed: ${await createRes.text()}`);
        }

        const song = await createRes.json();
        console.log('Song created with ID:', song.id);

        if (song.userId) {
            console.log('Song has userId attached:', song.userId);
        } else {
            console.warn('WARNING: createSong response did not return userId. Checking getSongById...');
        }

        // 3. Get Song by ID to check user field
        console.log('Fetching song details...');
        const getRes = await fetch(`${BASE_URL}/songs/${song.id}`);

        if (!getRes.ok) {
            throw new Error(`Get song failed: ${await getRes.text()}`);
        }

        const fetchedSong = await getRes.json();
        console.log('Fetched Song Data:', JSON.stringify(fetchedSong, null, 2));

        if (fetchedSong.user && fetchedSong.user.name) {
            console.log('SUCCESS: Song has creator information:', fetchedSong.user.name);
        } else {
            console.error('FAILURE: Song missing creator information.');
            process.exit(1);
        }

    } catch (e) {
        console.error('Verification failed:', e);
        process.exit(1);
    }
}

verifyCreator();
