const API_URL = "http://localhost:1337";

export async function getCards() {
  // I guess we don't need to include the GET method?
  const response = await fetch(`${API_URL}/api/cards`);
  return response.json();
}

export async function createCard(data) {
  const response = await fetch(`${API_URL}/api/cards`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return response.json()
}