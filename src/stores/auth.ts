import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthUser } from '@/types'
import { useDbStore } from '@/stores/db'

const TOKEN_PREFIX = 'sz-tch-'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)

    const isAuthenticated = computed(() => Boolean(token.value && user.value))

    function hasRole(roles: string | string[]) {
      if (!user.value) return false
      const list = Array.isArray(roles) ? roles : [roles]
      return list.includes(user.value.role)
    }

    async function login(username: string, password: string): Promise<{ ok: boolean; message?: string }> {
      const db = useDbStore()
      if (!db.ready) {
        await db.init()
      }

      const rows = db.query<AuthUser & { password_hash: string }>(
        `SELECT id, username, password_hash, role, full_name, dept, email
         FROM sz_tch_users
         WHERE username = ?`,
        [username.trim()],
      )

      const found = rows[0]
      if (!found || found.password_hash !== password) {
        return { ok: false, message: '用户名或密码错误' }
      }

      user.value = {
        id: found.id,
        username: found.username,
        role: found.role,
        full_name: found.full_name,
        dept: found.dept,
        email: found.email,
      }
      token.value = `${TOKEN_PREFIX}${found.id}-${Date.now()}`
      return { ok: true }
    }

    function logout() {
      token.value = null
      user.value = null
    }

    return {
      token,
      user,
      isAuthenticated,
      hasRole,
      login,
      logout,
    }
  },
  {
    persist: {
      key: 'sz-tch-auth',
      pick: ['token', 'user'],
    },
  },
)
