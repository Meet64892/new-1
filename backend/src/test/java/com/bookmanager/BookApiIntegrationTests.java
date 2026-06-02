package com.bookmanager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BookApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsAndFetchesBook() throws Exception {
        String payload = """
                {
                  "title": "Test Driven Development",
                  "author": "Kent Beck",
                  "isbn": "9780321146533",
                  "publishedYear": 2002,
                  "genre": "Software",
                  "available": true
                }
                """;

        String location = mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Test Driven Development"))
                .andReturn()
                .getResponse()
                .getHeader("Location");

        mockMvc.perform(get(location))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.author").value("Kent Beck"));
    }

    @Test
    void rejectsInvalidBook() throws Exception {
        String payload = """
                { "title": "", "author": "" }
                """;

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.author").exists());
    }

    @Test
    void returnsNotFoundForMissingBook() throws Exception {
        mockMvc.perform(get("/api/books/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletesBook() throws Exception {
        String payload = """
                { "title": "Refactoring", "author": "Martin Fowler" }
                """;

        String location = mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getHeader("Location");

        mockMvc.perform(delete(location))
                .andExpect(status().isNoContent());

        mockMvc.perform(get(location))
                .andExpect(status().isNotFound());
    }
}
