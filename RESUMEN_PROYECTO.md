Resumen del Plan de Proyecto: DecoEstilos

1. Objetivo General del Proyecto:
Desarrollar una tienda online funcional para "DecoEstilos", incluyendo un frontend público
para clientes y un dashboard de administración para la gestión de productos, todo
respaldado por una base de datos en la nube.

2. Estado Actual del Proyecto:
El frontend público ha sido migrado a Next.js y desplegado exitosamente en Vercel. El dashboard de administración también está en proceso de despliegue. Se han implementado mejoras significativas en la interfaz de usuario, la funcionalidad de búsqueda y la gestión de productos, y se han resuelto múltiples errores de compilación y configuración.

Mejoras de UI/UX (Storefront):
*   **Botón de WhatsApp Animado:** Implementado como un componente React dedicado (`WhatsAppButton.tsx`) con estilos CSS Modules (`WhatsAppButton.module.css`) para animaciones complejas (pulso, vibración del icono, texto desplegable al pasar el cursor). Se instaló la dependencia `react-icons`.
*   **Secciones "Nosotros" e "Inspiración":** Implementado un sistema de control de visibilidad basado en `UIContext`. Las secciones están ocultas por defecto y se muestran dinámicamente al hacer clic en sus respectivos enlaces en la barra de navegación. (Funcionalidad corregida y refactorizada).
*   **Carrusel Móvil:** Ajustada la configuración de Swiper en `ProductCarousels.tsx` para mostrar 1.5 tarjetas en la vista móvil, mejorando la visualización.
*   **Botones "Añadir al Carrito":** Hechos más redondeados en las tarjetas de producto y en la página de detalle.
*   **Etiquetas de Producto:** Implementadas con colores dinámicos según el tipo de etiqueta (ej. "a medida", "15% dcto").

Funcionalidad de Búsqueda (Storefront):
*   **Búsqueda Robusta:** Implementada una página de búsqueda dedicada (`/search`) con funcionalidad de búsqueda de productos insensible a mayúsculas/minúsculas y con normalización de acentos (ej. "baño" -> "bano").
*   **Experiencia de Usuario:** La página de resultados de búsqueda ahora se desplaza automáticamente a la altura de los productos encontrados.

Gestión de Productos (Dashboard):
*   **Formulario de Producto:** Refactorizado para una estrategia de actualización de variantes más robusta y eficiente (usando `upsert` y eliminación selectiva en lugar de borrar y reinsertar todo).
*   **Manejo de IDs de Variantes:** Implementado un manejo robusto de IDs para variantes nuevas y existentes, resolviendo errores de inserción de IDs auto-incrementales.
*   **Estilo de Botones:** Botones "Añadir Producto" hechos redondeados y de color azul metálico.

Resolución de Errores Críticos de Compilación y Tipado:
*   Se han resuelto numerosos errores que impedían el despliegue en entornos de producción, incluyendo:
    *   Errores de tipos en `product/[id]/page.tsx` (definición de props y compatibilidad de tipos).
    *   **Error de ESLint `@typescript-eslint/no-explicit-any`:** Resuelto en `dashboard-nextjs/src/app/products/product-form.tsx` mediante la definición explícita de tipos para `variantData`.
    *   Errores de comillas sin escapar en `page.tsx`.
    *   Conflictos de versiones de dependencias (`next`, `react`, `eslint`) mediante la actualización a versiones estables.
    *   Problemas de configuración del build de Next.js (`next.config.js` y `output: 'standalone'`).
    *   Conflictos de enrutamiento en Netlify (mediante la eliminación de `netlify.toml` y `_redirects`).
    *   Errores de ESLint (`@typescript-eslint/no-unused-vars`, `@next/next/no-img-element`).
    *   Errores de "React Hook only works in a Client Component" (añadido `use client` a componentes necesarios).
    *   **Error al actualizar variantes existentes (`cannot insert a non-DEFAULT value into column "id"`):** Resuelto en `dashboard-nextjs/src/app/products/product-form.tsx` al cambiar la estrategia de actualización de variantes. Para variantes existentes, se utiliza una llamada `update` explícita a Supabase (en lugar de `upsert` con `onConflict: 'id'`), asegurando que la base de datos realice una actualización y no intente insertar un `id` en una columna `GENERATED ALWAYS AS IDENTITY`.

3. Arquitectura y Tecnologías Clave:

* Frontend Público (Tienda Online):
    * Ubicación: /Users/jesuco1203/Documents/Deco_estilos/storefront-nextjs/
    * Tecnologías: Next.js, React, TypeScript, Tailwind CSS, Swiper.js.
    * Conexión a DB: Se conecta a Supabase (lectura para productos).

