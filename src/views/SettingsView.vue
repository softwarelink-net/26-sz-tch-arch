<template>
  <div class="space-y-6">
    <div class="card-panel">
      <h3 class="text-base font-semibold text-slate-800">业务灵活配置</h3>
      <p class="mt-1 text-sm text-slate-500">系统开关、同步间隔与上传限制（演示可写回本地 SQLite）</p>
    </div>

    <div class="card-panel space-y-4">
      <div v-for="item in configs" :key="item.key" class="grid gap-2 border-b border-slate-100 pb-4 last:border-0 sm:grid-cols-[220px_1fr_auto] sm:items-center">
        <div>
          <p class="text-sm font-medium text-slate-800">{{ item.key }}</p>
          <p class="text-xs text-slate-400">{{ item.description }}</p>
        </div>
        <input v-model="item.value" class="input-field" />
        <button class="btn-primary" type="button" @click="save(item)">保存</button>
      </div>
      <p v-if="message" class="text-sm text-emerald-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDbStore } from '@/stores/db'

interface ConfigRow {
  key: string
  value: string
  description: string | null
}

const db = useDbStore()
const configs = ref<ConfigRow[]>([])
const message = ref('')

function load() {
  configs.value = db.query<ConfigRow>('SELECT key, value, description FROM sz_tch_system_configs ORDER BY key')
}

function save(item: ConfigRow) {
  db.execute('UPDATE sz_tch_system_configs SET value = ? WHERE key = ?', [item.value, item.key])
  message.value = `已更新 ${item.key}`
  load()
}

onMounted(load)
</script>
