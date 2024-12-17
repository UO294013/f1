class Calendario {

    // Constructor base
    constructor() {
        this.apiUrl = "https://ergast.com/api/f1/current.json";
    }

    // Método para realizar la consulta AJAX
    getSeasonRacesInfo() {
        $.ajax({
            url: this.apiUrl,
            method: "GET",
            dataType: "json",
            success: (data) => {
                const races = data.MRData.RaceTable.Races;
                var section = $("<section></section>");
                var raceNumber = 1;
    
                races.forEach(race => {
                    const raceName = race.raceName;
                    const circuitName = race.Circuit.circuitName;
                    const { lat, long } = race.Circuit.Location;
                    const dateTime = `${race.date} ${race.time}`;
    
                    // Crear un elemento <article> para cada carrera
                    const raceArticle = $(`
                        <article>
                            <h3>${raceNumber}. ${raceName}</h3>
                            <p>Circuito: ${circuitName}</p>
                            <p>Coordenadas: (${lat}, ${long})</p>
                            <p>Fecha y hora: ${dateTime}</p>
                        </article>
                    `);
    
                    section.append(raceArticle);
                    raceNumber++;
                });
                $("body").append(section);
                $("button").attr("disabled","disabled");
            },
            error: function(error) {
                console.error("Error al obtener la información de las carreras:", error);
            }
        });
    }
}

var calendario = new Calendario();
