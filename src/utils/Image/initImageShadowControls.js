// ✅ initImageShadowControls.js

// Declare internal state for shadow controls
const shadowState = {
  x: 0,
  y: 0,
  blur: 0,
  spread: 0,
  color: "rgba(0,0,0,0.5)",
};

function updateShadowCSS(blockId, saveFn) {
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

  if (typeof saveFn === "function") {
    saveFn(
      blockId,
      {
        image: {
          styles: {
            "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${color}`,
          },
        },
      },
      "image"
    );
  }
}

function initShadowSlider(controlId, key, getSelectedElement, saveFn) {
  const field = document.getElementById(controlId);
  const bullet = field?.querySelector("div");

  if (!field || !bullet) return;

  const startDrag = (e) => {
    e.preventDefault();
    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const value = Math.round((offsetX / rect.width) * 100);
      bullet.style.left = `${offsetX}px`;
      shadowState[key] = value;

      const selected = getSelectedElement?.();
      const blockId = selected?.closest('[id^="block-"]')?.id;
      if (blockId) updateShadowCSS(blockId, saveFn);
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", stopDrag);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", stopDrag);
  };

  bullet.addEventListener("mousedown", startDrag);
  bullet.addEventListener("touchstart", startDrag);
}

export function initImageShadowControls(
  getSelectedElement,
  saveModificationsforImage
) {
  initShadowSlider(
    "shadowXSlider",
    "x",
    getSelectedElement,
    saveModificationsforImage
  );
  initShadowSlider(
    "shadowYSlider",
    "y",
    getSelectedElement,
    saveModificationsforImage
  );
  initShadowSlider(
    "shadowBlurSlider",
    "blur",
    getSelectedElement,
    saveModificationsforImage
  );
  initShadowSlider(
    "shadowSpreadSlider",
    "spread",
    getSelectedElement,
    saveModificationsforImage
  );
}
