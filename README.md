# Organização de Voluntários

Site simples e responsivo para uma organização de voluntários, com páginas de Início, Projetos e Cadastro.

## Estrutura

- `index.html` — Página inicial com chamada para ação e seção "Quem Somos" com imagem.
- `projeto.html` — Explica os projetos e apresenta uma galeria de fotos.
- `cadastro.html` — Formulário de cadastro de voluntários com feedback de sucesso.
- `style.css` — Estilos globais, layout responsivo, cards, galeria e navegação mobile.
- `script.js` — Menu hambúrguer, máscara de telefone e tratativa de envio do formulário.
- `imagem/` — Fotos usadas no site (`voluntario.jpg`, `teste.jpg`).

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador.

No Windows (PowerShell), você pode abrir a pasta e começar pelo `index.html`:

```powershell
Start-Process .\index.html
```

## Acessibilidade e responsividade

- Navegação com botão de menu para telas pequenas (hambúrguer).
- Imagens com `alt` descritivo e `loading="lazy"` onde apropriado.
- Layouts em grid que se adaptam do mobile ao desktop.

## Créditos das imagens

As fotos estão na pasta `imagem/` e são referenciadas nas páginas. Substitua por suas imagens próprias caso necessário.