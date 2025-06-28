export function initImageStateTabToggle() {
  const normalButton = document.getElementById("image-normal-state-button");
  const hoverButton = document.getElementById("image-hover-state-button");
  const normalState = document.getElementById("image-normal-state");
  const hoverState = document.getElementById("image-hover-state");
  if (!normalButton || !hoverButton || !normalState || !hoverState) return;
  normalButton.addEventListener("click", () => {
    normalState.classList.remove("sc-hidden");
    hoverState.classList.add("sc-hidden");
    normalButton.classList.add("sc-bg-color-EF7C2F");
    normalButton.classList.remove("sc-bg-3f3f3f");
    hoverButton.classList.remove("sc-bg-color-EF7C2F");
    hoverButton.classList.add("sc-bg-3f3f3f");
  });
  hoverButton.addEventListener("click", () => {
    hoverState.classList.remove("sc-hidden");
    normalState.classList.add("sc-hidden");
    hoverButton.classList.add("sc-bg-color-EF7C2F");
    hoverButton.classList.remove("sc-bg-3f3f3f");
    normalButton.classList.remove("sc-bg-color-EF7C2F");
    normalButton.classList.add("sc-bg-3f3f3f");
  });
  normalState.classList.remove("sc-hidden");
  hoverState.classList.add("sc-hidden");
  normalButton.classList.add("sc-bg-color-EF7C2F");
  hoverButton.classList.add("sc-bg-3f3f3f");
}
