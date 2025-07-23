// textbanner.js
export default function decorate(block) {
    block.classList.add('tbx-textbanner');
  
    // 4 placeholders: rich text, alignment, font color, background color
    const [textEl, alignEl, fontEl, bgEl] = Array.from(block.children);
  
    const richHTML  = textEl?.innerHTML.trim() ?? '';
    const alignRaw  = alignEl?.textContent.trim().toLowerCase() ?? '';
    const fontColor = fontEl?.textContent.trim() ?? '';
    const bgRaw     = bgEl?.textContent.trim() ?? '';
  
    // normalize
    const align = ['left', 'center', 'right'].includes(alignRaw) ? alignRaw : 'left';
  
    // allow simple gradient "c1,c2"
    let background = bgRaw;
    if (bgRaw && bgRaw.includes(',')) {
      const [c1, c2] = bgRaw.split(',').map((c) => c.trim());
      background = `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`;
    }
  
    // wipe authored cells
    block.textContent = '';
  
    // inner wrapper that inherits the page/container width & margins
    const inner = document.createElement('div');
    inner.className = 'tbx-textbanner__inner';
    inner.style.textAlign = align;
    if (fontColor) inner.style.color = fontColor;
    if (background) inner.style.background = background;
  
    const content = document.createElement('div');
    content.className = 'tbx-textbanner__content';
    content.innerHTML = richHTML;
  
    inner.append(content);
    block.append(inner);
  }
  