import { copyFileSync, appendFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcJs = join(root, 'node_modules/sql.js/dist/sql-wasm.js')
const srcWasm = join(root, 'node_modules/sql.js/dist/sql-wasm.wasm')
const publicDir = join(root, 'public')

if (!existsSync(srcJs)) {
  console.warn('[copy-sqljs] sql.js not installed, skip')
  process.exit(0)
}

mkdirSync(publicDir, { recursive: true })
copyFileSync(srcJs, join(publicDir, 'sql-wasm.js'))
copyFileSync(srcWasm, join(publicDir, 'sql-wasm.wasm'))
appendFileSync(join(publicDir, 'sql-wasm.js'), '\nwindow.initSqlJs = initSqlJs;\n')
console.log('[copy-sqljs] copied sql-wasm.js + sql-wasm.wasm to public/')
