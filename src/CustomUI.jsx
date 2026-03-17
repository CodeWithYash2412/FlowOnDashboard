import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DefaultColorStyle,
  DefaultFillStyle,
  DefaultFontStyle,
  DefaultSizeStyle,
  DefaultTextAlignStyle,
  DefaultToasts,
  GeoShapeGeoStyle,
  track,
  toRichText,
  useDefaultHelpers,
  useEditor,
  useValue,
} from 'tldraw'
import {
  ArrowLeft,
  Bird,
  Book,
  Box,
  Camera,
  ChevronDown,
  ChevronRight,
  Circle as CircleShape,
  Cloud,
  Crop,
  Eraser,
  FileText,
  GripVertical,
  Hand,
  Heart,
  Hexagon,
  LineChart,
  Minus,
  Monitor,
  MonitorUp,
  Moon,
  MoreHorizontal,
  MousePointer2,
  PenLine,
  Pentagon,
  PlusCircle,
  Redo2,
  RefreshCcw,
  Ruler,
  Search as SearchIcon,
  Shapes,
  Share2,
  Smile,
  Square,
  SquareDashed,
  Star,
  StickyNote,
  Sun,
  Triangle,
  Type,
  Undo2,
  UserRound,
  Users,
  Video as VideoIcon,
  Wand2,
  X,
  ZoomIn,
} from 'lucide-react'
import './CustomUI.css'

const COLOR_OPTIONS = [
  { id: 'black', hex: '#1f2937', label: 'Black' },
  { id: 'grey', hex: '#6b7280', label: 'Grey' },
  { id: 'light-violet', hex: '#c4b5fd', label: 'Light violet' },
  { id: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { id: 'blue', hex: '#3b82f6', label: 'Blue' },
  { id: 'light-blue', hex: '#7dd3fc', label: 'Light blue' },
  { id: 'yellow', hex: '#facc15', label: 'Yellow' },
  { id: 'orange', hex: '#f97316', label: 'Orange' },
  { id: 'green', hex: '#22c55e', label: 'Green' },
  { id: 'light-green', hex: '#86efac', label: 'Light green' },
  { id: 'light-red', hex: '#fca5a5', label: 'Light red' },
  { id: 'red', hex: '#ef4444', label: 'Red' },
]

const TOOL_ITEMS = [
  { id: 'select', name: 'Select', icon: MousePointer2 },
  { id: 'draw', name: 'Draw', icon: PenLine },
  { id: 'eraser', name: 'Eraser', icon: Eraser },
  { id: 'hand', name: 'Hand', icon: Hand },
  { id: 'geo', name: 'Shapes', icon: Shapes },
  { id: 'line', name: 'Line', icon: Minus },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'note', name: 'Note', icon: StickyNote },
  { id: 'frame', name: 'Frame', icon: SquareDashed },
  { id: 'arrow', name: 'Arrow', icon: Wand2 },
]

const GEO_OPTIONS = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'ellipse', label: 'Ellipse', icon: CircleShape },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
  { id: 'diamond', label: 'Diamond', icon: DiamondIcon },
  { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
  { id: 'pentagon', label: 'Pentagon', icon: Pentagon },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'cloud', label: 'Cloud', icon: Cloud },
  { id: 'heart', label: 'Heart', icon: Heart },
]

const FILL_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'semi', label: 'Semi' },
  { id: 'solid', label: 'Solid' },
]

const SIZE_OPTIONS = [
  { id: 's', label: '1', textLabel: '16 px' },
  { id: 'm', label: '2', textLabel: '20 px' },
  { id: 'l', label: '3', textLabel: '28 px' },
  { id: 'xl', label: '4', textLabel: '36 px' },
]

const DEFAULT_BOARD_NAME = 'Whiteboard'
const BOARD_NAME_STORAGE_KEY = 'custom-whiteboard-name'

const FONT_OPTIONS = [
  { id: 'draw', label: 'Draw' },
  { id: 'sans', label: 'Sans' },
  { id: 'serif', label: 'Serif' },
  { id: 'mono', label: 'Mono' },
]

const TEXT_ALIGN_OPTIONS = [
  { id: 'start', label: 'Left' },
  { id: 'middle', label: 'Center' },
  { id: 'end', label: 'Right' },
]

const CLIPART_CATEGORIES = [
  { id: 'learning', label: 'Learning', icon: Book },
  { id: 'people', label: 'People', icon: UserRound },
  { id: 'objects', label: 'Objects', icon: Box },
  { id: 'measure', label: 'Measure', icon: Ruler },
  { id: 'charts', label: 'Charts', icon: LineChart },
  { id: 'emotion', label: 'Emotion', icon: Smile },
  { id: 'nature', label: 'Nature', icon: Bird },
]

const CLIPART_ITEMS = [
  { id: 'idea', label: 'Idea', emoji: '💡', category: 'learning' },
  { id: 'books', label: 'Books', emoji: '📚', category: 'learning' },
  { id: 'pencil', label: 'Pencil', emoji: '✏️', category: 'learning' },
  { id: 'teacher', label: 'Teacher', emoji: '🧑‍🏫', category: 'people' },
  { id: 'team', label: 'Team', emoji: '🧑‍🤝‍🧑', category: 'people' },
  { id: 'speaker', label: 'Speaker', emoji: '🧑‍💼', category: 'people' },
  { id: 'package', label: 'Package', emoji: '📦', category: 'objects' },
  { id: 'gear', label: 'Gear', emoji: '⚙️', category: 'objects' },
  { id: 'lightning', label: 'Lightning', emoji: '⚡', category: 'objects' },
  { id: 'ruler', label: 'Ruler', emoji: '📏', category: 'measure' },
  { id: 'target', label: 'Target', emoji: '🎯', category: 'measure' },
  { id: 'pin', label: 'Pin', emoji: '📍', category: 'measure' },
  { id: 'growth', label: 'Growth', emoji: '📈', category: 'charts' },
  { id: 'decrease', label: 'Decrease', emoji: '📉', category: 'charts' },
  { id: 'bars', label: 'Bars', emoji: '📊', category: 'charts' },
  { id: 'smile', label: 'Smile', emoji: '😊', category: 'emotion' },
  { id: 'celebrate', label: 'Celebrate', emoji: '🎉', category: 'emotion' },
  { id: 'sparkles', label: 'Sparkles', emoji: '✨', category: 'emotion' },
  { id: 'leaf', label: 'Leaf', emoji: '🍃', category: 'nature' },
  { id: 'tree', label: 'Tree', emoji: '🌳', category: 'nature' },
  { id: 'bird', label: 'Bird', emoji: '🐦', category: 'nature' },
]

