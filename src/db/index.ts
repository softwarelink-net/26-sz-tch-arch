import type { Database, SqlJsStatic } from 'sql.js'

let SQL: SqlJsStatic | null = null
let db: Database | null = null

declare global {
  interface Window {
    initSqlJs?: (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (typeof window.initSqlJs === 'function') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)))
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

async function loadSqlJs(): Promise<SqlJsStatic> {
  if (typeof window.initSqlJs !== 'function') {
    await loadScript('/sql-wasm.js')
  }
  const init = window.initSqlJs
  if (typeof init !== 'function') {
    throw new Error('sql.js failed to initialize')
  }
  return init({
    locateFile: (file) => `/${file}`,
  })
}

export async function initDatabase(): Promise<Database> {
  if (db) return db

  SQL = await loadSqlJs()

  const response = await fetch('/db.sqlite')
  if (!response.ok) {
    throw new Error(`Failed to load db.sqlite: ${response.status}`)
  }

  const buffer = await response.arrayBuffer()
  db = new SQL.Database(new Uint8Array(buffer))
  return db
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return db
}

export function queryAll<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
  const database = getDatabase()
  const stmt = database.prepare(sql)
  stmt.bind(params as never[])
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

export function runSql(sql: string, params: unknown[] = []): void {
  const database = getDatabase()
  database.run(sql, params as never[])
}

export function exportDatabase(): Uint8Array {
  return getDatabase().export()
}
