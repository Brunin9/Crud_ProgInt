const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// Atualiza a tabela
function atualizarTabela() {
    tabela.innerHTML = "";
    alunos.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${a.nome}</td>
            <td>${a.cpf}</td>
            <td>${a.telefone}</td>
            <td>${a.email}</td>
            <td>${a.matricula}</td>
            <td>${a.aluno}</td>
            <td>${a.escola}</td>
            <td>
                <button onclick="editar(${a.id})">Editar</button>
                <button onclick="deletar(${a.id})">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

// Salvar ou editar aluno
form.addEventListener("submit", e => {
    e.preventDefault();

    const id = document.getElementById("id").value;
    const aluno = {
        id: id ? Number(id) : Date.now(),
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        matricula: document.getElementById("matricula").value,
        aluno: document.getElementById("aluno").value,
        escola: document.getElementById("escola").value
    };

    if (id) {
        alunos = alunos.map(a => a.id === aluno.id ? aluno : a);
    } else {
        alunos.push(aluno);
    }

    localStorage.setItem("alunos", JSON.stringify(alunos));
    form.reset();
    document.getElementById("id").value = "";
    atualizarTabela();
});

// Editar aluno
window.editar = (id) => {
    const aluno = alunos.find(a => a.id === id);
    document.getElementById("id").value = aluno.id;
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("cpf").value = aluno.cpf;
    document.getElementById("telefone").value = aluno.telefone;
    document.getElementById("email").value = aluno.email;
    document.getElementById("matricula").value = aluno.matricula;
    document.getElementById("aluno").value = aluno.aluno;
    document.getElementById("escola").value = aluno.escola;
};

// Excluir aluno
window.deletar = (id) => {
    if (confirm("Deseja realmente excluir este aluno?")) {
        alunos = alunos.filter(a => a.id !== id);
        localStorage.setItem("alunos", JSON.stringify(alunos));
        atualizarTabela();
    }
};

// Inicializa tabela
atualizarTabela();
