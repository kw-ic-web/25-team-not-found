
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function run() {
    try {
        console.log('--- Starting Weekly Goal Verification ---');

        // 1. Register
        const username = `goal_test_${Date.now()}`;
        console.log(`1. Registering: ${username}`);
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: 'password123', nickname: 'GoalTester' })
        });

        if (!regRes.ok) throw new Error(await regRes.text());
        const regData = await regRes.json();
        console.log('   Registered OK.');

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('   Login OK.');

        // 3. Check Initial Dashboard (Target should be 5)
        console.log('3. Checking Initial Goal...');
        const dashRes1 = await fetch(`${BASE_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dashData1 = await dashRes1.json();
        const initialTarget = dashData1.summary.weekly_goal.target;
        console.log(`   Initial Target: ${initialTarget}`);

        if (String(initialTarget) !== '5') {
            throw new Error(`Expected initial target 5, got ${initialTarget}`);
        }

        // 4. Update Goal to 10
        console.log('4. Updating Goal to 10...');
        const updateRes = await fetch(`${BASE_URL}/users/goal`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ weekly_goal: 10 })
        });

        if (!updateRes.ok) throw new Error(await updateRes.text());
        const updateData = await updateRes.json();
        console.log('   Update Response:', updateData);

        // 5. Check Dashboard Again (Target should be 10)
        console.log('5. Checking Updated Goal...');
        const dashRes2 = await fetch(`${BASE_URL}/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dashData2 = await dashRes2.json();
        const updatedTarget = dashData2.summary.weekly_goal.target;
        console.log(`   Updated Target: ${updatedTarget}`);

        if (String(updatedTarget) !== '10') {
            throw new Error(`Expected updated target 10, got ${updatedTarget}`);
        }

        console.log('✅ Weekly Goal Verification Passed!');
    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
}

run();
