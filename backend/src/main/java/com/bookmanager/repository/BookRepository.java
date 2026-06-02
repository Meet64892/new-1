package com.bookmanager.repository;

import com.bookmanager.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("""
            SELECT b FROM Book b
            WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(b.author) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(COALESCE(b.genre, '')) LIKE LOWER(CONCAT('%', :term, '%'))
               OR LOWER(COALESCE(b.isbn, '')) LIKE LOWER(CONCAT('%', :term, '%'))
            ORDER BY b.title ASC
            """)
    List<Book> search(@Param("term") String term);

    boolean existsByIsbnIgnoreCase(String isbn);
}