const FILE_ACCEPT = 'image/*,video/*,.svg'

const CustomUI = track(function CustomUI() {
  const editor = useEditor()
  const helpers = useDefaultHelpers()

  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false)
  const [isClipartMenuOpen, setIsClipartMenuOpen] = useState(false)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [clipartQuery, setClipartQuery] = useState('')
  const [clipartCategory, setClipartCategory] = useState(CLIPART_CATEGORIES[0].id)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isVideoRecorderOpen, setIsVideoRecorderOpen] = useState(false)
  const [screenshotStream, setScreenshotStream] = useState(null)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 20, y: 150 })
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false)
  const [boardName, setBoardName] = useState(() => loadBoardName())

  const headerRef = useRef(null)
  const mediaRef = useRef(null)
  const toolbarRef = useRef(null)
  const dragStateRef = useRef({ offsetX: 0, offsetY: 0 })
  const fileInputRef = useRef(null)

  const currentTool = useValue('currentTool', () => editor.getCurrentToolId(), [editor])
  const canUndo = useValue('canUndo', () => editor.getCanUndo(), [editor])
  const canRedo = useValue('canRedo', () => editor.getCanRedo(), [editor])
  const uiState = useValue(
    'customUiState',
    () => ({
      isToolLocked: editor.getInstanceState().isToolLocked,
      isGridMode: editor.getInstanceState().isGridMode,
      isSnapMode: editor.user.getIsSnapMode(),
      isDarkMode: editor.user.getIsDarkMode(),
    }),
    [editor]
  )
  const sharedStyles = useValue(
    'sharedStyles',
    () => {
      const styles = editor.getSharedStyles()
      return {
        color: styles.getAsKnownValue(DefaultColorStyle) ?? 'black',
        fill: styles.getAsKnownValue(DefaultFillStyle) ?? 'none',
        size: styles.getAsKnownValue(DefaultSizeStyle) ?? 'm',
        font: styles.getAsKnownValue(DefaultFontStyle) ?? 'sans',
        textAlign: styles.getAsKnownValue(DefaultTextAlignStyle) ?? 'start',
        geo: styles.getAsKnownValue(GeoShapeGeoStyle) ?? 'rectangle',
      }
    },
    [editor]
  )

  const filteredClipart = useMemo(() => {
    const query = clipartQuery.trim().toLowerCase()
    return CLIPART_ITEMS.filter((item) => {
      const matchesCategory = item.category === clipartCategory
      const matchesQuery =
        query.length === 0 ||
        item.label.toLowerCase().includes(query) ||
        item.emoji.includes(query)
      return matchesCategory && matchesQuery
    })
  }, [clipartCategory, clipartQuery])

  const centerToolbar = useCallback(() => {
    setToolbarPosition(getCenteredToolbarPosition(toolbarRef.current))
  }, [])

  const closeMenus = useCallback(() => {
    setIsMediaMenuOpen(false)
    setIsClipartMenuOpen(false)
    setIsHeaderMenuOpen(false)
  }, [])

  useEffect(() => {
    centerToolbar()
  }, [centerToolbar])

  useEffect(() => {
    const normalizedBoardName = normalizeBoardName(boardName)
    document.title = normalizedBoardName

    try {
      window.localStorage.setItem(BOARD_NAME_STORAGE_KEY, normalizedBoardName)
    } catch {
      // Ignore storage failures and continue using in-memory state.
    }
  }, [boardName])

  useEffect(() => {
    const handleResize = () => {
      setToolbarPosition((position) => clampToolbarPosition(position, toolbarRef.current))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isDraggingToolbar) return

    const handlePointerMove = (event) => {
      setToolbarPosition(
        clampToolbarPosition({
          x: event.clientX - dragStateRef.current.offsetX,
          y: event.clientY - dragStateRef.current.offsetY,
        }, toolbarRef.current)
      )
    }

    const handlePointerUp = () => {
      setIsDraggingToolbar(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDraggingToolbar])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsHeaderMenuOpen(false)
      }

      if (mediaRef.current && !mediaRef.current.contains(event.target)) {
        setIsMediaMenuOpen(false)
        setIsClipartMenuOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenus()
        setIsSettingsOpen(false)
        setIsUrlDialogOpen(false)
        setIsClipartMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMenus])

  const showToast = useCallback(
    (title, description, severity = 'info') => {
      helpers.addToast({ title, description, severity })
    },
    [helpers]
  )

  const applyStyle = useCallback(
    (style, value) => {
      editor.run(() => {
        editor.setStyleForSelectedShapes(style, value)
        editor.setStyleForNextShapes(style, value)
      })
    },
    [editor]
  )

  const insertFiles = useCallback(
    (files) => {
      if (!files.length) return

      editor.putExternalContent({
        type: 'files',
        files,
        point: editor.getViewportPageBounds().center,
        ignoreParent: false,
      })
    },
    [editor]
  )

  const openFilePicker = useCallback(() => {
    closeMenus()
    fileInputRef.current?.click()
  }, [closeMenus])

  const handleFileInputChange = useCallback(
    (event) => {
      const files = event.target.files ? Array.from(event.target.files) : []
      insertFiles(files)
      event.target.value = ''
    },
    [insertFiles]
  )

  const handleToolbarPointerDown = useCallback(
    (event) => {
      event.preventDefault()
      setIsDraggingToolbar(true)
      dragStateRef.current = {
        offsetX: event.clientX - toolbarPosition.x,
        offsetY: event.clientY - toolbarPosition.y,
      }
    },
    [toolbarPosition.x, toolbarPosition.y]
  )

  const handleSelectTool = useCallback(
    (toolId) => {
      closeMenus()

      if (toolId === 'geo') {
        editor.setStyleForNextShapes(GeoShapeGeoStyle, sharedStyles.geo)
      }

      editor.setCurrentTool(toolId)
    },
    [closeMenus, editor, sharedStyles.geo]
  )

  const handleSelectGeo = useCallback(
    (geoId) => {
      applyStyle(GeoShapeGeoStyle, geoId)
      editor.setCurrentTool('geo')
    },
    [applyStyle, editor]
  )

  const handleInsertClipart = useCallback(
    (item) => {
      const center = editor.getViewportPageBounds().center
      editor.createShape({
        type: 'text',
        x: center.x - 36,
        y: center.y - 36,
        props: {
          ...editor.getShapeUtil('text').getDefaultProps(),
          color: sharedStyles.color,
          font: 'sans',
          richText: toRichText(item.emoji),
          size: 'xl',
          textAlign: 'middle',
        },
      })

      editor.setCurrentTool('select')
      setIsClipartMenuOpen(false)
      setIsMediaMenuOpen(false)
    },
    [editor, sharedStyles.color]
  )

  const handleCreatePlaceholder = useCallback(() => {
    const center = editor.getViewportPageBounds().center

    editor.createShape({
      type: 'geo',
      x: center.x - 120,
      y: center.y - 70,
      props: {
        ...editor.getShapeUtil('geo').getDefaultProps(),
        geo: 'rectangle',
        w: 240,
        h: 140,
        color: 'grey',
        dash: 'dashed',
        fill: 'none',
        size: 'm',
        richText: toRichText('Placeholder'),
      },
    })

    editor.setCurrentTool('select')
    setIsMediaMenuOpen(false)
  }, [editor])

  const handleOpenCamera = useCallback(() => {
    closeMenus()
    setIsCameraOpen(true)
  }, [closeMenus])

  const handleOpenVideoRecorder = useCallback(() => {
    closeMenus()
    setIsVideoRecorderOpen(true)
  }, [closeMenus])

  const handleOpenScreenshot = useCallback(async () => {
    closeMenus()

    if (!navigator.mediaDevices?.getDisplayMedia) {
      showToast('Screen capture is unavailable', 'Your browser does not support screenshots.', 'error')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          frameRate: { ideal: 1, max: 4 },
        },
        audio: false,
      })
      setScreenshotStream(stream)
    } catch (error) {
      if (error?.name !== 'NotAllowedError' && error?.name !== 'AbortError') {
        showToast('Screenshot failed', 'The screen capture could not be started.', 'error')
      }
    }
  }, [closeMenus, showToast])

  const handleOpenUrlDialog = useCallback(() => {
    setUrlValue('')
    setIsUrlDialogOpen(true)
    setIsMediaMenuOpen(false)
    setIsClipartMenuOpen(false)
  }, [])

  const handleInsertUrl = useCallback(
    (event) => {
      event.preventDefault()
      const normalizedUrl = urlValue.trim()

      if (!isValidHttpUrl(normalizedUrl)) {
        showToast('Enter a valid URL', 'Use a full http or https URL.', 'error')
        return
      }

      editor.putExternalContent({
        type: 'url',
        url: normalizedUrl,
        point: editor.getViewportPageBounds().center,
      })

      setIsUrlDialogOpen(false)
      setUrlValue('')
      showToast('Link inserted', 'The URL was added to the board.', 'success')
    },
    [editor, showToast, urlValue]
  )

  const handleDownload = useCallback(async () => {
    const selectedIds = editor.getSelectedShapeIds()
    const exportIds =
      selectedIds.length > 0
        ? selectedIds
        : editor.getCurrentPageShapes().map((shape) => shape.id)

    if (exportIds.length === 0) {
      showToast('Nothing to export', 'Add some content before downloading the board.', 'info')
      return
    }

    setIsHeaderMenuOpen(false)

    try {
      const { blob } = await editor.toImage(exportIds, {
        format: 'png',
        background: true,
        padding: 24,
        pixelRatio: 2,
        darkMode: editor.user.getIsDarkMode(),
      })

      downloadBlob(
        blob,
        buildExportFileName(
          normalizeBoardName(boardName),
          selectedIds.length > 0 ? 'selection' : 'board'
        )
      )
      showToast('Download started', 'The whiteboard PNG is being saved.', 'success')
    } catch {
      showToast('Download failed', 'The whiteboard could not be exported.', 'error')
    }
  }, [boardName, editor, showToast])

  const handleCopyLink = useCallback(
    async (successTitle) => {
      try {
        await copyTextToClipboard(window.location.href)
        showToast(successTitle, 'The current whiteboard URL is in your clipboard.', 'success')
      } catch {
        showToast('Copy failed', 'The link could not be copied from this browser.', 'error')
      }
    },
    [showToast]
  )

  const handleInvite = useCallback(async () => {
    await handleCopyLink('Invite link copied')
  }, [handleCopyLink])

  const handleShare = useCallback(async () => {
    closeMenus()

    if (navigator.share) {
      try {
        await navigator.share({
          title: normalizeBoardName(boardName),
          text: 'Open this whiteboard',
          url: window.location.href,
        })
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }

    await handleCopyLink('Share link copied')
  }, [boardName, closeMenus, handleCopyLink])

  const handleBackClick = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    showToast('No previous page', 'There is no browser history entry to go back to.', 'info')
  }, [showToast])

  const toggleToolLock = useCallback(() => {
    editor.updateInstanceState({ isToolLocked: !uiState.isToolLocked })
  }, [editor, uiState.isToolLocked])

  const activeBorderSize = SIZE_OPTIONS.find((option) => option.id === sharedStyles.size) ?? SIZE_OPTIONS[1]

  return (
    <div className="custom-tldraw-ui">
      <input
        ref={fileInputRef}
        className="hidden-file-input"
        type="file"
        accept={FILE_ACCEPT}
        multiple
        onChange={handleFileInputChange}
      />

      <DefaultToasts />

      {screenshotStream && (
        <ScreenshotModal
          stream={screenshotStream}
          onCancel={() => setScreenshotStream(null)}
          onDone={(file) => {
            setScreenshotStream(null)
            insertFiles([file])
          }}
        />
      )}

      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onError={(message) => showToast('Camera unavailable', message, 'error')}
          onPhotoTaken={(file) => {
            setIsCameraOpen(false)
            insertFiles([file])
          }}
        />
      )}

      {isVideoRecorderOpen && (
        <VideoRecorderModal
          onClose={() => setIsVideoRecorderOpen(false)}
          onError={(message) => showToast('Video recording unavailable', message, 'error')}
          onVideoRecorded={(file) => {
            setIsVideoRecorderOpen(false)
            insertFiles([file])
          }}
        />
      )}

      {isUrlDialogOpen && (
        <ModalShell
          title="Insert Link or Embed"
          onClose={() => setIsUrlDialogOpen(false)}
          footer={
            <>
              <button className="modal-secondary" onClick={() => setIsUrlDialogOpen(false)}>
                Cancel
              </button>
              <button className="modal-primary" type="submit" form="url-insert-form">
                Insert
              </button>
            </>
          }
        >
          <form id="url-insert-form" className="modal-form" onSubmit={handleInsertUrl}>
            <label className="modal-field">
              <span>URL</span>
              <input
                autoFocus
                className="modal-input"
                placeholder="https://example.com"
                value={urlValue}
                onChange={(event) => setUrlValue(event.target.value)}
              />
            </label>
            <p className="modal-note">
              Paste an image URL, a video URL, or any supported embed URL to place it on the board.
            </p>
          </form>
        </ModalShell>
      )}

      {isSettingsOpen && (
        <ModalShell
          title="Board Settings"
          onClose={() => setIsSettingsOpen(false)}
          footer={
            <>
              <button className="modal-secondary" onClick={centerToolbar}>
                Center Toolbar
              </button>
              <button
                className="modal-primary"
                onClick={() => {
                  editor.zoomToFit()
                  centerToolbar()
                }}
              >
                Reset View
              </button>
            </>
          }
        >
          <div className="settings-list">
            <label className="modal-field">
              <span>Canvas Name</span>
              <input
                autoFocus
                className="modal-input"
                value={boardName}
                maxLength={80}
                placeholder={DEFAULT_BOARD_NAME}
                onChange={(event) => setBoardName(event.target.value)}
              />
            </label>
            <SettingsRow
              label="Grid"
              description="Snap newly placed content to the document grid."
              checked={uiState.isGridMode}
              onChange={() => editor.updateInstanceState({ isGridMode: !uiState.isGridMode })}
            />
            <SettingsRow
              label="Snap"
              description="Use snap guides while moving and resizing."
              checked={uiState.isSnapMode}
              onChange={() =>
                editor.user.updateUserPreferences({ isSnapMode: !uiState.isSnapMode })
              }
            />
            <SettingsRow
              label="Dark Theme"
              description="Switch the Tldraw color theme for the canvas."
              checked={uiState.isDarkMode}
              icon={uiState.isDarkMode ? Moon : Sun}
              onChange={() =>
                editor.user.updateUserPreferences({
                  colorScheme: uiState.isDarkMode ? 'light' : 'dark',
                })
              }
            />
            <SettingsRow
              label="Tool Lock"
              description="Keep shape and text tools active after each insert."
              checked={uiState.isToolLocked}
              onChange={toggleToolLock}
            />
          </div>
        </ModalShell>
      )}

      <div className="header-stack" ref={headerRef}>
        <div className="top-header">
          <div className="header-cluster">
            <button className="icon-btn" onClick={handleBackClick} data-tip="Back">
              <ArrowLeft size={16} />
            </button>
            <button className="title-btn" onClick={() => setIsHeaderMenuOpen((open) => !open)}>
              <span className="title">{normalizeBoardName(boardName)}</span>
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="header-cluster">
            <button className="invite-btn" onClick={handleInvite}>
              <Users size={16} />
              <span>Invite</span>
            </button>
            <button className="icon-btn" onClick={handleShare} data-tip="Share">
              <Share2 size={18} />
            </button>
            <button
              className="icon-btn"
              onClick={() => setIsHeaderMenuOpen((open) => !open)}
              data-tip="Board menu"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {isHeaderMenuOpen && (
          <div className="header-menu surface-panel">
            <button className="header-menu-item" onClick={handleDownload}>
              Download PNG
            </button>
            <button
              className="header-menu-item"
              onClick={() => {
                editor.selectAll()
                setIsHeaderMenuOpen(false)
              }}
            >
              Select All
            </button>
            <button
              className="header-menu-item"
              onClick={() => {
                setIsSettingsOpen(true)
                setIsHeaderMenuOpen(false)
              }}
            >
              Settings
            </button>
          </div>
        )}
      </div>

      <div
        ref={toolbarRef}
        className="left-toolbar-draggable"
        style={{ left: toolbarPosition.x, top: toolbarPosition.y }}
      >
        <div className="main-tools pill-container">
          <button
            className="tool-btn drag-btn"
            style={{ cursor: isDraggingToolbar ? 'grabbing' : 'grab' }}
            onPointerDown={handleToolbarPointerDown}
            data-tip="Move toolbar"
          >
            <GripVertical size={16} />
          </button>

          <div className="media-menu-container" ref={mediaRef}>
            <button
              className={`tool-btn ${isMediaMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMediaMenuOpen((open) => !open)}
              data-tip="Add media"
            >
              <PlusCircle size={18} />
            </button>

            {isMediaMenuOpen && (
              <div className="media-menu-popup surface-panel">
                <div className="media-menu-header">Add media</div>
                <div className="media-menu-items">
                  <button className="media-item" onClick={handleOpenCamera}>
                    <Camera size={16} />
                    <span>New photo</span>
                  </button>
                  <button className="media-item" onClick={handleOpenVideoRecorder}>
                    <VideoIcon size={16} />
                    <span>New video</span>
                  </button>
                  <button className="media-item" onClick={handleOpenScreenshot}>
                    <MonitorUp size={16} />
                    <span>Screenshot</span>
                  </button>
                  <button className="media-item" onClick={openFilePicker}>
                    <FileText size={16} />
                    <span>File</span>
                  </button>
                  <button
                    className="media-item"
                    onClick={() => {
                      setIsMediaMenuOpen(false)
                      editor.setCurrentTool('note')
                    }}
                  >
                    <StickyNote size={16} />
                    <span>Sticky note</span>
                  </button>
                  <button
                    className="media-item"
                    onClick={(event) => {
                      event.stopPropagation()
                      setIsClipartMenuOpen(true)
                    }}
                  >
                    <Bird size={16} />
                    <span>Clipart</span>
                    <ChevronRight size={16} className="media-item-chevron" />
                  </button>
                  <button className="media-item" onClick={handleOpenUrlDialog}>
                    <SearchIcon size={16} />
                    <span>Link or embed</span>
                  </button>
                  <button className="media-item" onClick={handleCreatePlaceholder}>
                    <SquareDashed size={16} />
                    <span>Placeholder</span>
                  </button>
                </div>
              </div>
            )}

            {isMediaMenuOpen && isClipartMenuOpen && (
              <div className="clipart-menu-popup surface-panel">
                <div className="clipart-header">
                  <button className="back-btn" onClick={() => setIsClipartMenuOpen(false)}>
                    <ArrowLeft size={16} />
                  </button>
                  <span className="clipart-title">Clipart</span>
                </div>

                <div className="clipart-search-container">
                  <div className="clipart-search-inner">
                    <input
                      className="clipart-search-input"
                      placeholder="Search clipart"
                      value={clipartQuery}
                      onChange={(event) => setClipartQuery(event.target.value)}
                    />
                    <SearchIcon className="clipart-search-icon" size={16} />
                  </div>
                </div>

                <div className="clipart-categories">
                  {CLIPART_CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        className={`clipart-category ${
                          clipartCategory === category.id ? 'active' : ''
                        }`}
                        onClick={() => setClipartCategory(category.id)}
                        title={category.label}
                      >
                        <Icon size={18} />
                      </button>
                    )
                  })}
                </div>

                <div className="clipart-content">
                  <div className="clipart-section-title">
                    {CLIPART_CATEGORIES.find((category) => category.id === clipartCategory)?.label}
                  </div>

                  {filteredClipart.length > 0 ? (
                    <div className="clipart-grid">
                      {filteredClipart.map((item) => (
                        <button
                          key={item.id}
                          className="clipart-grid-item"
                          onClick={() => handleInsertClipart(item)}
                          title={item.label}
                        >
                          <span className="clipart-emoji">{item.emoji}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="clipart-empty">
                      <Bird size={42} />
                      <span>No clipart matches this search.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {TOOL_ITEMS.map((tool) => {
            const Icon = tool.icon
            const isActive = tool.id === 'geo' ? currentTool === 'geo' : currentTool === tool.id

            return (
              <button
                key={tool.id}
                className={`tool-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectTool(tool.id)}
                data-tip={tool.name}
              >
                <Icon size={18} />
              </button>
            )
          })}
        </div>

        {currentTool === 'geo' && (
          <div className="shapes-panel-popup surface-panel">
            <PanelSection title="Shape">
              <div className="shapes-grid">
                {GEO_OPTIONS.map((shape) => {
                  const Icon = shape.icon
                  return (
                    <button
                      key={shape.id}
                      className={`shape-select-btn ${
                        sharedStyles.geo === shape.id ? 'active' : ''
                      }`}
                      onClick={() => handleSelectGeo(shape.id)}
                      title={shape.label}
                    >
                      <Icon size={18} />
                    </button>
                  )
                })}
              </div>
            </PanelSection>

            <PanelSection title={`Border Width ${activeBorderSize.label}`}>
              <div className="segmented-row">
                {SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={`segment-btn ${sharedStyles.size === option.id ? 'active' : ''}`}
                    onClick={() => applyStyle(DefaultSizeStyle, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Fill">
              <div className="segmented-row">
                {FILL_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={`segment-btn ${sharedStyles.fill === option.id ? 'active' : ''}`}
                    onClick={() => applyStyle(DefaultFillStyle, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Color">
              <ColorPicker
                activeColor={sharedStyles.color}
                onSelect={(color) => applyStyle(DefaultColorStyle, color)}
              />
            </PanelSection>

            <ToggleCard
              label="Keep adding shapes"
              description="Leave the shape tool active after each insert."
              checked={uiState.isToolLocked}
              onChange={toggleToolLock}
            />
          </div>
        )}

        {currentTool === 'text' && (
          <div className="shapes-panel-popup surface-panel">
            <PanelSection
              title={`Font Size ${
                SIZE_OPTIONS.find((option) => option.id === sharedStyles.size)?.textLabel
              }`}
            >
              <div className="segmented-row">
                {SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={`segment-btn ${sharedStyles.size === option.id ? 'active' : ''}`}
                    onClick={() => applyStyle(DefaultSizeStyle, option.id)}
                  >
                    {option.textLabel}
                  </button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Font">
              <div className="segmented-row font-row">
                {FONT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={`segment-btn ${sharedStyles.font === option.id ? 'active' : ''}`}
                    onClick={() => applyStyle(DefaultFontStyle, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Alignment">
              <div className="segmented-row">
                {TEXT_ALIGN_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    className={`segment-btn ${
                      sharedStyles.textAlign === option.id ? 'active' : ''
                    }`}
                    onClick={() => applyStyle(DefaultTextAlignStyle, option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Color">
              <ColorPicker
                activeColor={sharedStyles.color}
                onSelect={(color) => applyStyle(DefaultColorStyle, color)}
              />
            </PanelSection>

            <ToggleCard
              label="Keep adding text"
              description="Leave the text tool active after each insert."
              checked={uiState.isToolLocked}
              onChange={toggleToolLock}
            />
          </div>
        )}
      </div>

      <div className="bottom-controls-container">
        <div className="control-pill">
          <button
            className="control-btn"
            onClick={() => editor.undo()}
            data-tip="Undo"
            aria-label="Undo"
            disabled={!canUndo}
          >
            <Undo2 size={18} />
          </button>
          <div className="pill-divider" />
          <button
            className="control-btn"
            onClick={() => editor.redo()}
            data-tip="Redo"
            aria-label="Redo"
            disabled={!canRedo}
          >
            <Redo2 size={18} />
          </button>
        </div>

        <div className="control-pill">
          <button
            className="control-btn single-btn"
            onClick={() => editor.zoomToFit()}
            data-tip="Fit to screen"
            aria-label="Fit to screen"
          >
            <Monitor size={18} />
          </button>
        </div>

        <div className="control-pill">
          <button
            className="control-btn"
            onClick={() => editor.zoomOut()}
            data-tip="Zoom out"
            aria-label="Zoom out"
          >
            <Minus size={18} />
          </button>
          <div className="pill-divider" />
          <button
            className="control-btn"
            onClick={() => editor.zoomIn()}
            data-tip="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
    </div>
  )
})

function PanelSection({ title, children }) {
  return (
    <div className="panel-section">
      <div className="panel-section-title">{title}</div>
      {children}
    </div>
  )
}

function ToggleCard({ label, description, checked, onChange }) {
  return (
    <button className="toggle-card" onClick={onChange}>
      <div className="toggle-card-copy">
        <span className="toggle-card-label">{label}</span>
        <span className="toggle-card-description">{description}</span>
      </div>
      <span className={`toggle-pill ${checked ? 'active' : ''}`} aria-hidden="true">
        <span className="toggle-knob" />
      </span>
    </button>
  )
}

function ColorPicker({ activeColor, onSelect }) {
  return (
    <div className="color-grid">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color.id}
          className={`color-ring-btn ${activeColor === color.id ? 'active' : ''}`}
          onClick={() => onSelect(color.id)}
          title={color.label}
        >
          <div className="color-ring-inner" style={{ borderColor: color.hex }}>
            <div className="color-ring-fill" style={{ backgroundColor: color.hex }} />
          </div>
        </button>
      ))}
    </div>
  )
}

function SettingsRow({ label, description, checked, onChange, icon: Icon }) {
  return (
    <button className="settings-row" onClick={onChange}>
      <div className="settings-row-copy">
        <div className="settings-row-title">
          {Icon ? <Icon size={16} /> : null}
          <span>{label}</span>
        </div>
        <span className="settings-row-description">{description}</span>
      </div>
      <span className={`toggle-pill ${checked ? 'active' : ''}`} aria-hidden="true">
        <span className="toggle-knob" />
      </span>
    </button>
  )
}

function ModalShell({ title, onClose, children, footer }) {
  return (
    <div className="app-modal-overlay" onMouseDown={onClose}>
      <div
        className="app-modal"
        onMouseDown={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="app-modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="app-modal-body">{children}</div>
        {footer ? <div className="app-modal-footer">{footer}</div> : null}
      </div>
    </div>
  )
}

function CameraModal({ onPhotoTaken, onClose, onError }) {
  const videoRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let activeStream = null

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMessage('Camera access is not supported in this browser.')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        activeStream = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch {
        setErrorMessage('Allow camera access to take a photo.')
      }
    }

    startCamera()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (errorMessage) onError(errorMessage)
  }, [errorMessage, onError])

  const capture = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      setErrorMessage('The camera stream is not ready yet.')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    if (!context) {
      setErrorMessage('Could not capture the current camera frame.')
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) {
        setErrorMessage('The photo could not be generated.')
        return
      }

      onPhotoTaken(new File([blob], 'photo.png', { type: 'image/png' }))
    }, 'image/png')
  }

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal-content">
        <div className="camera-modal-header">
          <h3>Take a Photo</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="camera-video-container">
          {errorMessage ? (
            <div className="media-error-state">
              <Camera size={28} />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <video ref={videoRef} playsInline autoPlay disablePictureInPicture />
          )}
        </div>
        <div className="camera-modal-footer">
          <button className="capture-btn" onClick={capture} disabled={Boolean(errorMessage)}>
            <div className="capture-btn-inner" />
          </button>
        </div>
      </div>
    </div>
  )
}

