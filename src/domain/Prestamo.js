class Prestamo {
  constructor(usuario, libro, fechaPrestamo = new Date()) {
    this.usuario = usuario;
    this.libro = libro;
    this.fechaPrestamo = fechaPrestamo;
  }
}

module.exports = Prestamo;