class Noticias {

    constructor() {
        // Comprobar que el navegador soporta API File
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {  
            document.write("<p>¡ATENCIÓN! Este navegador NO soporta el API File, por tanto, el programa puede no funcionar correctamente</p>");
        }
    }

    // Método para leer las noticias de un fichero .txt
    readInputFile(files) {
        var archivo = files[0];
        var contenido = document.querySelector('main>p:nth-of-type(2)');
        var areaVisualizacion = document.querySelector('main>pre');
        var errorArchivo = document.querySelector('main>p:nth-of-type(3)');
        contenido.innerText="Contenido del archivo de noticias: "
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = () => {
                areaVisualizacion.innerText = "";
                var noticias = lector.result.split('\n');
                
                var section = document.createElement("section");
                // Procesamiento de cada linea para crear una noticia
                noticias.forEach(noticia => {
                    if (noticia.trim() !== "") { // Evitar noticias vacias
                        var [titulo, contenido, autor] = noticia.split('_');

                        var article = document.createElement("article");
                        var h3Titulo = document.createElement("h3");
                        h3Titulo.textContent = titulo;
                        var pContenido = document.createElement("p");
                        pContenido.textContent = contenido;
                        var pAutor = document.createElement("p");
                        pAutor.textContent = "Autor: " + autor;

                        article.appendChild(h3Titulo);
                        article.appendChild(pContenido);
                        article.appendChild(pAutor);
                        section.appendChild(article);
                    }
                });
                areaVisualizacion.appendChild(section);
            }      
            lector.readAsText(archivo);
        } else {
            errorArchivo.textContent = "Error: Archivo no válido";
        }         
    }

    // Método para crear nuevas noticias
    crearNoticia() {
        $(document).ready(() => {
            document.querySelector("form>button").addEventListener("click", () => {
                const titulo = document.querySelector('form>input[id="titulo"]').value.trim();
                const contenido = document.querySelector('form>textarea[id="contenido"]').value.trim();
                const autor = document.querySelector('form>input[id="autor"]').value.trim();

                if (titulo && contenido && autor) {
                    let section = document.querySelector("main>pre>section");
                    if (!section) {
                        section = document.createElement("section");
                        document.querySelector("main>pre").appendChild(section);
                    }
                    var article = document.createElement("article");
                    var h3Titulo = document.createElement("h3");
                    h3Titulo.textContent = titulo;
                    var pContenido = document.createElement("p");
                    pContenido.textContent = contenido;
                    var pAutor = document.createElement("p");
                    pAutor.textContent = "Autor: " + autor;

                    article.appendChild(h3Titulo);
                    article.appendChild(pContenido);
                    article.appendChild(pAutor);
                    section.appendChild(article);
        
                    // Limpiar los campos del formulario
                    document.querySelector('form>input[id="titulo"]').value = '';
                    document.querySelector('form>textarea[id="contenido"]').value = '';
                    document.querySelector('form>input[id="autor"]').value = '';
                }
            });
        });
    }
}

var news = new Noticias();
news.crearNoticia();
