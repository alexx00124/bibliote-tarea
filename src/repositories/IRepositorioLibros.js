// Interfaz simulada para el repositorio de libros
const IRepositorioLibros = {
  listar: function() {
    throw new Error('Método listar() debe ser implementado');
  },
  
  guardar: function(libro) {
    throw new Error('Método guardar() debe ser implementado');
  },
  
  buscarPorISBN: function(isbn) {
    throw new Error('Método buscarPorISBN() debe ser implementado');
  }
};

module.exports = IRepositorioLibros;