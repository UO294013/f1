class Pais { 
    
    constructor (nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuito = '';
        this.gobierno = '';
        this.coordenadas_circuito = {
            longitud: '',
            latitud: '',
            altitud: ''
        };
        this.religion = '';
    }

    completarInfo(circuito, gobierno, longitud, latitud, altitud, religion) {
        this.circuito = circuito;
        this.gobierno = gobierno;
        this.coordenadas_circuito.longitud = longitud;
        this.coordenadas_circuito.latitud = latitud;
        this.coordenadas_circuito.altitud = altitud;
        this.religion = religion;
    }

    getNombre() {
        return ("<p>Pais: " + this.nombre + "</p>");
    }

    getCapital() {
        return "<p>Capital: " + this.capital + "</p>";
    }

    getInfoSecundaria() {
        const info = {
            circuito: this.circuito,
            poblacion: this.poblacion,
            formaGobierno: this.gobierno,
            religionMayoritaria: this.religion
        };

        let listaHTML = '<ul>' + 
                        '<li>Circuito de F1: ' + info.circuito + '</li>' +
                        '<li>Población: ' + info.poblacion + ' habitantes</li>' +
                        '<li>Forma de Gobierno: ' + info.formaGobierno + '</li>' +
                        '<li>Religión mayoritaria: ' + info.religionMayoritaria + '</li>' +
                        '</ul>';
                         
        return listaHTML;
    }

    escribirCoordenadas() {
        document.write('<p>Coordenadas del circuito de Spa-Francorchamps: ' + 
                            '[Longitud: ' + this.coordenadas_circuito.longitud + 
                            ', Latitud: ' + this.coordenadas_circuito.latitud +
                            ', Altitud: ' + this.coordenadas_circuito.altitud + ' metros]</p>');
    }

    getMeteorologia() {
        var apiKey = "1003353b5af2c3f05e6116b9576d31b1";
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.coordenadas_circuito.latitud}&lon=${this.coordenadas_circuito.longitud}&appid=${apiKey}&mode=xml&lang=es&units=metric`;
    
        $.ajax({
            url: url,
            method: "GET",
            dataType: "xml",
            success: (data) => {
                var forecastList = $(data).find("time");
                var daysData = {};
                var dayCounter = 0;
    
                forecastList.each(function() {
                    if (dayCounter >= 5) {
                        return false;
                    }

                    var fecha = $(this).attr("from").split("T")[0]; // Solo fecha (sin hora)
    
                    if (!daysData[fecha]) {
                        daysData[fecha] = {
                            maxTemp: -Infinity,
                            minTemp: Infinity,
                            totalHumidity: 0,
                            humidityCounter: 0,
                            totalRain: 0,
                            iconCounter: {}
                        };
                        dayCounter++;
                    }
    
                    var maxTemp = parseFloat($(this).find("temperature").attr("max"));
                    var minTemp = parseFloat($(this).find("temperature").attr("min"));
                    var humedad = parseFloat($(this).find("humidity").attr("value"));
                    var lluvia = parseFloat($(this).find("precipitation").attr("value") || 0);
                    var icono = $(this).find("symbol").attr("var");
    
                    if (maxTemp > daysData[fecha].maxTemp) {
                        daysData[fecha].maxTemp = maxTemp;
                    }
                    if (minTemp < daysData[fecha].minTemp) {
                        daysData[fecha].minTemp = minTemp;
                    }

                    daysData[fecha].totalHumidity += humedad;
                    daysData[fecha].humidityCounter++;
                    daysData[fecha].totalRain += lluvia;
    
                    if (!daysData[fecha].iconCounter[icono]) {
                        daysData[fecha].iconCounter[icono] = 0;
                    }
                    daysData[fecha].iconCounter[icono]++;
                });
    
                var section = $("<section></section>");
    
                // Procesamiento de datos
                Object.keys(daysData).forEach(fecha => {
                    var data = daysData[fecha];
                    
                    var avgHumidity = Math.round(data.totalHumidity / data.humidityCounter);
                    var maxTempRounded = data.maxTemp.toFixed(1);
                    var minTempRounded = data.minTemp.toFixed(1);
    
                    var mostFrequentIcon = Object.keys(data.iconCounter).reduce((a, b) => data.iconCounter[a] > data.iconCounter[b] ? a : b);
                    var iconUrl = `https://openweathermap.org/img/wn/${mostFrequentIcon}@2x.png`;
    
                    // Crear un articulo por dia
                    var article = $("<article></article>");
                    article.append(`<h3>Dia: ${fecha}</h3>`);
                    article.append(`<p>Temperatura máxima: ${maxTempRounded}°C</p>`);
                    article.append(`<p>Temperatura minima: ${minTempRounded}°C</p>`);
                    article.append(`<p>Humedad media: ${avgHumidity}%</p>`);
                    article.append(`<p>Lluvia total: ${data.totalRain.toFixed(1)} mm</p>`);
                    article.append(`<img src="${iconUrl}" alt="Icono del clima">`);
                    section.append(article);
                });
                $("body").append(section);
            },
            error: (error) => {
                console.error("Error al realizar la consulta al servicio de meteorologia:", error);
            }
        });
    }
}
