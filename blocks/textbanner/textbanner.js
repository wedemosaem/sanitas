// textbanner.js
export default function decorate(block) {
    block.classList.add('tbx-textbanner');
  
    // 1. Grab the 4 authorable placeholders (rows/columns)
    const [
      textHolder,      // rich text (keep markup)
      alignHolder,     // "left" | "center" | "right"
      fontColorHolder, // any valid CSS color
      bgColorHolder    // any valid CSS color (or "c1,c2" for gradient)
    ] = Array.from(block.children);
  
    const richHTML  = textHolder ? textHolder.innerHTML.trim() : '';
    const alignRaw  = alignHolder ? alignHolder.textContent.trim().toLowerCase() : '';
    const fontColor = fontColorHolder ? fontColorHolder.textContent.trim() : '';
    const bgRaw     = bgColorHolder ? bgColorHolder.textContent.trim() : '';
  
    // 2. Normalize values
    const align = ['left', 'center', 'right'].includes(alignRaw) ? alignRaw : 'left';
  
    // Support simple 2‑color gradient: "color1,color2"
    let background = bgRaw;
    if (bgRaw.includes(',')) {
      const [c1, c2] = bgRaw.split(',').map((c) => c.trim());
      background = `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`;
    }
  
    // 3. Clear original DOM
    block.textContent = '';
  
    // 4. Build structure
    const wrapper = document.createElement('div');
    wrapper.className = 'tbx-textbanner__inner';
    wrapper.style.textAlign = align;
    if (fontColor) wrapper.style.color = fontColor;
    if (background) wrapper.style.background = background;
  
    const content = document.createElement('div');
    content.className = 'tbx-textbanner__content';
    content.innerHTML = richHTML;
  
    wrapper.append(content);
    block.append(wrapper);
  }
  