<template>
  <div class="space-y-6">
    <div class="card-panel flex flex-wrap items-end gap-4">
      <div class="min-w-[180px] flex-1">
        <label class="mb-1.5 block text-sm text-slate-600">关键词</label>
        <input v-model="keyword" class="input-field" placeholder="文档标题 / 教师姓名" />
      </div>
      <div class="min-w-[160px]">
        <label class="mb-1.5 block text-sm text-slate-600">类别</label>
        <select v-model="category" class="input-field">
          <option value="">全部</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <button class="btn-primary" type="button" @click="load">筛选</button>
    </div>

    <div class="card-panel overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-slate-200 text-slate-500">
          <tr>
            <th class="px-3 py-3 font-medium">文档标题</th>
            <th class="px-3 py-3 font-medium">教师</th>
            <th class="px-3 py-3 font-medium">类别</th>
            <th class="px-3 py-3 font-medium">类型</th>
            <th class="px-3 py-3 font-medium">上传日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="rows.length === 0">
            <td colspan="5" class="px-3 py-10 text-center text-slate-400">暂无档案数据</td>
          </tr>
          <tr v-for="row in rows" :key="row.id" class="border-b border-slate-100 hover:bg-slate-50">
            <td class="px-3 py-3 font-medium text-slate-800">{{ row.doc_title }}</td>
            <td class="px-3 py-3">
              <RouterLink class="text-cyan-700 hover:underline" :to="`/teachers/${row.teacher_id}`">
                {{ row.teacher_name }}
              </RouterLink>
            </td>
            <td class="px-3 py-3">{{ row.category }}</td>
            <td class="px-3 py-3">{{ row.doc_type }}</td>
            <td class="px-3 py-3 text-slate-500">{{ row.upload_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDbStore } from '@/stores/db'
import type { ArchiveDoc } from '@/types'

const db = useDbStore()
const keyword = ref('')
const category = ref('')
const categories = ref<string[]>([])
const rows = ref<(ArchiveDoc & { teacher_name: string })[]>([])

function load() {
  categories.value = db
    .query<{ category: string }>('SELECT DISTINCT category FROM sz_tch_archives ORDER BY category')
    .map((r) => r.category)

  const params: unknown[] = []
  let sql = `SELECT a.*, t.name as teacher_name
    FROM sz_tch_archives a
    LEFT JOIN sz_tch_teachers t ON t.id = a.teacher_id
    WHERE 1=1`

  if (keyword.value.trim()) {
    sql += ' AND (a.doc_title LIKE ? OR t.name LIKE ?)'
    const like = `%${keyword.value.trim()}%`
    params.push(like, like)
  }
  if (category.value) {
    sql += ' AND a.category = ?'
    params.push(category.value)
  }
  sql += ' ORDER BY a.upload_date DESC, a.id DESC'

  rows.value = db.query(sql, params)
}

onMounted(load)
</script>
