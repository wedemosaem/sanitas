// /blocks/hb-hero/hb-hero.js
const DEFAULT_IMG = 'https://placehold.co/1200x670';

function el(tag, attrs = {}, kids = []) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k === 'html') n.innerHTML = v; // only for small safe snippets
    else n.setAttribute(k, v);
  });
  (Array.isArray(kids) ? kids : [kids]).forEach((k) => k && n.append(k));
  return n;
}

function buildForm(suffix = '') {
  const box = el('div', { class: 'hb-form-box' });
  box.append(
    el('h2', { text: 'TE ASESORAMOS SIN COMPROMISO' }),
    el('input', { type: 'text', placeholder: 'Nombre' }),
    el('input', { type: 'email', placeholder: 'Email' }),
    el('input', { type: 'tel', placeholder: 'Teléfono' }),
    (() => {
      const s = el('select');
      s.append(
        el('option', { disabled: '', selected: '', text: 'Provincia' }),
        el('option', { text: 'Madrid' }),
        el('option', { text: 'Barcelona' }),
        el('option', { text: 'Valencia' }),
      );
      return s;
    })(),
    el('div', { class: 'hb-privacy' }, el('span', { html: 'Consulta la <a href="#">información de privacidad</a>' })),
    (() => {
      const wrap = el('div', { class: 'hb-checkbox' });
      const id = `hb-consent${suffix}`;
      wrap.append(
        el('input', { type: 'checkbox', id }),
        el('label', { for: id, text: 'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.' }),
      );
      return wrap;
    })(),
    el('button', { class: 'hb-submit-btn', type: 'button', text: 'RECIBIR ASESORAMIENTO' }),
    el('div', { class: 'hb-secure-note', text: '🔒 Tus datos se tratan de forma segura.' }),
  );
  return box;
}

export default function decorate(block) {
  // Make section full-bleed (remove EDS padding/width)
  const section = block.closest('.section');
  if (section) section.classList.add('hb-hero-full');

  block.classList.add('hb-hero');

  // read the 3 cells
  const [imgCell, titleCell, descCell] = Array.from(block.children);
  const imgSrc = imgCell?.querySelector('img')?.src || imgCell?.textContent.trim() || DEFAULT_IMG;
  const title = (titleCell?.textContent || '').trim();
  const descHTML = (descCell?.innerHTML || '').trim();

  // clear authored content
  block.textContent = '';

  // background
  const bg = el('img', { src: imgSrc, alt: '', class: 'hb-bg-img' });

  // overlay + inner
  const overlay = el('div', { class: 'hb-content-layer' });
  const inner   = el('div', { class: 'hb-hero-inner' });

  // top bar
  const topBar = el('div', { class: 'hb-top-bar' }, [
    el('div', { class: 'hb-logo' },
      el('img', {
        src: 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png',
        alt: 'Sanitas Logo',
      })),
    el('div', { class: 'hb-phone-box', text: '📞 91 291 93 92' }),
  ]);

  // text block
  const textBlock = el('div', { class: 'hb-text-block' }, el('h1', { text: title }));
  if (descHTML) {
    const tmp = el('div', { html: descHTML });
    // turn nodes into <p>
    let buf = '';
    tmp.childNodes.forEach((n) => {
      if (n.nodeName === 'BR') {
        if (buf.trim()) textBlock.append(el('p', { text: buf.trim() }));
        buf = '';
      } else {
        buf += n.textContent || '';
      }
    });
    if (buf.trim()) textBlock.append(el('p', { text: buf.trim() }));
  }

  const desktopForm = buildForm();
  desktopForm.classList.add('hb-form-in-hero');

  const bottom = el('div', { class: 'hb-bottom-content' }, [textBlock, desktopForm]);

  inner.append(topBar, bottom);
  overlay.append(inner);

  // mobile form holder
  const mobileHolder = el('div', { class: 'hb-form-holder' }, buildForm('-m'));

  block.append(bg, overlay, mobileHolder);
}
