// ✅ initImageShadowControls.js

const shadowState = {
  x: 0, // centered
  y: 0, // centered
  blur: 10, // default blur
  spread: 2, // default spread
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
        box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color} !important;
        -webkit-mask-image: none !important;
      }
    `;

  if (typeof saveFn === "function") {
    saveFn(
      blockId,
      {
        image: {
          styles: {
            "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${color}`,
            "-webkit-mask-image": "none",
          },
        },
      },
      "image"
    );
  }
}

function applyOverflowVisible(blockId) {
  const styleId = `sc-overflow-style-${blockId}`;
  const selector = `#siteWrapper #${blockId} .intrinsic, #siteWrapper #${blockId} .sqs-image`;

  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
      ${selector} {
        overflow: visible !important;
      }
    `;
}

function initShadowSlider(controlId, key, getSelectedElement, saveFn) {
  const field = document.getElementById(controlId);
  const bullet = field?.querySelector(".shadow-bullet");
  const label = field?.previousElementSibling?.querySelector("p.sc-text-xs");
  const externalValueLabel = document.getElementById(
    `shadow${key.charAt(0).toUpperCase() + key.slice(1)}Value`
  );
  const fill = field?.querySelector(
    `#${controlId} > .sc-bg-color-EF7C2F:not(.shadow-bullet)`
  );

  if (!field || !bullet) return;

  const isCentered = key === "x" || key === "y";
  const initial = shadowState[key];
  const initialPercent = isCentered ? (initial + 100) / 2 : initial;

  const setUI = (percent) => {
    const sliderWidth = field.offsetWidth;
    const px = (percent / 100) * sliderWidth;
    bullet.style.left = `${px}px`;
    bullet.style.transform = "translateX(-50%)";

    if (fill) fill.style.width = `${px}px`;

    const rawVal = isCentered
      ? (percent / 100) * 200 - 100
      : (percent / 100) * 100;
    const displayVal = Math.round(rawVal);

    if (label) label.textContent = `${displayVal}px`;
    if (externalValueLabel) externalValueLabel.textContent = `${displayVal}px`;
    shadowState[key] = displayVal;
  };

  setTimeout(() => {
    setUI(initialPercent);
  }, 50);

  const startDrag = (e) => {
    e.preventDefault();
    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percent = (offsetX / rect.width) * 100;

      setUI(percent);

      const selected = getSelectedElement?.();
      const blockId = selected?.closest('[id^="block-"]')?.id;
      if (blockId) {
        updateShadowCSS(blockId, saveFn);
        if (key === "blur") applyOverflowVisible(blockId);
      }
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

// ✅ PATCH: Color palette integration for shadow box
function applyShadowColorFromPalette(
  color,
  alpha = 1,
  getSelectedElement,
  saveFn
) {
  const selected = getSelectedElement?.();
  if (!selected) return;

  const blockId = selected.closest('[id^="block-"]')?.id;
  if (!blockId) return;

  // Convert rgb to rgba with alpha
  const rgbaColor = color.startsWith("rgb(")
    ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
    : color;

  shadowState.color = rgbaColor;
  updateShadowCSS(blockId, saveFn);
}

export function initImageShadowControls(getSelectedElement, saveFn) {
  initShadowSlider("shadowXSlider", "x", getSelectedElement, saveFn); // ✅ -100 to +100
  initShadowSlider("shadowYSlider", "y", getSelectedElement, saveFn); // ✅ -100 to +100
  initShadowSlider("shadowBlurSlider", "blur", getSelectedElement, saveFn); // ✅ 0 to 100
  initShadowSlider("shadowSpreadSlider", "spread", getSelectedElement, saveFn); // ✅ 0 to 100
}

export { applyShadowColorFromPalette };
