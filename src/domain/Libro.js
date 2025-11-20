class Libro {
  constructor(titulo, autor, isbn, año, categoria, disponible = true) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.año = año;
    this.categoria = categoria;
    this.disponible = disponible;
  }

  marcarPrestado() {
    this.disponible = false;
  }

  marcarDisponible() {
    this.disponible = true;
  }
}

module.exports = Libro;