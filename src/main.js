const Libro = require('./domain/Libro');
const Usuario = require('./domain/Usuario');
const TipoUsuario = require('./domain/TipoUsuario');
const RepositorioLibrosEnMemoria = require('./repositories/RepositorioLibrosEnMemoria');
const BibliotecaService = require('./services/BibliotecaService');

// Inicializar el repositorio
const repositorio = new RepositorioLibrosEnMemoria();

// Crear algunos libros de ejemplo
const libro1 = new Libro('Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 1967, 'Ficción');
const libro2 = new Libro('El principito', 'Antoine de Saint-Exupéry', '978-0156012195', 1943, 'Infantil');
const libro3 = new Libro('1984', 'George Orwell', '978-0451524935', 1949, 'Ficción');
const libro4 = new Libro('Don Quijote', 'Miguel de Cervantes', '978-8491050827', 1605, 'Clásico');

// Guardar libros en el repositorio
repositorio.guardar(libro1);
repositorio.guardar(libro2);
repositorio.guardar(libro3);
repositorio.guardar(libro4);

// Crear el servicio de biblioteca
const bibliotecaService = new BibliotecaService(repositorio);

// Crear usuarios de ejemplo
const estudiante = new Usuario(1, 'Juan Pérez', TipoUsuario.ESTUDIANTE);
const docente = new Usuario(2, 'María López', TipoUsuario.DOCENTE);
const externo = new Usuario(3, 'Carlos Ruiz', TipoUsuario.EXTERNO);

console.log('=== Sistema de Biblioteca ===\n');

// Listar todos los libros
console.log('📚 Libros disponibles:');
repositorio.listar().forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.autor}) - ${libro.disponible ? 'Disponible' : 'Prestado'}`);
});

console.log('\n--- Realizando préstamos ---\n');

// Prestar libro a estudiante
try {
  const prestamo1 = bibliotecaService.prestarLibro(estudiante, libro1);
  console.log(`✅ Préstamo exitoso: ${prestamo1.libro.titulo} a ${prestamo1.usuario.nombre}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

// Prestar libro a docente
try {
  const prestamo2 = bibliotecaService.prestarLibro(docente, libro2);
  console.log(`✅ Préstamo exitoso: ${prestamo2.libro.titulo} a ${prestamo2.usuario.nombre}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

// Intentar prestar el mismo libro (debe fallar)
try {
  const prestamo3 = bibliotecaService.prestarLibro(externo, libro1);
  console.log(`✅ Préstamo exitoso: ${prestamo3.libro.titulo} a ${prestamo3.usuario.nombre}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

console.log('\n📚 Estado actualizado de libros:');
repositorio.listar().forEach(libro => {
  console.log(`- ${libro.titulo} - ${libro.disponible ? 'Disponible' : 'Prestado'}`);
});

console.log('\n--- Búsqueda de libros ---\n');

// Buscar por autor
const resultadosBusqueda = bibliotecaService.buscar(null, 'García', null);
console.log('🔍 Búsqueda por autor "García":');
resultadosBusqueda.forEach(libro => {
  console.log(`- ${libro.titulo} (${libro.autor})`);
});

console.log('\n--- Devolución de libros ---\n');

// Devolver libro
try {
  bibliotecaService.devolverLibro(estudiante, libro1);
  console.log(`✅ Devolución exitosa: ${libro1.titulo}`);
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

console.log('\n📚 Estado final de libros:');
repositorio.listar().forEach(libro => {
  console.log(`- ${libro.titulo} - ${libro.disponible ? 'Disponible' : 'Prestado'}`);
});

// Probar límite de préstamos
console.log('\n--- Probando límite de préstamos para estudiante (máx 3) ---\n');

try {
  bibliotecaService.prestarLibro(estudiante, libro1);
  console.log('✅ Préstamo 1 exitoso');
  bibliotecaService.prestarLibro(estudiante, libro3);
  console.log('✅ Préstamo 2 exitoso');
  bibliotecaService.prestarLibro(estudiante, libro4);
  console.log('✅ Préstamo 3 exitoso');
  
  // Este debe fallar (excede el límite)
  const libroExtra = new Libro('Extra', 'Autor', '123456', 2020, 'Test');
  repositorio.guardar(libroExtra);
  bibliotecaService.prestarLibro(estudiante, libroExtra);
  console.log('✅ Préstamo 4 exitoso');
} catch (error) {
  console.log(`❌ Error esperado: ${error.message}`);
}