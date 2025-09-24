
# Leaflet — Distritos Lima & Callao con enlaces

Proyecto mínimo para visualizar tu GeoJSON y abrir un enlace por distrito al hacer clic.

## Estructura
```
leaflet-lima-callao-demo/
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ app.js
└─ data/
   └─ lima__callao_distritos.geojson
```

- El archivo GeoJSON ya está colocado en `data/`.
- El proyecto intenta detectar automáticamente el nombre del campo del distrito y el campo `link`.
  - Detectado: CAMPO_NOMBRE = `DISTRITO`
  - Detectado: CAMPO_LINK   = `link`

Si tu campo de nombre o link es diferente, edítalo en `index.html`:
```html
<script>
  const CAMPO_NOMBRE = "DISTRITO";
  const CAMPO_LINK   = "link";
</script>
```

## Cómo ejecutar
Abre una terminal dentro de la carpeta y levanta un servidor estático, por ejemplo con Python 3:

```bash
cd leaflet-lima-callao-demo
python -m http.server 8000
```

Luego abre: http://localhost:8000

## Personalización
- Para abrir en nueva pestaña en lugar de redirigir en la misma, cambia en `app.js`:
```js
window.location.href = url;
// por:
window.open(url, '_blank');
```
- El cuadro de búsqueda filtra por el nombre del distrito.
- Puedes reemplazar el GeoJSON en `data/` por otra versión con más distritos y mantener la misma estructura.
