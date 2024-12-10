class Fondo {

    // Constructor base
    constructor(nombre_pais, nombre_capital, nombre_circuito) {
        this.pais = nombre_pais;
        this.capital = nombre_capital;
        this.circuito = nombre_circuito;
        this.getFondo();
    }

    // Método para realizar la consulta AJAX
    getFondo() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickrAPI, 
        {
            tags: this.circuito + ", F1",
            tagmode: "all",
            format: "json"
        }).done(function(data) {
            $("body").css({
                "background-image": `url(${data.items[0].media.m.replace('_m', '_b')})`,
                "height": "100vh",
                "width": "100vw",
                "background-size": "cover",
                "background-repeat": "no-repeat",
                "background-position": "center"
            });
        });
    }
}
