let alunoEditandoId = null; // controla se estamos editando alguém

// =========================
// Função para renderizar um aluno na tabela
// =========================
function adicionarAlunoNaLista(aluno) {
  const lista = document.getElementById("lista-alunos");

  const tr = document.createElement("tr");
  tr.setAttribute("data-id", aluno.id);

  tr.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.cpf}</td>
        <td>${aluno.telefone}</td>
        <td>${aluno.email}</td>
        <td>${aluno.matricula}</td>
        <td>
            <button onclick="editarAluno(${aluno.id})">Editar</button>
            <button onclick="deletarAluno(${aluno.id}, this)">Excluir</button>
        </td>
    `;

  lista.appendChild(tr);
}

// =========================
// Carregar alunos ao abrir a página
// =========================
async function carregarAlunos() {
  try {
    const response = await fetch("http://localhost:3000/alunos");
    if (response.ok) {
      const dados = await response.json();
      document.getElementById("lista-alunos").innerHTML = ""; // limpa tabela
      dados.forEach((aluno) => adicionarAlunoNaLista(aluno));
    } else {
      console.error("Erro ao carregar alunos");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

// =========================
// Submeter formulário (cadastrar ou editar)
// =========================
document.getElementById("form-aluno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    matricula: document.getElementById("matricula").value,
  };

  if (alunoEditandoId) {
    // === Edição ===
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });

      if (response.ok) {
        const atualizado = await response.json();

        // Atualiza linha na tabela
        const tr = document.querySelector(`tr[data-id='${alunoEditandoId}']`);
        tr.innerHTML = `
            <td>${atualizado.nome}</td>
            <td>${atualizado.cpf}</td>
            <td>${atualizado.telefone}</td>
            <td>${atualizado.email}</td>
            <td>${atualizado.matricula}</td>
            <td>
                <button onclick="editarAluno(${atualizado.id})">Editar</button>
                <button onclick="deletarAluno(${atualizado.id}, this)">Excluir</button>
            </td>
        `;

        // Reseta formulário
        e.target.reset();
        alunoEditandoId = null;
        document.querySelector("#form-aluno button").textContent = "Cadastrar";
      } else {
        alert("Erro ao atualizar aluno");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  } else {
    // === Cadastro normal ===
    try {
      const response = await fetch("http://localhost:3000/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno),
      });

      if (response.ok) {
        const novoAluno = await response.json();
        adicionarAlunoNaLista(novoAluno); // 👈 insere direto na tabela
        e.target.reset(); // limpa formulário
      } else {
        alert("Erro ao cadastrar aluno");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }
});

// =========================
// Excluir aluno
// =========================
async function deletarAluno(id, botao) {
  if (!confirm("Deseja realmente excluir este aluno?")) return;

  try {
    const response = await fetch(`http://localhost:3000/alunos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const linha = botao.closest("tr");
      linha.remove();
    } else {
      alert("Erro ao excluir aluno");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

// =========================
// Editar aluno
// =========================
function editarAluno(id) {
  const tr = document.querySelector(`tr[data-id='${id}']`);
  const tds = tr.querySelectorAll("td");

  document.getElementById("nome").value = tds[0].textContent;
  document.getElementById("cpf").value = tds[1].textContent;
  document.getElementById("telefone").value = tds[2].textContent;
  document.getElementById("email").value = tds[3].textContent;
  document.getElementById("matricula").value = tds[4].textContent;

  alunoEditandoId = id; // 👈 sinaliza que é edição
  document.querySelector("#form-aluno button").textContent = "Salvar Alterações";
}

// =========================
// Chamar ao carregar a página
// =========================
window.onload = carregarAlunos;
