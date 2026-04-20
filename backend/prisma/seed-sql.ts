// Seed-Script das die SQL-Datei ausführt
// Usage: npx ts-node prisma/seed-sql.ts

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Lese SQL-Datei...')
  
  const sqlFile = path.join(__dirname, 'seed-tours-only.sql')
  const sql = fs.readFileSync(sqlFile, 'utf-8')
  
  // Splitte in einzelne Statements (basierend auf Semikolon am Zeilenende)
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  console.log(`📊 Führe ${statements.length} SQL-Statements aus...`)
  
  let count = 0
  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement)
      count++
    } catch (e: any) {
      // Ignoriere Duplikat-Fehler (unique constraint)
      if (!e.code?.includes('P2002') && !e.message?.includes('duplicate')) {
        console.log(`⚠️ Fehler bei Statement: ${e.message.substring(0, 100)}`)
      }
    }
  }
  
  console.log(`✅ ${count} Statements erfolgreich ausgeführt!`)
  
  // Zeige Statistik
  const tours = await prisma.tour.count()
  const blogs = await prisma.blogPost.count()
  const faqs = await prisma.fAQ.count()
  
  console.log(`
📈 Statistik:
   - Tours: ${tours}
   - Blog Posts: ${blogs}
   - FAQs: ${faqs}
  `)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })