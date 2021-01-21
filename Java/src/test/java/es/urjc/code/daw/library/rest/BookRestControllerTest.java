package es.urjc.code.daw.library.rest;

import com.google.gson.Gson;
import es.urjc.code.daw.library.book.Book;
import es.urjc.code.daw.library.book.BookService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("BookRestControllerTests")
class BookRestControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private BookService bookService;

    @Nested
    @DisplayName("Given unlogged user")
    class givenUnloggedUser {

        @Nested
        @DisplayName("when the user get all books ")
        class whenGetAllBooks {

            @Test
            @DisplayName("then the user should get all books ")
            public void thenShouldGetAllBooks() throws Exception {
                String title = "Book 1";
                String description = "book 1 description";
                List<Book> books = Arrays.asList(new Book(title, description), new Book());
                Mockito.when(bookService.findAll()).thenReturn(books);

                mvc.perform(get("/api/books/")
                        .contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(2)))
                        .andExpect(jsonPath("$[0].title", equalTo(title)))
                        .andExpect(jsonPath("$[0].description", equalTo(description)));
            }

            @Test
            @DisplayName("then should return no books")
            public void thenShouldGetNoBooks() throws Exception {
                Mockito.when(bookService.findAll()).thenReturn(new ArrayList<>());

                mvc.perform(get("/api/books/")
                        .contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$", hasSize(0)));
            }
        }

    }

    @Nested
    @DisplayName("Given user logged")
    class givenLoggedUser {

        @Nested
        @DisplayName("when the user creates new book")
        class whenGetAllBooks {

            @Test
            @DisplayName("then should return book created")
            @WithMockUser(username = "username", password = "password", roles = "USER")
            public void thenShouldReturnBook() throws Exception {
                String title = "Book 1";
                String description = "book 1 description";
                Book book = new Book(title, description);
                Mockito.when(bookService.save(book)).thenReturn(book);
                Gson gson = new Gson();

                mvc.perform(post("/api/books/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(gson.toJson(book)))
                        .andExpect(status().isCreated())
                        .andExpect(jsonPath("$.title", equalTo(title)))
                        .andExpect(jsonPath("$.description", equalTo(description)));
            }
        }

    }
}