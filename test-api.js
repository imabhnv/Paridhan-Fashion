const testApi = async () => {
  try {
    const res = await fetch('https://paridhan-fashion.vercel.app/api/deleteUser', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: 'test-uid', role: 'store', boutiqueId: 'test-boutique' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
};
testApi();
