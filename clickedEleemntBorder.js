document.body.addEventListener("click", (event) => {
  let block = event.target.closest('[id^="block-"]');
  if (!block) return;

  if (selectedElement) {
    selectedElement.style.outline = "";
    selectedElement.classList.remove("sc-selected");
  }

  selectedElement = block;
  selectedElement.style.outline = "2px dashed #EF7C2F";
  selectedElement.classList.add("sc-selected");

});
