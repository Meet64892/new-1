package com.bookmanager.config;

import com.bookmanager.model.Book;
import com.bookmanager.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@Profile("!test")
public class DataInitializer {

    @Bean
    CommandLineRunner seedBooks(BookRepository bookRepository) {
        return args -> {
            if (bookRepository.count() > 0) {
                return;
            }
            bookRepository.saveAll(List.of(
                    new Book("The Pragmatic Programmer", "Andrew Hunt, David Thomas", "9780201616224", 1999, "Software", true),
                    new Book("Clean Code", "Robert C. Martin", "9780132350884", 2008, "Software", true),
                    new Book("Effective Java", "Joshua Bloch", "9780134685991", 2018, "Programming", true),
                    new Book("Designing Data-Intensive Applications", "Martin Kleppmann", "9781449373320", 2017, "Data", false),
                    new Book("The Lord of the Rings", "J.R.R. Tolkien", "9780544003415", 1954, "Fantasy", true),
                    new Book("Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "9780062316097", 2011, "History", true)
            ));
        };
    }
}
