<template>
  <div class="space-y-6">
    <div class="card-panel flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 class="text-base font-semibold text-slate-800">风险智能预警</h3>
        <p class="mt-1 text-sm text-slate-500">教学事故、项目逾期、证书到期等事件触发</p>
      </div>
      <button class="btn-ghost border border-slate-200" type="button" @click="markAllRead">全部标为已读</button>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in rows"
        :key="item.id"
        class="card-panel flex flex-wrap items-start justify-between gap-4"
        :class="item.is_read ? 'opacity-70' : ''"
      >
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="severityClass(item.severity)">
              {{ item.severity }}
            </span>
            <span class="text-sm font-semibold text-slate-800">{{ item.warning_type }}</span>
            <RouterLink class="text-sm text-cyan-700 hover:underline" :to="`/teachers/${item.teacher_id}`">
              {{ item.teacher_name }}
            </RouterLink>
          </div>
          <p class="mt-2 text-sm text-slate-600">{{ item.message }}</p>
          <p class="mt-2 text-xs text-slate-400">{{ item.created_at }}</p>
        </div>
        <button
          v-if="!item.is_read"
          class="btn-primary"
          type="button"
          @click="markRead(item.id)"
        >
          标为已读
        </button>
      </div>
      <div v-if="rows.length === 0" class="card-panel py-12 text-center text-slate-400">暂无预警记录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDbStore } from '@/stores/db'
import type { WarningItem } from '@/types'

const db = useDbStore()
const rows = ref<(WarningItem & { teacher_name: string })[]>([])

function severityClass(severity: string) {
  if (severity === 'Critical') return 'bg-rose-100 text-rose-700'
  if (severity === 'Warning') return 'bg-amber-100 text-amber-700'
  return 'bg-sky-100 text-sky-700'
}

function load() {
  rows.value = db.query(
    `SELECT w.*, t.name as teacher_name
     FROM sz_tch_warnings w
     LEFT JOIN sz_tch_teachers t ON t.id = w.teacher_id
     ORDER BY CASE w.severity WHEN 'Critical' THEN 0 WHEN 'Warning' THEN 1 ELSE 2 END, w.created_at DESC`,
  )
}

function markRead(id: number) {
  db.execute('UPDATE sz_tch_warnings SET is_read = 1 WHERE id = ?', [id])
  load()
}

function markAllRead() {
  db.execute('UPDATE sz_tch_warnings SET is_read = 1')
  load()
}

onMounted(load)
</script>
