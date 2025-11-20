// Interfaz simulada para el servicio de biblioteca
const IBibliotecaService = {
  prestarLibro: function(usuario, libro) {
    throw new Error('Método prestarLibro() debe ser implementado');
  },
  
  devolverLibro: function(usuario, libro) {
    throw new Error('Método devolverLibro() debe ser implementado');
  },
  
  buscar: function(titulo, autor, categoria) {
    throw new Error('Método buscar() debe ser implementado');
  }
};

module.exports = IBibliotecaService;