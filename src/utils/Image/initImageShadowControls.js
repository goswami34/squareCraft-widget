//shadow start here

const shadowState = {
  x: 0,
  y: 0,
  blur: 0,
  spread: 0,
  color: "rgba(0,0,0,0.5)",
};

function updateShadowCSS(blockId) {
  const { x, y, blur, spread, color } = shadowState;
  const selector = `#${blockId} div.sqs-image-content`;
  const styleId = `sc-shadow-style-${blockId}`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = `
      ${selector} {
        box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};
      }`;

  mergeAndSaveImageStyles(
    blockId,
    {
      image: {
        styles: {
          "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${color}`,
        },
      },
    },
    saveModificationsforImage
  );
}

function initShadowSlider(controlId, key) {
  const field = document.getElementById(controlId);
  const bullet = field?.querySelector("div");

  if (!field || !bullet) return;

  bullet.addEventListener("mousedown", (e) => startDrag(e, key, field, bullet));
  bullet.addEventListener("touchstart", (e) =>
    startDrag(e, key, field, bullet)
  );

  function startDrag(e, key, field, bullet) {
    e.preventDefault();
    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const value = Math.round((offsetX / rect.width) * 100);
      bullet.style.left = `${offsetX}px`;
      shadowState[key] = value;

      const imageContent = document.querySelector(".sc-selected-image");
      if (!imageContent) return;
      const blockId = imageContent.closest('[id^="block-"]')?.id;
      if (blockId) updateShadowCSS(blockId);
    };
    const endHandler = () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("mouseup", endHandler);
      document.removeEventListener("touchend", endHandler);
    };
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchend", endHandler);
  }
}

initShadowSlider("shadowXSlider", "x");
initShadowSlider("shadowYSlider", "y");
initShadowSlider("shadowBlurSlider", "blur");
initShadowSlider("shadowSpreadSlider", "spread");

//shadow end here
