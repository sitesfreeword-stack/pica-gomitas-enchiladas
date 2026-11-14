# PICA — Gomitas enchiladas

Sitio escolar multipágina para presentar un concepto juvenil de gomitas enchiladas. Usa HTML, CSS y JavaScript sin framework ni paso de compilación.

## Estructura

```text
gomitasEnchiladas/
├── index.html                 # Portada y carrusel de productos
├── pages/
│   ├── tienda.html            # Catálogo y opciones
│   ├── carrito.html           # Carrito demostrativo
│   ├── nosotros.html          # Equipo y contexto escolar
│   └── contacto.html          # Formulario de demostración
├── assets/
│   ├── css/site.css            # Sistema visual y responsive
│   ├── js/site.js              # Navegación, carrusel y carrito
│   └── img/ASSETS.md           # Fuentes de imágenes y video
├── README.md
└── PROYECTO.md
```

## Abrir

Usa una extensión de servidor estático (por ejemplo, Live Server en VS Code) y abre `index.html`. También puedes iniciar uno desde esta carpeta con `python -m http.server 8000 --bind 127.0.0.1` y visitar `http://127.0.0.1:8000/`. No abras el archivo con doble clic: YouTube bloquea el reproductor incrustado bajo `file://` porque no recibe un encabezado HTTP `Referer`; la página mostrará una vista previa y un enlace externo en ese caso. Servirlo desde localhost permite que el reproductor reciba el origen.

## Funciones

- Catálogo con seis opciones de ejemplo, cantidades y precios ilustrativos en COP.
- Carrusel horizontal con botones anterior/siguiente, desplazamiento táctil y botón de agregado rápido.
- Acceso flotante al carrito, siempre visible, con panel lateral para cambiar cantidades y revisar el subtotal.
- Carrito persistente en el navegador con `localStorage`.
- Video externo cargado de forma anticipada, con intento de autoplay silenciado y enlace alternativo a YouTube.
- Navegación adaptada a móvil y animaciones con respeto a `prefers-reduced-motion`.

## Antes de publicar

1. Confirma las presentaciones, precios e información del producto con el equipo: el catálogo y sus precios actuales son solo ejemplos.
2. El botón del carrito abre WhatsApp con el pedido escrito para revisión y envío. El sitio no cobra ni confirma disponibilidad o entrega; el equipo acuerda esos detalles por chat.
3. El formulario de contacto es demostrativo y no envía ni guarda mensajes; hace falta un correo o servicio real para habilitarlo.
4. Las fotografías de referencia son de gomitas, no fotos del producto PICA. Sustitúyelas por fotos propias para representar el producto real.
5. Al publicar bajo un dominio, añade URL canónica, `sitemap.xml` y `robots.txt` con ese dominio.

## SEO y accesibilidad

Cada página tiene título, descripción, Open Graph, idioma español, contenido semántico y diseño responsive. Las imágenes tienen texto alternativo. Los controles del carrusel y del carrito usan etiquetas accesibles.
