// ========= PRODUTOS =========

const PRODUCTS = [
  //Packs primeiro
  {
    id: "pack-basico",
    name: "Pack de Presets (Básico)",
    price: 65.00,
    tag: "Pack",
    img: "assets/pack-basico.png"
  },
  {
    id: "pack-avancado",
    name: "Pack de Presets (Avançado)",
    price: 80.00,
    tag: "Pack",
    img: "assets/pack-avancado.png"
  },

  // Loja
  {
    id: "loja-basico",
    name: "Preset de Loja (Básico)",
    price: 25.00,
    tag: "Loja",
    img: "assets/loja-basico.png"
  },
  {
    id: "loja-avancado",
    name: "Preset de Loja (Avançado)",
    price: 30.00,
    tag: "Loja",
    img: "assets/loja-avancado.png"
  },

  // Blog
  {
    id: "blog-basico",
    name: "Preset de Blog (Básico)",
    price: 25.00,
    tag: "Blog",
    img: "assets/blog-basico.png"
  },
  {
    id: "blog-avancado",
    name: "Preset de Blog (Avançado)",
    price: 30.00,
    tag: "Blog",
    img: "assets/blog-avancado.png"
  },

  // Licença
  {
    id: "licenca",
    name: "Licença (válida para todos os presets)",
    price: 10.00,
    tag: "Licença",
    img: "assets/licenca.png"
  },

  // Portfólio
  {
    id: "portfolio-basico",
    name: "Preset de Portfólio (Básico)",
    price: 25.00,
    tag: "Portfólio",
    img: "assets/portfolio-basico.png"
  },
  {
    id: "portfolio-avancado",
    name: "Preset de Portfólio (Avançado)",
    price: 30.00,
    tag: "Portfólio",
    img: "assets/portfolio-avancado.png"
  }
];

// ========= LÓGICA DO SITE =========

const $ = (q, el=document) => el.querySelector(q);
const grid = $('.grid');
const cartDrawer = $('#cartDrawer');
const openCartBtn = $('#openCart');
const closeCartBtn = $('#closeCart');
const scrim = $('#scrim');
const cartItemsEl = $('#cartItems');
const cartTotalEl = $('#cartTotal');
const cartCountEl = $('#cartCount');
const checkoutBtn = $('#checkoutBtn');
const checkoutModal = $('#checkoutModal');
const checkoutContent = $('#checkoutContent');

const cart = new Map();
const money = n => n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

// ====== Render catálogo ======

