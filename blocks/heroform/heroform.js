// heroform.js
export default function decorate(block) {
  block.classList.add('heroform');

  // Expect 3 placeholders (rows/cols in authoring): Image | Title | Description
  const [imgHolder, titleHolder, descHolder] = Array.from(block.children);

  // 1) Background image URL (img tag or plain text)
  const imgEl = imgHolder.querySelector('img');
  const bgSrc = imgEl ? imgEl.src : imgHolder.textContent.trim();

  // 2) Rich text HTML (keep markup)
  const titleHTML = titleHolder.innerHTML.trim();
  const descHTML  = descHolder.innerHTML.trim();

  // 3) Clean block
  block.textContent = '';

  // --------- Build DOM ---------
  // Background image
  const bgImg = document.createElement('img');
  bgImg.className = 'bg-img';
  bgImg.src = bgSrc;
  bgImg.alt = '';

  // Overlay layers
  const contentLayer = div('content-layer');
  const heroInner    = div('hero-inner');

  // Top bar
  const topBar   = div('top-bar');
  const logoWrap = div('logo');
  const logoImg  = document.createElement('img');
  logoImg.src = 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png';
  logoImg.alt = 'Sanitas Logo';
  logoWrap.append(logoImg);

  const phoneBox = div('phone-box', '📞 91 291 93 92');

  topBar.append(logoWrap, phoneBox);

  // Bottom content
  const bottomContent = div('bottom-content');

  const textBlock = div('text-block');
  const titleWrap = div('title');
  titleWrap.innerHTML = titleHTML;
  const descWrap = div('description');
  descWrap.innerHTML = descHTML;
  textBlock.append(titleWrap, descWrap);

  // Form (desktop)
  const formDesktop = buildFormBox('form-in-hero');

  bottomContent.append(textBlock, formDesktop);

  heroInner.append(topBar, bottomContent);
  contentLayer.append(heroInner);

  block.append(bgImg, contentLayer);

  // Mobile form holder AFTER hero block
  const formHolder = div('form-holder');
  const formMobile = buildFormBox();
  formHolder.append(formMobile);
  block.after(formHolder);
}

// --------------- Helpers ----------------
function div(className, text) {
  const d = document.createElement('div');
  if (className) d.className = className;
  if (text) d.textContent = text;
  return d;
}

function buildFormBox(extraClass = '') {
  const formBox = div(`form-box ${extraClass}`.trim());

  const h2 = document.createElement('h2');
  h2.textContent = 'TE ASESORAMOS SIN COMPROMISO';
  formBox.append(h2);

  const name = input('text', 'Nombre');
  const email = input('email', 'Email');
  const phone = input('tel', 'Teléfono');

  const select = document.createElement('select');
  select.innerHTML = `
    <option disabled selected>Provincia</option>
    <option>Madrid</option>
    <option>Barcelona</option>
    <option>Valencia</option>
  `;

  const privacy = div('privacy');
  privacy.innerHTML = `Consulta la <a href="#">información de privacidad</a>`;

  const checkboxWrap = div('checkbox');
  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.id = `consent-${Math.random().toString(36).slice(2,7)}`;
  const lbl = document.createElement('label');
  lbl.setAttribute('for', chk.id);
  lbl.textContent = 'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.';
  checkboxWrap.append(chk, lbl);

  const btn = document.createElement('button');
  btn.className = 'submit-btn';
  btn.type = 'button';
  btn.textContent = 'RECIBIR ASESORAMIENTO';

  const secure = div('secure-note', '🔒 Tus datos se tratan de forma segura.');

  formBox.append(name, email, phone, select, privacy, checkboxWrap, btn, secure);
  return formBox;
}

function input(type, placeholder) {
  const i = document.createElement('input');
  i.type = type;
  i.placeholder = placeholder;
  return i;
}
