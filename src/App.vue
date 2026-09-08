<template>
  <GlobalStickyBanner />
  <div class="min-h-screen">
    <div v-if="bootstrapping" class="flex min-h-screen items-center justify-center bg-slate-50 pt-banner">
      <div class="text-center">
        <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
        <p class="mt-4 text-sm text-slate-500">正在初始化本地档案数据库…</p>
        <p v-if="db.error" class="mt-2 text-sm text-rose-600">{{ db.error }}</p>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GlobalStickyBanner from '@/components/GlobalStickyBanner.vue'
import { useDbStore } from '@/stores/db'

const db = useDbStore()
const bootstrapping = ref(true)

onMounted(async () => {
  const timeout = new Promise<never>((_, reject) => {
    window.setTimeout(() => reject(new Error('数据库初始化超时，请刷新重试')), 20000)
  })
  try {
    await Promise.race([db.init(), timeout])
  } catch (err) {
    if (!db.error) {
      db.error = err instanceof Error ? err.message : '数据库初始化失败'
    }
  } finally {
    bootstrapping.value = false
  }
})
</script>
