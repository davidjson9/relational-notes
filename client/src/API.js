const API_URL = "http://localhost:1337";

export async function fetchCardEntries() {
  // I guess we don't need to include the GET method?
  const response = await fetch(`${API_URL}/api/cards`);
  return response.json();
}

export async function deleteCard(data) {
  console.log(data)

  const response = await fetch(`${API_URL}/api/cards/delete`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function saveCard(data) {
  console.log(data);

  const response = await fetch(`${API_URL}/api/cards`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchCardEntriesForSearch(terms) {
  const response = await fetch(`${API_URL}/api/tags`);
  return response.json()
}

export async function fetchTagEntries() {
  const response = await fetch(`${API_URL}/api/tags`);
  return response.json()
}

export async function saveTag(data) {
  console.log(data);
  const response = await fetch(`${API_URL}/api/tags`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  })

  return response.json();
}