function renderProducts(){
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card reveal" data-id="${p.id}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="card-body">
        <div class="card-title">
          <h3>${p.name}</h3>
          <span class="price">${money(p.price)}</span>
        </div>
        <span class="badge">${p.tag}</span>
        <div class="actions">
          <button class="btn ghost add">Adicionar</button>
          <button class="icon-btn buy">Comprar</button>
        </div>
      </div>
    </article>
  `).join('');
}
renderProducts();

// ====== Efeitos de revelação ao rolar ======

const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.animation = 'cardIn .6s ease both'; obs.unobserve(e.target); }
  });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ====== Carrinho ======

function refreshCart(){
  let total = 0;
  cartItemsEl.innerHTML = [...cart.values()].map(item=>{
    const sub = item.qty * item.price; total += sub;
    return `
      <div class="item">
        <img src="${item.img}" alt="">
        <div>
          <h4>${item.name}</h4>
          <div class="muted">${money(item.price)} • ${item.tag}</div>
        </div>
        <div class="qty">
          <button class="icon-btn" data-act="dec" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="icon-btn" data-act="inc" data-id="${item.id}">+</button>
          <button class="icon-btn" data-act="rm" data-id="${item.id}">✕</button>
        </div>
      </div>
    `;
  }).join('') || `<p class="muted">Seu carrinho está vazio.</p>`;
  cartTotalEl.textContent = money(total);
  cartCountEl.textContent = [...cart.values()].reduce((a,b)=>a+b.qty,0);
}
function openCart(){ cartDrawer.classList.add('open'); scrim.classList.add('show'); }
function closeCart(){ cartDrawer.classList.remove('open'); scrim.classList.remove('show'); }
openCartBtn.addEventListener('click', openCart);
closeCartBtn?.addEventListener('click', closeCart);
scrim.addEventListener('click', closeCart);

grid.addEventListener('click', e=>{
  const card = e.target.closest('.card'); if(!card) return;
  const id = card.dataset.id;
  const prod = PRODUCTS.find(p=>p.id===id);

  if(e.target.classList.contains('add')){
    const cur = cart.get(id) || { ...prod, qty:0 }; cur.qty++; cart.set(id, cur);
    toast(`${prod.name} adicionado ao carrinho`); refreshCart();
  }
  if(e.target.classList.contains('buy')){
    const cur = cart.get(id) || { ...prod, qty:0 }; cur.qty++; cart.set(id, cur);
    refreshCart(); openCart();
  }
});

cartItemsEl.addEventListener('click', e=>{
  const btn = e.target.closest('button[data-act]'); if(!btn) return;
  const id = btn.dataset.id; const row = cart.get(id); if(!row) return;
  const act = btn.dataset.act;
  if(act==='inc') row.qty++;
  if(act==='dec') row.qty = Math.max(1, row.qty-1);
  if(act==='rm') cart.delete(id);
  refreshCart();
});

function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style,{
    position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',
    background: 'linear-gradient(180deg,#eaf6ff,#bfe3ff)', color:'#00223d',
    padding:'10px 14px',borderRadius:'12px',fontWeight:'800',
    boxShadow:'0 12px 30px rgba(58,163,255,.35)',zIndex:1000,transition:'opacity .3s'
  });
  document.body.appendChild(t);
  setTimeout(()=>t.style.opacity=.0,1600);
  setTimeout(()=>t.remove(),2000);
}

// ====== CHECKOUT PIX ======

checkoutBtn.addEventListener('click', async ()=>{
  const items = [...cart.values()].map(({id,name,price,qty})=>({id,name,price,qty}));
  const total = items.reduce((s,i)=>s+i.price*i.qty,0);
  if(total<=0){ toast('Carrinho vazio'); return; }

  // createPixCharge vem de payment-api.js

  const charge = await createPixCharge(total, items);

  checkoutContent.innerHTML = `
    <p>Use o QR Code ou a chave <strong>copia e cola</strong> abaixo.<br>Valor: <strong>${money(total)}</strong></p>
    <div class="qr"><img src="${charge.qr}" alt="QR PIX"></div>
    <div class="kv">
      <label>Chave copia e cola:</label>
      <code>${charge.copiaCola}</code>
      <small class="muted">TXID: ${charge.txid}</small>
    </div>
    <p class="muted">Após a confirmação do pagamento, a entrega será realizada no servidor do Discord da PixelDrop.
        Antes de entrar no Discord, para poder saber como resgatar seu produto leia abaixo</p>
    <p class="muted">Ao entrar no Discord, leia o canal <strong>📜-𝑅𝑒𝑔𝓇𝒶𝓈</strong> scrolle ate em baixo e clique no ✅ para liberar todo o servidor.</p>
    <p class="muted">Depois vá até o canal <strong>📩・𝒶𝒷𝓇𝒾𝓇-𝓉𝒾𝒸𝓀𝑒𝓉</strong> clique na caixa de seleção e va em adquirir produto, apresente o comprovante da compra.</p>
     <a href="https://discord.gg/Sk9nc7wWFz" target="_blank" class="btn">Entrar no Discord</a>
  `;
  checkoutModal.showModal();
});

// === CUPONS CONFIG ===
const COUPONS = {
  "bemvindo5": { discount: 5, min: 25 },
  "pixel10": { discount: 10, min: 50 }
};

let appliedDiscount = 0;
let usedCoupon = null;

const applyBtn = document.getElementById("applyCoupon");
const couponInput = document.getElementById("couponInput");
const couponMsg = document.getElementById("couponMsg");

function showCouponMsg(text, type = "success") {
  couponMsg.textContent = text;
  couponMsg.className = `show ${type}`;
  setTimeout(() => (couponMsg.classList.remove("show")), 3000);
}

applyBtn.addEventListener("click", () => {
  const code = couponInput.value.trim().toLowerCase();
  const total = [...cart.values()].reduce((s, i) => s + i.price * i.qty, 0);

  if (usedCoupon) {
    showCouponMsg("Só é permitido 1 cupom por compra.", "error");
    return;
  }

  if (!code) {
    couponInput.classList.add("error");
    setTimeout(() => couponInput.classList.remove("error"), 400);
    return;
  }

  const coupon = COUPONS[code];
  if (coupon && total >= coupon.min) {
    const { discount } = coupon;
    appliedDiscount = discount;
    usedCoupon = code;
    showCouponMsg(`Cupom ${code} aplicado: ${discount}% off`, "success");

    // feedback visual
    applyBtn.textContent = "✅ Aplicado!";
    applyBtn.classList.add("applied");
    setTimeout(() => {
      applyBtn.textContent = "Aplicar";
      applyBtn.classList.remove("applied");
    }, 2000);

    couponInput.value = "";
  } else if (coupon && total < coupon.min) {
    showCouponMsg(`Valor mínimo: R$ ${coupon.min.toFixed(2)}`, "error");
    couponInput.classList.add("error");
    setTimeout(() => couponInput.classList.remove("error"), 400);
  } else {
    showCouponMsg("Cupom inválido ❌", "error");
    couponInput.classList.add("error");
    setTimeout(() => couponInput.classList.remove("error"), 400);
  }

  refreshCart();
});

// Verificar se é a primeira visita
function checkFirstVisit() {
  const hasVisited = localStorage.getItem('hasVisited');
  
  if (!hasVisited) {
    // Mostrar o modal após um pequeno delay
    setTimeout(() => {
      showModal();
    }, 1000);
    
    // Marcar que já visitou
    localStorage.setItem('hasVisited', 'true');
  }
}

// Mostrar modal
function showModal() {
  const modal = document.getElementById('discordModal');
  modal.style.display = 'block';
}

// Fechar modal
function closeModal() {
  const modal = document.getElementById('discordModal');
  modal.style.display = 'none';
}

// Fechar permanentemente
function closePermanently() {
  closeModal();
  localStorage.setItem('discordModalClosed', 'true');
}

// Event listeners quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('discordModal');
  const closeBtn = document.querySelector('.close');
  const closePermBtn = document.getElementById('closePermanently');
  
  // Só mostrar se não foi fechado permanentemente
  if (!localStorage.getItem('discordModalClosed')) {
    checkFirstVisit();
  }
  
  // Fechar ao clicar no X
  closeBtn.addEventListener('click', closeModal);
  
  // Fechar permanentemente
  closePermBtn.addEventListener('click', closePermanently);
  
  // Fechar ao clicar fora do modal
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
});

// ====== CARRINHO ======
function refreshCart() {
  let total = 0;
  cartItemsEl.innerHTML = [...cart.values()].map(item => {
    const sub = item.qty * item.price;
    total += sub;
    return `
      <div class="item">
        <img src="${item.img}" alt="">
        <div>
          <h4>${item.name}</h4>
          <div class="muted">${money(item.price)} • ${item.tag}</div>
        </div>
        <div class="qty">
          <button class="icon-btn" data-act="dec" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="icon-btn" data-act="inc" data-id="${item.id}">+</button>
          <button class="icon-btn" data-act="rm" data-id="${item.id}">✕</button>
        </div>
      </div>
    `;
  }).join('') || `<p class="muted">Seu carrinho está vazio.</p>`;

  // aplica desconto se houver
  let totalComDesconto = total;
  if (appliedDiscount > 0) {
    const descontoValor = (total * appliedDiscount) / 100;
    totalComDesconto -= descontoValor;
    couponMsg.textContent = `Cupom ${usedCoupon} aplicado (-${appliedDiscount}%)`;
  }

  cartTotalEl.textContent = money(totalComDesconto);
  cartCountEl.textContent = [...cart.values()].reduce((a, b) => a + b.qty, 0);

  // salva o carrinho atual no localStorage
  const carrinho = {
    items: [...cart.values()],
    total: totalComDesconto
  };
  localStorage.setItem("pixelDropCart", JSON.stringify(carrinho));
}

// eventos do carrinho
cartItemsEl.addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.dataset.id;
  const row = cart.get(id);
  if (!row) return;
  const act = btn.dataset.act;
  if (act === 'inc') row.qty++;
  if (act === 'dec') row.qty = Math.max(1, row.qty - 1);
  if (act === 'rm') cart.delete(id);
  refreshCart();
});

// ====== CHECKOUT ======
checkoutBtn.addEventListener('click', () => {
  // cria um snapshot do carrinho atual (garantido)
  const items = [...cart.values()].map(({ id, name, price, qty, img }) => ({
    id, name, price, qty, img
  }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0 || total <= 0) {
    toast("Carrinho vazio 😢");
    return;
  }

  // aplica desconto se tiver
  let totalFinal = total;
  if (appliedDiscount > 0) {
    totalFinal -= (total * appliedDiscount) / 100;
  }

  // salva carrinho completo antes de redirecionar
  const dados = { items, total: totalFinal };
  localStorage.setItem("pixelDropCart", JSON.stringify(dados));

  // redireciona
  window.location.href = "payment.html";
});

checkoutBtn.addEventListener('click', () => {
  const items = [...cart.values()].map(({ id, name, price, qty, img }) => ({
    id, name, price, qty, img
  }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  if (items.length === 0 || total <= 0) {
    toast("Carrinho vazio 😢");
    return;
  }

  let totalFinal = total;
  if (appliedDiscount > 0) {
    totalFinal -= (total * appliedDiscount) / 100;
  }

  const dados = { items, total: totalFinal };
  localStorage.setItem("pixelDropCart", JSON.stringify(dados));

  // salva o nome do cupom usado (pra mostrar no payment)
  if (usedCoupon) localStorage.setItem("cupomUsado", usedCoupon);
  else localStorage.removeItem("cupomUsado");

  window.location.href = "payment.html";
});

// ===== CARROSSEL =====
document.addEventListener('DOMContentLoaded', function() {
  const carrossel = document.getElementById('carrossel');
  const indicadoresContainer = document.getElementById('indicadores');
  const btnAnterior = document.getElementById('anterior');
  const btnProximo = document.getElementById('proximo');
  
  // Array de imagens do carrossel - ADICIONE MAIS IMAGENS AQUI
  const slidesData = [
    { 
      imagem: "assets/suporte24H.png", 
      link: "contato.html"  // Altere para o link desejado
    },
    { 
      imagem: "assets/Discord.png", 
      link: "https://discord.gg/Sk9nc7wWFz"
    },
    { 
      imagem: "assets/melhorespreços.png", 
      link: "#catalogo"  // Link para a seção de produtos
    }
    // PARA ADICIONAR MAIS IMAGENS, COLE AQUI:
    // { 
    //   imagem: "assets/nova-imagem.png", 
    //   link: "https://exemplo.com" 
    // },
  ];

  let slideAtual = 0;
  const totalSlides = slidesData.length;

  // Criar slides
  slidesData.forEach((slide, index) => {
    const slideElement = document.createElement('a');
    slideElement.className = 'slide';
    slideElement.href = slide.link;
    slideElement.innerHTML = `
      <img src="${slide.imagem}" alt="Slide ${index + 1}">
    `;
    carrossel.appendChild(slideElement);

    // Criar indicadores
    const indicador = document.createElement('button');
    indicador.className = 'indicador' + (index === 0 ? ' ativo' : '');
    indicador.setAttribute('data-indice', index);
    indicadoresContainer.appendChild(indicador);
  });

  const slides = document.querySelectorAll('.slide');
  const indicadores = document.querySelectorAll('.indicador');

  function atualizarCarrossel() {
    slides.forEach((slide, index) => {
      slide.className = 'slide';
      
      // Calcular a posição relativa considerando loop infinito
      let posicaoRelativa = (index - slideAtual + totalSlides) % totalSlides;
      
      if (posicaoRelativa === 0) {
        // Slide central
        slide.classList.add('central');
      } else if (posicaoRelativa === 1) {
        // Slide direito
        slide.classList.add('direita-1');
      } else if (posicaoRelativa === totalSlides - 1) {
        // Slide esquerdo
        slide.classList.add('esquerda-1');
      } else {
        // Slides escondidos (apenas 3 visíveis)
        slide.classList.add('escondido');
      }
    });

    // Atualizar indicadores
    indicadores.forEach((ind, index) => {
      ind.classList.toggle('ativo', index === slideAtual);
    });
  }

  // Próximo slide com loop infinito
  btnProximo.addEventListener('click', function() {
    slideAtual = (slideAtual + 1) % totalSlides;
    atualizarCarrossel();
  });

  // Slide anterior com loop infinito
  btnAnterior.addEventListener('click', function() {
    slideAtual = (slideAtual - 1 + totalSlides) % totalSlides;
    atualizarCarrossel();
  });

  // Navegação pelos indicadores
  indicadores.forEach(ind => {
    ind.addEventListener('click', function() {
      slideAtual = parseInt(this.getAttribute('data-indice'));
      atualizarCarrossel();
    });
  });

  // Auto-play a cada 6 segundos
  setInterval(function() {
    slideAtual = (slideAtual + 1) % totalSlides;
    atualizarCarrossel();
  }, 6000);

  // Inicializar
  atualizarCarrossel();
});