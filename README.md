# Atividade-para-o-vinicius

Breve instruções:

- Arquivos principais: `index.html`, `style.css`, `script.js`.
- As "5 páginas" (Home, Notícias, História, Admin, Referências) estão implementadas como arquivos HTML separados: `index.html`, `noticias.html`, `historia.html`, `admin.html`, `referencias.html`.
- Para editar:
  - Substitua o nome da escola em `index.html` (cabeçalho) e o ano no rodapé.
  - Notícias iniciais: edite a constante `noticiasIniciais` em `script.js` (comentários em PT-BR dentro do arquivo ajudando você).
- A página `referencias.html` agora contém uma lista inicial de vídeos PT-BR sugeridos para estudo (precisam ser verificados).
- Para testar localmente: execute um servidor HTTP simples, por exemplo:

```bash
python3 -m http.server
```

Abra `http://localhost:8000` e use o Painel Admin para publicar notícias que serão salvas em `localStorage`.