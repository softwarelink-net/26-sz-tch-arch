<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div>
      <h2 class="text-xl font-semibold text-slate-900">系统登录</h2>
      <p class="mt-1 text-sm text-slate-500">请使用演示账号进入对应角色视图</p>
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-slate-700" for="username">用户名</label>
      <input id="username" v-model="username" class="input-field" autocomplete="username" required />
    </div>

    <div class="space-y-1.5">
      <label class="text-sm font-medium text-slate-700" for="password">密码</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="input-field"
        autocomplete="current-password"
        required
      />
    </div>

    <p v-if="error" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{{ error }}</p>

    <button class="btn-primary w-full" type="submit" :disabled="submitting">
      {{ submitting ? '登录中…' : '进入系统' }}
    </button>

    <div class="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
      <p class="font-medium text-slate-700">演示账号</p>
      <p>admin / admin123 · hr_manager / hr123</p>
      <p>teacher01 / tch123 · decider / dec123</p>
    </div>

    <RouterLink class="block text-center text-sm text-cyan-700 hover:underline" to="/tender">
      查看采购公告
    </RouterLink>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('admin')
const password = ref('admin123')
const error = ref('')
const submitting = ref(false)

async function onSubmit() {
  submitting.value = true
  error.value = ''
  try {
    const result = await auth.login(username.value, password.value)
    if (!result.ok) {
      error.value = result.message || '登录失败'
      submitting.value = false
      return
    }
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    // 不等待导航完成，避免懒加载/图表包解析时按钮长期卡在「登录中」
    void router.replace(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
    submitting.value = false
  }
}
</script>
