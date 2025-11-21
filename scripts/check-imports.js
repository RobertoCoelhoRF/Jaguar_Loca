const fs = require('fs')
const path = require('path')

function walk(dir, files=[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, files)
    else if (/\.jsx?$|\.tsx?$|\.css$/.test(e.name)) files.push(p)
  }
  return files
}

function resolveImport(fromFile, importPath) {
  if (!importPath.startsWith('.')) return null
  const base = path.dirname(fromFile)
  const candidate = path.resolve(base, importPath)
  const exts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.json']
  // direct file
  for (const ext of ['', ...exts]) {
    const p = candidate + ext
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
  }
  // index files in folder
  for (const ext of exts) {
    const p = path.join(candidate, 'index' + ext)
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
  }
  return null
}

const root = path.resolve(process.cwd())
const files = walk(root)
const importRegex = /import\s+(?:[^'"]+from\s+)?['"]([^'"]+)['"]/g
let problems = []
for (const f of files) {
  const txt = fs.readFileSync(f,'utf8')
  let m
  while ((m = importRegex.exec(txt)) !== null) {
    const imp = m[1]
    if (imp.startsWith('.')) {
      const resolved = resolveImport(f, imp)
      if (!resolved) problems.push({file: f, import: imp})
    }
  }
}
if (problems.length === 0) {
  console.log('OK - nenhum import relativo faltando encontrado')
  process.exit(0)
}
console.log('Imports relativos não resolvidos:')
for (const p of problems) console.log(p.file, '->', p.import)
process.exit(2)
