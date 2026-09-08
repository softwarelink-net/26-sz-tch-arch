import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initDatabase, queryAll, runSql } from '@/db'

export const useDbStore = defineStore('db', () => {
  const ready = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function init() {
    if (ready.value || loading.value) return
    loading.value = true
    error.value = null
    try {
      await initDatabase()
      ready.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : '数据库初始化失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
    if (!ready.value) return []
    return queryAll<T>(sql, params)
  }

  function execute(sql: string, params: unknown[] = []): void {
    if (!ready.value) return
    runSql(sql, params)
  }

  return {
    ready,
    loading,
    error,
    init,
    query,
    execute,
  }
})
