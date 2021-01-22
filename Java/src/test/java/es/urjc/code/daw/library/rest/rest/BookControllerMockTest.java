package es.urjc.code.daw.library.rest.rest;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("REST Assured BookRestControllerTests")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookControllerMockTest {

    @LocalServerPort
    int port;

    String baseUrl;

    @BeforeEach
    public void setUp() {
        RestAssured.port = port;
        baseUrl = "https://localhost:" + port;
    }

    @Test
    @DisplayName("Given logged user, when gets books, then should return all books")
    public void givenUnloggedUser_whenGetsAllBooks_thenShouldReturnBooksList() {
        given().
                relaxedHTTPSValidation().
                when().
                get(baseUrl + "/api/books/").
                then().
                statusCode(200).
                body("size()", greaterThanOrEqualTo(5)).
                body("get(0).id", equalTo(1)).
                body("get(0).title", equalTo("SUEÑOS DE ACERO Y NEON")).
                body("get(0).description", containsStringIgnoringCase("Los personajes que protagonizan")).
                body("get(4).id", equalTo(5)).
                body("get(4).title", equalTo("LA LEGIÓN PERDIDA")).
                body("get(4).description", containsStringIgnoringCase("Éufrates para conquistar Oriente"));
    }

    @Test
    @DisplayName("Given logged user as role: USER, when creates new book, then should return ok")
    public void givenLoggedUser_whenSaveNewBook_thenShouldReturnOk() {
        int numberOfBooksBeforeOperation = numberOfBooks();

        given().
                relaxedHTTPSValidation().
                auth()
                .basic("user", "pass").
                contentType("application/json").
                body("{\"description\":\"description 1\",\"title\":\"New Book 1\" }").
                when().
                post(baseUrl + "/api/books/").
                then().
                statusCode(201).
                body("title", equalTo("New Book 1"),
                        "description", containsStringIgnoringCase("description 1"));

        int newNumberOfBooks = numberOfBooks();
        Assertions.assertEquals(numberOfBooksBeforeOperation + 1, newNumberOfBooks);
    }

    @Test
    @DisplayName("Given logged user as role: ADMIN, when deletes book, then should return ok")
    public void givenLoggedUserAsAdmin_whenDeletesBook_thenShouldReturnOk() {
        int numberOfBooksBeforeOperation = numberOfBooks();

        createBookToDelete();
        given().
                relaxedHTTPSValidation().
                auth()
                .basic("admin", "pass").
                when().
                //TODO: no se porque inicializa la DDBB con 5 libros, pero cuando crea uno nuevo le asigna el numero 8 -> deberia ser el 6.
                        delete(baseUrl + "/api/books/" + (numberOfBooks() + 2)).
                then().
                statusCode(200);

        int newNumberOfBooks = numberOfBooks();
        Assertions.assertEquals(numberOfBooksBeforeOperation, newNumberOfBooks);
    }

    private int numberOfBooks() {
        Response response = given().
                relaxedHTTPSValidation().
                when().
                get(baseUrl + "/api/books/");

        return response.getBody().jsonPath().getList("$").size();
    }

    private void createBookToDelete() {
        given().
                relaxedHTTPSValidation().
                auth()
                .basic("user", "pass").
                contentType("application/json").
                body("{\"description\":\"description book to delete\",\"title\":\"Book to delete\" }").
                when().
                post(baseUrl + "/api/books/");
    }
}