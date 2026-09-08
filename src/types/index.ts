export type UserRole = 'ADMIN' | 'HR_MGR' | 'TEACHER' | 'DECIDER'

export interface AuthUser {
  id: number
  username: string
  role: UserRole
  full_name: string
  dept: string | null
  email: string | null
}

export interface Teacher {
  id: number
  emp_id: string
  name: string
  dept: string
  title: string | null
  hire_date: string | null
  status: string
  growth_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  last_updated: string
}

export interface ArchiveDoc {
  id: number
  teacher_id: number
  category: string
  doc_title: string
  doc_type: string | null
  file_url: string | null
  upload_date: string
  verified_by: number | null
  teacher_name?: string
}

export interface WarningItem {
  id: number
  teacher_id: number
  warning_type: string
  severity: 'Info' | 'Warning' | 'Critical'
  message: string
  is_read: number
  created_at: string
  teacher_name?: string
}
