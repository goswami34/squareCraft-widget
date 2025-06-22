export function detectBlockElementTypes(block) {
  let foundType = null;
  let currentButtonType = "Unknown Button";

  // Priority: Button > Image > Text
  const button = block.querySelector(
    "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
  );
  const image = block.querySelector(".sqs-image-content");
  const text = block.querySelector("h1, h2, h3, h4, p:not(.rte-placeholder)");

  if (button) {
    foundType = "button";
    if (button.classList.contains("sqs-button-element--primary"))
      currentButtonType = "Primary Button";
    else if (button.classList.contains("sqs-button-element--secondary"))
      currentButtonType = "Secondary Button";
    else if (button.classList.contains("sqs-button-element--tertiary"))
      currentButtonType = "Tertiary Button";
    else currentButtonType = "Button";

    const buttonTypeEl = document.getElementById("buttonTypeDisplay");
    if (buttonTypeEl) {
      buttonTypeEl.textContent = currentButtonType;
    }
  } else if (block.classList.contains("sqs-block-image") || image) {
    foundType = "image";
  } else if (text && text.innerText.trim()) {
    foundType = "text";
  }

  const hide = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("sc-hidden");
  };
  const show = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("sc-hidden");
  };

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
