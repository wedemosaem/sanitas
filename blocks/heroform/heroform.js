// heroform.js
// Expected spreadsheet columns: [image][title rich][description rich]
// Title & description keep their internal markup by moving child nodes (not using innerHTML)

export default function decorate(block) {
  block.classList.add('heroform');

  const [imgCell, titleCell, descCell] = Array.from(block.children);

  // Resolve bg image
  const authoredImg = imgCell?.querySelector('img');
  const bgSrc = authoredImg ? authoredImg.src : (imgCell?.textContent.trim() || '');

  // Move children to fragments (preserves rich HTML without innerHTML)
  const titleFrag = moveChildren(titleCell);
  const descFrag  = moveChildren(descCell);

  // Clear original authored cells
  block.textContent = '';

  /* -------- Build DOM -------- */
  const hero = el('div', { class: 'hero' });
  const bgImg = el('img', { class: 'bg-img', src: bgSrc, alt: '' });
  hero.append(bgImg);

  const contentLayer = el('div', { class: 'content-layer' });
  const heroInner    = el('div', { class: 'hero-inner' });

  // Top bar
  const topBar   = el('div', { class: 'top-bar' });
  const logo     = el('div', { class: 'logo' });
  logo.append(el('img', { src: 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png', alt: 'Sanitas Logo' }));
  const phoneBox = el('div', { class: 'phone-box' }, '📞 91 291 93 92');
  topBar.append(logo, phoneBox);

  // Bottom content
  const bottomContent = el('div', { class: 'bottom-content' });

  const textBlock = el('div', { class: 'text-block' });
  const h1 = el('h1'); h1.append(titleFrag);
  textBlock.append(h1);

  // wrap desc fragment to keep spacing rules
  // original HTML used <p>. We'll just append whatever came.
  const descWrap = document.createDocumentFragment();
  descWrap.append(descFrag);
  textBlock.append(descWrap);

  // Desktop form
  const formDesktop = buildFormBox('consent');
  formDesktop.classList.add('form-in-hero');

  bottomContent.append(textBlock, formDesktop);

  heroInner.append(topBar, bottomContent);
  contentLayer.append(heroInner);
  hero.append(contentLayer);

  // Mobile form holder under hero
  const formHolder = el('div', { class: 'form-holder' });
  formHolder.append(buildFormBox('consent-m'));

  // Mount everything
  block.append(hero, formHolder);
}

/* ---------- helpers ---------- */

function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) node.setAttribute(k, v);
  });
  if (text !== undefined) node.textContent = text;
  return node;
}

function option({ text, value = text, disabled = false, selected = false }) {
  const o = document.createElement('option');
  o.textContent = text;
  o.value = value;
  if (disabled) o.disabled = true;
  if (selected) o.selected = true;
  return o;
}

function buildFormBox(consentId) {
  const box = el('div', { class: 'form-box' });

  const h2 = el('h2'); h2.textContent = 'TE ASESORAMOS SIN COMPROMISO';

  const nameInp = el('input', { type: 'text', placeholder: 'Nombre', 'aria-label': 'Nombre' });
  const mailInp = el('input', { type: 'email', placeholder: 'Email', 'aria-label': 'Email' });
  const telInp  = el('input', { type: 'tel', placeholder: 'Teléfono', 'aria-label': 'Teléfono' });

  const provSel = el('select', { 'aria-label': 'Provincia' });
  provSel.append(
    option({ text: 'Provincia', disabled: true, selected: true }),
    option({ text: 'Madrid' }),
    option({ text: 'Barcelona' }),
    option({ text: 'Valencia' }),
  );

  const privacy = el('div', { class: 'privacy' });
  privacy.append(document.createTextNode('Consulta la '));
  const a = el('a', { href: '#' }); a.textContent = 'información de privacidad';
  privacy.append(a);

  const chkWrap = el('div', { class: 'checkbox' });
  const chk = el('input', { type: 'checkbox', id: consentId });
  const lbl = el('label', { for: consentId });
  lbl.textContent = 'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.';
  chkWrap.append(chk, lbl);

  const btn = el('button', { class: 'submit-btn', type: 'button' }, 'RECIBIR ASESORAMIENTO');

  const secure = el('div', { class: 'secure-note' }, '🔒 Tus datos se tratan de forma segura.');

  box.append(h2, nameInp, mailInp, telInp, provSel, privacy, chkWrap, btn, secure);
  return box;
}

function moveChildren(srcEl) {
  const frag = document.createDocumentFragment();
  if (!srcEl) return frag;
  while (srcEl.firstChild) {
    frag.appendChild(srcEl.firstChild);
  }
  return frag;
}
