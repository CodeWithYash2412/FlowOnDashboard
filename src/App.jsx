import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Tldraw, parseTldrawJsonFile, serializeTldrawJson } from 'tldraw'
import 'tldraw/tldraw.css'
import CustomUI from './CustomUI'
import { getCurrentBoardId, loadBoardDocument, saveBoardDocument } from './pgliteBoardStorage'

function App() {
  const boardId = useMemo(() => getCurrentBoardId(), [])
  const [isLoadingBoard, setIsLoadingBoard] = useState(true)
  const initialDocumentRef = useRef(null)

  useEffect(() => {
    let isActive = true

    loadBoardDocument(boardId)
      .then((documentJson) => {
        if (!isActive) return
        initialDocumentRef.current = documentJson
        setIsLoadingBoard(false)
      })
      .catch((error) => {
        console.error('Failed to load board document from PGlite', error)
        if (!isActive) return
        setIsLoadingBoard(false)
      })

    return () => {
      isActive = false
    }
  }, [boardId])

  const handleMount = useCallback(
    (editor) => {
      let isDisposed = false
      let saveTimeoutId = null
      let unlisten = null
      let saveQueue = Promise.resolve()

      const scheduleSave = () => {
        if (saveTimeoutId) {
          window.clearTimeout(saveTimeoutId)
        }

        saveTimeoutId = window.setTimeout(() => {
          saveQueue = saveQueue
            .then(async () => {
              const documentJson = await serializeTldrawJson(editor)
              await saveBoardDocument(boardId, documentJson)
            })
            .catch((error) => {
              console.error('Failed to save board document to PGlite', error)
            })
        }, 700)
      }

      const hydrateAndListen = async () => {
        const initialDocument = initialDocumentRef.current

        if (initialDocument) {
          const parsedDocument = parseTldrawJsonFile({
            schema: editor.store.schema,
            json: initialDocument,
          })

          if (parsedDocument.ok) {
            editor.loadSnapshot(parsedDocument.value.getStoreSnapshot())
            editor.clearHistory()

            const bounds = editor.getCurrentPageBounds()
            if (bounds) {
              editor.zoomToBounds(bounds, { targetZoom: 1, immediate: true })
            }
          } else {
            console.error('Failed to parse saved board document', parsedDocument.error)
          }
        }

        if (isDisposed) return

        unlisten = editor.store.listen(scheduleSave, {
          source: 'user',
          scope: 'document',
        })
      }

      void hydrateAndListen()

      return () => {
        isDisposed = true
        if (saveTimeoutId) {
          window.clearTimeout(saveTimeoutId)
        }
        unlisten?.()
      }
    },
    [boardId]
  )

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {isLoadingBoard ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: '#f8fafc',
            color: '#475569',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          Loading whiteboard…
        </div>
      ) : (
        <Tldraw hideUi onMount={handleMount}>
          <CustomUI />
        </Tldraw>
      )}
    </div>
  )
}

export default App
