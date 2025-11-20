const TipoUsuario = require('../domain/TipoUsuario');
const Prestamo = require('../domain/Prestamo');

class BibliotecaService {
  constructor(repositorioLibros) {
    this.repositorioLibros = repositorioLibros;
    this.prestamos = [];
    
    // Límites por tipo de usuario
    this.limitesPorTipo = {
      [TipoUsuario.ESTUDIANTE]: 3,
      [TipoUsuario.DOCENTE]: 5,
      [TipoUsuario.EXTERNO]: 2
    };
  }

  prestarLibro(usuario, libro) {
    // Validar si el libro está disponible
    if (!libro.disponible) {
      throw new Error('El libro no está disponible para préstamo');
    }

    // Validar límite de préstamos del usuario
    const prestamosActuales = this.prestamos.filter(
      p => p.usuario.id === usuario.id && p.libro.disponible === false
    );

    const limite = this.limitesPorTipo[usuario.tipo];
    
    if (prestamosActuales.length >= limite) {
      throw new Error(`El usuario ha alcanzado su límite de ${limite} libros prestados`);
    }

    // Realizar el préstamo
    libro.marcarPrestado();
    const prestamo = new Prestamo(usuario, libro);
    this.prestamos.push(prestamo);
    
    return prestamo;
  }

  devolverLibro(usuario, libro) {
    // Buscar el préstamo
    const prestamoIndex = this.prestamos.findIndex(
      p => p.usuario.id === usuario.id && p.libro.isbn === libro.isbn
    );

    if (prestamoIndex === -1) {
      throw new Error('No se encontró un préstamo activo para este libro y usuario');
    }

    // Marcar el libro como disponible
    libro.marcarDisponible();
    
    // Opcional: remover el préstamo o marcarlo como devuelto
    this.prestamos.splice(prestamoIndex, 1);
    
    return true;
  }

  buscar(titulo = null, autor = null, categoria = null) {
    const libros = this.repositorioLibros.listar();
    
    return libros.filter(libro => {
      let coincide = true;
      
      if (titulo && !libro.titulo.toLowerCase().includes(titulo.toLowerCase())) {
        coincide = false;
      }
      
      if (autor && !libro.autor.toLowerCase().includes(autor.toLowerCase())) {
        coincide = false;
      }
      
      if (categoria && !libro.categoria.toLowerCase().includes(categoria.toLowerCase())) {
        coincide = false;
      }
      
      return coincide;
    });
  }
}

module.exports = BibliotecaService;