import { PGlite } from '@electric-sql/pglite'

const DATABASE_URL = 'idb://dashboard-whiteboard-db'
const DOCUMENTS_TABLE = 'whiteboard_documents'

let dbPromise = null

function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        const db = new PGlite(DATABASE_URL)
        await db.query(`
          CREATE TABLE IF NOT EXISTS ${DOCUMENTS_TABLE} (
            board_id TEXT PRIMARY KEY,
            document_json TEXT NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `)
        return db
      } catch (error) {
        dbPromise = null
        throw error
      }
    })()
  }

  return dbPromise
}

export function getCurrentBoardId() {
  if (typeof window === 'undefined') {
    return 'default-board'
  }

  const pathname = window.location.pathname || '/'
  const search = window.location.search || ''
  return `${pathname}${search}` || 'default-board'
}

export async function loadBoardDocument(boardId) {
  const db = await getDb()
  const result = await db.query(
    `SELECT document_json FROM ${DOCUMENTS_TABLE} WHERE board_id = $1 LIMIT 1;`,
    [boardId]
  )

  return result.rows[0]?.document_json ?? null
}

export async function saveBoardDocument(boardId, documentJson) {
  const db = await getDb()
  await db.query(
    `
      INSERT INTO ${DOCUMENTS_TABLE} (board_id, document_json, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (board_id)
      DO UPDATE SET
        document_json = EXCLUDED.document_json,
        updated_at = NOW();
    `,
    [boardId, documentJson]
  )
}
