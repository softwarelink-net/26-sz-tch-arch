<template>
  <div v-if="!teacher" class="card-panel py-16 text-center text-slate-400">未找到该教师档案</div>
  <div v-else class="space-y-6">
    <section class="card-panel">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 class="text-xl font-bold text-slate-900">{{ teacher.name }}</h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ teacher.emp_id }} · {{ teacher.dept }} · {{ teacher.title }}
          </p>
        </div>
        <div class="flex gap-3">
          <span class="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
            成长指数 {{ teacher.growth_score }}
          </span>
          <span
            class="rounded-full px-3 py-1 text-sm font-medium"
            :class="riskBadge(teacher.risk_level)"
          >
            风险 {{ teacher.risk_level }}
          </span>
        </div>
      </div>
      <dl class="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <dt class="text-xs text-slate-400">入职日期</dt>
          <dd class="mt-1 text-sm text-slate-800">{{ teacher.hire_date || '-' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-slate-400">状态</dt>
          <dd class="mt-1 text-sm text-slate-800">{{ teacher.status }}</dd>
        </div>
        <div>
          <dt class="text-xs text-slate-400">最近更新</dt>
          <dd class="mt-1 text-sm text-slate-800">{{ teacher.last_updated }}</dd>
        </div>
      </dl>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <div class="card-panel">
        <h4 class="mb-4 font-semibold text-slate-800">关联档案</h4>
        <ul class="divide-y divide-slate-100">
          <li v-for="doc in archives" :key="doc.id" class="py-3">
            <p class="text-sm font-medium text-slate-800">{{ doc.doc_title }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ doc.category }} · {{ doc.doc_type }} · {{ doc.upload_date }}</p>
          </li>
          <li v-if="archives.length === 0" class="py-8 text-center text-sm text-slate-400">暂无档案</li>
        </ul>
      </div>
      <div class="card-panel">
        <h4 class="mb-4 font-semibold text-slate-800">关联预警</h4>
        <ul class="divide-y divide-slate-100">
          <li v-for="w in warnings" :key="w.id" class="py-3">
            <p class="text-sm font-medium text-slate-800">{{ w.warning_type }} · {{ w.severity }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ w.message }}</p>
          </li>
          <li v-if="warnings.length === 0" class="py-8 text-center text-sm text-slate-400">暂无预警</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDbStore } from '@/stores/db'
import type { ArchiveDoc, Teacher, WarningItem } from '@/types'

const route = useRoute()
const db = useDbStore()

const teacher = ref<Teacher | null>(null)
const archives = ref<ArchiveDoc[]>([])
const warnings = ref<WarningItem[]>([])

function riskBadge(level: string) {
  if (level === 'HIGH') return 'bg-rose-50 text-rose-700'
  if (level === 'MEDIUM') return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

function load() {
  const id = Number(route.params.id)
  teacher.value = db.query<Teacher>('SELECT * FROM sz_tch_teachers WHERE id = ?', [id])[0] ?? null
  archives.value = db.query('SELECT * FROM sz_tch_archives WHERE teacher_id = ? ORDER BY upload_date DESC', [id])
  warnings.value = db.query('SELECT * FROM sz_tch_warnings WHERE teacher_id = ? ORDER BY created_at DESC', [id])
}

onMounted(load)
watch(() => route.params.id, load)
</script>
