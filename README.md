# SheT Burger Stamp Card

Crea la aplicación web de tarjeta de fidelidad digital para la hamburguesería artesanal "SHET BURGER", utilizando el logo adjunto como identidad visual.

1. BRANDING Y DISEÑO:
- Utiliza la imagen adjunta como logo principal en la cabecera y tarjeta.
- Paleta inspirada en el logo: tonos rosa chicle/bubblegum (#F472B6 / #EC4899 / tonos pastel cálidos), blanco y contrastes limpios. Estilo moderno, retro-pop redondeado y acogedor.
- Diseño mobile-first con aspecto de app nativa.

2. FLUJO DE CLIENTES:
- Inicio rápido: buscar tarjeta ingresando su usuario de Instagram (ej: @usuario) o botón para registrarse por primera vez.
- Registro ágil: pide solo Nombre, Apellido y Usuario de Instagram (sin teléfono).
- Tarjeta Digital de Fidelidad:
  * Casilleros de sellos visuales (por defecto meta de 10 sellos con premio intermedio en el sello 5 y premio final en el 10, fácilmente configurables en código).
  * Código QR único identificador para cada cliente generado en pantalla.
  * Botón para compartir o guardar la tarjeta / enlace directo.
  * Sección de Términos y Condiciones con formato de borrador claro y editable.
  * Notificación visual destacada cuando la acumulación de sellos esté pausada por falta de stock.

3. PANEL DE ADMINISTRACIÓN / CONTROL:
- Acceso al panel con switch o botón dedicado (puede tener clave simple o acceso directo).
- Switch de Stock en tiempo real: Encendido/Apagado para pausar la acumulación de sellos cuando el local no tenga stock o esté cerrado, alertando a los clientes.
- Listado de clientes registrados: tabla/tarjetas con Nombre, Apellido, Instagram y cantidad de sellos.
- Control manual de sellos: botones rápidos (+) y (-) por cliente.
- Escáner QR con cámara: lector para escanear el QR del cliente desde el celular del cajero, identificar al cliente de inmediato y sumar el sello con confirmación visual festiva.

Implementa almacenamiento persistente en Lovable Cloud / backend para clientes, sellos y estado de stock.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cadd31f1-943f-44dc-8e2d-6be918788710).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
