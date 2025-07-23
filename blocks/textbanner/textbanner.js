// textbanner.js
export default function decorate(block) {
    block.classList.add('tbx-textbanner');
  
    const [
      textHolder,
      alignHolder,
      fontColorHolder,
      bgColorHolder
    ] = Array.from(block.children);
  
    const richHTML  = textHolder?.innerHTML.trim()     || '';
    const alignRaw  = alignHolder?.textContent.trim().toLowerCase() || 'left';
    const fontColor = fontColorHolder?.textContent.trim() || '';
    const bgRaw     = bgColorHolder?.textContent.trim() || '';
  
    const align = ['left','center','right'].includes(alignRaw) ? alignRaw : 'left';
    let background = bgRaw;
    if (bgRaw.includes(',')) {
      const [c1,c2] = bgRaw.split(',').map(s=>s.trim());
      background = `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`;
    }
  
    block.textContent = '';
  
    const wrapper = document.createElement('div');
    wrapper.className = 'tbx-textbanner__inner';
    wrapper.style.textAlign = align;
    if (fontColor)   wrapper.style.color      = fontColor;
    if (background)  wrapper.style.background = background;
  
    const content = document.createElement('div');
    content.className = 'tbx-textbanner__content';
    content.innerHTML = richHTML;
  
    wrapper.append(content);
    block.append(wrapper);
  }
  