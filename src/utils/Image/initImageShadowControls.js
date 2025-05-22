// // ✅ initImageShadowControls.js

// // Declare internal state for shadow controls
// const shadowState = {
//   x: 0,
//   y: 0,
//   blur: 0,
//   spread: 0,
//   color: "rgba(0,0,0,0.5)",
// };

// function updateShadowCSS(blockId, saveFn) {
//   const { x, y, blur, spread, color } = shadowState;
//   const selector = `#${blockId} div.sqs-image-content`;
//   const styleId = `sc-shadow-style-${blockId}`;
//   let styleTag = document.getElementById(styleId);
//   if (!styleTag) {
//     styleTag = document.createElement("style");
//     styleTag.id = styleId;
//     document.head.appendChild(styleTag);
//   }

//   styleTag.textContent = `
//       ${selector} {
//         box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};
//       }`;

//   if (typeof saveFn === "function") {
//     saveFn(
//       blockId,
//       {
//         image: {
//           styles: {
//             "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${color}`,
//           },
//         },
//       },
//       "image"
//     );
//   }
// }

// function initShadowSlider(controlId, key, getSelectedElement, saveFn) {
//   const field = document.getElementById(controlId);
//   const bullet = field?.querySelector("div");

//   if (!field || !bullet) return;

//   const startDrag = (e) => {
//     e.preventDefault();
//     const moveHandler = (ev) => {
//       const clientX = ev.clientX || ev.touches?.[0]?.clientX;
//       const rect = field.getBoundingClientRect();
//       const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
//       const value = Math.round((offsetX / rect.width) * 100);
//       bullet.style.left = `${offsetX}px`;
//       shadowState[key] = value;

//       const selected = getSelectedElement?.();
//       const blockId = selected?.closest('[id^="block-"]')?.id;
//       if (blockId) updateShadowCSS(blockId, saveFn);
//     };

//     const stopDrag = () => {
//       document.removeEventListener("mousemove", moveHandler);
//       document.removeEventListener("mouseup", stopDrag);
//       document.removeEventListener("touchmove", moveHandler);
//       document.removeEventListener("touchend", stopDrag);
//     };

//     document.addEventListener("mousemove", moveHandler);
//     document.addEventListener("mouseup", stopDrag);
//     document.addEventListener("touchmove", moveHandler);
//     document.addEventListener("touchend", stopDrag);
//   };

//   bullet.addEventListener("mousedown", startDrag);
//   bullet.addEventListener("touchstart", startDrag);
// }

// export function initImageShadowControls(
//   getSelectedElement,
//   saveModificationsforImage
// ) {
//   initShadowSlider(
//     "shadowXSlider",
//     "x",
//     getSelectedElement,
//     saveModificationsforImage
//   );
//   initShadowSlider(
//     "shadowYSlider",
//     "y",
//     getSelectedElement,
//     saveModificationsforImage
//   );
//   initShadowSlider(
//     "shadowBlurSlider",
//     "blur",
//     getSelectedElement,
//     saveModificationsforImage
//   );
//   initShadowSlider(
//     "shadowSpreadSlider",
//     "spread",
//     getSelectedElement,
//     saveModificationsforImage
//   );
// }

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

function initShadowSlider(controlId, key, getSelectedElement, saveFn) {
  const field = document.getElementById(controlId);
  const bullet = field?.querySelector(".shadow-bullet");
  const label = field?.previousElementSibling?.querySelector("p.sc-text-xs");

  if (!field || !bullet || !label) return;

  const isCentered = key === "x" || key === "y"; // only X and Y are centered range
  const initial = shadowState[key];
  const initialPercent = isCentered ? (initial + 100) / 2 : initial; // convert -100~+100 to 0~100

  const setUI = (percent) => {
    const sliderWidth = field.offsetWidth;
    const px = (percent / 100) * sliderWidth;
    bullet.style.left = `${px}px`;
    bullet.style.transform = "translateX(-50%)";

    // Convert slider value back to range
    const displayVal = isCentered
      ? Math.round((percent / 100) * 200 - 100)
      : percent;
    label.textContent = `${displayVal}px`;

    shadowState[key] = displayVal;
  };

  // initialize UI
  setTimeout(() => {
    setUI(initialPercent);
  }, 50); // small delay to ensure DOM is ready

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

export function initImageShadowControls(getSelectedElement, saveFn) {
  initShadowSlider("shadowXSlider", "x", getSelectedElement, saveFn); // ✅ -100 to +100
  initShadowSlider("shadowYSlider", "y", getSelectedElement, saveFn); // ✅ -100 to +100
  initShadowSlider("shadowBlurSlider", "blur", getSelectedElement, saveFn); // ✅ 0 to 100
  initShadowSlider("shadowSpreadSlider", "spread", getSelectedElement, saveFn); // ✅ 0 to 100
}
