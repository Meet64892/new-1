package com.bookmanager.service;

import com.bookmanager.dto.BookRequest;
import com.bookmanager.exception.ResourceNotFoundException;
import com.bookmanager.model.Book;
import com.bookmanager.repository.BookRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<Book> findAll(String search) {
        if (StringUtils.hasText(search)) {
            return bookRepository.search(search.trim());
        }
        return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "title"));
    }

    @Transactional(readOnly = true)
    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
    }

    public Book create(BookRequest request) {
        Book book = new Book();
        applyRequest(book, request);
        return bookRepository.save(book);
    }

    public Book update(Long id, BookRequest request) {
        Book book = findById(id);
        applyRequest(book, request);
        return bookRepository.save(book);
    }

    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id " + id);
        }
        bookRepository.deleteById(id);
    }

    private void applyRequest(Book book, BookRequest request) {
        book.setTitle(request.title().trim());
        book.setAuthor(request.author().trim());
        book.setIsbn(request.isbn() != null ? request.isbn().trim() : null);
        book.setPublishedYear(request.publishedYear());
        book.setGenre(request.genre() != null ? request.genre().trim() : null);
        book.setAvailable(request.available() == null || request.available());
    }
}
