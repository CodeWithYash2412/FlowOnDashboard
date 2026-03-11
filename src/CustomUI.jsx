import { useState, useRef, useEffect } from 'react'
import { useEditor, track } from 'tldraw'
import {
  MousePointer2,
  PenLine,
  Eraser,
  Hand,
  Shapes,
  Type,
  StickyNote,
  SquareDashed,
  Wand2,
  GripVertical,
  PlusCircle,
  Video,
  Circle,
  MicOff,
  Undo2,
  Redo2,
  Monitor,
  ZoomIn,
  Copy,
  Plus,
  ArrowLeft,
  ChevronDown,
  Users,
  Share2,
  MoreHorizontal,
  Camera,
  Video as VideoIcon,
  MonitorUp,
  Image as ImageIcon,
  FileText,
  Bird,
  Search as SearchIcon,
  Music,
  PiSquare,
  X,
  RotateCw,
  Crop,
  Search,
  Book,
  UserRound,
  Box,
  Ruler,
  LineChart,
  Smile,
  ChevronRight
} from 'lucide-react'
import './CustomUI.css'

const CustomUI = track(function CustomUI() {
  const editor = useEditor()
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false)
  const [isFileSourceMenuOpen, setIsFileSourceMenuOpen] = useState(false)
  const [isClipartMenuOpen, setIsClipartMenuOpen] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [screenshotStream, setScreenshotStream] = useState(null)

  const tools = [
    { id: 'select', name: 'Select', icon: <MousePointer2 size={18} /> },
    { id: 'draw', name: 'Draw', icon: <PenLine size={18} /> },
    { id: 'eraser', name: 'Eraser', icon: <Eraser size={18} /> },
    { id: 'hand', name: 'Hand', icon: <Hand size={18} /> },
    { id: 'geo', name: 'Shapes', icon: <Shapes size={18} /> },
    { id: 'text', name: 'Text', icon: <Type size={18} /> },
    { id: 'note', name: 'Note', icon: <StickyNote size={18} /> },
    { id: 'frame', name: 'Frame', icon: <SquareDashed size={18} /> },
    { id: 'arrow', name: 'Arrow', icon: <Wand2 size={18} /> },
  ]

  return (
    <div className="custom-tldraw-ui">
      {screenshotStream && (
        <ScreenshotModal 
          stream={screenshotStream}
          onCancel={() => setScreenshotStream(null)}
          onDone={(file) => {
            setScreenshotStream(null)
            editor.putExternalContent({
              type: 'files',
              files: [file],
              point: editor.getViewportPageBounds().center,
              ignoreParent: false,
            })
          }}
        />
      )}

      {/* Top Header */}`
      <div className="top-header">
        <div className="header-left">
          <button className="icon-btn"><ArrowLeft size={16} /></button>
          <span className="title">Whiteboard</span>
          <button className="icon-btn"><ChevronDown size={16} /></button>
        </div>
        <div className="header-right">
          <button className="invite-btn">
            <Users size={16} />
            <span>Invite</span>
          </button>
          <button className="icon-btn"><Share2 size={18} /></button>
          <button className="icon-btn"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      {/* Main Left Toolbar */}
      <div className="left-toolbar-wrapper">
        <div className="main-tools pill-container">
          <div className="media-menu-container">
            <button 
              className={`tool-btn ${isMediaMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMediaMenuOpen(!isMediaMenuOpen)}
              data-tip="Add media"
            >
              <PlusCircle size={18} />
            </button>
            
            {isMediaMenuOpen && (
              <div className="media-menu-popup">
                <div className="media-menu-header">Add media</div>
                <div className="media-menu-items">
                  <button className="media-item" onClick={() => { setIsMediaMenuOpen(false); setIsCameraOpen(true); }}><Camera size={16} /> New photo</button>
                  <button className="media-item" onClick={() => setIsMediaMenuOpen(false)}><VideoIcon size={16} /> New video</button>
                  <button className="media-item" onClick={async () => {
                    setIsMediaMenuOpen(false)
                    try {
                      // Prompt for screen selection 
                      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
                      setScreenshotStream(stream)
                    } catch (e) {
                      console.error('Screen sharing canceled', e)
                    }
                  }}><MonitorUp size={16} /> Screenshot</button>
                  
                  {/* Nested File Menu Trigger */}
                  <button className="media-item" onClick={(e) => {
                    e.stopPropagation();
                    setIsFileSourceMenuOpen(true);
                  }}>
                    <FileText size={16} /> File
                  </button>
                  <button className="media-item" onClick={() => { setIsFileSourceMenuOpen(false); setIsMediaMenuOpen(false); editor.setCurrentTool('note'); }}><StickyNote size={16} /> Sticky note</button>
                  <button className="media-item" onClick={(e) => {
                    e.stopPropagation();
                    setIsClipartMenuOpen(true);
                  }}>
                    <Bird size={16} /> Clipart
                  </button>
                  <button className="media-item" onClick={() => setIsMediaMenuOpen(false)}><SearchIcon size={16} /> Web Media Search</button>
                  <button className="media-item" onClick={() => setIsMediaMenuOpen(false)}><Music size={16} /> Audio</button>
                  <button className="media-item" onClick={() => setIsMediaMenuOpen(false)}><PiSquare size={16} /> Equation</button>
                  <button className="media-item" onClick={() => setIsMediaMenuOpen(false)}><SquareDashed size={16} /> Placeholder</button>
                </div>
              </div>
            )}

            {/* NESTED FILE SOURCE MENU */}
            {isMediaMenuOpen && isFileSourceMenuOpen && (
              <div className="file-source-menu-popup">
                <div className="file-source-header">
                  <button className="back-btn" onClick={(e) => { e.stopPropagation(); setIsFileSourceMenuOpen(false); }}>
                    <ArrowLeft size={16} />
                  </button>
                  <span>Choose source</span>
                </div>
                <div className="media-menu-items">
                  
                  {/* This Device Loader */}
                  <label className="media-item" style={{ cursor: 'pointer', margin: 0 }}>
                    <input 
                      type="file" 
                      accept="*/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        setIsFileSourceMenuOpen(false)
                        setIsMediaMenuOpen(false)
                        if (e.target.files && e.target.files.length > 0) {
                          editor.putExternalContent({
                            type: 'files',
                            files: Array.from(e.target.files),
                            point: editor.getViewportPageBounds().center,
                            ignoreParent: false,
                          })
                        }
                        e.target.value = ''
                      }}
                    />
                    <Monitor size={16} /> This device
                  </label>

                  {/* Cloud Providers Stub */}
                  <button className="media-item" onClick={(e) => { e.stopPropagation(); alert("Google Drive integration coming soon!"); setIsMediaMenuOpen(false); setIsFileSourceMenuOpen(false); }}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" width="16" height="16" /> Google Drive
                  </button>
                  <button className="media-item" onClick={(e) => { e.stopPropagation(); alert("OneDrive integration coming soon!"); setIsMediaMenuOpen(false); setIsFileSourceMenuOpen(false); }}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg" alt="OneDrive" width="16" height="16" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230078d4'><path d='M17.1,10.6c-0.2-2.5-2.3-4.5-4.9-4.5c-2.1,0-4,1.3-4.7,3.2C7,9.1,6.5,9,6,9c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4h11c2.8,0,5-2.2,5-5C22,9.3,19.9,7.1,17.1,10.6z'/></svg>"; }} /> OneDrive
                  </button>
                  <button className="media-item" onClick={(e) => { e.stopPropagation(); alert("Dropbox integration coming soon!"); setIsMediaMenuOpen(false); setIsFileSourceMenuOpen(false); }}>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Dropbox_Icon.svg" alt="Dropbox" width="16" height="16" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230061FF'><path d='M12,2.548l7.005,4.492L12,11.533L4.995,7.04L12,2.548z M4.995,16.026L12,11.533l-7.005-4.493L0,11.533L4.995,16.026z M12,11.533l7.005,4.493l7.005-4.493l-7.005-4.493L12,11.533z M4.995,17.519L12,22l7.005-4.481l-7.005-4.492L4.995,17.519z'/></svg>"; }} /> Dropbox
                  </button>
                  
                </div>
              </div>
            )}

            {/* NESTED CLIPART MENU */}
            {isMediaMenuOpen && isClipartMenuOpen && (
              <div className="clipart-menu-popup">
                <div className="clipart-header">
                  <button className="back-btn" onClick={(e) => { e.stopPropagation(); setIsClipartMenuOpen(false); }}>
                    <ArrowLeft size={16} />
                  </button>
                  <span className="clipart-title">Clipart</span>
                </div>
                
                <div className="clipart-search-container">
                  <div className="clipart-search-inner">
                    <input type="text" placeholder="Search" className="clipart-search-input" />
                    <Search className="clipart-search-icon" size={16} />
                  </div>
                </div>

                <div className="clipart-categories">
                  <button className="clipart-category active"><Book size={18} /></button>
                  <button className="clipart-category"><UserRound size={18} /></button>
                  <button className="clipart-category"><Box size={18} /></button>
                  <button className="clipart-category"><Ruler size={18} /></button>
                  <button className="clipart-category"><LineChart size={18} /></button>
                  <button className="clipart-category"><Smile size={18} /></button>
                  <button className="clipart-category"><Bird size={18} /></button>
                  <button className="clipart-category-more"><ChevronRight size={18} /></button>
                </div>

                <div className="clipart-content">
                  <div className="clipart-section-title">Doodles</div>
                  <div className="clipart-working-state" style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '200px',
                    color: '#9ca3af',
                    gap: '12px'
                  }}>
                    <Bird size={48} opacity={0.5} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Working on it...</span>
                    <span style={{ fontSize: '12px', textAlign: 'center', padding: '0 20px' }}>Clipart libraries will be available in a future update.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {tools.map((t) => (
            <button
              key={t.id}
              className={`tool-btn ${editor.getCurrentToolId() === t.id ? 'active' : ''}`}
              onClick={() => editor.setCurrentTool(t.id)}
              data-tip={t.name}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className="bottom-left-tools">
          <div className="pill-container col-pill mb">
            <button className="tool-btn" onClick={() => editor.undo()}><Undo2 size={18} /></button>
            <button className="tool-btn" onClick={() => editor.redo()}><Redo2 size={18} /></button>
          </div>
          <div className="pill-container single mb">
            <button className="tool-btn" onClick={() => editor.zoomToFit()}><Monitor size={18} /></button>
          </div>
          <div className="pill-container single">
            <button className="tool-btn" onClick={() => editor.zoomIn()}><ZoomIn size={18} /></button>
          </div>
        </div>
      </div>

      {/* Bottom Center Bar */}
      <div className="bottom-center-wrapper">
        <div className="pill-container row-pill">
          <button className="tool-btn"><Video size={18} /></button>
          <button className="tool-btn"><Circle size={18} /></button>
          <button className="tool-btn"><MicOff size={18} /></button>
        </div>
      </div>

      {/* Bottom Right Controls */}
      <div className="bottom-right-wrapper">
        <div className="pill-container row-pill">
          <button className="tool-btn"><Copy size={18} /></button>
          <button className="tool-btn"><Plus size={18} /></button>
        </div>
      </div>
      {/* Camera Photo Modal Overlay */}
      {isCameraOpen && (
        <CameraModal 
          onClose={() => setIsCameraOpen(false)}
          onPhotoTaken={(file) => {
            setIsCameraOpen(false)
            editor.putExternalContent({
              type: 'files',
              files: [file],
              point: editor.getViewportPageBounds().center,
              ignoreParent: false,
            })
          }}
        />
      )}
    </div>
  )
})

