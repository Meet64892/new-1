export default function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return null
  }

  return (
    <div className="table-wrapper">
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>ISBN</th>
            <th>Status</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td data-label="Title" className="title-cell">{book.title}</td>
              <td data-label="Author">{book.author}</td>
              <td data-label="Genre">{book.genre || '—'}</td>
              <td data-label="Year">{book.publishedYear ?? '—'}</td>
              <td data-label="ISBN">{book.isbn || '—'}</td>
              <td data-label="Status">
                <span className={`badge ${book.available ? 'badge-available' : 'badge-unavailable'}`}>
                  {book.available ? 'Available' : 'Borrowed'}
                </span>
              </td>
              <td data-label="Actions" className="actions-col">
                <button type="button" className="btn btn-small btn-secondary" onClick={() => onEdit(book)}>
                  Edit
                </button>
                <button type="button" className="btn btn-small btn-danger" onClick={() => onDelete(book)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
