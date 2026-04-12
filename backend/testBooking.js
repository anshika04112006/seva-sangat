const API_URL = 'http://localhost:5001/api';

const runTest = async () => {
    try {
        console.log("1. Logging in as volunteer... (or creating one)");
        let volunteerToken;
        let loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'testvol@example.com', password: 'password123' })
        });
        
        let loginData = await loginRes.json();
        
        if (!loginRes.ok) {
            let regRes = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: 'Test Vol', email: 'testvol@example.com', phone: '1234567890', password: 'password123', role: 'volunteer' })
            });
            loginData = await regRes.json();
        }
        
        volunteerToken = loginData.token;

        console.log("2. Fetching events...");
        const eventsRes = await fetch(`${API_URL}/events`);
        const eventsData = await eventsRes.json();
        const eventId = eventsData.data[0]._id;
        console.log(`Using Event: ${eventId}`);

        console.log("3. Booking event...");
        const bookRes = await fetch(`${API_URL}/events/${eventId}/book`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${volunteerToken}` }
        });
        const bookData = await bookRes.json();
        if (!bookRes.ok) {
            console.log("Booking info (might be already booked):", bookData.message);
        } else {
            console.log("Booked successfully.");
        }

        console.log("4. Logging in as NGO...");
        const ngoRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'hello@sevasangat.org', password: 'password123' })
        });
        const ngoData = await ngoRes.json();
        const ngoToken = ngoData.token;

        console.log("5. Fetching Event Volunteers...");
        const volunteersRes = await fetch(`${API_URL}/events/${eventId}/volunteers`, {
            headers: { 'Authorization': `Bearer ${ngoToken}` }
        });
        const volunteersData = await volunteersRes.json();
        console.log("Volunteers found:", volunteersData.count);
        
        if (volunteersData.count > 0) {
            const bookingId = volunteersData.data[0]._id;
            console.log("6. Verifying Completion for Booking:", bookingId);
            const completeRes = await fetch(`${API_URL}/events/bookings/${bookingId}/complete`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${ngoToken}` }
            });
            const completeData = await completeRes.json();
            console.log("Success! Certificate ID:", completeData.data?.certificateId || completeData.message);
        }

    } catch (e) {
        console.error("Test failed:", e.message);
    }
};

runTest();
