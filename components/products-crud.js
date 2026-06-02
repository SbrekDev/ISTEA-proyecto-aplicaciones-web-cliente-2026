const PRODUCTS_ENDPOINT = `${SUPABASE_URL}/rest/v1/products`

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
}

async function getAllProducts() {
  const res = await fetch(`${PRODUCTS_ENDPOINT}?select=*`, {
    method: 'GET',
    headers
  })
  if (!res.ok) throw new Error(`Error al obtener productos: ${res.status}`)
  return res.json()
}

async function getProductById(id) {
  const res = await fetch(`${PRODUCTS_ENDPOINT}?id=eq.${id}&select=*`, {
    method: 'GET',
    headers
  })
  if (!res.ok) throw new Error(`Error al obtener producto: ${res.status}`)
  const data = await res.json()
  return data.length ? data[0] : null
}

async function createProduct(product) {
  const res = await fetch(PRODUCTS_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(product)
  })
  if (!res.ok) throw new Error(`Error al crear producto: ${res.status}`)
  return res.json()
}

async function updateProduct(id, updates) {
  const res = await fetch(`${PRODUCTS_ENDPOINT}?id=eq.${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error(`Error al actualizar producto: ${res.status}`)
  return res.json()
}

async function deleteProduct(id) {
  const res = await fetch(`${PRODUCTS_ENDPOINT}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  })
  if (!res.ok) throw new Error(`Error al eliminar producto: ${res.status}`)
  return true
}
