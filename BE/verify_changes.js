import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const TIMESTAMP = Date.now();
const USERNAME = `testuser_${TIMESTAMP}`;
const PASSWORD = 'password123';

async function runTests() {
    try {
        console.log('--- Starting Verification ---');

        // 1. Register User
        console.log(`\n1. Registering user: ${USERNAME}`);
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME, password: PASSWORD, nickname: 'Tester' })
        });

        if (!registerRes.ok) {
            const err = await registerRes.text();
            throw new Error(`Registration failed: ${err}`);
        }
        const registerData = await registerRes.json();
        console.log('   Registration successful:', registerData.user_id);

        // 2. Login to get Token
        console.log('\n2. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME, password: PASSWORD })
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        if (!token) throw new Error('Login failed: No token received');
        console.log('   Login successful. Token received.');

        // 3. Check Username Availability
        console.log('\n3. Checking username availability...');
        // Check existing
        const check1 = await fetch(`${BASE_URL}/auth/check-username`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME })
        });
        const check1Data = await check1.json();
        console.log(`   Check '${USERNAME}' (should be false):`, check1Data.available);

        // Check new
        const check2 = await fetch(`${BASE_URL}/auth/check-username`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `new_${TIMESTAMP}` })
        });
        const check2Data = await check2.json();
        console.log(`   Check 'new_${TIMESTAMP}' (should be true):`, check2Data.available);

        // 4. Create Textbook (to test update)
        console.log('\n4. Creating a textbook...');
        const createTextbookRes = await fetch(`${BASE_URL}/textbooks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: `Textbook ${TIMESTAMP}` })
        });
        const textbookData = await createTextbookRes.json();
        const textbookId = textbookData.textbookId; // Note: API returns textbookId (camelCase) based on my read of routes
        console.log('   Textbook created:', textbookId);

        // 5. Update Textbook Title
        console.log('\n5. Updating textbook title...');
        const updateTextbookRes = await fetch(`${BASE_URL}/textbooks/${textbookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: `Updated Title ${TIMESTAMP}` })
        });
        const updateTextbookData = await updateTextbookRes.json();
        console.log('   Update response:', updateTextbookData.title);
        if (updateTextbookData.title !== `Updated Title ${TIMESTAMP}`) {
            console.error('   FAIL: Title mismatch');
        } else {
            console.log('   PASS: Title updated');
        }

        // 6. Get Dashboard
        console.log('\n6. Fetching Dashboard...');
        const dashboardRes = await fetch(`${BASE_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const dashboardData = await dashboardRes.json();
        console.log('   Dashboard Data Keys:', Object.keys(dashboardData.data || {}));

        if (dashboardData.data && dashboardData.data.teacher_textbooks) {
            console.log('   PASS: teacher_textbooks field present');
        } else {
            console.error('   FAIL: teacher_textbooks field missing');
        }

        if (dashboardData.data && dashboardData.data.stats) {
            console.log('   PASS: stats field present');
        } else {
            console.error('   FAIL: stats field missing');
        }

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('\n!!! Verification Failed !!!');
        console.error(error);
    }
}

runTests();
