<template>
  <div class="space-y-6">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="card in summaryCards" :key="card.label" class="card-panel">
        <p class="text-sm text-slate-500">{{ card.label }}</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">{{ card.value }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ card.hint }}</p>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <div class="card-panel">
        <h3 class="mb-4 text-base font-semibold text-slate-800">院系师资分布</h3>
        <VChart class="h-72 w-full" :option="deptOption" autoresize />
      </div>
      <div class="card-panel">
        <h3 class="mb-4 text-base font-semibold text-slate-800">风险等级分布</h3>
        <VChart class="h-72 w-full" :option="riskOption" autoresize />
      </div>
    </section>

    <section class="card-panel">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-base font-semibold text-slate-800">近期风险预警</h3>
        <RouterLink class="text-sm text-cyan-700 hover:underline" to="/warnings">查看全部</RouterLink>
      </div>
      <div v-if="recentWarnings.length === 0" class="py-8 text-center text-sm text-slate-400">暂无预警</div>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="item in recentWarnings" :key="item.id" class="flex items-start justify-between gap-4 py-3">
          <div>
            <p class="text-sm font-medium text-slate-800">{{ item.teacher_name }} · {{ item.warning_type }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ item.message }}</p>
          </div>
          <span
            class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
            :class="severityClass(item.severity)"
          >
            {{ item.severity }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useDbStore } from '@/stores/db'
import type { WarningItem } from '@/types'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const db = useDbStore()
const teacherCount = ref(0)
const archiveCount = ref(0)
const warningCount = ref(0)
const highRiskCount = ref(0)
const deptRows = ref<{ dept: string; c: number }[]>([])
const riskRows = ref<{ risk_level: string; c: number }[]>([])
const recentWarnings = ref<(WarningItem & { teacher_name: string })[]>([])

const summaryCards = computed(() => [
  { label: '在档教师', value: teacherCount.value, hint: '全校活跃档案主体' },
  { label: '档案材料', value: archiveCount.value, hint: '已归集证据材料' },
  { label: '未读预警', value: warningCount.value, hint: '待人事/教师处理' },
  { label: '高风险教师', value: highRiskCount.value, hint: '需重点关注' },
])

const deptOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 20, bottom: 40 },
  xAxis: {
    type: 'category',
    data: deptRows.value.map((r) => r.dept),
    axisLabel: { interval: 0, rotate: 20 },
  },
  yAxis: { type: 'value', minInterval: 1 },
  series: [
    {
      type: 'bar',
      data: deptRows.value.map((r) => r.c),
      itemStyle: { color: '#0891b2', borderRadius: [6, 6, 0, 0] },
    },
  ],
}))

const riskOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['42%', '68%'],
      data: riskRows.value.map((r) => ({
        name: r.risk_level,
        value: r.c,
      })),
      color: ['#10b981', '#f59e0b', '#ef4444'],
    },
  ],
}))

function severityClass(severity: string) {
  if (severity === 'Critical') return 'bg-rose-100 text-rose-700'
  if (severity === 'Warning') return 'bg-amber-100 text-amber-700'
  return 'bg-sky-100 text-sky-700'
}

function load() {
  teacherCount.value = db.query<{ c: number }>('SELECT COUNT(*) as c FROM sz_tch_teachers')[0]?.c ?? 0
  archiveCount.value = db.query<{ c: number }>('SELECT COUNT(*) as c FROM sz_tch_archives')[0]?.c ?? 0
  warningCount.value = db.query<{ c: number }>('SELECT COUNT(*) as c FROM sz_tch_warnings WHERE is_read = 0')[0]?.c ?? 0
  highRiskCount.value =
    db.query<{ c: number }>("SELECT COUNT(*) as c FROM sz_tch_teachers WHERE risk_level = 'HIGH'")[0]?.c ?? 0
  deptRows.value = db.query('SELECT dept, COUNT(*) as c FROM sz_tch_teachers GROUP BY dept ORDER BY c DESC')
  riskRows.value = db.query('SELECT risk_level, COUNT(*) as c FROM sz_tch_teachers GROUP BY risk_level')
  recentWarnings.value = db.query(
    `SELECT w.*, t.name as teacher_name
     FROM sz_tch_warnings w
     LEFT JOIN sz_tch_teachers t ON t.id = w.teacher_id
     ORDER BY w.created_at DESC
     LIMIT 5`,
  )
}

onMounted(load)
</script>
