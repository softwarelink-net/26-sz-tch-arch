import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import initSqlJs from 'sql.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const schemaPath = resolve(root, 'src/db/schema.sql')
const outPath = resolve(root, 'public/db.sqlite')

const SQL = await initSqlJs()
const db = new SQL.Database()
const schema = readFileSync(schemaPath, 'utf8')
db.exec(schema)

const data = db.export()
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, Buffer.from(data))
console.log(`Wrote ${outPath} (${data.length} bytes)`)
db.close()
