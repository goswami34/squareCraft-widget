export function initRadiusProgressbarControls() {
  const radiusSlider = document.getElementById("radiusField");
  const radiusBullet = document.getElementById("radiusBullet");
  const radiusFill = document.getElementById("radiusFill");
  const radiusDisplay = document.getElementById("radiusCountAnother");

  if (!radiusSlider || !radiusBullet || !radiusFill || !radiusDisplay) return;

  let isDragging = false;

  const getRadiusValue = () => {
    const width = radiusSlider.offsetWidth;
    const pos = parseFloat(radiusBullet.style.left) || 0;
    return Math.round((pos / width) * 100);
  };

  const updateUI = (position) => {
    const max = radiusSlider.offsetWidth;
    const percent = Math.max(0, Math.min(position, max));
    const pxValue = Math.round((percent / max) * 100);

    radiusBullet.style.left = `${percent}px`;
    radiusBullet.style.transform = "translateX(-50%)";
    radiusFill.style.width = `${percent}px`;
    radiusDisplay.textContent = `${pxValue}px`;

    const selected = document.querySelector(".sc-selected-image");
    if (!selected) return;

    const block = selected.closest('[id^="block-"]');
    if (!block) return;

    // Default to applying global radius
    const blockSelector = `#${block.id} div.sqs-image-content img`;

    let styleTag = document.getElementById("sc-image-border-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "sc-image-border-style";
      document.head.appendChild(styleTag);
    }

    let currentCSS = styleTag.textContent;
    const blockRegex = new RegExp(
      `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
      "g"
    );
    const match = blockRegex.exec(currentCSS);

    if (match) {
      let declarations = match[2];
      declarations = declarations
        .replace(/border-radius\s*:\s*[^;]+;?/g, "")
        .trim();
      declarations += `\n  border-radius: ${pxValue}px !important;`;
      const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
      currentCSS = currentCSS.replace(blockRegex, updated);
    } else {
      currentCSS += `
  ${blockSelector} {
    border-radius: ${pxValue}px !important;
  }`;
    }

    styleTag.textContent = currentCSS.trim();
  };

  const handleDrag = (e) => {
    if (!isDragging) return;

    const clientX = e.clientX || (e.touches?.[0]?.clientX ?? 0);
    const rect = radiusSlider.getBoundingClientRect();
    const offsetX = Math.max(
      0,
      Math.min(clientX - rect.left, radiusSlider.offsetWidth)
    );
    updateUI(offsetX);
  };

  const startDrag = (e) => {
    e.preventDefault();
    isDragging = true;
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", stopDrag);
  };

  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", stopDrag);
  };

  radiusBullet.addEventListener("mousedown", startDrag);
  radiusBullet.addEventListener("touchstart", startDrag);
}
