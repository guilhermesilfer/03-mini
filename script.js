document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-tarefa');
  const lista = document.getElementById('lista-tarefas');
  const cancelarBtn = document.getElementById('cancelar');

  let tarefas = [];
  let indiceEdicao = null;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const data = document.getElementById('data').value;
    const comentario = document.getElementById('comentario').value;
    const prioridade = document.getElementById('prioridade').value;
    const notificacao = document.getElementById('notificacao').checked;
    const dataCriacao = new Date().toISOString().split('T')[0];

    const tarefa = {
      titulo,
      data,
      comentario,
      prioridade,
      notificacao,
      dataCriacao,
      expandido: false
    };

    if (indiceEdicao !== null) {
      tarefas[indiceEdicao] = tarefa;
      indiceEdicao = null;
    } else {
      tarefas.push(tarefa);
    }

    form.reset();
    renderizarTarefas();
  });

  cancelarBtn.addEventListener('click', function () {
    form.reset();
    indiceEdicao = null;
  });

  function renderizarTarefas() {
    lista.innerHTML = '';
    tarefas.forEach((tarefa, index) => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow';

      const info = `
        <h3 class="text-lg font-bold">${tarefa.titulo}</h3>
        <p><strong>Data:</strong> ${tarefa.data}</p>
        <p><strong>Prioridade:</strong> ${tarefa.prioridade}</p>
        <div id="detalhes-${index}" class="${tarefa.expandido ? '' : 'hidden'} mt-2 text-sm text-gray-700">
          <p><strong>Comentário:</strong> ${tarefa.comentario}</p>
          <p><strong>Notificação:</strong> ${tarefa.notificacao ? 'Sim' : 'Não'}</p>
          <p><small>Criado em: ${tarefa.dataCriacao}</small></p>
        </div>
        <div class="flex gap-2 mt-2">
          <button class="text-blue-500 underline" data-acao="expandir" data-index="${index}">Expandir</button>
          <button class="text-blue-500 underline" data-acao="editar" data-index="${index}">Editar</button>
          <button class="text-red-500 underline" data-acao="remover" data-index="${index}">Remover</button>
          <button class="text-purple-500 underline" data-acao="detalhes" data-index="${index}">Detalhes</button>
        </div>
      `;

      div.innerHTML = info;
      lista.appendChild(div);
    });
  }

  lista.addEventListener('click', function (e) {
    const botao = e.target;
    const index = botao.getAttribute('data-index');
    const acao = botao.getAttribute('data-acao');

    if (acao === 'expandir') {
      tarefas[index].expandido = !tarefas[index].expandido;
      renderizarTarefas();
    } else if (acao === 'editar') {
      const tarefa = tarefas[index];
      document.getElementById('titulo').value = tarefa.titulo;
      document.getElementById('data').value = tarefa.data;
      document.getElementById('comentario').value = tarefa.comentario;
      document.getElementById('prioridade').value = tarefa.prioridade;
      document.getElementById('notificacao').checked = tarefa.notificacao;
      indiceEdicao = index;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (acao === 'remover') {
      tarefas.splice(index, 1);
      renderizarTarefas();
    } else if (acao === 'detalhes') {
      const tarefa = tarefas[index];
      window.open(`detalhes.html?tarefa=${encodeURIComponent(JSON.stringify(tarefa))}`, '_blank');
    }
  });
});

