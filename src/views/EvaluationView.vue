<template>
  <div class="space-y-6">
    <div class="card-panel">
      <h3 class="text-base font-semibold text-slate-800">能力评价诊改</h3>
      <p class="mt-1 text-sm text-slate-500">基于“双高”建设标准的多维雷达诊断（演示）</p>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="card-panel">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <label class="text-sm text-slate-600">选择教师</label>
          <select v-model="selectedId" class="input-field max-w-xs" @change="buildReport">
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }} · {{ t.dept }}</option>
          </select>
        </div>
        <VChart class="h-96 w-full" :option="radarOption" autoresize />
      </div>

      <div class="card-panel">
        <h4 class="font-semibold text-slate-800">自动诊断报告</h4>
        <p class="mt-3 text-sm leading-7 text-slate-600">{{ report }}</p>
        <ul class="mt-6 space-y-3">
          <li v-for="item in highlights" :key="item.label" class="rounded-lg bg-slate-50 px-3 py-2">
            <p class="text-xs text-slate-400">{{ item.label }}</p>
            <p class="mt-1 text-sm font-medium text-slate-800">{{ item.value }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { LegendComponent, RadarComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useDbStore } from '@/stores/db'
import type { Teacher } from '@/types'

use([CanvasRenderer, RadarChart, RadarComponent, TooltipComponent, LegendComponent])

const db = useDbStore()
const teachers = ref<Teacher[]>([])
const selectedId = ref<number>(1)
const scores = ref([80, 70, 75, 65, 78, 72])
const report = ref('')
const highlights = ref<{ label: string; value: string }[]>([])

const radarOption = computed(() => ({
  tooltip: {},
  legend: { data: ['当前能力', '双高目标'] },
  radar: {
    indicator: [
      { name: '教学能力', max: 100 },
      { name: '科研创新', max: 100 },
      { name: '社会服务', max: 100 },
      { name: '师德师风', max: 100 },
      { name: '国际视野', max: 100 },
      { name: '数字化素养', max: 100 },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [
        { name: '当前能力', value: scores.value, areaStyle: { opacity: 0.15 } },
        { name: '双高目标', value: [90, 88, 85, 95, 80, 86], lineStyle: { type: 'dashed' } },
      ],
    },
  ],
}))

function buildReport() {
  const teacher = teachers.value.find((t) => t.id === selectedId.value)
  if (!teacher) return

  const base = Math.round(teacher.growth_score)
  scores.value = [
    Math.min(98, base + 2),
    Math.min(95, base - 8),
    Math.min(92, base - 4),
    Math.min(99, base + 5),
    Math.min(90, base - 12),
    Math.min(93, base - 3),
  ]

  const weakIdx = scores.value.indexOf(Math.min(...scores.value))
  const dims = ['教学能力', '科研创新', '社会服务', '师德师风', '国际视野', '数字化素养']
  report.value = `${teacher.name}（${teacher.title}）当前成长指数为 ${teacher.growth_score}。相较双高目标画像，短板主要集中在「${dims[weakIdx]}」。建议通过专题研修、校企协同项目与成果沉淀补齐差距，并纳入下一周期诊改计划。`
  highlights.value = [
    { label: '优势维度', value: dims[scores.value.indexOf(Math.max(...scores.value))] },
    { label: '优先改进', value: dims[weakIdx] },
    { label: '风险联动', value: teacher.risk_level === 'HIGH' ? '存在高风险事件，需同步整改' : '风险可控，可按常规周期推进' },
  ]
}

onMounted(() => {
  teachers.value = db.query<Teacher>('SELECT * FROM sz_tch_teachers ORDER BY id')
  if (teachers.value[0]) {
    selectedId.value = teachers.value[0].id
    buildReport()
  }
})
</script>
