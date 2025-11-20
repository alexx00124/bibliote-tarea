class RepositorioLibrosEnMemoria {
  constructor() {
    this.libros = [];
  }

  listar() {
    return this.libros;
  }

  guardar(libro) {
    this.libros.push(libro);
    return libro;
  }

  buscarPorISBN(isbn) {
    return this.libros.find(libro => libro.isbn === isbn);
  }
}

module.exports = RepositorioLibrosEnMemoria;