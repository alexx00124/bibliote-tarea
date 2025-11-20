# 📚 Sistema de Gestión de Biblioteca

Sistema completo de gestión de biblioteca implementado en JavaScript con arquitectura limpia y principios SOLID.

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema de biblioteca que permite gestionar libros, usuarios y préstamos. Está diseñado siguiendo principios de desarrollo de software como:

- **Separación de responsabilidades**
- **Inversión de dependencias (DIP)**
- **Interfaces bien definidas**
- **Arquitectura en capas**

## 🏗️ Arquitectura del Proyecto

```
bibliote-tarea/
├── src/
│   ├── domain/              # Entidades del dominio
│   │   ├── Libro.js
│   │   ├── Usuario.js
│   │   ├── Prestamo.js
│   │   └── TipoUsuario.js
│   ├── repositories/        # Capa de acceso a datos
│   │   ├── IRepositorioLibros.js
│   │   └── RepositorioLibrosEnMemoria.js
│   ├── services/            # Lógica de negocio
│   │   ├── IBibliotecaService.js
│   │   └── BibliotecaService.js
│   └── main.js              # Punto de entrada y demostración
├── package.json
└── README.md
```

## 📦 Componentes del Sistema

### 1️⃣ **Domain Layer (Capa de Dominio)**

#### **Libro.js**
Representa un libro en la biblioteca.

**Atributos:**
- `titulo`: Nombre del libro
- `autor`: Autor del libro
- `isbn`: Código ISBN único
- `año`: Año de publicación
- `categoria`: Categoría o género del libro
- `disponible`: Estado de disponibilidad (boolean)

**Métodos:**
- `marcarPrestado()`: Marca el libro como no disponible
- `marcarDisponible()`: Marca el libro como disponible

**Ejemplo de uso:**
```javascript
const libro = new Libro('1984', 'George Orwell', '978-0451524935', 1949, 'Ficción');
libro.marcarPrestado(); // disponible = false
```

#### **Usuario.js**
Representa a un usuario de la biblioteca.

**Atributos:**
- `id`: Identificador único del usuario
- `nombre`: Nombre completo
- `tipo`: Tipo de usuario (del enum TipoUsuario)

**Ejemplo de uso:**
```javascript
const usuario = new Usuario(1, 'Juan Pérez', TipoUsuario.ESTUDIANTE);
```

#### **Prestamo.js**
Representa un préstamo de libro a un usuario.

**Atributos:**
- `usuario`: Objeto Usuario que realiza el préstamo
- `libro`: Objeto Libro que se presta
- `fechaPrestamo`: Fecha del préstamo (por defecto la fecha actual)

**Ejemplo de uso:**
```javascript
const prestamo = new Prestamo(usuario, libro);
```

#### **TipoUsuario.js**
Enumeración que define los tipos de usuarios permitidos.

**Valores:**
- `ESTUDIANTE`: Estudiante de la institución
- `DOCENTE`: Profesor o docente
- `EXTERNO`: Usuario externo

**Beneficio:** Evita usar strings sueltos y proporciona seguridad de tipos.

```javascript
const tipo = TipoUsuario.ESTUDIANTE; // ✅ Correcto
const tipo = 'estudiante'; // ❌ Evitar
```

---

### 2️⃣ **Repository Layer (Capa de Repositorio)**

#### **IRepositorioLibros.js**
Interfaz que define el contrato para los repositorios de libros.

**Métodos obligatorios:**
- `listar()`: Retorna todos los libros
- `guardar(libro)`: Guarda un libro en el repositorio
- `buscarPorISBN(isbn)`: Busca un libro por su ISBN

**Propósito:** Definir la "forma" que debe tener cualquier repositorio de libros.

#### **RepositorioLibrosEnMemoria.js**
Implementación concreta del repositorio que almacena libros en memoria (array).

**Características:**
- Almacena libros en un array privado
- Implementa todos los métodos de la interfaz
- Perfecto para desarrollo y pruebas

**Ejemplo de uso:**
```javascript
const repo = new RepositorioLibrosEnMemoria();
repo.guardar(libro1);
repo.guardar(libro2);
const todosLosLibros = repo.listar();
const libro = repo.buscarPorISBN('978-0451524935');
```

**💡 Ventaja:** Se puede cambiar fácilmente por una implementación con base de datos sin modificar el servicio.

---

### 3️⃣ **Service Layer (Capa de Servicio)**

#### **IBibliotecaService.js**
Interfaz que define las operaciones de negocio de la biblioteca.

**Métodos obligatorios:**
- `prestarLibro(usuario, libro)`: Presta un libro a un usuario
- `devolverLibro(usuario, libro)`: Registra la devolución de un libro
- `buscar(titulo, autor, categoria)`: Busca libros por criterios

#### **BibliotecaService.js**
Implementación completa de la lógica de negocio de la biblioteca.

**Características principales:**

##### 📊 **Límites de Préstamo por Tipo de Usuario**
```javascript
ESTUDIANTE: 3 libros máximo
DOCENTE: 5 libros máximo
EXTERNO: 2 libros máximo
```

##### ✅ **Validaciones Implementadas**

1. **Validación de disponibilidad:**
   - No se puede prestar un libro ya prestado

