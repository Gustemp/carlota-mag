const API_BASE = '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }))
    throw new Error(error.detail || 'Erro na requisição')
  }
  
  if (response.status === 204) {
    return null
  }
  
  return response.json()
}

export const api = {
  magazines: {
    list: (publishedOnly = false) => 
      request(`/magazines?published_only=${publishedOnly}`),
    
    get: (id) => 
      request(`/magazines/${id}`),
    
    create: (data) => 
      request('/magazines', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id, data) => 
      request(`/magazines/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id) => 
      request(`/magazines/${id}`, {
        method: 'DELETE',
      }),
  },
  
  upload: {
    pdf: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_BASE}/upload/pdf`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Erro no upload' }))
        throw new Error(error.detail)
      }
      
      return response.json()
    },
    
    cover: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${API_BASE}/upload/cover`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Erro no upload' }))
        throw new Error(error.detail)
      }
      
      return response.json()
    },
  },
}
