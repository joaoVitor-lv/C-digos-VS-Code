document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const taskList = document.getElementById('task-list');

    // Carregar do banco de dados da nave (localStorage)
    let tasks = JSON.parse(localStorage.getItem('space-agenda')) || [];

    // Formatar data estelar
    const formatDateTime = (dateString) => {
        const options = { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', options).replace(',', ' às');
    };

    // Salvar no sistema
    const saveTasks = () => {
        localStorage.setItem('space-agenda', JSON.stringify(tasks));
    };

    // Atualizar painel de controle
    const renderTasks = () => {
        taskList.innerHTML = ''; 

        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div style="text-align:center; padding: 20px; border: 1px dashed #334155; border-radius: 8px;">
                    <p style="color:#94a3b8; font-size:1rem;">Nenhuma missão programada no radar. O espaço está livre! 🌌</p>
                </div>`;
            return;
        }

        // Ordenar por data cronológica
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

        tasks.forEach((task) => {
            const taskEl = document.createElement('div');
            taskEl.classList.add('task-item');
            if (task.completed) taskEl.classList.add('completed');

            taskEl.innerHTML = `
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-time">🛰️ ${formatDateTime(task.date)}</div>
                    ${task.desc ? `<div class="task-desc">${task.desc}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-action check" onclick="toggleTask('${task.id}')" title="${task.completed ? 'Reabrir Missão' : 'Concluir Missão'}">
                        ${task.completed ? '↩️' : '✔️'}
                    </button>
                    <button class="btn-action delete" onclick="deleteTask('${task.id}')" title="Abortar e Excluir">
                        🛸
                    </button>
                </div>
            `;
            taskList.appendChild(taskEl);
        });
    };

    // Registrar nova missão
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('task-title').value;
        const dateInput = document.getElementById('task-date').value;
        const descInput = document.getElementById('task-desc').value;

        const newTask = {
            id: Date.now().toString(),
            title: titleInput,
            date: dateInput,
            desc: descInput,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        form.reset();
    });

    // Função de sucesso da missão (Exposta)
    window.toggleTask = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    };

    // Função para abortar (Exposta)
    window.deleteTask = (id) => {
        if (confirm('Atenção Comandante: Deseja realmente pulverizar esta missão dos registros?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    };

    // Iniciar sistema
    renderTasks();
});