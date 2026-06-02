const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const BOOKS_ENDPOINT = `${API_BASE_URL}/api/books`

async function handleResponse(response) {
  if (response.status === 204) {
    return null
  }

  let payload = null
  const text = await response.text()
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!response.ok) {
    const error = new Error(
      (payload && payload.message) || `Request failed with status ${response.status}`,
    )
    error.status = response.status
    error.fieldErrors = (payload && payload.errors) || null
    throw error
  }

  return payload
}

export async function fetchBooks(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  const response = await fetch(`${BOOKS_ENDPOINT}${query}`)
  return handleResponse(response)
}

export async function createBook(book) {
  const response = await fetch(BOOKS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
  return handleResponse(response)
}

export async function updateBook(id, book) {
  const response = await fetch(`${BOOKS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
  return handleResponse(response)
}

export async function deleteBook(id) {
  const response = await fetch(`${BOOKS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}
