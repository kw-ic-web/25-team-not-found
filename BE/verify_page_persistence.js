import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
const TIMESTAMP = Date.now();
const USERNAME = `persist_user_${TIMESTAMP}`;
const PASSWORD = 'password123';

async function runTests() {
    try {
        console.log('--- Starting Page Persistence Verification ---');

        // 1. & 2. Skip Register/Login, use provided token
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6InBvc3RtYW5fdXNlciIsIm5pY2tuYW1lIjoiVGVzdF9fVXNlciIsImlhdCI6MTc2NDY2NTAwOCwiZXhwIjoxNzY0NzUxNDA4LCJpc3MiOiJlZHVub3RlIn0.wduqi0dhJBsDsYSjioI-oanDrz7bITNt80WHYXVtaBI";
        console.log('   Using provided token for authentication.');

        // 2. Create Textbook
        console.log('\n2. Creating textbook...');
        const createTextbookRes = await fetch(`${BASE_URL}/textbooks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title: `Textbook ${TIMESTAMP}` })
        });
        const textbookData = await createTextbookRes.json();
        const textbookId = textbookData.textbookId;
        console.log('   Textbook created:', textbookId);

        // 3. Create Page (v1)
        console.log('\n3. Creating page in v1...');
        const createPageRes = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions/1/pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ page_number: 1, content: { text: "v1 content" } })
        });
        if (!createPageRes.ok) {
            const errText = await createPageRes.text();
            throw new Error(`Create Page failed: ${createPageRes.status} ${errText}`);
        }
        const pageDataV1 = await createPageRes.json();
        console.log('   Create Page Response:', JSON.stringify(pageDataV1, null, 2));
        const logicalPageId = pageDataV1.page_id;
        const recordIdV1 = pageDataV1.record_id;
        console.log('   Page created. Logical ID:', logicalPageId, 'Record ID:', recordIdV1);

        // 4. Create Version 2
        console.log('\n4. Creating version 2...');
        const createV2Res = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ from_version: 1, publish: false })
        });
        const v2Data = await createV2Res.json();
        console.log('   Version 2 created:', v2Data.version);

        // 5. Verify Page ID Persistence in v2
        console.log('\n5. Verifying page ID in v2...');
        const pagesV2Res = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions/2/pages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pagesV2 = await pagesV2Res.json();
        const pageV2 = pagesV2[0];

        console.log('   v2 Page Logical ID:', pageV2.page_id);
        console.log('   v2 Page Record ID:', pageV2.record_id);

        if (pageV2.page_id === logicalPageId) {
            console.log('   PASS: Logical Page ID persisted.');
        } else {
            console.error('   FAIL: Logical Page ID changed!');
        }

        if (pageV2.record_id !== recordIdV1) {
            console.log('   PASS: Record ID is different (new row created).');
        } else {
            console.error('   FAIL: Record ID is same (should be new row)!');
        }

        // 6. Update Page in v2
        console.log('\n6. Updating page in v2...');
        const updateRes = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions/2/pages/${logicalPageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: { text: "v2 updated content" } })
        });
        const updateData = await updateRes.json();
        console.log('   Update response:', updateData);

        // Verify v1 is unchanged
        const pagesV1Res = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions/1/pages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pagesV1 = await pagesV1Res.json();
        if (pagesV1[0].content.text === "v1 content") {
            console.log('   PASS: v1 content remains unchanged.');
        } else {
            console.error('   FAIL: v1 content was modified!');
        }

        // 7. Delete Page in v2
        console.log('\n7. Deleting page in v2...');
        const deleteRes = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions/2/pages/${logicalPageId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (deleteRes.ok) {
            console.log('   Page deleted in v2.');
        } else {
            console.error('   FAIL: Delete failed', await deleteRes.text());
        }

        // Verify v1 still has the page
        const pagesV1AfterDelRes = await fetch(`${BASE_URL}/textbooks/${textbookId}/versions/1/pages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const pagesV1AfterDel = await pagesV1AfterDelRes.json();
        if (pagesV1AfterDel.length === 1) {
            console.log('   PASS: v1 page still exists.');
        } else {
            console.error('   FAIL: v1 page was deleted!');
        }

        console.log('\n--- Verification Complete ---');

    } catch (error) {
        console.error('\n!!! Verification Failed !!!');
        console.error(error);
        process.exit(1);
    }
}

runTests();
