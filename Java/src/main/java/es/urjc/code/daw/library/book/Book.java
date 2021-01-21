package es.urjc.code.daw.library.book;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id = null;
	
	private String title;
	
	@Column(length = 50000)
	private String description;

	public Book() {}

	public Book(String nombre, String description) {
		super();
		this.title = nombre;
		this.description = description;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "Book [id=" + id + ", title=" + title + ", description=" + description + "]";
	}

	@Override
    public boolean equals(Object o) {
		if (o == this) { 
			return true; 
		} 

		if (!(o instanceof Book)) { 
			return false; 
		} 
			
		Book b = (Book) o; 
			
		return b.title.equals(this.title) && b.description.equals(this.description); 
	}

}
