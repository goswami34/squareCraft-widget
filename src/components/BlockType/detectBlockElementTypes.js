export function detectBlockElementTypes(block) {
  let foundType = null;
  let currentButtonType = "Unknown Button";

  if (block.classList.contains("sqs-block-image")) {
    foundType = "image";
  } else {
    block
      .querySelectorAll("h1, h2, h3, h4, p, img, a, button")
      .forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const cls = el.classList;

        if (
          !foundType &&
          (["h1", "h2", "h3", "h4"].includes(tag) ||
            (tag === "p" &&
              !cls.contains("rte-placeholder") &&
              el.innerText.trim()))
        ) {
          foundType = "text";
        }

        if (
          !foundType &&
          tag === "img" &&
          el.closest(".sqs-image-content") &&
          el.closest(".fluid-image-editor-wrapper")
        ) {
          foundType = "image";
        }

        if (!foundType && (tag === "a" || tag === "button")) {
          const iconImg = el.querySelector("img");
          if (
            !iconImg ||
            (iconImg && iconImg.classList.contains("sqscraft-button-icon"))
          ) {
            foundType = "button";

            if (cls.contains("sqs-button-element--primary"))
              currentButtonType = "Primary Button";
            else if (cls.contains("sqs-button-element--secondary"))
              currentButtonType = "Secondary Button";
            else if (cls.contains("sqs-button-element--tertiary"))
              currentButtonType = "Tertiary Button";
            else currentButtonType = "Button";

            const buttonTypeEl = document.getElementById("buttonTypeDisplay");
            if (buttonTypeEl) {
              buttonTypeEl.textContent = currentButtonType;
            }
          }
        }
      });
  }

  const hide = (id) => document.getElementById(id)?.classList.add("sc-hidden");
  const show = (id) =>
    document.getElementById(id)?.classList.remove("sc-hidden");

  const allSections = [
    "typoSection",
    "imageSection",
    "buttonSection",
    "advancedTypoSection",
    "advancedImageSection",
    "advancedButtonSection",
    "presetTypoSection",
    "presetImageSection",
    "presetButtonSection",
  ];

  allSections.forEach(hide);

  if (foundType === "text") {
    show("typoSection");
    show("advancedTypoSection");
    show("presetTypoSection");
  } else if (foundType === "image") {
    show("imageSection");
    show("advancedImageSection");
    show("presetImageSection");
  } else if (foundType === "button") {
    show("buttonSection");
    show("advancedButtonSection");
    show("presetButtonSection");
  }

  return currentButtonType;
}