* Dashboard de Administración:
    * Ubicación: /Users/jesuco1203/Documents/Deco_estilos/dashboard-nextjs/
    * Tecnologías: Next.js, React, TypeScript, Supabase JS Client, React Router DOM, Tailwind CSS.
    * Conexión a DB: Se conecta a Supabase (lectura/escritura para gestión de productos y
      variantes).

* Backend / Base de Datos / Autenticación:
    * Plataforma: Supabase
    * Base de Datos: PostgreSQL
    * Funcionalidades: Almacenamiento de productos y variantes, autenticación de usuarios
      (para el dashboard), API auto-generada para operaciones CRUD.

4. Avances Realizados (Fases Completadas):
(Mantener las fases 1, 2, 3, 4 como están, ya que describen el progreso histórico. Añadir una nueva sección para "Avances Recientes" o "Mejoras Adicionales".)

5. Tareas Pendientes (Próximos Pasos):

*   **Finalizar Carrito de Compras (Storefront):**
    *   Implementar la lógica de `ProductOptions.tsx` para seleccionar variantes.
    *   Conectar el botón "Agregar al Carrito" para actualizar el estado global (`CartContext`).
    *   Implementar la funcionalidad completa del `CartModal.tsx` (ver, actualizar, eliminar productos).
    *   Reimplementar el proceso de checkout básico.
*   **Implementación de Wishlist (Favoritos) con Backend Anónimo:**
    *   **Estado Actual:** La lógica frontend (`WishlistContext.tsx`), los botones de corazón (`ProductCard.tsx`, `ProductOptions.tsx`), la página de favoritos (`wishlist/page.tsx`), la Edge Function (`supabase/functions/wishlist/index.ts`) y su configuración de variables de entorno (`SB_URL`, `SB_SERVICE_ROLE_KEY`) están implementados y desplegados.
    *   **PENDIENTE CRÍTICO:** La base de datos **NO** tiene la tabla `contacts` ni la columna `contact_id` en `wishlists`. **Es IMPRESCINDIBLE ejecutar el siguiente SQL en el SQL Editor de Supabase para que la funcionalidad de wishlist con identificación funcione:**
        ```sql
        -- Crear la tabla contacts
        create table if not exists contacts (
          id uuid primary key default gen_random_uuid(),
          email text unique,
          phone text unique,
          created_at timestamptz default now()
        );

        -- Añadir la columna contact_id a la tabla wishlists
        alter table wishlists
        add column if not exists contact_id uuid references contacts(id);
        ```
    *   **Próximos Pasos (una vez ejecutado el SQL):**
        *   Implementar el modal de identificación (`IdentifyModal.tsx`).
        *   Actualizar `WishlistContext.tsx` para disparar el modal y vincular el `anon_id` con el `contact_id`.
        *   Añadir la ruta `/identify` a la Edge Function `wishlist`.
*   **Despliegue del Dashboard:**
    *   Desplegar el panel de administración (`dashboard-nextjs`) en Vercel (se han resuelto los errores de compilación, y el despliegue ya está funcionando).
*   **Pruebas Finales:**
    *   Realizar pruebas de integración completas en el entorno de producción (Vercel).
    *   Revisar y optimizar el rendimiento general del sitio.
*   **Imágenes de Producto (Dashboard):** Las imágenes externas ahora se cargan (configuración `remotePatterns` en `next.config.ts`), pero se recomienda migrar las imágenes a Supabase Storage para una gestión unificada y mejor rendimiento.
*   **Búsqueda de Productos (Storefront):** La búsqueda de términos con caracteres especiales (ej. "baño") aún puede no funcionar correctamente si los datos en la base de datos no están normalizados de la misma manera. La normalización actual solo afecta el término de búsqueda del usuario.
*   **Implementación de AR (Propuesta):** Evaluar la propuesta de integrar una funcionalidad de Realidad Aumentada ("Ver en tu pared") como una micro-aplicación ("/ar") separada dentro del mismo repositorio.

6. Estructura de Carpetas Relevantes:

* Frontend Público (Antiguo): /Users/jesuco1203/Documents/Deco_estilos/ (contiene index.html, product-detail.html)
* Frontend Público (Nuevo - Next.js): /Users/jesuco1203/Documents/Deco_estilos/storefront-nextjs/
* Dashboard: /Users/jesuco1203/Documents/Deco_estilos/dashboard-nextjs/

7. Credenciales de Supabase:

* Project URL: https://qehmrxrrtestgxvqjjze.supabase.co
* Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaG1yeHJydGVzdGd4dnFqanplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTI2OTIsImV4cCI6MjA3MTg4ODY5Mn0.hGXhKwBh-gNjx1sq195nnOdOm2yg2NcHvigF9RkCeAc
  (Nota: Estas claves están directamente en el código JavaScript de `main.js` y `product-detail.js` para el frontend antiguo, y en las variables de entorno para el dashboard y el nuevo frontend Next.js).