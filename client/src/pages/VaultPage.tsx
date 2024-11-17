import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface VaultItem {
  id: string
  name: string
  type: 'file' | 'image' | 'text'
  content: string
  category: string
}

export default function VaultPage() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([
    { id: '1', name: 'Important Note', type: 'text', content: 'This is a very important note.', category: 'Notes' },
    { id: '2', name: 'Profile Picture', type: 'image', content: 'https://picsum.photos/200', category: 'Images' },
    { id: '3', name: 'Resume', type: 'file', content: 'https://example.com/resume.pdf', category: 'Documents' },
  ])
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [newItemName, setNewItemName] = useState('')
  const [newItemContent, setNewItemContent] = useState('')
  const [newItemType, setNewItemType] = useState<'file' | 'image' | 'text'>('text')
  const [newItemCategory, setNewItemCategory] = useState('')

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
    const newItem: VaultItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: newItemType,
      content: newItemContent,
      category: newItemCategory
    }
    setVaultItems([...vaultItems, newItem])
    setNewItemName('')
    setNewItemContent('')
    setNewItemType('text')
    setNewItemCategory('')
  }

  const filteredItems = vaultItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = ['All', ...new Set(vaultItems.map(item => item.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-slate-400 via-red-200 to-cyan-500 opacity-90 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900">Your Secure Vault</h1>
          <Link to={"/"}>
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
            Back to Dashboard
          </button>
          </Link>
        </header>

        <div className="mb-8 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search vault items..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-1/3 px-4 py-2 rounded-lg border-2 border-cyan-300 focus:border-cyan-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <div className="space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  activeCategory === category
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white text-indigo-600 hover:bg-cyan-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-white p-4 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-2xl mb-2">
                {item.type === 'file' && '📄'}
                {item.type === 'image' && '🖼️'}
                {item.type === 'text' && '📝'}
              </div>
              <h3 className="font-semibold text-lg mb-1 text-indigo-900">{item.name}</h3>
              <p className="text-sm text-indigo-600">{item.category}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleNewItemSubmit} className="bg-cyan-200 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">Add New Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as 'file' | 'image' | 'text')}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="text">Text</option>
              <option value="file">File</option>
              <option value="image">Image</option>
            </select>
            <input
              type="text"
              placeholder="Content (URL for file/image, text content for text)"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900">{selectedItem.name}</h2>
            <p className="text-sm text-indigo-600 mb-4">{selectedItem.category}</p>
            {selectedItem.type === 'image' ? (
              <img src={selectedItem.content} alt={selectedItem.name} className="w-full h-auto rounded-lg" />
            ) : selectedItem.type === 'file' ? (
              <div className="bg-cyan-100 p-4 rounded-lg">
                <a href={selectedItem.content} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  Open File
                </a>
              </div>
            ) : (
              <p className="text-gray-700">{selectedItem.content}</p>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}