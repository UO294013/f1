class Circuito {

    constructor() {
        // Control de evento cuando se introduce un XML al primer file chooser
        document.addEventListener("DOMContentLoaded", () => {
            const archivoInputXML = document.querySelector("input[type='file'][accept='.xml']");
            archivoInputXML.addEventListener("change", e => {
                this.leerArchivoXML(e);
            });
            const archivoInputKML = document.querySelector("input[type='file'][accept='.kml']");
            archivoInputKML.addEventListener("change", e => {
                this.procesarKML(e);
            });
            const archivoInputSVG = document.querySelector("input[type='file'][accept='.svg']");
            archivoInputSVG.addEventListener("change", e => {
                this.procesarSVG(e);
            });
        });
    }

    // Función para leer el archivo XML
    leerArchivoXML(event) {
        const archivo = event.target.files[0];
        const areaTexto = document.querySelector("main>section");
        const errorLectura = document.querySelector("main>p:nth-of-type(1)");
        errorLectura.innerText = "";
        areaTexto.innerText = ""; // Limpia el área de texto

        if (archivo && archivo.type === "text/xml") {
            const lector = new FileReader();
            lector.onload = (e) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, "application/xml");
                
                if (xmlDoc.documentElement.nodeName === "parsererror") {
                    errorLectura.innerText = "Error: Archivo XML no válido.";
                    return;
                }

                const infoExtraida = this.procesarXML(xmlDoc);
                areaTexto.innerText = infoExtraida || "No se encontró información relevante en el archivo XML.";
            };
            lector.readAsText(archivo);
        } else {
            errorLectura.innerText = "Error: ¡¡¡Archivo no válido!!! Por favor, selecciona un archivo XML.";
        }
    }

    // Función para extraer y procesar los datos del XML
    procesarXML(xmlDoc) {
        const section = document.querySelector("main>section");
        const circuitos = xmlDoc.querySelectorAll("circuito");

        circuitos.forEach(circuito => {
            const p = document.createElement("p");
            p.textContent = "Datos del circuito: ";
            section.appendChild(p);

            // Extracción de los atributos y elementos hijos simples del nodo <circuito>
            const nombre = circuito.getAttribute("nombre");
            const longitud = circuito.getAttribute("longitud_circuito");
            const localidad = circuito.getAttribute("localidad");
            const pais = circuito.getAttribute("pais");

            // La propiedad ?.xxx se utiliza para consultar la existencia del nodo
            const vueltas = circuito.querySelector("vueltas")?.textContent;
            const anchuraMedia = circuito.querySelector("anchura_media")?.textContent;
            const fecha = circuito.querySelector("fecha2024")?.textContent;
            const hora = circuito.querySelector("hora_inicio_españa")?.textContent;

            // Incorporación los elementos del XML al HTML
            const generarEtiqueta = (section, nombre, valor) => {
                const p = document.createElement("p");
                p.textContent = `${nombre}: ${valor}`;
                section.appendChild(p);
            };

            if (nombre) {
                generarEtiqueta(section, "Nombre del circuito", nombre);
            }
            if (longitud) {
                generarEtiqueta(section, "Longitud del circuito", longitud + " metros");
            }
            if (localidad) {
                generarEtiqueta(section, "Localidad", localidad);
            }
            if (pais) {
                generarEtiqueta(section, "País", pais);
            }
            if (vueltas) {
                generarEtiqueta(section, "Número de vueltas", vueltas);
            }
            if (anchuraMedia) {
                generarEtiqueta(section, "Anchura media de la pista", anchuraMedia + " metros");
            }
            if (fecha) {
                generarEtiqueta(section, "Fecha de la carrera (Temporada 2024)", fecha);
            }
            if (hora) {
                generarEtiqueta(section, "Hora de inicio de la carrera (hora española)", hora);
            }

            // El timeout ayuda a actualizar el DOM para cargar todos los elementos del XML y evitar condiciones de carrera
            setTimeout(() => {
                // Procesamiento de las referencias
                const pRefs = document.createElement("ul");
                pRefs.textContent = "Referencias: ";
                const referencias = circuito.querySelectorAll("referencias>referencia");
                referencias.forEach(referencia => {
                    const li = document.createElement("li");
                    const ref = document.createElement("a");
                    ref.href = referencia.textContent.trim();
                    ref.target = "_blank";
                    ref.textContent = referencia.textContent.trim();
                    li.appendChild(ref);
                    pRefs.appendChild(li);
                });
                section.appendChild(pRefs);

                // Procesamiento de las fotos
                const pFotos = document.createElement("p");
                pFotos.textContent = "Imágenes: ";
                section.appendChild(pFotos);
                const fotos = circuito.querySelectorAll("fotos foto");
                fotos.forEach(foto => {
                    const img = document.createElement("img");
                    img.src = `./xml/${foto.textContent.trim()}`;
                    img.alt = `Foto del circuito ${nombre || "desconocido"}`;
                    // Manejo de errores al cargar la imagen
                    section.appendChild(img);
                });

                // Procesamiento de los videos
                const pVideo = document.createElement("p");
                pVideo.textContent = "Vídeos: ";
                section.appendChild(pVideo);
                const videos = circuito.querySelectorAll("videos video");
                videos.forEach(video => {
                    const vid = document.createElement("video");
                    vid.src = `./xml/${video.textContent.trim()}`;
                    vid.controls = true;
                    section.appendChild(vid);
                });

                // Procesamiento de las coordenadas de la línea de meta
                const coordenadaMeta = circuito.querySelector("coordenadas coordenada");
                if (coordenadaMeta) {
                    const longitudMeta = coordenadaMeta.getAttribute("longitud");
                    const latitudMeta = coordenadaMeta.getAttribute("latitud");
                    const altitudMeta = coordenadaMeta.getAttribute("altitud");
                    generarEtiqueta(section, "Coordenadas del circuito (Centro de la pista)", `Longitud: ${longitudMeta}, Latitud: ${latitudMeta}, Altitud: ${altitudMeta} metros`);
                }

                // Procesamiento de los tramos
                const tramos = circuito.querySelectorAll("tramos tramo");
                tramos.forEach((tramo, num_tramo) => {
                    const distancia = tramo.getAttribute("distancia");
                    const numeroSector = tramo.getAttribute("numero_sector");
                    const coordTramo = tramo.querySelector("coordenada");
                    const longitudTramo = coordTramo?.getAttribute("longitud");
                    const latitudTramo = coordTramo?.getAttribute("latitud");
                    const altitudTramo = coordTramo?.getAttribute("altitud");
                    generarEtiqueta(section, 
                        `-> Tramo ${num_tramo + 1}`, 
                        `Distancia: ${distancia} metros, 
                        Sector: ${numeroSector}, 
                        (Longitud: ${longitudTramo}, 
                        Latitud: ${latitudTramo}, 
                        Altitud: ${altitudTramo} metros)`);     
                });
            }, 0);
        });

        return section.innerText;
    }

    // Inicialización del mapa para el KML
    initMap() {
        // Coordenadas centrales aproximadas de Spa-Francorchamps para crear el mapa enfocado al circuito
        const spaCoords = { lat: 50.4371, lng: 5.9718 };
        const main = document.querySelector("main");
        const label = document.querySelector("main>label:nth-of-type(3)");
        const map = document.createElement("div");
        main.insertBefore(map, label);
        this.mapa = new google.maps.Map(document.querySelector("div"), {
            zoom: 14, // Zoom para mostrar la zona cercana al circuito
            center: spaCoords
        });
    }

    // Función para manejar el archivo KML
    procesarKML(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const kmlText = e.target.result;
            this.parseKML(kmlText);
        };
        reader.readAsText(file);
    }

    // Función para parsear el contenido del archivo KML
    parseKML(kmlText) {
        // Generación del parser (IMPORTANTE notificar que el archivo a parsear es un XML)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, "application/xml");
        // Extracción de las coordenadas de la etiqueta <coordinates>
        const coordinates = [];
        const coordsNodes = xmlDoc.getElementsByTagName('coordinates');
        if (coordsNodes.length > 0) {
            const coordinatesText = coordsNodes[0].textContent.trim();
            const coordArray = coordinatesText.split(/\s+/); // Split de las coordenadas por espacios (acorde al formato de circuito.kml)
            // Conversión de coordenadas (a formato lat, lng)
            coordArray.forEach(coord => {
                const [lng, lat] = coord.split(',').map(parseFloat);
                if (!isNaN(lat) && !isNaN(lng)) {
                    coordinates.push({ lat, lng });
                }
            });
            this.drawCircuit(coordinates);
        }
    }

    // Función para dibujar la polyline en el mapa (unir los puntos del KML)
    drawCircuit(coordinates) {
        this.initMap();
        // Creación del objeto Polyline
        const spaPolyline = new google.maps.Polyline({
            path: coordinates,  // Coordenadas extraídas del KML
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4
        });
        // Se dibuja la polyline en el mapa
        spaPolyline.setMap(this.mapa);
        // Se ajusta el mapa para enfocar totalmente al circuito
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        this.mapa.fitBounds(bounds);
        const p = document.querySelector("main>input[type='file'][accept='.kml']~p");
        p.remove();
    }

    // Procesamiento del archivo SVG
    procesarSVG(e) {
        const file = e.target.files[0];
        if (file && file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = (event) => {
                const main = document.querySelector("main");
                const svgContent = event.target.result;
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
                const svgElement = svgDoc.documentElement;
                const viewBox = svgElement.getAttribute("viewBox");
                if (!viewBox) {
                    const width = svgElement.getAttribute("width");
                    const height = svgElement.getAttribute("height");
                    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`); /* To allow to resize the SVG */
                }
                main.appendChild(svgElement);
            };
            reader.readAsText(file);
            const p = document.querySelector("main>input[type='file'][accept='.svg']~p");
            p.remove();
        }
    }
}
