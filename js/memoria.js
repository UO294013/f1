class Memoria {

    constructor() {
        
        // Elemento JSON
        this.elements = { 
            cards: [
                { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
                { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
                { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
                { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
                { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
                { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
                { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
                { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
                { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
                { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
                { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
                { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
            ]
        };

        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.pairsFound = 0; // Lleva la cuenta de las parejas encontradas

        this.shuffleElements(this.elements.cards);
        this.createElements();
        this.addEventListeners();
    }

    // Método para barajar utilizando método de Durstenfeld
    shuffleElements(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Método para resetear el tablero tras finalizar un "turno" de interacción del usuario
    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.setAttribute('data-state', 'hidden');
            this.secondCard.setAttribute('data-state', 'hidden');
            this.resetBoard();
          }, 1000); // Introducido delay de 1.5 segundos
    }

    // Resetea el tablero tras voltear dos cartas distintas
    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    // Comprueba que las cartas volteadas son iguales y actúa en consecuencia
    checkForMatch() {
        if (this.firstCard.getAttribute('data-element') === this.secondCard.getAttribute('data-element')) {
            ++this.pairsFound;
            this.disableCards();
        } else {
            this.unflipCards();
        }
    }

    // Deshabilita las cartas que ya han sido emparejadas correctamente
    disableCards() {
        this.firstCard.setAttribute('data-state', 'revealed');
        this.secondCard.setAttribute('data-state', 'revealed');
        this.resetBoard();
        this.checkGameComplete();
    }

    // Crea los elementos del JSON para añadir las cartas al HTML
    createElements() {
        const section = document.createElement('section');
        section.setAttribute('data-game', 'memory-game');

        // Diálogo que se abre al pulsar el botón de ayuda ("Cómo jugar")
        const dialogAyuda = document.createElement('dialog');
        dialogAyuda.textContent = 
            "Bienvenido al juego de cartas de F1 Desktop. " +
            "El objetivo del juego es encontrar todas las parejas de cartas iguales. " +
            "Haz clic en una carta para voltearla y trata de encontrar su pareja haciendo click sobre otra. " +
            "Si las cartas son iguales, se quedarán visibles. Si no, se volverán a voltear tras un segundo. " +
            "¡Buena suerte y que te diviertas!";
        dialogAyuda.appendChild(document.createElement('button')).textContent = "Cerrar";
        dialogAyuda.querySelector('button').onclick = () => {
            dialogAyuda.close();
        };
        document.body.appendChild(dialogAyuda);

        // Botón de ayuda ("Cómo jugar")
        const ayudaButton = document.createElement('button');
        ayudaButton.type = "button";
        ayudaButton.textContent = "Cómo jugar";
        ayudaButton.onclick = () => {
            dialogAyuda.showModal();
        };
        section.appendChild(ayudaButton);

        // Botón para reiniciar el juego
        const reiniciarButton = document.createElement('button');
        reiniciarButton.type = "button";
        reiniciarButton.textContent = "Reiniciar";
        reiniciarButton.onclick = () => {
            location.reload();
        };
        section.appendChild(reiniciarButton);

        const dialogVictoria = document.createElement('dialog');
        dialogVictoria.textContent = 
                "¡Felicidades, has completado el juego de memoria!";
        dialogVictoria.appendChild(document.createElement('button')).textContent = "Continuar";
        dialogVictoria.querySelector('button').onclick = () => {
            dialogVictoria.close();
        };
        document.body.appendChild(dialogVictoria);

        const h2 = document.createElement('h2');
        h2.textContent = "Juego de memoria";
        section.appendChild(h2);

        this.elements.cards.forEach(card => {
            const article = document.createElement('article');
            article.setAttribute('data-element', card.element);
            article.setAttribute('data-state', 'hidden');

            const h3 = document.createElement('h3');
            h3.textContent = "Tarjeta de memoria"; // Tarjeta sin voltear
            article.appendChild(h3);

            const img = document.createElement('img');
            img.src = card.source;
            img.alt = card.element;
            article.appendChild(img);

            section.appendChild(article);
        });

        document.querySelector('main').appendChild(section);
    }

    // Añade funcionalidad al pulsar sobre las cartas
    addEventListeners() {
        const cards = document.querySelectorAll('[data-game=memory-game]>article');
        cards.forEach(card => {
            card.onclick = this.flipCard.bind(card, this)
        });
    }

    // Voltea la carta y muestra la imagen
    flipCard(game) {
        const card = this;
        const state = card.getAttribute('data-state');

        if (state === 'revealed' || game.lockBoard || card === game.firstCard) {
            return;
        }

        card.setAttribute('data-state', 'flip');

        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = card;
        } else {
            game.secondCard = card;
            game.checkForMatch(game.firstCard, game.secondCard);
        }
    }

    // Método para verificar si el juego está completo
    checkGameComplete() {
        if (this.pairsFound === this.elements.cards.length / 2) {
            document.querySelector('dialog:nth-of-type(2)').showModal();
        }
    }
}