function VideoRecorderModal({ onClose, onError, onVideoRecorded }) {
  const videoRef = useRef(null)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const previewUrlRef = useRef('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const stopLivePreview = useCallback(() => {
    if (!videoRef.current?.srcObject) return

    const stream = videoRef.current.srcObject
    stream.getTracks().forEach((track) => track.stop())
    videoRef.current.srcObject = null
  }, [])

  const startPreview = useCallback(async () => {
    stopLivePreview()
    setErrorMessage('')
    setPreviewUrl('')

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErrorMessage('Video recording is not supported in this browser.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        await videoRef.current.play()
      }
    } catch {
      setErrorMessage('Allow camera and microphone access to record a video.')
    }
  }, [stopLivePreview])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void startPreview()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
      stopLivePreview()
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [startPreview, stopLivePreview])

  useEffect(() => {
    if (errorMessage) onError(errorMessage)
  }, [errorMessage, onError])

  const startRecording = () => {
    const stream = videoRef.current?.srcObject
    if (!stream) {
      setErrorMessage('The recorder is not ready yet.')
      return
    }

    chunksRef.current = []

    try {
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        })
        const nextPreviewUrl = URL.createObjectURL(blob)
        previewUrlRef.current = nextPreviewUrl
        setPreviewUrl(nextPreviewUrl)
        setIsRecording(false)
        stopLivePreview()
      }

      recorder.start()
      setIsRecording(true)
    } catch {
      setErrorMessage('The browser could not start recording.')
    }
  }

  const stopRecording = () => {
    if (!recorderRef.current) return
    recorderRef.current.stop()
  }

  const handleUseVideo = async () => {
    if (!previewUrl) return

    const response = await fetch(previewUrl)
    const blob = await response.blob()
    onVideoRecorded(new File([blob], 'recording.webm', { type: blob.type || 'video/webm' }))
  }

  const handleRetake = async () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }

    await startPreview()
  }

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal-content video-modal-content">
        <div className="camera-modal-header">
          <h3>Record a Video</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="camera-video-container">
          {errorMessage ? (
            <div className="media-error-state">
              <VideoIcon size={28} />
              <span>{errorMessage}</span>
            </div>
          ) : previewUrl ? (
            <video src={previewUrl} controls autoPlay />
          ) : (
            <video ref={videoRef} playsInline autoPlay disablePictureInPicture />
          )}
        </div>
        <div className="camera-modal-footer video-modal-footer">
          {previewUrl ? (
            <>
              <button className="modal-secondary" onClick={handleRetake}>
                Retake
              </button>
              <button className="modal-primary" onClick={handleUseVideo}>
                Use Video
              </button>
            </>
          ) : (
            <button
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={Boolean(errorMessage)}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ScreenshotModal({ stream, onDone, onCancel }) {
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isCropping, setIsCropping] = useState(false)
  const [cropRect, setCropRect] = useState(null)
  const imgRef = useRef(null)
  const historyIndexRef = useRef(-1)
  const currentUrl = historyIndex >= 0 ? history[historyIndex] : null

  useEffect(() => {
    historyIndexRef.current = historyIndex
  }, [historyIndex])

  useEffect(() => {
    if (!stream) return

    let isCancelled = false
    const videoTrack = stream.getVideoTracks()[0]
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.srcObject = stream

    captureDisplayFrame(videoTrack, video)
      .then((dataUrl) => {
        if (isCancelled) return

        setHistory([dataUrl])
        setHistoryIndex(0)
      })
      .catch(() => {
        if (isCancelled) return
        onCancel()
      })
      .finally(() => {
        stream.getTracks().forEach((track) => track.stop())
      })

    return () => {
      isCancelled = true
      video.pause()
      video.srcObject = null
      stream.getTracks().forEach((track) => track.stop())
    }
  }, [onCancel, stream])

  const pushHistory = useCallback((newUrl) => {
    setHistory((previous) => {
      const nextHistory = previous.slice(0, historyIndexRef.current + 1)
      nextHistory.push(newUrl)
      const nextIndex = nextHistory.length - 1
      historyIndexRef.current = nextIndex
      setHistoryIndex(nextIndex)
      return nextHistory
    })
  }, [])

  const handleRotate = () => {
    if (!currentUrl) return

    const image = new Image()
    image.src = currentUrl
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.height
      canvas.height = image.width
      const context = canvas.getContext('2d')
      if (!context) return

      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate((90 * Math.PI) / 180)
      context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height)
      pushHistory(canvas.toDataURL('image/png'))
    }
  }

  const handleCropStart = (event) => {
    if (!isCropping || !imgRef.current) return

    event.preventDefault()
    const rect = imgRef.current.getBoundingClientRect()
    const startX = event.clientX - rect.left
    const startY = event.clientY - rect.top

    setCropRect({ startX, startY, x: startX, y: startY, width: 0, height: 0 })

    const handleMove = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width))
      const currentY = Math.max(0, Math.min(moveEvent.clientY - rect.top, rect.height))

      setCropRect((previous) => ({
        ...previous,
        x: Math.min(previous.startX, currentX),
        y: Math.min(previous.startY, currentY),
        width: Math.abs(currentX - previous.startX),
        height: Math.abs(currentY - previous.startY),
      }))
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)

      setCropRect((previous) => {
        if (previous && previous.width > 5 && previous.height > 5) {
          const image = new Image()
          image.src = currentUrl
          image.onload = () => {
            const scaleX = image.width / rect.width
            const scaleY = image.height / rect.height
            const cropX = previous.x * scaleX
            const cropY = previous.y * scaleY
            const cropWidth = previous.width * scaleX
            const cropHeight = previous.height * scaleY

            const canvas = document.createElement('canvas')
            canvas.width = cropWidth
            canvas.height = cropHeight
            const context = canvas.getContext('2d')
            if (!context) return

            context.drawImage(
              image,
              cropX,
              cropY,
              cropWidth,
              cropHeight,
              0,
              0,
              cropWidth,
              cropHeight
            )

            pushHistory(canvas.toDataURL('image/png'))
          }
        }

        return null
      })

      setIsCropping(false)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const handleDone = () => {
    if (!currentUrl) return

    const image = new Image()
    image.src = currentUrl
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      if (!context) return

      context.drawImage(image, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return
        onDone(new File([blob], 'screenshot.png', { type: 'image/png' }))
      }, 'image/png')
    }
  }

  const handleCancel = () => {
    stream.getTracks().forEach((track) => track.stop())
    onCancel()
  }

  return (
    <div
      className="screenshot-overlay"
      style={{
        opacity: currentUrl ? 1 : 0,
        pointerEvents: currentUrl ? 'auto' : 'none',
      }}
    >
      <div className="screenshot-workspace">
        {currentUrl && (
          <div
            className="screenshot-image-container"
            ref={imgRef}
            onMouseDown={handleCropStart}
            style={{ cursor: isCropping ? 'crosshair' : 'default' }}
          >
            <img src={currentUrl} alt="Screenshot" className="screenshot-image" draggable={false} />
            {isCropping && (
              <div className="crop-overlay-bg">
                {cropRect && (
                  <div
                    className="crop-rect"
                    style={{
                      left: cropRect.x,
                      top: cropRect.y,
                      width: cropRect.width,
                      height: cropRect.height,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {currentUrl && (
          <div className="screenshot-left-toolbar pill-container col-pill">
            <button className="tool-btn" onClick={handleRotate} data-tip="Rotate">
              <RefreshCcw size={18} />
            </button>
            <button
              className={`tool-btn ${isCropping ? 'active' : ''}`}
              onClick={() => setIsCropping((value) => !value)}
              data-tip="Crop"
            >
              <Crop size={18} />
            </button>
            <button
              className="tool-btn"
              onClick={() => historyIndex > 0 && setHistoryIndex(historyIndex - 1)}
              disabled={historyIndex <= 0}
              data-tip="Undo"
            >
              <Undo2 size={18} />
            </button>
            <button
              className="tool-btn"
              onClick={() => historyIndex < history.length - 1 && setHistoryIndex(historyIndex + 1)}
              disabled={historyIndex >= history.length - 1}
              data-tip="Redo"
            >
              <Redo2 size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="screenshot-bottom-bar">
        <button className="screenshot-cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="screenshot-done-btn" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  )
}

function DiamondIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3l8 9-8 9-8-9 8-9z" />
    </svg>
  )
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

async function captureDisplayFrame(track, video) {
  await waitForDisplayTrack(track)

  if (track && 'ImageCapture' in window) {
    const imageCapture = new window.ImageCapture(track)

    for (let attempt = 0; attempt < 8; attempt += 1) {
      try {
        const frame = await imageCapture.grabFrame()
        if (frame.width > 0 && frame.height > 0) {
          return bitmapToDataUrl(frame)
        }
      } catch {
        // Fall back to the hidden video element path below if all attempts fail.
      }

      await delay(120)
    }
  }

  return captureVideoElementFrame(video)
}

async function captureVideoElementFrame(video) {
  mountHiddenVideo(video)

  try {
    await waitForVideoReady(video)

    try {
      await video.play()
    } catch {
      // Muted display streams usually autoplay, but keep retrying even if play throws.
    }

    for (let attempt = 0; attempt < 10; attempt += 1) {
      await waitForVideoFrame(video)

      const dataUrl = drawVideoFrameToDataUrl(video)
      if (dataUrl) {
        return dataUrl
      }

      await delay(120)
    }

    throw new Error('No screenshot frame available')
  } finally {
    video.pause()
    video.srcObject = null
    if (video.parentNode) {
      video.parentNode.removeChild(video)
    }
  }
}

function bitmapToDataUrl(bitmap) {
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Screenshot frame could not be drawn')
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  if (typeof bitmap.close === 'function') {
    bitmap.close()
  }

  return canvas.toDataURL('image/png')
}

function drawVideoFrameToDataUrl(video) {
  if (!video.videoWidth || !video.videoHeight) {
    return null
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Screenshot frame could not be drawn')
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

function waitForVideoFrame(video) {
  if ('requestVideoFrameCallback' in video) {
    return new Promise((resolve) => {
      video.requestVideoFrameCallback(() => resolve())
    })
  }

  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve)
    })
  })
}

function waitForVideoReady(video) {
  if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let settled = false

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleReady)
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('canplay', handleReady)
      video.removeEventListener('resize', handleReady)
      video.removeEventListener('error', handleError)
      window.clearTimeout(timeoutId)
    }

    const finish = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }

    const fail = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('Screen capture failed'))
    }

    const handleReady = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        finish()
      }
    }

    const handleError = () => fail()
    const timeoutId = window.setTimeout(fail, 5000)

    video.addEventListener('loadedmetadata', handleReady)
    video.addEventListener('loadeddata', handleReady)
    video.addEventListener('canplay', handleReady)
    video.addEventListener('resize', handleReady)
    video.addEventListener('error', handleError)

    handleReady()
  })
}

