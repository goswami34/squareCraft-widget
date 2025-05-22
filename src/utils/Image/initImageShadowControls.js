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
  x: 50,
  y: 50,
  blur: 50,
  spread: 50,
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

  const setUI = (percent) => {
    const sliderWidth = field.offsetWidth;
    const px = (percent / 100) * sliderWidth;
    bullet.style.left = `${px}px`;
    bullet.style.transform = "translateX(-50%)";
    label.textContent = `${percent}px`;
  };

  setUI(shadowState[key]);

  const startDrag = (e) => {
    e.preventDefault();

    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const value = Math.round((offsetX / rect.width) * 100);
      shadowState[key] = value;
      setUI(value);

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
  initShadowSlider("shadowXSlider", "x", getSelectedElement, saveFn);
  initShadowSlider("shadowYSlider", "y", getSelectedElement, saveFn);
  initShadowSlider("shadowBlurSlider", "blur", getSelectedElement, saveFn);
  initShadowSlider("shadowSpreadSlider", "spread", getSelectedElement, saveFn);
}
