# SHET BURGER — Tarjeta de fidelidad digital

App móvil (web) con estética rosa chicle retro-pop, usando el logo adjunto.

## 1. Identidad visual
- Logo subido como imagen principal en cabecera y tarjeta.
- Paleta rosa chicle (#F472B6 / #EC4899), rosas pastel cálidos y blanco, bordes muy redondeados, sombras suaves, tipografía redondeada tipo pop.
- Todo mobile-first, con aspecto de app nativa (barra superior fija, botones grandes).

## 2. Pantalla de inicio
- Buscar mi tarjeta escribiendo el usuario de Instagram (@usuario).
- Botón "Registrarme por primera vez".
- Aviso destacado si la acumulación de sellos está pausada.

## 3. Registro
- Solo Nombre, Apellido y Usuario de Instagram. Sin teléfono.
- Validación de usuario único; al registrarse entra directo a su tarjeta.

## 4. Tarjeta de fidelidad
- 10 casilleros de sellos visuales; premio intermedio en el 5 y premio final en el 10 (valores configurables en un archivo de configuración).
- Código QR único por cliente generado en pantalla.
- Botón para compartir/copiar el enlace directo a su tarjeta.
- Cartel llamativo cuando los sellos están pausados por falta de stock o local cerrado.
- Términos y condiciones en texto borrador, fácil de editar.

## 5. Panel de administración
- Acceso con clave simple desde un botón discreto.
- Interruptor de stock encendido/apagado en tiempo real, que bloquea sumar sellos y avisa a los clientes.
- Listado de clientes (nombre, apellido, Instagram, sellos) con buscador.
- Botones rápidos (+) y (−) por cliente.
- Escáner QR con la cámara del celular: identifica al cliente y suma el sello con confirmación festiva (animación y mensaje).

## 6. Datos y detalles técnicos
- Se activa Lovable Cloud para guardar clientes, sellos y estado de stock de forma permanente.
- Tablas: `customers` (nombre, apellido, instagram único, sellos, premios canjeados) y `store_settings` (stock activo).
- Lectura pública de la tarjeta por enlace; las modificaciones de sellos y el interruptor de stock pasan por funciones de servidor protegidas con la clave de administración.
- Librerías: generación de QR en pantalla y lector de QR por cámara.
- Rutas: inicio `/`, registro, tarjeta `/t/@usuario`, panel `/admin`.

## Pendiente de confirmar
- La clave del panel: se dejará una inicial y se puede cambiar cuando quieras.
- Textos de los premios (sello 5 y sello 10): se ponen textos de ejemplo editables.