function waitForDisplayTrack(track) {
  if (!track || track.readyState !== 'live' || !track.muted) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    let settled = false

    const cleanup = () => {
      track.removeEventListener('unmute', handleUnmute)
      track.removeEventListener('ended', handleEnded)
      window.clearTimeout(timeoutId)
    }

    const finish = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }

    const fail = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('Display track did not become readable'))
    }

    const handleUnmute = () => finish()
    const handleEnded = () => fail()
    const timeoutId = window.setTimeout(fail, 5000)

    track.addEventListener('unmute', handleUnmute, { once: true })
    track.addEventListener('ended', handleEnded, { once: true })
  })
}

function mountHiddenVideo(video) {
  Object.assign(video.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: '1px',
    height: '1px',
    opacity: '0',
    pointerEvents: 'none',
  })

  document.body.appendChild(video)
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function getToolbarBounds(toolbarElement) {
  return {
    width: toolbarElement?.offsetWidth ?? 88,
    height: toolbarElement?.offsetHeight ?? 760,
  }
}

function getCenteredToolbarPosition(toolbarElement) {
  const bounds = getToolbarBounds(toolbarElement)
  return clampToolbarPosition(
    {
      x: window.innerWidth <= 640 ? 16 : 28,
      y: Math.round((window.innerHeight - bounds.height) / 2),
    },
    toolbarElement
  )
}

function clampToolbarPosition(position, toolbarElement) {
  const bounds = getToolbarBounds(toolbarElement)
  const maxX = Math.max(16, window.innerWidth - bounds.width - 16)
  const minY = 20
  const maxY = Math.max(minY, window.innerHeight - bounds.height - 24)

  return {
    x: Math.min(Math.max(16, position.x), maxX),
    y: Math.min(Math.max(minY, position.y), maxY),
  }
}

function loadBoardName() {
  try {
    return normalizeBoardName(window.localStorage.getItem(BOARD_NAME_STORAGE_KEY))
  } catch {
    return DEFAULT_BOARD_NAME
  }
}

function normalizeBoardName(value) {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : DEFAULT_BOARD_NAME
}

function sanitizeFileName(value) {
  return Array.from(value)
    .map((character) => {
      const code = character.charCodeAt(0)
      if (code <= 31 || '<>:"/\\|?*'.includes(character)) {
        return '-'
      }

      return character
    })
    .join('')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

function buildExportFileName(boardName, scope) {
  const dateStamp = new Date().toISOString().slice(0, 10)
  return `${sanitizeFileName(boardName)}-${scope}-${dateStamp}.png`
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

export default CustomUI
