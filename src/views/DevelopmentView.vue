<template>
  <div class="space-y-6">
    <div class="card-panel">
      <h3 class="text-base font-semibold text-slate-800">教师发展指引</h3>
      <p class="mt-1 text-sm text-slate-500">根据能力缺口匹配培训课程与成长路径建议</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div v-for="item in recommendations" :key="item.title" class="card-panel">
        <p class="text-xs font-medium uppercase tracking-wide text-cyan-700">{{ item.tag }}</p>
        <h4 class="mt-2 text-lg font-semibold text-slate-900">{{ item.title }}</h4>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ item.desc }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="course in item.courses"
            :key="course"
            class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
          >
            {{ course }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const recommendations = computed(() => [
  {
    tag: '画像缺口',
    title: `${auth.user?.full_name || '教师'} · 数字化教学跃迁`,
    desc: '对照双高数字化素养目标，建议优先补齐智慧课堂设计与过程性评价能力。',
    courses: ['智慧教学设计工作坊', '教学大数据分析入门', '混合式课程认证'],
  },
  {
    tag: '科研路径',
    title: '应用型科研成果沉淀',
    desc: '围绕校企协同课题，形成可归档的阶段性成果包，缩短从项目到档案的闭环。',
    courses: ['纵向课题申报辅导', '成果转化案例营', '科研诚信与合规'],
  },
  {
    tag: '师德发展',
    title: '课堂质量与风险防控',
    desc: '结合预警中心规则，强化教学事故预防与学生反馈闭环处置能力。',
    courses: ['课堂应急处置演练', '学评教改进工作坊'],
  },
  {
    tag: '职业跃迁',
    title: '职称晋升材料准备',
    desc: '按人事处材料清单自动核对缺失项，生成下一年度补档清单。',
    courses: ['职称材料结构化整理', '代表性成果打磨'],
  },
])
</script>
