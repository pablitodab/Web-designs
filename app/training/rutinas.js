document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const addExerciseBtn = document.getElementById('addExerciseBtn');
    const newExerciseInput = document.getElementById('newExerciseInput');
    const exercisesList = document.getElementById('exercisesList');
    const routineForm = document.getElementById('routineForm');
    const footer = document.querySelector('.site-footer');

    let exercises = [];

    // Asegurar que el modal está cerrado al cargar la página
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');

    // Abrir modal
    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    });

    // Cerrar modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Cerrar al hacer click fuera del panel
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Función para renderizar lista de ejercicios
    function renderExercises() {
        exercisesList.innerHTML = '';
        
        exercises.forEach((exercise, index) => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            exerciseItem.innerHTML = `
                <span class="exercise-item-text">${exercise}</span>
                <button type="button" class="remove-exercise-btn" data-index="${index}">🗑️</button>
            `;
            exercisesList.appendChild(exerciseItem);
        });

        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.remove-exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                exercises.splice(index, 1);
                renderExercises();
            });
        });
    }

    // Añadir ejercicio al hacer click en el botón +
    addExerciseBtn.addEventListener('click', () => {
        const exerciseText = newExerciseInput.value.trim();
        
        if (exerciseText) {
            exercises.push(exerciseText);
            newExerciseInput.value = '';
            renderExercises();
            newExerciseInput.focus();
        }
    });

    // Añadir ejercicio al presionar Enter
    newExerciseInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const exerciseText = newExerciseInput.value.trim();
            
            if (exerciseText) {
                exercises.push(exerciseText);
                newExerciseInput.value = '';
                renderExercises();
            }
        }
    });

    // Manejar envío del formulario
    routineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const routineName = document.getElementById('routineName').value;
        const routineDays = document.getElementById('routineDays').value;

        if (exercises.length === 0) {
            alert('Debes añadir al menos un ejercicio');
            return;
        }

        // Aquí guardarías la rutina en localStorage o enviarías al servidor
        const routine = {
            name: routineName,
            days: routineDays,
            exercises: exercises,
            createdAt: new Date().toISOString()
        };

        console.log('Rutina guardada:', routine);

        // Guardar en localStorage
        let routines = JSON.parse(localStorage.getItem('routines')) || [];
        routines.push(routine);
        localStorage.setItem('routines', JSON.stringify(routines));

        // Limpiar formulario y cerrar modal
        routineForm.reset();
        exercises = [];
        renderExercises();
        closeModal();

        alert('✅ Rutina guardada correctamente!');
        
        // Aquí podrías recargar la lista de rutinas
        loadRoutines();
    });

    // Función para cargar y mostrar rutinas guardadas
    function loadRoutines() {
        const routines = JSON.parse(localStorage.getItem('routines')) || [];
        const trainingList = document.getElementById('trainingList');
        
        if (routines.length === 0) {
            trainingList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: rgba(248,249,255,0.5);">
                    <p style="font-size: 3rem; margin-bottom: 1rem;">💪</p>
                    <p>No tienes rutinas aún. ¡Crea tu primera rutina!</p>
                </div>
            `;
            return;
        }

        trainingList.innerHTML = '';
        routines.forEach((routine, index) => {
            const routineCard = document.createElement('div');
            routineCard.className = 'routine-card';
            routineCard.innerHTML = `
                <div class="routine-header">
                    <h3>${routine.name}</h3>
                    <button class="delete-routine-btn" data-index="${index}">🗑️</button>
                </div>
                <p class="routine-days">📅 ${routine.days}</p>
                <div class="routine-exercises">
                    <p><strong>Ejercicios (${routine.exercises.length}):</strong></p>
                    <ul>
                        ${routine.exercises.map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                </div>
            `;
            trainingList.appendChild(routineCard);
        });

        // Añadir event listeners a botones de eliminar
        document.querySelectorAll('.delete-routine-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (confirm('¿Estás seguro de eliminar esta rutina?')) {
                    routines.splice(index, 1);
                    localStorage.setItem('routines', JSON.stringify(routines));
                    loadRoutines();
                }
            });
        });
    }

    // Cargar rutinas al iniciar
    loadRoutines();
});