function CameraModal({ onPhotoTaken, onClose }) {
  const videoRef = useRef(null)

  useEffect(() => {
    let activeStream = null
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        activeStream = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(e => console.error("Video play failed", e))
        }
      })
      .catch(console.error)

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const capture = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'photo.png', { type: 'image/png' })
        onPhotoTaken(file)
      }
    }, 'image/png')
  }

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal-content">
        <div className="camera-modal-header">
          <h3>Take a Photo</h3>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="camera-video-container">
          <video ref={videoRef} playsInline autoPlay disablePictureInPicture />
        </div>
        <div className="camera-modal-footer">
          <button className="capture-btn" onClick={capture}>
            <div className="capture-btn-inner"></div>
          </button>
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

  const currentUrl = historyIndex >= 0 ? history[historyIndex] : null

  useEffect(() => {
    if (!stream) return
    const video = document.createElement('video')
    video.srcObject = stream
    video.onloadedmetadata = () => {
      video.play()
      // Delay capture by 800ms
      setTimeout(() => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUrl = canvas.toDataURL('image/png')
        
        setHistory([dataUrl])
        setHistoryIndex(0)
        
        // Ensure all tracks are immediately stopped after capture
        stream.getTracks().forEach(t => t.stop())
      }, 800)
    }
  }, [stream])

  const pushHistory = (newUrl) => {
    const newHist = history.slice(0, historyIndex + 1)
    newHist.push(newUrl)
    setHistory(newHist)
    setHistoryIndex(newHist.length - 1)
  }

  const handleRotate = () => {
    if (!currentUrl) return
    const img = new Image()
    img.src = currentUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.height
      canvas.height = img.width
      const ctx = canvas.getContext('2d')
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((90 * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
      pushHistory(canvas.toDataURL('image/png'))
    }
  }

  const handleDragStart = (e) => {
    if (!isCropping || !imgRef.current) return
    e.preventDefault()
    const rect = imgRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top
    setCropRect({ startX, startY, x: startX, y: startY, width: 0, height: 0 })
    
    const docMove = (ev) => {
      const currentX = Math.max(0, Math.min(ev.clientX - rect.left, rect.width))
      const currentY = Math.max(0, Math.min(ev.clientY - rect.top, rect.height))
      setCropRect(prev => ({
        ...prev,
        x: Math.min(prev.startX, currentX),
        y: Math.min(prev.startY, currentY),
        width: Math.abs(currentX - prev.startX),
        height: Math.abs(currentY - prev.startY)
      }))
    }
    
    const docUp = () => {
      document.removeEventListener('mousemove', docMove)
      document.removeEventListener('mouseup', docUp)
      setCropRect(prev => {
        if (prev && prev.width > 5 && prev.height > 5) {
           const img = new Image()
           img.src = currentUrl
           img.onload = () => {
               // Map coordinates from container's UI size back to the natural image size
               const scaleX = img.width / rect.width
               const scaleY = img.height / rect.height
               
               const cx = prev.x * scaleX
               const cy = prev.y * scaleY
               const cw = prev.width * scaleX
               const ch = prev.height * scaleY
               
               const canvas = document.createElement('canvas')
               canvas.width = cw
               canvas.height = ch
               const ctx = canvas.getContext('2d')
               ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch)
               
               pushHistory(canvas.toDataURL('image/png'))
           }
        }
        return null
      })
      setIsCropping(false)
    }
    document.addEventListener('mousemove', docMove)
    document.addEventListener('mouseup', docUp)
  }

  const handleDone = () => {
    if (!currentUrl) return
    const img = new Image()
    img.src = currentUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' })
          onDone(file)
        }
      }, 'image/png')
    }
  }

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
    }
    onCancel()
  }

  return (
    <div 
      className="screenshot-overlay" 
      style={{ 
        opacity: currentUrl ? 1 : 0, 
        pointerEvents: currentUrl ? 'auto' : 'none',
        transition: 'opacity 0.2s'
      }}
    >
       <div className="screenshot-workspace">
         {currentUrl && (
           <div 
             className="screenshot-image-container" 
             ref={imgRef}
             onMouseDown={handleDragStart}
             style={{ cursor: isCropping ? 'crosshair' : 'default' }}
           >
             <img 
                src={currentUrl} 
                alt="Screenshot"
                className="screenshot-image" 
                draggable={false}
             />
             {isCropping && (
               <div className="crop-overlay-bg">
                 {cropRect && (
                   <div 
                     className="crop-rect"
                     style={{
                       left: cropRect.x,
                       top: cropRect.y,
                       width: cropRect.width,
                       height: cropRect.height
                     }}
                   />
                 )}
               </div>
             )}
           </div>
         )}
         
         {currentUrl && (
           <div className="screenshot-left-toolbar pill-container col-pill">
              <button className="tool-btn" onClick={handleRotate} data-tip="Rotate"><RotateCw size={18} /></button>
              <button className={`tool-btn ${isCropping ? 'active' : ''}`} onClick={() => setIsCropping(!isCropping)} data-tip="Crop"><Crop size={18} /></button>
              <button 
                className="tool-btn" 
                onClick={() => {if (historyIndex > 0) setHistoryIndex(historyIndex - 1)}} 
                disabled={historyIndex <= 0}
                style={{ opacity: historyIndex <= 0 ? 0.3 : 1 }}
                data-tip="Undo"
              ><Undo2 size={18} /></button>
              <button 
                className="tool-btn" 
                onClick={() => {if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1)}}
                disabled={historyIndex >= history.length - 1}
                style={{ opacity: historyIndex >= history.length - 1 ? 0.3 : 1 }}
                data-tip="Redo"
              ><Redo2 size={18} /></button>
           </div>
         )}
       </div>
       <div className="screenshot-bottom-bar">
          <button className="screenshot-cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className="screenshot-done-btn" onClick={handleDone}>Done</button>
       </div>
    </div>
  )
}

export default CustomUI
