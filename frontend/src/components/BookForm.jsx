import { useState } from 'react'

const EMPTY_BOOK = {
  title: '',
  author: '',
  isbn: '',
  publishedYear: '',
  genre: '',
  available: true,
}

export default function BookForm({ initialBook, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_BOOK,
    ...initialBook,
    publishedYear: initialBook?.publishedYear ?? '',
    isbn: initialBook?.isbn ?? '',
    genre: initialBook?.genre ?? '',
    available: initialBook?.available ?? true,
  }))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.title.trim()) {
      nextErrors.title = 'Title is required'
    }
    if (!form.author.trim()) {
      nextErrors.author = 'Author is required'
    }
    if (form.publishedYear !== '' && Number(form.publishedYear) < 0) {
      nextErrors.publishedYear = 'Published year must be a positive number'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim() || null,
      publishedYear: form.publishedYear === '' ? null : Number(form.publishedYear),
      genre: form.genre.trim() || null,
      available: form.available,
    }

    try {
      await onSubmit(payload)
    } catch (error) {
      if (error.fieldErrors) {
        setErrors(error.fieldErrors)
      } else {
        setErrors({ form: error.message })
      }
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      {errors.form && <p className="form-error">{errors.form}</p>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Clean Code"
          autoFocus
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">Author *</label>
        <input
          id="author"
          name="author"
          type="text"
          value={form.author}
          onChange={handleChange}
          placeholder="e.g. Robert C. Martin"
        />
        {errors.author && <span className="field-error">{errors.author}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={form.isbn}
            onChange={handleChange}
            placeholder="e.g. 9780132350884"
          />
          {errors.isbn && <span className="field-error">{errors.isbn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="publishedYear">Published Year</label>
          <input
            id="publishedYear"
            name="publishedYear"
            type="number"
            value={form.publishedYear}
            onChange={handleChange}
            placeholder="e.g. 2008"
          />
          {errors.publishedYear && <span className="field-error">{errors.publishedYear}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="genre">Genre</label>
        <input
          id="genre"
          name="genre"
          type="text"
          value={form.genre}
          onChange={handleChange}
          placeholder="e.g. Software"
        />
        {errors.genre && <span className="field-error">{errors.genre}</span>}
      </div>

      <div className="form-group checkbox-group">
        <label htmlFor="available">
          <input
            id="available"
            name="available"
            type="checkbox"
            checked={form.available}
            onChange={handleChange}
          />
          Available
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Book'}
        </button>
      </div>
    </form>
  )
}
