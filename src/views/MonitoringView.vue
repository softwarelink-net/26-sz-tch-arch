<template>
  <div class="space-y-6">
    <div class="card-panel flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 class="text-base font-semibold text-slate-800">师资动态监测</h3>
        <p class="mt-1 text-sm text-slate-500">教学学时、科研产出与学生满意度趋势（演示数据）</p>
      </div>
      <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">近实时刷新</span>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <div class="card-panel">
        <h4 class="mb-4 text-sm font-semibold text-slate-700">关键 KPI 年度对比</h4>
        <VChart class="h-80 w-full" :option="kpiOption" autoresize />
      </div>
      <div class="card-panel">
        <h4 class="mb-4 text-sm font-semibold text-slate-700">成长指数排行</h4>
        <VChart class="h-80 w-full" :option="rankOption" autoresize />
      </div>
    </div>

    <div class="card-panel overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-slate-200 text-slate-500">
          <tr>
            <th class="px-3 py-3 font-medium">教师</th>
            <th class="px-3 py-3 font-medium">院系</th>
            <th class="px-3 py-3 font-medium">职称</th>
            <th class="px-3 py-3 font-medium">成长指数</th>
            <th class="px-3 py-3 font-medium">风险</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in teachers" :key="t.id" class="border-b border-slate-100">
            <td class="px-3 py-3">
              <RouterLink class="font-medium text-cyan-700 hover:underline" :to="`/teachers/${t.id}`">
                {{ t.name }}
              </RouterLink>
            </td>
            <td class="px-3 py-3">{{ t.dept }}</td>
            <td class="px-3 py-3">{{ t.title }}</td>
            <td class="px-3 py-3">{{ t.growth_score }}</td>
            <td class="px-3 py-3">{{ t.risk_level }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useDbStore } from '@/stores/db'
import type { Teacher } from '@/types'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const db = useDbStore()
const teachers = ref<Teacher[]>([])

const kpiOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['教学学时', '科研产出', '学生满意度'] },
  grid: { left: 40, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: ['2023', '2024', '2025', '2026'] },
  yAxis: { type: 'value' },
  series: [
    { name: '教学学时', type: 'line', smooth: true, data: [280, 310, 295, 330] },
    { name: '科研产出', type: 'line', smooth: true, data: [12, 15, 18, 21] },
    { name: '学生满意度', type: 'line', smooth: true, data: [86, 88, 87, 91] },
  ],
}))

const rankOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 80, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'value', max: 100 },
  yAxis: {
    type: 'category',
    data: teachers.value.map((t) => t.name).reverse(),
  },
  series: [
    {
      type: 'bar',
      data: teachers.value.map((t) => t.growth_score).reverse(),
      itemStyle: { color: '#10b981', borderRadius: [0, 6, 6, 0] },
    },
  ],
}))

onMounted(() => {
  teachers.value = db.query<Teacher>('SELECT * FROM sz_tch_teachers ORDER BY growth_score DESC')
})
</script>
