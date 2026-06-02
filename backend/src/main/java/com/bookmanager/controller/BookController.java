package com.bookmanager.controller;

import com.bookmanager.dto.BookRequest;
import com.bookmanager.model.Book;
import com.bookmanager.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getBooks(@RequestParam(value = "search", required = false) String search) {
        return bookService.findAll(search);
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody BookRequest request,
                                           UriComponentsBuilder uriBuilder) {
        Book created = bookService.create(request);
        URI location = uriBuilder.path("/api/books/{id}").buildAndExpand(created.getId()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        return bookService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
