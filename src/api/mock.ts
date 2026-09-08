import type { AuthUser, ArchiveDoc, Teacher, WarningItem } from '@/types'
import { useDbStore } from '@/stores/db'

export async function fetchTeachers(): Promise<Teacher[]> {
  const db = useDbStore()
  return db.query<Teacher>('SELECT * FROM sz_tch_teachers ORDER BY id')
}

export async function fetchArchives(): Promise<(ArchiveDoc & { teacher_name: string })[]> {
  const db = useDbStore()
  return db.query(
    `SELECT a.*, t.name as teacher_name
     FROM sz_tch_archives a
     LEFT JOIN sz_tch_teachers t ON t.id = a.teacher_id
     ORDER BY a.upload_date DESC`,
  )
}

export async function fetchWarnings(): Promise<(WarningItem & { teacher_name: string })[]> {
  const db = useDbStore()
  return db.query(
    `SELECT w.*, t.name as teacher_name
     FROM sz_tch_warnings w
     LEFT JOIN sz_tch_teachers t ON t.id = w.teacher_id
     ORDER BY w.created_at DESC`,
  )
}

export async function authenticate(username: string, password: string): Promise<AuthUser | null> {
  const db = useDbStore()
  const rows = db.query<AuthUser & { password_hash: string }>(
    'SELECT id, username, password_hash, role, full_name, dept, email FROM sz_tch_users WHERE username = ?',
    [username],
  )
  const user = rows[0]
  if (!user || user.password_hash !== password) return null
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    full_name: user.full_name,
    dept: user.dept,
    email: user.email,
  }
}
