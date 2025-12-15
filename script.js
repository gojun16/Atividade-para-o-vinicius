// script.js
// Código escrito de forma simples, com comentários em PT-BR.
// OBS: isso pode ser melhorado depois — deixei do jeito mais direto.

// chave do localStorage (usar sempre a mesma pra não perder dados)
var chaveStorage = 'clc_news';

/* NOTÍCIAS INICIAIS
   EDITAR AQUI: substitua/os textos abaixo por notícias reais.
   Deixei 5 exemplos simples para a demonstração.
*/
var noticiasIniciais = [
  { id: Date.now()+1, title: 'Time do Colégio vence campeonato regional', theme: 'Esportes', content: 'Nosso time representou a escola e conquistou o título.', date: new Date().toISOString() },
  { id: Date.now()+2, title: 'Aluno conquista medalha em atletismo', theme: 'Esportes', content: 'Parabéns ao aluno pela conquista.', date: new Date().toISOString() },
  { id: Date.now()+3, title: 'Como se preparar para o ENEM 2026', theme: 'ENEM', content: 'Dicas de estudo e simulados.', date: new Date().toISOString() },
  { id: Date.now()+4, title: 'Oficina de Redação para o ENEM', theme: 'ENEM', content: 'Oficina semanal com professores.', date: new Date().toISOString() },
  { id: Date.now()+5, title: 'Rodada de amistosos entre turmas', theme: 'Esportes', content: 'Jogos amistosos e integração.', date: new Date().toISOString() }
];

// CARREGA E SALVA
function carregarNoticias(){
  var raw = localStorage.getItem(chaveStorage);
  if(!raw){
    // primeiro acesso: popular com as iniciais (só pra demo)
    localStorage.setItem(chaveStorage, JSON.stringify(noticiasIniciais));
    // retorno cópia pra evitar mutação acidental
    return noticiasIniciais.slice();
  }
  try{
    return JSON.parse(raw);
  }catch(err){
    console.error('Erro ao ler localStorage', err);
    return [];
  }
}

function salvarNoticias(lista){
  localStorage.setItem(chaveStorage, JSON.stringify(lista));
}

// Escape simples para evitar problemas com caracteres
function escapar(text){
  // não é perfeito, mas quebra o básico
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* Menu hambúrguer
   Simples: só abre/fecha. Poderia ser melhor acessível (aria-expanded), mas deixei assim.
*/
function configurarMenu(){
  var btn = document.getElementById('btn-hamburger');
  var nav = document.getElementById('main-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', function(){
    nav.classList.toggle('open');
  });
  // fecha quando clica em qualquer link (simples)
  var links = nav.querySelectorAll('a');
  for(var i=0;i<links.length;i++){
    links[i].addEventListener('click', function(){ nav.classList.remove('open'); });
  }
}

/* Renderiza notícias nas seções (Esportes, ENEM)
   Uso de for ao invés de forEach porque achei mais direto pra estudantes
*/
function renderizarNoticias(){
  var contEsportes = document.getElementById('esportes-cards');
  var contEnem = document.getElementById('enem-cards');
  if(!contEsportes && !contEnem) return; // página não tem área de notícias

  var lista = carregarNoticias();
  // ordenar por data (recente primeiro)
  lista.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });

  if(contEsportes) contEsportes.innerHTML = '';
  if(contEnem) contEnem.innerHTML = '';

  for(var i=0;i<lista.length;i++){
    var n = lista[i];
    var card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = '<h4>'+escapar(n.title)+'</h4>' +
                     '<div class="meta">'+escapar(n.theme)+' • '+new Date(n.date).toLocaleString()+'</div>' +
                     '<p>'+escapar(n.content)+'</p>';

    if(n.theme === 'Esportes' && contEsportes) contEsportes.appendChild(card);
    else if(n.theme === 'ENEM' && contEnem) contEnem.appendChild(card);
    else if(contEnem) contEnem.appendChild(card); // coloquei ENEM como fallback
  }
}

/* Lista no Admin com botão de deletar
   Deixei sem confirmação pra ficar mais simples; talvez colocar confirm() depois.
*/
function renderizarListaAdmin(){
  var listaEl = document.getElementById('admin-news-list');
  if(!listaEl) return;
  var lista = carregarNoticias();
  listaEl.innerHTML = '';
  if(lista.length === 0){ listaEl.textContent = 'Nenhuma notícia publicada.'; return; }

  // ordenar
  lista.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });

  for(var i=0;i<lista.length;i++){
    var n = lista[i];
    var item = document.createElement('div');
    item.className = 'admin-item';
    item.innerHTML = '<div><div class="title">'+escapar(n.title)+'</div>'+
                     '<div class="meta">'+escapar(n.theme)+' • '+new Date(n.date).toLocaleString()+'</div></div>'+
                     '<div><button class="delete" data-id="'+n.id+'">Deletar</button></div>';
    listaEl.appendChild(item);
  }

  // attach handlers
  var botoes = listaEl.querySelectorAll('button.delete');
  for(var j=0;j<botoes.length;j++){
    botoes[j].addEventListener('click', function(e){
      var id = Number(e.currentTarget.getAttribute('data-id'));
      excluirNoticia(id);
    });
  }
}

function excluirNoticia(id){
  var lista = carregarNoticias();
  // alternativa: usar filter (mais moderno), mas deixei o for para ser didático
  var nova = [];
  for(var i=0;i<lista.length;i++){
    if(lista[i].id !== id) nova.push(lista[i]);
  }
  salvarNoticias(nova);
  renderizarListaAdmin();
  renderizarNoticias();
}

/* Configurar formulário de publicação
   Observação: não validei tudo, deixei simples. Talvez depois colocar validação melhor.
*/
function configurarFormulario(){
  var form = document.getElementById('news-form');
  if(!form) return;
  var msg = document.getElementById('form-msg');
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var t = form.title.value.trim();
    var tema = form.theme.value;
    var c = form.content.value.trim();
    if(!t || !c) return; // simples
    var lista = carregarNoticias();
    var novo = { id: Date.now(), title: t, theme: tema, content: c, date: new Date().toISOString() };
    lista.push(novo);
    salvarNoticias(lista);
    form.reset();
    if(msg) msg.textContent = 'Notícia publicada com sucesso.';
    setTimeout(function(){ if(msg) msg.textContent = ''; }, 2000);
    renderizarListaAdmin();
    renderizarNoticias();
    // redirecionar pra página de notícias (só um location simples)
    window.location.href = 'noticias.html';
  });
}

// Inicialização da página
function iniciar(){
  configurarMenu();
  configurarFormulario();
  renderizarNoticias();
  renderizarListaAdmin();
}

// Espera o DOM
document.addEventListener('DOMContentLoaded', function(){ iniciar(); });

// Comentários extras: 
// - Talvez no futuro adicionar edição de notícia (não implementei pra ficar simples)
// - Podia ter usado bibliotecas, mas preferi JS puro para facilitar o entendimento
