// /blocks/hero/hero.js
const DEFAULT_IMG = 'https://placehold.co/1200x670';

function el(tag, props = {}, children = []) {
  const n = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else if (k === 'html') n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => c && n.append(c));
  return n;
}

function buildForm(idSuffix = '') {
  const box = el('div', { class: 'form-box' });
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
    el('div', { class: 'privacy' }, el('span', { html: 'Consulta la <a href="#">información de privacidad</a>' })),
    (() => {
      const wrap = el('div', { class: 'checkbox' });
      const id = `consent${idSuffix}`;
      wrap.append(
        el('input', { type: 'checkbox', id }),
        el('label', { for: id, text: 'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.' }),
      );
      return wrap;
    })(),
    el('button', { class: 'submit-btn', type: 'button', text: 'RECIBIR ASESORAMIENTO' }),
    el('div', { class: 'secure-note', text: '🔒 Tus datos se tratan de forma segura.' }),
  );
  return box;
}

export default function decorate(block) {
  block.classList.add('hero');

  // make the wrapping section full width
  const section = block.closest('.section');
  if (section) section.classList.add('hero-full');

  const [imgCell, titleCell, descCell] = Array.from(block.children);
  const authoredImg = imgCell?.querySelector('img')?.src || imgCell?.textContent.trim();
  const bgSrc = authoredImg || DEFAULT_IMG;
  const title = (titleCell?.textContent || '').trim();
  const descHTML = (descCell?.innerHTML || '').trim();

  block.textContent = '';

  const bg = el('img', { src: bgSrc, alt: '', class: 'bg-img' });

  const contentLayer = el('div', { class: 'content-layer' }); // no padding here
  const heroInner = el('div', { class: 'hero-inner' });        // padding moved here

  const topBar = el('div', { class: 'top-bar' }, [
    el('div', { class: 'logo' },
      el('img', {
        src: 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png',
        alt: 'Sanitas Logo',
      })),
    el('div', { class: 'phone-box', text: '📞 91 291 93 92' }),
  ]);

  const textBlock = el('div', { class: 'text-block' }, el('h1', { text: title }));
  // convert description HTML to <p> nodes
  if (descHTML) {
    const tmp = el('div', { html: descHTML });
    const paras = [];
    let current = '';
    tmp.childNodes.forEach((n) => {
      if (n.nodeName === 'BR') {
        if (current.trim()) paras.push(current.trim());
        current = '';
      } else {
        current += (n.textContent || '').trim() ? `${n.textContent}` : '';
      }
    });
    if (current.trim()) paras.push(current.trim());
    paras.forEach((t) => textBlock.append(el('p', { text: t })));
  }

  const desktopForm = buildForm();
  desktopForm.classList.add('form-in-hero');

  const bottomContent = el('div', { class: 'bottom-content' }, [textBlock, desktopForm]);

  heroInner.append(topBar, bottomContent);
  contentLayer.append(heroInner);

  const mobileHolder = el('div', { class: 'form-holder' }, buildForm('-m'));

  block.append(bg, contentLayer, mobileHolder);
}
