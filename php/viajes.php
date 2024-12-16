<!DOCTYPE HTML>
<!-- Creación de la clase Carrusel -->
<?php
    class Carrusel {
        private $capital;
        private $pais;
        private $fotos;
    
        public function __construct($capital, $pais) {
            $this->capital = $capital;
            $this->pais = $pais;
            $this->fotos = [];
        }
    
        public function obtenerFotos() {
            $apiKey = "b3737c055ec0d9530fc521281d50264e";
            $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=$apiKey&tags=" 
                    . urlencode($this->pais) . ',' . urlencode($this->capital) . "&per_page=10&format=json&nojsoncallback=1";
            
            $respuesta = file_get_contents($url);
            $datos = json_decode($respuesta, true);
    
            foreach ($datos['photos']['photo'] as $foto) {
                $farm = $foto['farm'];
                $server = $foto['server'];
                $id = $foto['id'];
                $secret = $foto['secret'];
    
                $urlFoto = "https://farm$farm.staticflickr.com/$server/$id" . '_' . "$secret" . "_m.jpg";
                $this->fotos[] = $urlFoto;
            }
        }
    
        public function renderizarCarrusel() {
            echo '<section>';
            foreach ($this->fotos as $foto) {
                echo "<img src=\"$foto\" alt=\"Foto de $this->pais\" />";
            }
            echo '</section>';
        }
    }
?>
<!-- Creación de la clase Moneda -->
<?php
    class Moneda {
        private $monedaLocal;
        private $monedaBase;
        private $tipoCambio;

        // La moneda base por defecto es el dólar, puesto que en Bélgica se utiliza el Euro
        public function __construct($monedaLocal, $monedaBase) {
            $this->monedaLocal = $monedaLocal;
            $this->monedaBase = $monedaBase;
        }

        public function obtenerCambio() {
            $url = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_eh0HBakkzw3zEXkBl8rdLphUoOAWi2OVlVzIDcRH&currencies=". $this->monedaLocal . "&base_currency=" . $this->monedaBase;
            $respuesta = file_get_contents($url);
            $datos = json_decode($respuesta, true);
            $this->tipoCambio = $datos['data'][$this->monedaLocal] ?? null;
            if ($this->tipoCambio === null) {
                throw new Exception("No se pudo obtener el tipo de cambio para la moneda especificada.");
            }
        }

        public function mostrarCambio() {
            if ($this->tipoCambio) {
                echo "<p>Cambio de moneda: 1 {$this->monedaBase} = {$this->tipoCambio} {$this->monedaLocal}</p>";
            } else {
                echo "<p>No se pudo obtener el tipo de cambio.</p>";
            }
        }
    }
?>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop</title>
    <link rel="icon" href="../multimedia/imagenes/favicon.ico" sizes="48x48">
    <meta name="author" content="Vicente Megido García (UO294013)" />
    <meta name="description" content="Información relacionada con los viajes durante el campeonato de la F1" />
    <meta name="keywords" content="F1, Fórmula 1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="../js/viajes.js" defer></script>
</head>
<body>
    <header>
        <h1><a href="../index.html" title="Ir a la página principal">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html" title="Ir a Inicio">Inicio</a>
            <a href="../piloto.html" title="Ir a Piloto">Piloto</a>
            <a href="../noticias.html" title="Ir a Noticias">Noticias</a>
            <a href="../calendario.html" title="Ir a Calendario">Calendario</a>
            <a href="../meteorología.html" title="Ir a Meteorología">Meteorología</a>
            <a href="../circuito.html" title="Ir a Circuito">Circuito</a>
            <a class="active" href="viajes.php" title="Ir a Viajes">Viajes</a>
            <a href="../juegos.html" title="Ir a Juegos">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html" title="Ir a Inicio">Inicio</a> >> Viajes</p>
    <main>
        <h2>Viajes</h2>
        <?php
            $moneda = new Moneda("USD", "EUR");
            $moneda->obtenerCambio();
            $moneda->mostrarCambio();
        ?>
        <button>Cargar mapas</button>
        <div hidden>
            <!-- Aquí irá el mapa dinámico -->
        </div>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU"></script>
        <!-- Slider container -->
        <article>
            <h3>Carrusel de Imágenes:</h3>
            <?php
                $carrusel = new Carrusel("Brussels", "Belgium");
                $carrusel->obtenerFotos();
                $carrusel->renderizarCarrusel();
            ?>
            <!-- Control buttons -->
            <button> &gt; </button>
            <button> &lt; </button>
        </article>
    </main>
</body>
</html>
