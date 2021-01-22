package es.urjc.code.daw.library.rest.rest;

import io.restassured.RestAssured;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.event.annotation.BeforeTestClass;

import java.util.Base64;

import static io.restassured.RestAssured.*;
import static io.restassured.matcher.RestAssuredMatchers.*;
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
            body("size()",is(5)).
            body("get(0).id", equalTo(1)).
            body("get(0).title", equalTo("SUEÑOS DE ACERO Y NEON")).
            body("get(0).description", containsStringIgnoringCase("Los personajes que protagonizan")).
            body("get(4).id", equalTo(5)).
            body("get(4).title", equalTo("LA LEGIÓN PERDIDA")).
            body("get(4).description", containsStringIgnoringCase("Éufrates para conquistar Oriente"));
    }

    @Test
    @DisplayName("Given logged user as role: USER, when creats new book, then should return ok")
    public void givenLoggedUser_whenSaveNewBook_thenShouldReturnOk() {
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
    }

    @Test
    @DisplayName("Given logged user as role: USER, when creats new book, then should return ok")
    public void givenLoggedUser_whenSaveNewBook_thenShouldReturnOk() {
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
    }

}