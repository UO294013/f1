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
        if (navigator.geolocation) {
            this.longitud = Number(posicion.coords.longitude);
            this.latitud = Number(posicion.coords.latitude);
            this.precision = posicion.coords.accuracy;
            this.altitud = posicion.coords.altitude;
        }
    }

    verTodo() {
        const main = document.querySelector("main");

        // Mapa estático
        const apiKey = "&key=AIzaSyDfmip4lu4OXDuJ-DSiuoXLYb26CCQQEGk";
        const url = "https://maps.googleapis.com/maps/api/staticmap?";
        const centro = `center=${this.latitud},${this.longitud}`;
        const zoom = "&zoom=15";
        const tamaño = "&size=800x600";
        const marcador = `&markers=color:red%7Clabel:S%7C${this.latitud},${this.longitud}`;
        const sensor = "&sensor=false";
        const imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        const imgMapaEstatico = document.createElement("img");
        imgMapaEstatico.src = imagenMapa
        imgMapaEstatico.alt = "Mapa estático de tu ubicación generado con la API de Google Maps";
        
        // Inserción de datos y generación de mapa dinámico
        const h3 = document.createElement("h3");
        h3.textContent = "Ubicación (Mapa estático):";
        main.insertBefore(imgMapaEstatico, main.children[1]);
        main.insertBefore(h3, imgMapaEstatico);
        this.verMapaDinamico();
    }

    verMapaDinamico() {
        const divBlock = document.querySelector("div");
        divBlock.removeAttribute("hidden");
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

        const main = document.querySelector("main");
        const h3 = document.createElement("h3");
        h3.textContent = "Ubicación (Mapa dinámico):";
        main.insertBefore(h3, divBlock);
    }

    verErrores(error) {
        const main = document.querySelector("main");
        const buttonCargar = document.querySelector("main>button");
        buttonCargar.remove();
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
        const p = document.createElement("p");
        p.textContent = "No se han podido cargar los mapas estático y dinámico. Compruebe su ubicación y los permisos de geolocalización.";
        main.insertBefore(p, main.children[1]);
    }
}

var viaje = new Viaje();

let buttonCargarMapa = document.querySelector("main>button");
buttonCargarMapa.addEventListener("click", function () {
    viaje.verTodo();
    buttonCargarMapa.setAttribute("hidden", "");
});

// Aplicaión del scroll al carrusel
$(document).ready(function () {
    $("article").animate({scrollLeft: "+=200"}, 1000);
});

const slides = document.querySelectorAll("img");
const nextSlide = document.querySelector("article button:nth-of-type(1)");
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

const prevSlide = document.querySelector("article button:nth-of-type(2)");

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
