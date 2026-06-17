/* ============================================================
   PARÓQUIA DE SANTO ESTEVÃO – SCRIPT PRINCIPAL
   script.js

   ÍNDICE:
   1. Navbar – fica sólida ao fazer scroll
   2. Menu hambúrguer mobile
   3. Animações de entrada (Intersection Observer)
   4. Botão voltar ao topo
   5. Galeria – Lightbox
   6. Destaque do link ativo na navbar
   7. Ano atual no footer
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR – muda aparência ao rolar a página
   Adiciona/remove a classe .scrolled no elemento <header>
   O visual .scrolled é definido em style.css
   ============================================================ */
const navbar = document.getElementById('navbar');

function atualizarNavbar() {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Executa ao rolar e também imediatamente ao carregar
window.addEventListener('scroll', atualizarNavbar, { passive: true });
atualizarNavbar();


/* ============================================================
   2. MENU HAMBÚRGUER MOBILE
   Controla abertura/fechamento do menu lateral
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-menu-mobile');

/** Abre ou fecha o menu mobile */
function alternarMenu(forcarFechamento = false) {
    const deveAbrir = forcarFechamento ? false : !hamburger.classList.contains('open');

    hamburger.classList.toggle('open', deveAbrir);
    navLinks.classList.toggle('open', deveAbrir);
    hamburger.setAttribute('aria-expanded', deveAbrir);

    // Trava o scroll do body quando o menu estiver aberto
    document.body.style.overflow = deveAbrir ? 'hidden' : '';
}

// Abre/fecha ao clicar no botão hambúrguer
hamburger.addEventListener('click', () => alternarMenu());

// Fecha o menu ao clicar em qualquer link de navegação
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => alternarMenu(true));
});

// Fecha ao clicar fora do menu (no conteúdo da página)
document.addEventListener('click', (e) => {
    const menuAberto = navLinks.classList.contains('open');
    const clicouFora = !navLinks.contains(e.target) && !hamburger.contains(e.target);

    if (menuAberto && clicouFora) {
        alternarMenu(true);
    }
});

// Fecha com a tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        alternarMenu(true);
        hamburger.focus(); // Devolve o foco ao botão (acessibilidade)
    }
});


/* ============================================================
   3. ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER)
   Detecta quando os elementos entram na tela e adiciona .visible
   O efeito visual é definido em style.css (.fade-up, .fade-left, .fade-right)
   
   Para adicionar animação a um novo elemento:
   basta adicionar a classe "fade-up", "fade-left" ou "fade-right" no HTML
   ============================================================ */
const elementosAnimados = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const observadorEntrada = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Para de observar após animar (cada elemento anima só uma vez)
                observadorEntrada.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1,          // Elemento precisa estar 10% visível
        rootMargin: '0px 0px -40px 0px' // Ativa um pouco antes do elemento entrar
    }
);

elementosAnimados.forEach(el => observadorEntrada.observe(el));


/* ============================================================
   4. BOTÃO VOLTAR AO TOPO
   Aparece quando o usuário rola mais de 400px para baixo
   ============================================================ */
const btnTopo = document.getElementById('btn-topo');

window.addEventListener('scroll', () => {
    btnTopo.classList.toggle('visivel', window.scrollY > 400);
}, { passive: true });

btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   5. GALERIA – LIGHTBOX
   Abre uma imagem ampliada ao clicar em qualquer foto da galeria
   Fecha ao clicar no X, fora da imagem, ou pressionar Escape
   ============================================================ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

/** Abre o lightbox exibindo a imagem clicada */
function abrirLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus(); // Foco no botão de fechar (acessibilidade)
}

/** Fecha o lightbox */
function fecharLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
}

// Vincula o clique a cada item da galeria
document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) abrirLightbox(img.src, img.alt);
    });

    // Acessibilidade: permitir abertura com Enter/Espaço
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const img = item.querySelector('img');
            if (img) abrirLightbox(img.src, img.alt);
        }
    });
});

// Fecha ao clicar no botão X
lightboxClose.addEventListener('click', fecharLightbox);

// Fecha ao clicar no fundo escuro (fora da imagem)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fecharLightbox();
});

// Fecha com a tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        fecharLightbox();
    }
});


/* ============================================================
   6. DESTAQUE DO LINK ATIVO NA NAVBAR
   Marca com a classe .active o link correspondente à
   seção que está visível na tela enquanto o usuário scrolla
   ============================================================ */
const secoes   = document.querySelectorAll('section[id]');
const linksNav = document.querySelectorAll('.nav-links-left a, .nav-links-right a, .mobile-links a');

const observadorSecao = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                linksNav.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    },
    {
        threshold: 0.35 // Seção precisa estar 35% visível para ativar o link
    }
);

secoes.forEach(s => observadorSecao.observe(s));


/* ============================================================
   7. ANO ATUAL NO FOOTER
   Atualiza automaticamente sem precisar editar o HTML
   ============================================================ */
const anoAtualEl = document.getElementById('ano-atual');
if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
}
