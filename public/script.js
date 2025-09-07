//variável que controla se ta editando um aluno (null = modo cadastro, ID = modo edição)
let editando = null;

// referencias aos elementos HTML principais (cache para melhor performance)
const form = document.getElementById('form');           // Formulário principal
const tabela = document.getElementById('tabela');       // Corpo da tabela (tbody)
const cancelar = document.getElementById('cancelar');   // Botão cancelar

//busca os alunos e atualiza a tabela
async function carregar() {
    //faz requisição GET para a API para obter lista de alunos
    const res = await fetch('/api/alunos');
    
    //converte a resposta para JSON (array de objetos aluno)
    const alunos = await res.json();
    
    //gera o HTML das linhas da tabela usando map() + join()
    tabela.innerHTML = alunos.map(a => `
        <tr>
            <td>${a.nome}</td>
            <td>${a.cpf}</td>
            <td>${a.telefone}</td>
            <td>${a.email}</td>
            <td>${a.matricula}</td>
            <td>${a.escola}</td>
            <td>
                <button class="btn-success" onclick="editar(${a.id})">Editar</button>
                <button class="btn-danger" onclick="deletar(${a.id})">Deletar</button>
            </td>
        </tr>
    `).join('');
    
    // map(): Transforma cada aluno em uma string HTML
    // join(''): Une todas as strings em uma só
    // onclick: Define funções que serão chamadas quando os botões forem clicados
}

form.onsubmit = async (e) => {
    //n deixa atualizar a pagina pra previnir
    e.preventDefault();
    
    //coleta todos os dados dos campos do formulário
    const dados = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        matricula: document.getElementById('matricula').value,
        escola: document.getElementById('escola').value
    };

    //verifica se esta editando ou criando um novo aluno
    if (editando) {
        //se esta editando:
        //faz requisição PUT para atualizar aluno existente
        await fetch(`/api/alunos/${editando}`, {
            method: 'PUT',                                    
            headers: { 'Content-Type': 'application/json' }, //define tipo do conteúdo
            body: JSON.stringify(dados)                       //converte objeto para JSON
        });
    } else {
        //se esta cadastrando:
        //faz requisição POST para criar novo aluno
        await fetch('/api/alunos', {
            method: 'POST',                                  
            headers: { 'Content-Type': 'application/json' }, //define tipo do conteúdo
            body: JSON.stringify(dados)                       //converte objeto para JSON
        });
    }

    //limpa tudo dps da operacao
    form.reset();                          //limpa todos os campos do formulário
    editando = null;                       //reseta variável de controle (se ta editando ou cadatrando)
    cancelar.style.display = 'none';       //esconde botão cancelar
    carregar();                            //recarrega a tabela com dados atualizados
};

/**
//Função que prepara o formulário para edição de um aluno existente
 * @param {number} id - ID do aluno a ser editado
 */
async function editar(id) {
    //faz requisição GET para buscar dados específicos do aluno
    const res = await fetch(`/api/alunos/${id}`);
    
    //converte resposta para js
    const aluno = await res.json();
    
    //preenche os campos do formulário com os dados do aluno
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('cpf').value = aluno.cpf;
    document.getElementById('telefone').value = aluno.telefone;
    document.getElementById('email').value = aluno.email;
    document.getElementById('matricula').value = aluno.matricula;
    document.getElementById('escola').value = aluno.escola;
    
    //ativa o modo edição
    editando = id;                         // define qual aluno está sendo editado
    cancelar.style.display = 'inline';     // mostra botão cancelar
}

/**
 * Função que remove um aluno após confirmação do usuário
 * @param {number} id - ID do aluno a ser deletado
 */
async function deletar(id) {
    //exibe dialog de confirmação antes de deletar
    if (confirm('Deletar aluno?')) {
        //se confirmado faz requisição DELETE para a API
        await fetch(`/api/alunos/${id}`, { 
            method: 'DELETE'               // Método HTTP para exclusão
        });
        
        //recarrega a tabela
        carregar();
    }
    //se não confirmado não faz nada (função termina)
}

//cancelar edicao
cancelar.onclick = () => {
    form.reset();                          //limpa todos os campos
    editando = null;                       //volta para modo cadastro
    cancelar.style.display = 'none';       //esconde botão cancelar
};
carregar();