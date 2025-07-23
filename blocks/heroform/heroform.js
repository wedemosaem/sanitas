// /blocks/hero/hero.js
const DEFAULT_IMG = 'https://placehold.co/1200x670';

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v; // avoid using it for the form, but ok for tiny svg if needed
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => c && node.append(c));
  return node;
}

function buildForm(idSuffix = '') {
  const form = el('div', { class: 'form-box' });
  form.append(
    el('h2', { text: 'TE ASESORAMOS SIN COMPROMISO' }),
    el('input', { type: 'text', placeholder: 'Nombre' }),
    el('input', { type: 'email', placeholder: 'Email' }),
    el('input', { type: 'tel', placeholder: 'Teléfono' }),
    (() => {
      const sel = el('select');
      sel.append(
        el('option', { disabled: '', selected: '', text: 'Provincia' }),
        el('option', { text: 'Madrid' }),
        el('option', { text: 'Barcelona' }),
        el('option', { text: 'Valencia' }),
      );
      return sel;
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
    el('button', { class: 'submit-btn', text: 'RECIBIR ASESORAMIENTO', type: 'button' }),
    el('div', { class: 'secure-note', text: '🔒 Tus datos se tratan de forma segura.' }),
  );
  return form;
}

export default function decorate(block) {
  block.classList.add('hero');

  // 3 cells: img, title, description
  const [imgCell, titleCell, descCell] = Array.from(block.children);

  const authoredImg = imgCell?.querySelector('img')?.src || imgCell?.textContent.trim();
  const bgSrc = authoredImg || DEFAULT_IMG;
  const title = (titleCell?.textContent || '').trim();
  // allow author to use two lines by separating paragraphs in the sheet (multiple rows) or <br>
  const description = (descCell?.innerHTML || '').trim(); // allows <br> if they use it

  // wipe authored content
  block.textContent = '';

  // bg image
  const bg = el('img', { src: bgSrc, alt: '', class: 'bg-img' });

  // overlay
  const contentLayer = el('div', { class: 'content-layer' });
  const heroInner    = el('div', { class: 'hero-inner' });

  // top bar
  const topBar = el('div', { class: 'top-bar' }, [
    el('div', { class: 'logo' }, el('img', {
      src: 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png',
      alt: 'Sanitas Logo',
    })),
    el('div', { class: 'phone-box', text: '📞 91 291 93 92' }),
  ]);

  // text block
  const textBlock = el('div', { class: 'text-block' }, [
    el('h1', { text: title }),
  ]);

  // description -> split by <br> if present
  const tmpDiv = el('div', { html: description }); // helper container
  if (description) {
    Array.from(tmpDiv.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const trimmed = node.textContent.trim();
        if (trimmed) textBlock.append(el('p', { text: trimmed }));
      } else if (node.nodeName === 'BR') {
        // skip, paragraphs already split
      } else {
        // wrap any other element into p to keep styling
        const p = el('p');
        p.append(node);
        textBlock.append(p);
      }
    });
  }

  // bottom content (desktop)
  const bottomContent = el('div', { class: 'bottom-content' }, [
    textBlock,
    (() => {
      const fb = buildForm(); // desktop version
      fb.classList.add('form-in-hero');
      return fb;
    })(),
  ]);

  heroInner.append(topBar, bottomContent);
  contentLayer.append(heroInner);

  // mobile holder
  const formHolder = el('div', { class: 'form-holder' }, buildForm('-m'));

  // assemble
  block.append(bg, contentLayer, formHolder);
}
