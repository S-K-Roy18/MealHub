async function testDelete() {
  const baseURL = 'http://localhost:5000/api';
  try {
    const res = await fetch(`${baseURL}/gas/64a123456789012345678901`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer invalid_token' }
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Message:', data.message);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testDelete();
