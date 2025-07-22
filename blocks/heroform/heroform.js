export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'hero';

  // Background image
  const bgImg = document.createElement('img');
  bgImg.src = 'https://serviciosdesalud.sanitas.es/uploads/66e1a26e9ba67.jpg';
  bgImg.alt = 'Fondo Sanitas';
  bgImg.className = 'bg-img';
  container.appendChild(bgImg);

  // Overlay layer
  const overlay = document.createElement('div');
  overlay.className = 'content-layer';

  const heroInner = document.createElement('div');
  heroInner.className = 'hero-inner';

  // Top bar
  const topBar = document.createElement('div');
  topBar.className = 'top-bar';

  const logo = document.createElement('div');
  logo.className = 'logo';
  const logoImg = document.createElement('img');
  logoImg.src = 'https://serviciosdesalud.sanitas.es/assets/img/logo-sanitas-b.png';
  logoImg.alt = 'Sanitas Logo';
  logo.appendChild(logoImg);

  const phoneBox = document.createElement('div');
  phoneBox.className = 'phone-box';
  phoneBox.textContent = '📞 91 291 93 92';

  topBar.appendChild(logo);
  topBar.appendChild(phoneBox);

  // Bottom content
  const bottomContent = document.createElement('div');
  bottomContent.className = 'bottom-content';

  // Text block
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';
  const h1 = document.createElement('h1');
  h1.textContent = 'MICROESPUMA PARA VARICES';
  const p1 = document.createElement('p');
  p1.textContent = 'Tratamiento de varices sin cirugía ni cicatrices';
  const p2 = document.createElement('p');
  p2.textContent = 'Te cuidamos, con o sin seguro';
  textBlock.appendChild(h1);
  textBlock.appendChild(p1);
  textBlock.appendChild(p2);

  // Form
  const formBox = document.createElement('div');
  formBox.className = 'form-box form-in-hero';

  const formTitle = document.createElement('h2');
  formTitle.textContent = 'TE ASESORAMOS SIN COMPROMISO';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Nombre';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';

  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.placeholder = 'Teléfono';

  const select = document.createElement('select');
  const optionDefault = document.createElement('option');
  optionDefault.disabled = true;
  optionDefault.selected = true;
  optionDefault.textContent = 'Provincia';
  select.appendChild(optionDefault);
  ['Madrid', 'Barcelona', 'Valencia'].forEach(city => {
    const opt = document.createElement('option');
    opt.textContent = city;
    select.appendChild(opt);
  });

  const privacy = document.createElement('div');
  privacy.className = 'privacy';
  privacy.innerHTML = 'Consulta la <a href="#">información de privacidad</a>';

  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox';
  const cbInput = document.createElement('input');
  cbInput.type = 'checkbox';
  cbInput.id = 'consent';
  const cbLabel = document.createElement('label');
  cbLabel.setAttribute('for', 'consent');
  cbLabel.textContent = 'Consiento el tratamiento y la cesión por parte de Sanitas a las entidades del grupo Sanitas.';
  checkbox.appendChild(cbInput);
  checkbox.appendChild(cbLabel);

  const button = document.createElement('button');
  button.className = 'submit-btn';
  button.textContent = 'RECIBIR ASESORAMIENTO';

  const note = document.createElement('div');
  note.className = 'secure-note';
  note.textContent = '🔒 Tus datos se tratan de forma segura.';

  // Assemble form
  [formTitle, nameInput, emailInput, phoneInput, select, privacy, checkbox, button, note]
    .forEach(el => formBox.appendChild(el));

  bottomContent.appendChild(textBlock);
  bottomContent.appendChild(formBox);

  // Assemble final structure
  heroInner.appendChild(topBar);
  heroInner.appendChild(bottomContent);
  overlay.appendChild(heroInner);
  container.appendChild(overlay);

  block.appendChild(container);
}
