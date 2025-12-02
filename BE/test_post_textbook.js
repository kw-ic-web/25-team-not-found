import fetch from 'node-fetch';

const url = 'http://localhost:3000/textbooks';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJ1c2VybmFtZSI6InRlc3R1c2VyIiwibmlja25hbWUiOiJUZXN0IFVzZXIiLCJpYXQiOjE3NjQ1OTU0MDUsImV4cCI6MTc2NDY4MTgwNSwiaXNzIjoiZWR1bm90ZSJ9.UR8J0_u0LWTSy2RcAr7CcdNd34ijUP9iitFPsaiTttc';

async function test() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: 'Test Textbook 2' })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
