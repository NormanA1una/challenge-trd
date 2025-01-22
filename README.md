# TRD Challenge

Este proyecto es una aplicación web moderna que permite a los usuarios gestionar perfiles con información personal y de facturación. La aplicación incluye características como visualización de fotos en carrusel, integración con servicios meteorológicos y manejo de datos de usuario.

## 🚀 Características Principales

- Gestión de perfiles de usuario
- Carrusel de fotos interactivo
- Integración con API de clima en tiempo real
- Manejo de información personal y de facturación
- Diseño responsivo y moderno
- Soporte para múltiples tipos de documentos
- Validación de números telefónicos internacionales

## 🛠️ Tecnologías Utilizadas

- **Next.js 14**: Framework de React para el frontend
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de CSS para estilos
- **Supabase**: Backend as a Service para base de datos y autenticación
- **Embla Carousel**: Biblioteca para el carrusel de imágenes
- **React International Phone**: Componente para números telefónicos internacionales
- **Open-Meteo API**: Servicio de datos meteorológicos

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta en Supabase

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd challenge-trd
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Ejecutar el proyecto en modo desarrollo**

   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Abrir el navegador**
   Navegar a `http://localhost:3000`

## 📝 Estructura del Proyecto

```
challenge-trd/
├── app/                    # Rutas y páginas de Next.js
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades, schemas y constantes
├── public/                 # Archivos estáticos
└── ...
```

## 🔧 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
