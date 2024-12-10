class Semaforo {

    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;

        this.createStructure();
    }

    // Método para escoger una dificultad aleatoria
    selectRandomLevel() {
        return Math.floor(Math.random() * (this.levels.length));
    }

    // Método para crear la estructura HTML
    createStructure() {
        const main = document.querySelector('main');
        
        const title = document.createElement('h2');
        title.textContent = "Juego de reacción";
        main.appendChild(title);

        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            main.appendChild(light);
        }

        this.startButton = document.createElement('button');
        this.startButton.textContent = "Arranque";
        this.startButton.onclick = this.initSequence.bind(this);
        main.appendChild(this.startButton);

        this.reactionButton = document.createElement('button');
        this.reactionButton.textContent = "Reacción";
        this.reactionButton.onclick = this.stopReaction.bind(this);
        this.reactionButton.setAttribute('disabled', 'true');
        main.appendChild(this.reactionButton);

        this.displayResult = document.createElement('p');
        this.displayResult.textContent = "";
        main.appendChild(this.displayResult);
    }

    // Método para iniciar la secuencia de arranque del semáforo
    initSequence() {
        this.difficulty = this.levels[this.selectRandomLevel()];
        this.displayResult.textContent = "";
        const main = document.querySelector('main');
        main.className = 'load';
        this.startButton.setAttribute('disabled', 'true');

        const timeoutDuration = this.difficulty * 1000;

        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, 2000 + timeoutDuration);
    }

    // Método para apagar las luces y habilitar el botón de reacción
    endSequence() {
        const main = document.querySelector('main');
        main.className = 'unload';
        this.reactionButton.removeAttribute('disabled');
    }

    // Método para registrar el tiempo de reacción
    stopReaction() {
        this.clic_moment = new Date();
    
        const reactionTime = this.clic_moment - this.unload_moment;
        const roundedTime = (reactionTime / 1000).toFixed(3);
    
        this.displayResult.textContent = "Tu tiempo de reacción es: " + roundedTime + " segundos.";
        
        const main = document.querySelector('main');
        main.setAttribute('class', '');
    
        this.reactionButton.setAttribute('disabled', 'true');
        this.startButton.removeAttribute('disabled');

        this.createRecordForm(roundedTime);
    }

    // Método para crear el formulario que guarda los datos de un registro
    createRecordForm(time) {
        const main = document.querySelector('main');
        const form = document.createElement('form');

        form.method = "POST";
        form.action = "semaforo.php";

        const nameInput = document.createElement('input');
        const surnamesInput = document.createElement('input');
        const difficultyInput = document.createElement('input');
        const timeInput = document.createElement('input');
        const guardar = document.createElement('button');

        nameInput.required = true;
        surnamesInput.required = true;

        timeInput.value = time;
        difficultyInput.value = this.difficulty;
        timeInput.readOnly = true;
        difficultyInput.readOnly = true;
        
        guardar.textContent = "Guardar registro";
        guardar.type = "submit";

        form.appendChild(nameInput);
        form.appendChild(surnamesInput);
        form.appendChild(timeInput);
        form.appendChild(difficultyInput);
        form.appendChild(guardar);

        main.appendChild(form);
    }
}
