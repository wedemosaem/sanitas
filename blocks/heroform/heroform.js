// /blocks/hero-form/hero-form.js
const DEFAULT_IMG = 'https://placehold.co/1200x670';

export default function decorate(block) {
  block.classList.add('hero-form');

  // 1. read placeholders
  const [imgCell, titleCell, descCell] = Array.from(block.children);

  const rawImg = imgCell?.querySelector('img');
  const bgSrc = (rawImg && rawImg.src) || (imgCell?.textContent || '').trim() || DEFAULT_IMG;

  const titleHTML = (titleCell?.innerHTML || '').trim();
  const descText  = (descCell?.innerHTML || '').trim(); // allow simple <br> etc.

  // 2. clear authored table
  block.textContent = '';

  // 3. background
  const bgImg = document.createElement('img');
  bgImg.className = 'bg-img';
  bgImg.src = bgSrc;
  bgImg.alt = '';

  // 4. content layer
  const overlay = document.createElement('div');
  overlay.className = 'content-layer';

  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  // top bar (hardcoded logo + phone)
  const topBar = document.createElement('div');
  topBar.className = 'top-bar';

  const logoWrap = document.createElement('div');
  logoWrap.className = 'logo';
  logoWrap.innerHTML = `
    <img src="https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png" alt="Sanitas Logo">
  `;

  const phoneBox = document.createElement('div');
  phoneBox.className = 'phone-box';
  phoneBox.textContent = '📞 91 291 93 92';

  topBar.append(logoWrap, phoneBox);

  // bottom content (text + form)
  const bottom = document.createElement('div');
  bottom.className = 'bottom-content';

  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';
  textBlock.innerHTML = `
    <h1>${titleHTML || ''}</h1>
    <p>${descText || ''}</p>
  `;

  const formBox = document.createElement('div');
  formBox.className = 'form-box form-in-hero';
  formBox.innerHTML = `
    <h2>TE ASESORAMOS SIN COMPROMISO</h2>
    <input type="text" placeholder="Nombre">
    <input type="email" placeholder="Email">
    <input type="tel" placeholder="Teléfono">
    <select>
      <option disabled selected>Provincia</option>
      <option>Madrid</option>
      <option>Barcelona</option>
      <option>Valencia</option>
    </select>
    <div class="privacy">
      Consulta la <a href="#">información de privacidad</a>
    </div>
    <div class="checkbox">
      <input type="checkbox" id="consent">
      <label for="consent">Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.</label>
    </div>
    <button class="submit-btn">RECIBIR ASESORAMIENTO</button>
    <div class="secure-note">🔒 Tus datos se tratan de forma segura.</div>
  `;

  bottom.append(textBlock, formBox);
  inner.append(topBar, bottom);
  overlay.append(inner);

  // optional separate mobile form (same markup), toggled via CSS
  const mobileHolder = document.createElement('div');
  mobileHolder.className = 'form-holder';
  mobileHolder.append(formBox.cloneNode(true));

  // 5. assemble
  block.append(bgImg, overlay, mobileHolder);
}
