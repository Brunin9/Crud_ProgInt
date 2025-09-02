const form = document.getElementById("form");
const lista = document.getElementById("lista");
const btnCancelar = document.getElementById("cancelar");

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let editandoId = null;

function salvarLocal() {
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

function renderizar() {
  lista.innerHTML = "";
  alunos.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${a.nome} - ${a.email} - ${a.cpf}
      <button onclick="editarAluno(${a.id})">Editar</button>
      <button onclick="excluirAluno(${a.id})">Excluir</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    matricula: document.getElementById("matricula").value,
    aluno: document.getElementById("aluno").value,
    escola: document.getElementById("escola").value,
  };

  if (editandoId) {
    const res = await fetch(`/alunos/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });
    const atualizado = await res.json();

    alunos = alunos.map((a) => (a.id === editandoId ? atualizado : a));
    editandoId = null;
    btnCancelar.style.display = "none";
  } else {
    const res = await fetch("/alunos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });
    const novo = await res.json();
    alunos.push(novo);
  }

  salvarLocal();
  renderizar();
  form.reset();
});

window.editarAluno = function (id) {
  const aluno = alunos.find((a) => a.id === id);
  if (!aluno) return;

  document.getElementById("nome").value = aluno.nome;
  document.getElementById("cpf").value = aluno.cpf;
  document.getElementById("telefone").value = aluno.telefone;
  document.getElementById("email").value = aluno.email;
  document.getElementById("matricula").value = aluno.matricula;
  document.getElementById("aluno").value = aluno.aluno;
  document.getElementById("escola").value = aluno.escola;

  editandoId = id;
  btnCancelar.style.display = "inline";
};

window.excluirAluno = async function (id) {
  await fetch(`/alunos/${id}`, { method: "DELETE" });
  alunos = alunos.filter((a) => a.id !== id);
  salvarLocal();
  renderizar();
};

btnCancelar.addEventListener("click", () => {
  editandoId = null;
  form.reset();
  btnCancelar.style.display = "none";
});

renderizar();
