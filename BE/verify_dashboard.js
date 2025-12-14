
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function run() {
    try {
        console.log('--- Starting Dashboard Verification ---');

        // 1. Register
        const username = `test_dash_${Date.now()}`;
        console.log(`1. Registering: ${username}`);
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: 'password123', nickname: 'Tester' })
        });

        if (!regRes.ok) {
            throw new Error(`Register failed: ${regRes.status} ${await regRes.text()}`);
        }
        const regData = await regRes.json();
        console.log('   Registered OK.');

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: 'password123' })
        });
        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('   Login OK.');

        // 3. Get Dashboard
        console.log('3. Fetching Dashboard...');
        const dashRes = await fetch(`${BASE_URL}/dashboard`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!dashRes.ok) {
            throw new Error(`Dashboard failed: ${dashRes.status} ${await dashRes.text()}`);
        }

        const dashData = await dashRes.json();

        console.log('4. validating structure...');
        const valid = dashData.summary && dashData.charts && dashData.textbooks && dashData.calendar;

        if (valid) {
            console.log('✅ Structure VALID.');
            console.log('Summary:', JSON.stringify(dashData.summary));
        } else {
            console.error('❌ Structure INVALID:', JSON.stringify(dashData));
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

run();
