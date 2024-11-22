import React, { useState, useRef, useEffect } from 'react'

interface VaultItem {
  id: string
  name: string
  type: 'file' | 'image' | 'text' | 'video'
  content: string
  category: string
  createdAt: Date
}

export default function VaultPage() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    { id: '1', name: 'Important Note', type: 'text', content: 'This is a very important note.', category: 'Notes', createdAt: new Date() },
    { id: '2', name: 'Profile Picture', type: 'image', content: 'https://picsum.photos/200', category: 'Images', createdAt: new Date() },
    { id: '3', name: 'Resume', type: 'file', content: 'https://example.com/resume.pdf', category: 'Documents', createdAt: new Date() },
  ])
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [newItemName, setNewItemName] = useState('')
  const [newItemContent, setNewItemContent] = useState('')
  const [newItemType, setNewItemType] = useState<'file' | 'image' | 'text' | 'video'>('text')
  const [newItemCategory, setNewItemCategory] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureType, setCaptureType] = useState<'image' | 'video'>('image')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (isCapturing) {
      startCapture()
    } else {
      stopCapture()
    }
  }, [isCapturing])

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: captureType === 'video' })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      if (captureType === 'video') {
        mediaRecorderRef.current = new MediaRecorder(stream)
        mediaRecorderRef.current.ondataavailable = handleDataAvailable
        mediaRecorderRef.current.start()
        setIsRecording(true)
      }
    } catch (err) {
      console.error("Error accessing media devices:", err)
    }
  }

  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordedChunks(prev => [...prev, event.data])
    }
  }

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        addNewItem('Captured Image', 'image', imageDataUrl, 'Captures')
        setIsCapturing(false)
      }
    }
  }

  const captureVideo = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      addNewItem('Captured Video', 'video', url, 'Captures')
      setRecordedChunks([])
      setIsCapturing(false)
    }
  }

  const handleItemClick = (item: VaultItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
    setIsModalOpen(false)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const handleNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addNewItem(newItemName, newItemType, newItemContent, newItemCategory)
    setNewItemName('')
    setNewItemContent('')
    setNewItemType('text')
    setNewItemCategory('')
  }

  const addNewItem = (name: string, type: 'file' | 'image' | 'text' | 'video', content: string, category: string) => {
    const newItem: VaultItem = {
      id: Date.now().toString(),
      name,
      type,
      content,
      category,
      createdAt: new Date()
    }
    setVaultItems(prev => [...prev, newItem])
  }

  const filteredItems = vaultItems
    .filter(item => 
      (activeCategory === 'All' || item.category === activeCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

  const categories = ['All', ...new Set(vaultItems.map(item => item.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-slate-400 via-red-200 to-cyan-500 opacity-90 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900">Your Enhanced Secure Vault</h1>
          <div className="space-x-4">
            <button
              onClick={() => setIsCapturing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Capture Media
            </button>
            <button
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search vault items..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-1/3 px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <div className="space-x-2 flex-grow sm:flex-grow-0 flex flex-wrap justify-center sm:justify-end gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  activeCategory === category
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white text-cyan-600 hover:bg-cyan-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              className="px-4 py-2 rounded-lg border-2 border-cyan-300 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-300"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>

        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'} mb-8`}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`bg-white p-4 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}
            >
              <div className={`text-2xl ${viewMode === 'list' ? 'mr-4' : 'mb-2'}`}>
                {item.type === 'file' && '📄'}
                {item.type === 'image' && '🖼️'}
                {item.type === 'text' && '📝'}
                {item.type === 'video' && '🎥'}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-indigo-900">{item.name}</h3>
                <p className="text-sm text-indigo-600">{item.category}</p>
                {viewMode === 'list' && (
                  <p className="text-xs text-gray-500">{item.createdAt.toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleNewItemSubmit} className="bg-gradient-to-br from-teal-500 via-slate-400 via-red-200 to-cyan-500 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-cyan-900">Add New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              required
            />
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as 'file' | 'image' | 'text' | 'video')}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              required
            >
              <option value="text">Text</option>
              <option value="file">File</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input
              type="text"
              placeholder="Content (URL for file/image/video, text content for text)"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-cyan-500 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-300"
          >
            Add Item
          </button>
        </form>
      </div>

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900">{selectedItem.name}</h2>
            <p className="text-sm text-indigo-600 mb-4">{selectedItem.category}</p>
            {selectedItem.type === 'image' ? (
              <img src={selectedItem.content} alt={selectedItem.name} className="w-full h-auto rounded-lg" />
            ) : selectedItem.type === 'video' ? (
              <video src={selectedItem.content} controls className="w-full h-auto rounded-lg" />
            ) : selectedItem.type === 'file' ? (
              <div className="bg-indigo-100 p-4 rounded-lg">
                <a href={selectedItem.content} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Open File
                </a>
              </div>
            ) : (
              <p className="text-gray-700">{selectedItem.content}</p>
            )}
            <p className="text-xs text-gray-500 mt-4">Created: {selectedItem.createdAt.toLocaleString()}</p>
            <button
              onClick={handleCloseModal}
              className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isCapturing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-cyan-900">Capture {captureType === 'image' ? 'Image' : 'Video'}</h2>
            <video ref={videoRef} autoPlay muted className="w-full h-auto rounded-lg mb-4" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex justify-between items-center">
              <div>
                <button
                  onClick={() => setCaptureType('image')}
                  className={`px-4 py-2 rounded-lg mr-2 ${captureType === 'image' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Image
                </button>
                <button
                  onClick={() => setCaptureType('video')}
                  className={`px-4 py-2 rounded-lg ${captureType === 'video' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Video
                </button>
              </div>
              {captureType === 'image' ? (
                <button
                  onClick={captureImage}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Capture Image
                </button>
              ) : (
                <button
                  onClick={isRecording ? captureVideo : () => mediaRecorderRef.current?.start()}
                  className={`px-4 py-2 ${isRecording ? 'bg-red-600' : 'bg-green-600'} text-white rounded-lg hover:${isRecording ? 'bg-red-700' : 'bg-green-700'} transition-colors duration-300`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              )}
              <button
                onClick={() => setIsCapturing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}