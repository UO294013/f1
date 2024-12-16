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
        this.startButton.type = "button";
        this.startButton.textContent = "Arranque";
        this.startButton.onclick = this.initSequence.bind(this);
        main.appendChild(this.startButton);

        this.reactionButton = document.createElement('button');
        this.reactionButton.type = "button";
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
        document.querySelectorAll("form").forEach(form => form.remove()); // Retirar formularios anteriores
        document.querySelectorAll("section").forEach(section => section.remove()); // Retirar rankings anteriores
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

        // Etiquetas para los campos del formulario
        const lblName = document.createElement('label');
        const lblSurnames = document.createElement('label');
        const lblDifficulty = document.createElement('label');
        const lblTime = document.createElement('label');
        lblName.textContent = "Nombre: ";
        lblSurnames.textContent = "Apellidos: ";
        lblDifficulty.textContent = "Dificultad: ";
        lblTime.textContent = "Tiempo: ";
        lblName.htmlFor = "nombre";
        lblSurnames.htmlFor = "apellidos";
        lblDifficulty.htmlFor = "nivel";
        lblTime.htmlFor = "tiempo";

        // Campos del formulario
        const nameInput = document.createElement('input');
        const surnamesInput = document.createElement('input');
        const difficultyInput = document.createElement('input');
        const timeInput = document.createElement('input');
        nameInput.type = "text";
        surnamesInput.type = "text";
        difficultyInput.type = "number";
        timeInput.type = "number";
        // Se permite el uso de id para vincular los campos del formulario con las labels (etiquetas)
        nameInput.id = "nombre";
        surnamesInput.id = "apellidos";
        difficultyInput.id = "nivel";
        timeInput.id = "tiempo";
        nameInput.name = "nombre";
        surnamesInput.name = "apellidos";
        difficultyInput.name = "nivel";
        timeInput.name = "tiempo";
        nameInput.placeholder = "Nombre";
        surnamesInput.placeholder = "Apellidos";
        difficultyInput.placeholder = "Dificultad";
        timeInput.placeholder = "Tiempo";

        nameInput.required = true;
        surnamesInput.required = true;
        difficultyInput.value = this.difficulty.toString();
        timeInput.value = time.toString();
        difficultyInput.readOnly = true;
        timeInput.readOnly = true;
        
        const guardar = document.createElement('button');
        guardar.type = "submit";
        guardar.textContent = "Guardar registro";

        form.appendChild(lblName);
        form.appendChild(nameInput);
        form.appendChild(lblSurnames);
        form.appendChild(surnamesInput);
        form.appendChild(lblDifficulty);
        form.appendChild(difficultyInput);
        form.appendChild(lblTime);
        form.appendChild(timeInput);
        form.appendChild(guardar);
        main.appendChild(form);
    }
}
