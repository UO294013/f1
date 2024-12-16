/*
APIs utilizadas:
- Drag&Drop
- FullScreen
- Web Audio
*/

// --- API Web Audio ---

// Contexto de audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Nodo de ganancia para bajar el volumen de los sonidos
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.1;
gainNode.connect(audioContext.destination);

// Función para cargar y reproducir un sonido
function playSound(url) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            const soundSource = audioContext.createBufferSource();
            soundSource.buffer = audioBuffer;
            soundSource.connect(gainNode);
            soundSource.start();
        })
        .catch(e => console.error('Error al cargar el sonido', e));
}

// --- API Drag&Drop ---

document.addEventListener("DOMContentLoaded", () => {
    const circuitos = document.querySelectorAll("footer img");
    const foto = document.querySelector("section figure img");

    // Diálogo de ayuda: Se muestra al pulsar el botón de ayuda
    const dialogAyuda = document.createElement('dialog');
    dialogAyuda.textContent = 
        "En el recuadro de arriba se muestra una imagen de un circuito del calendario de la temporada " + 
        "2024 de F1. Abajo tienes los trazados de los 24 circuitos. Arrastra la imagen del trazado del " +
        "circuito que corresponda a la imagen de arriba. Si te equivocas, se sumará un fallo, pero no " +
        "te preocupes, el juego no termina hasta completarlo, independientemente del número de fallos. " +
        "Por tanto, aunque no seas un fanático de la Fórmula 1, podrás terminar el juego tarde o temprano "+
        "¡Buena suerte y ánimo!";
    dialogAyuda.appendChild(document.createElement('button')).textContent = "Cerrar";
    dialogAyuda.querySelector('button').onclick = () => {
        dialogAyuda.close();
    };
    document.body.appendChild(dialogAyuda);

    // Botón de ayuda (Cómo jugar)
    const ayudaButton = document.querySelector('button:nth-of-type(2)');
    ayudaButton.onclick = () => {
        dialogAyuda.showModal();
    };

    // Botón para reiniciar el juego
    const reiniciarButton = document.querySelector('button:nth-of-type(3)');
    reiniciarButton.onclick = () => {
        location.reload();
    };

    // Diálogo de victoria: Se muestra al completar el juego
    const dialog = document.createElement('dialog');
    dialog.textContent = "¡Felicidades, has completado el juego!";
    dialog.appendChild(document.createElement('button')).textContent = "Continuar";
    dialog.querySelector('button').onclick = () => {
        dialog.close();
    };
    document.body.appendChild(dialog);

    // Ajustar el volumen en función del valor del input
    const volumeControl = document.querySelector("input");
    volumeControl.addEventListener("input", (e) => {
        gainNode.gain.value = e.target.value;
    });

    // Lista de imágenes de circuitos
    const circuitImages = [
        "multimedia/imagenes/api_bahrein_img.jpg",
        "multimedia/imagenes/api_jeddah_img.jpg",
        "multimedia/imagenes/api_melbourne_img.jpg",
        "multimedia/imagenes/api_suzuka_img.jpg",
        "multimedia/imagenes/api_shanghai_img.jpg",
        "multimedia/imagenes/api_miami_img.jpg",
        "multimedia/imagenes/api_imola_img.jpg",
        "multimedia/imagenes/api_monaco_img.jpg",
        "multimedia/imagenes/api_canada_img.jpg",
        "multimedia/imagenes/api_barcelona_img.jpg",
        "multimedia/imagenes/api_austria_img.jpg",
        "multimedia/imagenes/api_silverstone_img.jpg",
        "multimedia/imagenes/api_hungria_img.jpg",
        "multimedia/imagenes/api_spa_img.jpg",
        "multimedia/imagenes/api_zandvoort_img.jpg",
        "multimedia/imagenes/api_monza_img.jpg",
        "multimedia/imagenes/api_baku_img.jpg",
        "multimedia/imagenes/api_singapur_img.jpg",
        "multimedia/imagenes/api_austin_img.jpg",
        "multimedia/imagenes/api_mexico_img.jpg",
        "multimedia/imagenes/api_brasil_img.jpg",
        "multimedia/imagenes/api_las_vegas_img.jpg",
        "multimedia/imagenes/api_losail_img.jpg",
        "multimedia/imagenes/api_abu_dhabi_img.jpg"
    ];

    // Barajar las imágenes para no mostrar siempre el mismo orden
    shuffle(circuitImages);

    // Mostrar la primera imagen
    let currentIndex = 0;
    foto.src = circuitImages[currentIndex];

    // Generar y añadir los eventos de Drag&Drop
    circuitos.forEach(circuito => {
        circuito.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", e.target.src);
        });
    });

    foto.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    // Modificación del contador de fallos
    const contadorFallos = document.querySelector("textarea");
    let fallos = 0;

    foto.addEventListener("drop", (e) => {
        e.preventDefault();
        verificarDrop(e);
    });

    // Soporte para dispositivos táctiles
    let touchData = null;
    circuitos.forEach(circuito => {
        circuito.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchData = {
                src: circuito.src,
                offsetX: touch.clientX - circuito.getBoundingClientRect().left,
                offsetY: touch.clientY - circuito.getBoundingClientRect().top,
            };            
        });
    });

    circuitos.forEach(circuito => {
        circuito.addEventListener("touchmove", (e) => {
            if (!touchData) return;
            e.preventDefault();
        });
    });
    
    circuitos.forEach(circuito => {
        circuito.addEventListener("touchend", (e) => {
            if (!touchData) return;
            e.preventDefault();
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            if (dropTarget === foto) {
                verificarDrop({ dataTransfer: { getData: () => touchData.src } });
            }
            // Eliminar objeto seleccionado
            touchData = null;
        });
    });

    // Función para verificar si el circuito arrastrado es el correcto
    function verificarDrop(e) {
        // Ajustar los paths de las imágenes para que la comparación sea correcta
        let circuitoSrc = e.dataTransfer.getData("text");
        circuitoSrc = circuitoSrc.substring(circuitoSrc.indexOf("multimedia"));
        const circuito = document.querySelector(`footer img[src="${circuitoSrc}"]`);
        let expected = foto.src.substring(foto.src.indexOf("multimedia"));
        expected = expected.replace("_img.jpg", ".png");

        if (circuito) {
            // Verificar si la imagen arrastrada es la correcta
            if (circuitoSrc === expected) {
                playSound('multimedia/audios/correcto.mp3'); // Reproducir sonido de acierto
                // Eliminar el circuito del footer
                circuito.parentElement.removeChild(circuito);
                // Eliminar la imagen del circuito de la lista
                circuitImages.splice(currentIndex, 1);
                // Mostrar la siguiente imagen
                if (currentIndex < circuitImages.length) {
                    foto.src = circuitImages[currentIndex];
                } else {
                    playSound('multimedia/audios/victoria.mp3'); // Reproducir sonido de victoria si acaban las imágenes
                    document.querySelector('dialog:nth-of-type(2)').showModal();
                }
            } else {
                playSound('multimedia/audios/incorrecto.mp3'); // Reproducir sonido de fallo
                // Aumentar el contador de fallos
                fallos++;
                contadorFallos.textContent = `Fallos: ${fallos}`;
            }
        }
    }

    // Función para barajar las imágenes
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});

// --- API FullScreen ---

// Pantalla Completa
document.addEventListener("DOMContentLoaded", () => {
    const botonPantallaCompleta = document.querySelector("button");
    if (botonPantallaCompleta) {
        botonPantallaCompleta.addEventListener("click", () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        });
    }
});
