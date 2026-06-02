import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { createBook, deleteBook, fetchBooks, updateBook } from './api/booksApi'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import Modal from './components/Modal'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const loadBooks = useCallback(async (searchTerm) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks(searchTerm)
      setBooks(data ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load books. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handle)
  }, [search])

  useEffect(() => {
    // Data fetching on mount and whenever the search term changes; loadBooks
    // manages its own loading/error state, so the lint rule is suppressed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBooks(debouncedSearch)
  }, [debouncedSearch, loadBooks])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openCreateForm() {
    setEditingBook(null)
    setIsFormOpen(true)
  }

  function openEditForm(book) {
    setEditingBook(book)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingBook(null)
  }

  async function handleSubmit(payload) {
    setSubmitting(true)
    try {
      if (editingBook) {
        await updateBook(editingBook.id, payload)
        showToast('Book updated successfully')
      } else {
        await createBook(payload)
        showToast('Book added successfully')
      }
      closeForm()
      await loadBooks(debouncedSearch)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(`Delete "${book.title}"? This cannot be undone.`)
    if (!confirmed) {
      return
    }
    try {
      await deleteBook(book.id)
      showToast('Book deleted')
      await loadBooks(debouncedSearch)
    } catch (err) {
      showToast(err.message || 'Failed to delete book', 'error')
    }
  }

  const stats = useMemo(() => {
    const total = books.length
    const available = books.filter((book) => book.available).length
    return { total, available, borrowed: total - available }
  }, [books])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div>
            <h1>📚 Book Management System</h1>
            <p className="subtitle">Organize, track and manage your library collection</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreateForm}>
            + Add Book
          </button>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Books</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.available}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.borrowed}</span>
            <span className="stat-label">Borrowed</span>
          </div>
        </section>

        <div className="toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search by title, author, genre or ISBN…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
            <button type="button" className="btn btn-small" onClick={() => loadBooks(debouncedSearch)}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="state-message">Loading books…</div>
        ) : books.length === 0 && !error ? (
          <div className="state-message empty-state">
            <p>No books found.</p>
            {search ? (
              <button type="button" className="btn btn-secondary" onClick={() => setSearch('')}>
                Clear search
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={openCreateForm}>
                Add your first book
              </button>
            )}
          </div>
        ) : (
          <BookList books={books} onEdit={openEditForm} onDelete={handleDelete} />
        )}
      </main>

      {isFormOpen && (
        <Modal title={editingBook ? 'Edit Book' : 'Add Book'} onClose={closeForm}>
          <BookForm
            initialBook={editingBook}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={submitting}
          />
        </Modal>
      )}

      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  )
}

export default App
