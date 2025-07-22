// heroform.js
// Authoring columns: [image][title (rich text)][description (rich text)]
export default function decorate(block) {
    block.classList.add('heroform');
  
    const [imgHolder, titleHolder, descHolder] = Array.from(block.children);
  
    // image src (allow <img> or plain URL text)
    const imgEl = imgHolder?.querySelector('img');
    const bgSrc = imgEl ? imgEl.src : (imgHolder?.textContent.trim() || '');
  
    // Helper to move (not clone) all children to a fragment (keeps rich markup)
    const moveChildren = (srcEl) => {
      const frag = document.createDocumentFragment();
      if (!srcEl) return frag;
      while (srcEl.firstChild) frag.appendChild(srcEl.firstChild);
      return frag;
    };
  
    const titleFrag = moveChildren(titleHolder);
    const descFrag  = moveChildren(descHolder);
  
    // wipe authored cells
    block.textContent = '';
  
    // ---------- Build DOM ----------
    const hero = el('div', { class: 'hero' });
    const bg   = el('img', { class: 'bg-img', src: bgSrc, alt: '' });
    hero.append(bg);
  
    const contentLayer = el('div', { class: 'content-layer' });
    const heroInner    = el('div', { class: 'hero-inner' });
  
    // top bar
    const topBar   = el('div', { class: 'top-bar' });
    const logo     = el('div', { class: 'logo' });
    logo.append(el('img', { src: 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png', alt: 'Sanitas Logo' }));
    const phoneBox = el('div', { class: 'phone-box' }, '📞 91 291 93 92');
    topBar.append(logo, phoneBox);
  
    // bottom content
    const bottomContent = el('div', { class: 'bottom-content' });
  
    const textBlock = el('div', { class: 'text-block' });
    const h1 = el('h1');
    h1.append(titleFrag);
    const descWrap = el('div', { class: 'desc' });
    descWrap.append(descFrag);
    textBlock.append(h1, descWrap);
  
    // desktop form
    const formBoxDesktop = buildFormBox('consent');
    formBoxDesktop.classList.add('form-in-hero');
  
    bottomContent.append(textBlock, formBoxDesktop);
  
    heroInner.append(topBar, bottomContent);
    contentLayer.append(heroInner);
    hero.append(contentLayer);
  
    // mobile form holder (outside hero)
    const formHolder = el('div', { class: 'form-holder' });
    formHolder.append(buildFormBox('consent-m'));
  
    // mount
    block.append(hero, formHolder);
  }
  
  /**
   * Element factory
   * @param {string} tag
   * @param {Object} [attrs]
   * @param {string} [text]
   */
  function el(tag, attrs = {}, text) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v !== undefined && v !== null) node.setAttribute(k, v);
    });
    if (text) node.textContent = text;
    return node;
  }
  
  /**
   * Builds the form box DOM tree without innerHTML.
   * @param {string} consentId
   * @returns {HTMLDivElement}
   */
  function buildFormBox(consentId) {
    const box = el('div', { class: 'form-box' });
  
    const h2 = el('h2');
    h2.textContent = 'TE ASESORAMOS SIN COMPROMISO';
  
    const nameInp  = el('input', { type: 'text', placeholder: 'Nombre', 'aria-label': 'Nombre' });
    const mailInp  = el('input', { type: 'email', placeholder: 'Email', 'aria-label': 'Email' });
    const telInp   = el('input', { type: 'tel', placeholder: 'Teléfono', 'aria-label': 'Teléfono' });
  
    const sel = el('select', { 'aria-label': 'Provincia' });
    sel.append(
      option({ text: 'Provincia', disabled: true, selected: true }),
      option({ text: 'Madrid' }),
      option({ text: 'Barcelona' }),
      option({ text: 'Valencia' }),
    );
  
    const privacy = el('div', { class: 'privacy' });
    privacy.append(document.createTextNode('Consulta la '));
    const a = el('a', { href: '#' });
    a.textContent = 'información de privacidad';
    privacy.append(a);
  
    const checkboxWrap = el('div', { class: 'checkbox' });
    const chk = el('input', { type: 'checkbox', id: consentId });
    const lbl = el('label', { for: consentId });
    lbl.textContent = 'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.';
    checkboxWrap.append(chk, lbl);
  
    const btn = el('button', { class: 'submit-btn' });
    btn.textContent = 'RECIBIR ASESORAMIENTO';
  
    const secure = el('div', { class: 'secure-note' });
    secure.textContent = '🔒 Tus datos se tratan de forma segura.';
  
    box.append(h2, nameInp, mailInp, telInp, sel, privacy, checkboxWrap, btn, secure);
    return box;
  }
  
  function option({ text, value = text, disabled = false, selected = false }) {
    const o = document.createElement('option');
    o.textContent = text;
    o.value = value;
    if (disabled) o.disabled = true;
    if (selected) o.selected = true;
    return o;
  }
  