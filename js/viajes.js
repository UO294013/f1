"use strict";
class Viaje {

    constructor() {
        this.longitud = null;
        this.latitud = null;
        this.precision = null;
        this.altitud = null;
        this.mensaje = null;

        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion) {
        this.longitud = Number(posicion.coords.longitude);
        this.latitud = Number(posicion.coords.latitude);
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;

        this.verTodo();
    }

    verTodo() {
        const main = document.querySelector("main");

        // Mapa estático
        const apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        const url = "https://maps.googleapis.com/maps/api/staticmap?";
        const centro = `center=${this.latitud},${this.longitud}`;
        const zoom = "&zoom=15";
        const tamaño = "&size=800x600";
        const marcador = `&markers=color:red%7Clabel:S%7C${this.latitud},${this.longitud}`;
        const sensor = "&sensor=false";
        const imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        const imgMapaEstatico = document.createElement("img");
        imgMapaEstatico.setAttribute("src", imagenMapa);
        imgMapaEstatico.setAttribute("alt", "Mapa estático de tu ubicación generado con la API de Google Maps");

        // Inserción de datos y generación de mapa dinámico
        const h3 = document.createElement("h3");
        h3.textContent = "Ubicación (Mapa estático):";
        main.appendChild(h3);
        main.appendChild(imgMapaEstatico);
        this.verMapaDinamico();
    }

    verMapaDinamico() {
        const main = document.querySelector("main");
        const divBlock = document.createElement("div");
        const centro = { lat: this.latitud, lng: this.longitud };
        const mapaGeoposicionado = new google.maps.Map(divBlock, {
            zoom: 12,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        const infoWindow = new google.maps.InfoWindow({
            position: centro,
            content: "Localización encontrada"
        });
        infoWindow.open(mapaGeoposicionado);
        mapaGeoposicionado.setCenter(centro);
        const h3 = document.createElement("h3");
        h3.textContent = "Ubicación (Mapa dinámico):";
        main.appendChild(h3);
        main.appendChild(divBlock);
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El permiso para obtener los datos de geolocalización está desactivado";
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible";
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado";
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido";
                break;
        }
        const infoSection = document.querySelector("section");
        infoSection.innerHTML = `<p>Error: ${this.mensaje}</p>`;
    }
}

// Inicializar clase
function initMap() {
    new Viaje();
}

// Aplicaión del scroll al carrusel
$(document).ready(function () {
    $("article").animate({scrollLeft: "+=200"}, 1000);
});

const slides = document.querySelectorAll("img");
const nextSlide = document.querySelector("button:nth-of-type(1)");
let curSlide = 0;
let maxSlide = slides.length - 1;

nextSlide.addEventListener("click", function () {
    if (curSlide === maxSlide) {
        curSlide = 0;
    } else {
        curSlide++;
    }

    slides.forEach((slide, indx) => {
  	    var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)')
    });
});

const prevSlide = document.querySelector("button:nth-of-type(2)");

prevSlide.addEventListener("click", function () {
    if (curSlide === 0) {
        curSlide = maxSlide;
    } else {
        curSlide--;
    }

    slides.forEach((slide, indx) => {
      	var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)')
    });
});
