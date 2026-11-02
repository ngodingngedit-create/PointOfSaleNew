import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useInsightsStore = defineStore('insights', () => {
  const insights = ref([])
  const loading = ref(false)
  const analyzing = ref(false)

  async function fetchInsights() {
    loading.value = true
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (!error) insights.value = data ?? []
    loading.value = false
    if (error) throw error
  }

  async function analyze(startDate, endDate) {
    analyzing.value = true
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      const { data, error } = await supabase.functions.invoke('analyze-sales', {
        body: { start_date: startDate, end_date: endDate },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (error) throw error
      await fetchInsights()
      return data
    } finally {
      analyzing.value = false
    }
  }

  return { insights, loading, analyzing, fetchInsights, analyze }
})
