<template>
  <div class="min-h-screen bg-slate-50 pt-banner">
    <div class="flex min-h-[calc(100vh-var(--banner-height))]">
      <aside
        class="sticky top-banner flex h-[calc(100vh-var(--banner-height))] flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-all duration-200"
        :class="collapsed ? 'w-[4.5rem]' : 'w-64'"
      >
        <div class="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <span v-if="!collapsed" class="truncate text-sm font-semibold tracking-wide">档案袋控制台</span>
          <button class="btn-ghost text-slate-300 hover:bg-white/10 hover:text-white" type="button" @click="collapsed = !collapsed">
            {{ collapsed ? '»' : '«' }}
          </button>
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto p-3">
          <RouterLink
            v-for="item in visibleMenus"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
            :class="isActive(item.to) ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'"
          >
            <span class="w-5 text-center text-base">{{ item.icon }}</span>
            <span v-if="!collapsed">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="sticky top-banner z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
          <div>
            <p class="text-xs text-slate-400">{{ breadcrumb }}</p>
            <h2 class="text-sm font-semibold text-slate-800">{{ pageTitle }}</h2>
          </div>
          <div class="flex items-center gap-4">
            <RouterLink to="/warnings" class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <span>🔔</span>
              <span
                v-if="unreadCount > 0"
                class="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] text-white"
              >
                {{ unreadCount }}
              </span>
            </RouterLink>
            <div class="text-right">
              <p class="text-sm font-medium text-slate-800">{{ auth.user?.full_name }}</p>
              <p class="text-xs text-slate-400">{{ roleLabel }} · {{ auth.user?.dept }}</p>
            </div>
            <button class="btn-ghost" type="button" @click="onLogout">退出</button>
          </div>
        </header>

        <main class="flex-1 p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDbStore } from '@/stores/db'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const db = useDbStore()

const collapsed = ref(false)
const unreadCount = ref(0)

const menus = [
  { to: '/dashboard', label: '工作台', icon: '📊', roles: ['ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER'] },
  { to: '/archives', label: '档案归集', icon: '📁', roles: ['ADMIN', 'HR_MGR', 'TEACHER'] },
  { to: '/monitoring', label: '动态监测', icon: '📈', roles: ['ADMIN', 'HR_MGR', 'DECIDER'] },
  { to: '/warnings', label: '风险预警', icon: '⚠️', roles: ['ADMIN', 'HR_MGR', 'DECIDER', 'TEACHER'] },
  { to: '/evaluation', label: '能力诊改', icon: '🎯', roles: ['ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER'] },
  { to: '/development', label: '发展指引', icon: '🧭', roles: ['ADMIN', 'TEACHER'] },
  { to: '/settings', label: '业务配置', icon: '⚙️', roles: ['ADMIN'] },
]

const roleLabels: Record<string, string> = {
  ADMIN: '系统超管',
  HR_MGR: '人事主管',
  TEACHER: '教师',
  DECIDER: '决策层',
}

const visibleMenus = computed(() =>
  menus.filter((item) => !auth.user?.role || item.roles.includes(auth.user.role)),
)

const pageTitle = computed(() => (route.meta.title as string) || '控制台')
const breadcrumb = computed(() => `首页 / ${pageTitle.value}`)
const roleLabel = computed(() => (auth.user ? roleLabels[auth.user.role] : ''))

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function refreshUnread() {
  if (!db.ready) return
  const rows = db.query<{ c: number }>('SELECT COUNT(*) as c FROM sz_tch_warnings WHERE is_read = 0')
  unreadCount.value = rows[0]?.c ?? 0
}

function onLogout() {
  auth.logout()
  router.push('/login')
}

onMounted(() => {
  refreshUnread()
})
</script>
