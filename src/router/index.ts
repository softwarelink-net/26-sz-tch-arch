import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TenderView from '@/views/TenderView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tender',
  },
  {
    path: '/tender',
    name: 'tender',
    component: TenderView,
    meta: { public: true, title: '采购公告' },
  },
  {
    path: '/login',
    component: AuthLayout,
    meta: { public: true },
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
        meta: { public: true, title: '登录' },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true, title: '工作台', roles: ['ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER'] },
      },
      {
        path: 'archives',
        name: 'archives',
        component: () => import('@/views/ArchivesView.vue'),
        meta: { requiresAuth: true, title: '档案归集', roles: ['ADMIN', 'HR_MGR', 'TEACHER'] },
      },
      {
        path: 'teachers/:id',
        name: 'teacher-profile',
        component: () => import('@/views/TeacherProfileView.vue'),
        meta: { requiresAuth: true, title: '教师画像', roles: ['ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER'] },
      },
      {
        path: 'monitoring',
        name: 'monitoring',
        component: () => import('@/views/MonitoringView.vue'),
        meta: { requiresAuth: true, title: '师资动态监测', roles: ['ADMIN', 'HR_MGR', 'DECIDER'] },
      },
      {
        path: 'warnings',
        name: 'warnings',
        component: () => import('@/views/WarningsView.vue'),
        meta: { requiresAuth: true, title: '风险智能预警', roles: ['ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER'] },
      },
      {
        path: 'evaluation',
        name: 'evaluation',
        component: () => import('@/views/EvaluationView.vue'),
        meta: { requiresAuth: true, title: '能力评价诊改', roles: ['ADMIN', 'HR_MGR', 'TEACHER', 'DECIDER'] },
      },
      {
        path: 'development',
        name: 'development',
        component: () => import('@/views/DevelopmentView.vue'),
        meta: { requiresAuth: true, title: '教师发展指引', roles: ['ADMIN', 'TEACHER'] },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { requiresAuth: true, title: '业务灵活配置', roles: ['ADMIN'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/tender',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.path === '/login' && auth.isAuthenticated) {
    return '/dashboard'
  }

  if (to.meta.public) {
    return true
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const roles = to.meta.roles as string[] | undefined
  if (roles && auth.user && !roles.includes(auth.user.role)) {
    return '/dashboard'
  }

  return true
})

export default router
