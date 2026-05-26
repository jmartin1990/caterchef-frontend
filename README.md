# CaterChef Frontend - Interfaz Web (Next.js)

Este repositorio contiene la interfaz de usuario interactiva y responsive de **CaterChef**, diseñada para ofrecer una experiencia fluida (UX/UI) en la contratación de catering y chefs a domicilio de cocina fusión peruana-española.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router con Turbopack)
- **Lenguaje:** TypeScript (Tipado estricto con extensión de interfaces para configuraciones del compilador)
- **Estilos:** Tailwind CSS (Diseño adaptable y utilitario)
- **Testing:** Jest + React Testing Library + `@types/jest`

## 📋 Manual de Procesos y Arranque en Terminal

### 1. Desarrollo Local Tradicional

Si deseas levantar el servidor de desarrollo en tu entorno local sin contenedores:

```bash
# Situarse en la carpeta del frontend
cd caterchef-frontend

# Instalar dependencias de forma limpia
npm install

# Levantar el servidor de desarrollo con Turbopack
npm run dev

La aplicación estará disponible en: http://localhost:3000

2. Compilación y Build de Producción
Para verificar que el empaquetador genera los archivos de distribución estáticos correctamente sin colapsar:

Manual de Despliegue con Docker
El frontend está completamente contenerizado de forma independiente para aislar el entorno de ejecución de la aplicación.

Comandos de Terminal para Gestión de Docker:

# 1. Construir la imagen del frontend (Etiquetada como latest)
docker build -t caterchef-frontend:latest .

# 2. Levantar el contenedor mapeando el puerto nativo de Next.js
docker run -d -p 3000:3000 --name container-frontend caterchef-frontend:latest

# 3. Revisar logs del contenedor en tiempo real si es necesario
docker logs -f container-frontend

Suite de Testing Unitario
Se ha implementado una arquitectura de pruebas automatizadas con Jest para certificar la estabilidad de la interfaz web.

El Reto del App Router y su Solución (Mocking):
Debido al uso de componentes interactivos y hooks avanzados de Next.js 16 (useRouter, useSearchParams), la suite incorpora una técnica de Mocking en los componentes de prueba. Esto emula el comportamiento de las rutas de Next.js en el DOM virtual de Node sin necesidad de levantar un navegador real, evitando errores de montaje (app router to be mounted).

Comando para ejecutar los Tests:

# Ejecutar la suite completa de pruebas unitarias
npm run test

Integración Continua (CI/CD)
El repositorio se encuentra blindado mediante un pipeline en GitHub Actions (.github/workflows/frontend-ci.yml). En cada push o pull_request a las ramas main o dev, el servidor en la nube realiza una instalación limpia (npm ci) y un proceso de build estricto. Si la compilación no es exitosa, el pipeline se tiñe de rojo e impide el despliegue de versiones inestables.
```