2. **Validación de límite:**
   - Cada usuario tiene un máximo según su tipo
   - Se verifica antes de cada préstamo

##### 🔍 **Sistema de Búsqueda**
Permite buscar libros por:
- Título (búsqueda parcial, case-insensitive)
- Autor (búsqueda parcial, case-insensitive)
- Categoría (búsqueda parcial, case-insensitive)

Se pueden combinar múltiples criterios.

**Ejemplo de uso:**
```javascript
const service = new BibliotecaService(repositorio);

// Prestar libro
try {
  const prestamo = service.prestarLibro(estudiante, libro);
  console.log('Préstamo exitoso');
} catch (error) {
  console.log('Error:', error.message);
}

// Buscar libros
const resultados = service.buscar('quijote', null, null);

// Devolver libro
service.devolverLibro(estudiante, libro);
```

##### 🔐 **Principio de Inversión de Dependencias (DIP)**
El servicio recibe el repositorio por constructor, no lo crea internamente:

```javascript
// ✅ Correcto (DIP)
const service = new BibliotecaService(repositorio);

// ❌ Incorrecto (dependencia directa)
class BibliotecaService {
  constructor() {
    this.repo = new RepositorioLibrosEnMemoria(); // Hard-coded
  }
}
```

**Beneficio:** Permite cambiar la implementación del repositorio fácilmente (testing, diferentes fuentes de datos).

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos previos
- Node.js instalado (versión 12 o superior)

### Instalación y ejecución

1. **Clonar el repositorio:**
```bash
git clone https://github.com/alexx00124/bibliote-tarea.git
cd bibliote-tarea
```

2. **Ejecutar el programa:**
```bash
node src/main.js
```

### 📝 Salida esperada

El programa demostrará:
- Creación de libros y usuarios
- Listado de libros disponibles
- Realización de préstamos
- Validación de disponibilidad
- Búsqueda de libros
- Devolución de libros
- Validación de límites por tipo de usuario

---

## 🎯 Casos de Uso Implementados

### ✅ Caso 1: Préstamo exitoso
```
Usuario: Estudiante
Libro: Disponible
Préstamos actuales: 2
Límite: 3
Resultado: ✅ Préstamo aprobado
```

### ❌ Caso 2: Libro no disponible
```
Usuario: Docente
Libro: Ya prestado a otro usuario
Resultado: ❌ Error - "El libro no está disponible para préstamo"
```

### ❌ Caso 3: Límite excedido
```
Usuario: Estudiante con 3 préstamos activos
Intenta: Prestar un cuarto libro
Límite: 3
Resultado: ❌ Error - "El usuario ha alcanzado su límite de 3 libros prestados"
```

### 🔍 Caso 4: Búsqueda de libros
```
Búsqueda: Autor contiene "García"
Resultado: Lista de libros que coinciden
```

---

## 🧪 Pruebas Incluidas en main.js

El archivo `main.js` incluye una demostración completa con:

1. ✅ Creación de 4 libros de ejemplo
2. ✅ Creación de 3 usuarios (uno de cada tipo)
3. ✅ Préstamos exitosos
4. ✅ Intento de prestar libro ya prestado (falla esperada)
5. ✅ Búsqueda por autor
6. ✅ Devolución de libros
7. ✅ Prueba de límite de préstamos

---

## 🛠️ Tecnologías Utilizadas

- **JavaScript (ES6+)**: Lenguaje de programación
- **Node.js**: Entorno de ejecución
- **CommonJS**: Sistema de módulos (require/module.exports)

---

## 📚 Principios de Diseño Aplicados

### 1. **Separación de Responsabilidades (SRP)**
- Cada clase tiene una única responsabilidad
- Domain: Entidades puras
- Repository: Acceso a datos
- Service: Lógica de negocio

### 2. **Inversión de Dependencias (DIP)**
- Las clases de alto nivel no dependen de clases de bajo nivel
- Ambas dependen de abstracciones (interfaces)
- BibliotecaService depende de IRepositorioLibros, no de RepositorioLibrosEnMemoria

### 3. **Arquitectura en Capas**
```
main.js → Service Layer → Repository Layer → Domain Layer
```

### 4. **Encapsulamiento**
- Atributos privados donde corresponde
- Métodos públicos bien definidos
- Estado interno protegido

---

## 🔄 Posibles Mejoras Futuras

- [ ] Implementar RepositorioLibrosEnBD con base de datos real
- [ ] Agregar sistema de multas por retraso
- [ ] Implementar renovación de préstamos
- [ ] Agregar historial de préstamos
- [ ] Sistema de reservas
- [ ] API REST para acceso remoto
- [ ] Interfaz gráfica de usuario
- [ ] Tests unitarios con Jest
- [ ] Validación de fechas de devolución
- [ ] Sistema de notificaciones

---

## 👤 Autor

Proyecto desarrollado como trabajo de UML

## 📄 Licencia

ISC

---

## 📞 Contacto

Para reportar issues o sugerencias, visita: [GitHub Issues](https://github.com/alexx00124/bibliote-tarea/issues)

---

**¡Gracias por usar el Sistema de Gestión de Biblioteca!** 📚✨