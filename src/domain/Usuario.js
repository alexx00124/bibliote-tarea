const TipoUsuario = require('./TipoUsuario');

class Usuario {
  constructor(id, nombre, tipo) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
  }
}

module.exports = Usuario;