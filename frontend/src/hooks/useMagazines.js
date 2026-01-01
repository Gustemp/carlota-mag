import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api/client"

export function useMagazines(publishedOnly = false) {
  return useQuery({
    queryKey: ['magazines', publishedOnly ? 'published' : 'all'],
    queryFn: () => api.magazines.list(publishedOnly),
  })
}

export function useMagazine(id) {
  return useQuery({
    queryKey: ['magazine', id],
    queryFn: () => api.magazines.get(id),
    enabled: !!id,
  })
}

export function useCreateMagazine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => api.magazines.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['magazines'] })
    },
  })
}

export function useUpdateMagazine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.magazines.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['magazines'] })
    },
  })
}

export function useDeleteMagazine() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => api.magazines.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['magazines'] })
    },
  })
}
