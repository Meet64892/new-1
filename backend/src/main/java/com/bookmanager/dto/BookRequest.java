package com.bookmanager.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be at most 255 characters")
        String title,

        @NotBlank(message = "Author is required")
        @Size(max = 255, message = "Author must be at most 255 characters")
        String author,

        @Size(max = 20, message = "ISBN must be at most 20 characters")
        String isbn,

        @Min(value = 0, message = "Published year must be a positive number")
        Integer publishedYear,

        @Size(max = 100, message = "Genre must be at most 100 characters")
        String genre,

        Boolean available
) {
}
