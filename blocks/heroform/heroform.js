/* eslint-disable import/no-cycle */
/**
 * Hero block – builds the DOM from config or default markup.
 * Expected block markup (authoring):
 *
 * | bg-image | logo | phone | title | subtitle | claim | form-fields(json) |
 *
 * Images can also come from metadata or authored <picture>.
 */
export default async function decorate(block) {
  // Read authored cells (simple spreadsheet-style authoring)
  const cells = [...block.children].map((row) => [...row.children].map((c) => c.textContent.trim()));

  // Helpers
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    return n;
  };

  // Data extraction with safe fallbacks
  const [
    [bgSrc = ''],
    [logoSrc = ''],
    [phone = ''],
    [h1 = ''],
    [subtitle = ''],
    [claim = ''],
    [formJSON = ''],
  ] = cells;

  // Wipe authoring table
  block.textContent = '';

  // ==== Structure ====
  const hero = el('div', 'hero');

  const bgImg = el('img', 'bg-img');
  bgImg.src = bgSrc;
  bgImg.alt = '';
  hero.append(bgImg);

  const overlay = el('div', 'content-layer');
  const inner = el('div', 'hero-inner');

  // top bar
  const topBar = el('div', 'top-bar');
  const logoBox = el('div', 'logo');
  if (logoSrc) {
    const logoImg = el('img');
    logoImg.src = logoSrc;
    logoImg.alt = 'logo';
    logoBox.append(logoImg);
  }
  const phoneBox = el('div', 'phone-box', phone);
  topBar.append(logoBox, phoneBox);

  // bottom content
  const bottom = el('div', 'bottom-content');
  const textBlock = el('div', 'text-block');
  textBlock.innerHTML = `
    <h1>${h1}</h1>
    <p>${subtitle}</p>
    <p>${claim}</p>
  `;

  // form desktop
  const formBox = buildForm(formJSON, 'form-in-hero');
  bottom.append(textBlock, formBox);

  inner.append(topBar, bottom);
  overlay.append(inner);
  hero.append(overlay);

  // mobile holder form
  const formHolder = el('div', 'form-holder');
  formHolder.append(buildForm(formJSON));

  block.append(hero, formHolder);
}

/**
 * Builds the form from a JSON definition or falls back to defaults.
 * @param {string} json
 * @param {string} extraClass
 * @returns HTMLElement
 */
function buildForm(json, extraClass = '') {
  let def;
  try {
    def = JSON.parse(json);
  } catch (e) {
    def = {
      title: 'TE ASESORAMOS SIN COMPROMISO',
      fields: [
        { type: 'text', placeholder: 'Nombre', name: 'nombre', required: true },
        { type: 'email', placeholder: 'Email', name: 'email', required: true },
        { type: 'tel', placeholder: 'Teléfono', name: 'telefono', required: true },
        {
          type: 'select',
          name: 'provincia',
          placeholder: 'Provincia',
          options: ['Madrid', 'Barcelona', 'Valencia'],
          required: true,
        },
      ],
      privacyText: 'Consulta la <a href="#">información de privacidad</a>',
      consentText:
        'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.',
      submitLabel: 'RECIBIR ASESORAMIENTO',
      secureNote: '🔒 Tus datos se tratan de forma segura.',
    };
  }

  const box = document.createElement('form');
  box.className = `form-box ${extraClass}`.trim();
  box.setAttribute('novalidate', '');

  const title = document.createElement('h2');
  title.textContent = def.title;
  box.append(title);

  def.fields.forEach((f) => {
    if (f.type === 'select') {
      const sel = document.createElement('select');
      sel.name = f.name;
      if (f.placeholder) {
        const opt = document.createElement('option');
        opt.disabled = true;
        opt.selected = true;
        opt.textContent = f.placeholder;
        sel.append(opt);
      }
      (f.options || []).forEach((o) => {
        const opt = document.createElement('option');
        opt.textContent = o;
        opt.value = o;
        sel.append(opt);
      });
      if (f.required) sel.required = true;
      box.append(sel);
    } else {
      const input = document.createElement('input');
      input.type = f.type || 'text';
      input.placeholder = f.placeholder || '';
      input.name = f.name || '';
      if (f.required) input.required = true;
      box.append(input);
    }
  });

  const privacy = document.createElement('div');
  privacy.className = 'privacy';
  privacy.innerHTML = def.privacyText;
  box.append(privacy);

  // consent checkbox
  const checkWrap = document.createElement('label');
  checkWrap.className = 'checkbox';
  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.name = 'consent';
  chk.required = true;
  checkWrap.append(chk, document.createTextNode(def.consentText));
  box.append(checkWrap);

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'submit-btn';
  btn.textContent = def.submitLabel;
  box.append(btn);

  const note = document.createElement('div');
  note.className = 'secure-note';
  note.textContent = def.secureNote;
  box.append(note);

  box.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: hook to your backend
    alert('¡Gracias! Nos pondremos en contacto.');
  });

  return box;
}
