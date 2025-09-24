
// Inicializa mapa
const map = L.map('map', { zoomControl: true });
map.whenReady(updateLabelsForZoom);
map.on('zoomend', updateLabelsForZoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

map.on('zoomend', () => {
  const z = map.getZoom();
  const show = z >= 11; // ejemplo
  document.querySelectorAll('.label-distrito').forEach(el => {
    el.style.display = show ? 'block' : 'none';
  });
});

const estiloBase = () => ({ weight: 1, color: '#333', fillOpacity: 0.12, fillColor: '#4da3ff' });

function hoverOn(e){
  const l = e.target;
  l.setStyle({ weight: 2, color: '#000', fillOpacity: 0.55 });
  l.bringToFront();
  map.getContainer().style.cursor = 'pointer';
}
function hoverOff(e){
  // vuelve al estilo base (misma fillColor estable)
  distritosLayer.resetStyle(e.target);
  map.getContainer().style.cursor = '';
}

let distritosLayer;
let lastData;

function onEachFeature(feature, layer) {
  const props = feature.properties || {};
  const nombre = (props[CAMPO_NOMBRE] || '').toString().trim();
  const url = CAMPO_LINK ? (props[CAMPO_LINK] || '').toString().trim() : '';

  if (nombre) {
    // Tooltip permanente
    layer.bindTooltip(nombre, {
      permanent: true,
      direction: "center", // aparece centrado en el polígono
      className: "label-distrito"
    });
  }

  layer.on({
    mouseover: hoverOn,
    mouseout: hoverOff,
    click: () => {
      if (url) {
        window.open(url, '_blank');
      } else {
        alert(`No hay link configurado para: ${nombre || '(sin nombre)'}`);
      }
    }
  });
}




fetch('./data/lima_callao_distritos.geojson')
  .then(r => r.json())
  .then(data => {
    lastData = data;
    distritosLayer = L.geoJSON(data, { style: estiloPorDistrito, onEachFeature }).addTo(map);
    if (distritosLayer.getBounds().isValid()) {
      map.fitBounds(distritosLayer.getBounds(), { padding: [20,20] });
    }
    // 3) Tras crear la capa inicial (ya existen las tooltips en el DOM)
    updateLabelsForZoom();
  });



// Búsqueda simple por nombre (filtra en cliente)
const input = document.getElementById('search');
input.addEventListener('input', () => {
  const q = input.value.trim().toLowerCase();
  if (!lastData) return;
  if (distritosLayer) distritosLayer.remove();

  const filtered = {
    ...lastData,
    features: lastData.features.filter(f => {
      const props = f.properties || {};
      const nombre = (props[CAMPO_NOMBRE] || '').toString().toLowerCase();
      return nombre.includes(q);
    })
  };

  distritosLayer = L.geoJSON(filtered, { style: estiloPorDistrito, onEachFeature }).addTo(map);
  if (distritosLayer.getBounds().isValid()) map.fitBounds(distritosLayer.getBounds(),
   { padding: [20,20] 

  }

);
}

);

function updateLabelsForZoom() {
  const show = map.getZoom() >= 12; // umbral a gusto
  document.querySelectorAll('.label-distrito').forEach(el => {
    el.style.display = show ? 'block' : 'none';
  });
}


const colorCache = new Map();
function colorFor(key) {
  if (!key) return '#cccccc';
  if (colorCache.has(key)) return colorCache.get(key);

  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0; // hash simple
  }
  h = h % 360; // 0..359
  const color = `hsl(${h}, 65%, 60%)`;
  colorCache.set(key, color);
  return color;
}

function estiloPorDistrito(feature) {
  const props = feature.properties || {};
  const nombre = (props[CAMPO_NOMBRE] || '').toString().trim();
  return {
    weight: 1,
    color: '#333',
    fillOpacity: 0.4,
    fillColor: colorFor(nombre) // <- estable
  };
}

