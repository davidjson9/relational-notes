const Joi = require('@hapi/joi');

const API_URL = (window.location.hostname === 'localhost') ? "http://localhost:1337" : 'https://relational-notes-api.now.sh';
// const API_URL = "https://relational-notes-api.now.sh";
const VALIDATION_ERR = { "error": "VALIDATION FAILED" };

export async function fetchCardEntries() {
  // I guess we don't need to include the GET method?
  const response = await fetch(`${API_URL}/api/cards`);
  return response.json();
}

export async function fetchCardEntriesForSearch(data) {
  const response = await fetch(`${API_URL}/api/cards/search`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return response.json()
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

  const response = await fetch(`${API_URL}/api/cards/save`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function fetchTagEntries() {
  const response = await fetch(`${API_URL}/api/tags`);
  return response.json()
}

export async function saveTag(data) {
  const schema = Joi.object({
    label: Joi.string().required(),
    value: Joi.string().required(),
    color: Joi.string().required(),
    count: Joi.number().required(),
  });
  console.log(data);
  console.log(schema.validate(data));
  if (schema.validate(data).error !== null) return { "error": "VALIDATION FAILED" };

  console.log(data);
  const response = await fetch(`${API_URL}/api/tags/save`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  return response.json();
}

export async function updateTag(data) {
  const schema = Joi.object({
    tag: Joi.string().required(),
    count: Joi.number().required(),
  });
  console.log(data);
  console.log(schema.validate(data));
  if (schema.validate(data).error !== null) return { VALIDATION_ERR };

  const response = await fetch(`${API_URL}/api/tags/update`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  return response.json();
}

export async function deleteTag(data) {
  const schema = Joi.object({
    tag: Joi.string().required()
  });
  console.log(data);
  if (schema.validate(data).error !== null) return { VALIDATION_ERR };

  const response = await fetch(`${API_URL}/api/tags/delete`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  return response.json();
}