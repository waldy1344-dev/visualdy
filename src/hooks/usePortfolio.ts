'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPortfolios, addPortfolio, updatePortfolio, deletePortfolio } from '@/services/portfolioService'
import { PortfolioInsert, PortfolioUpdate } from '@/types/portfolio'

export const usePortfolio = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
  })

  const addMutation = useMutation({
    mutationFn: (payload: PortfolioInsert) => addPortfolio(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PortfolioUpdate }) =>
      updatePortfolio(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePortfolio(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolios'] }),
  })

  return { query, addMutation, updateMutation, deleteMutation }
}
