export function initImageMaskControls(selectedElementRef) {
  const thumbs = document.querySelectorAll(".sc-image-mask-thumb");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      const maskUrl = thumb.dataset.mask;
      let element = selectedElementRef();

      if (!element || !maskUrl) return;

      if (element.id && element.id.startsWith("block-")) {
        let imageContentDiv = element.querySelector(".sqs-image-content");
        if (imageContentDiv) element = imageContentDiv;
      }

      element.style.webkitMaskImage = `url("${maskUrl}")`;
      element.style.maskImage = `url("${maskUrl}")`;
      element.style.maskRepeat = "no-repeat";
      element.style.maskSize = "contain";
      element.style.maskPosition = "center";
      element.style.webkitMaskRepeat = "no-repeat";
      element.style.webkitMaskSize = "contain";
      element.style.webkitMaskPosition = "center";
      element.style.transition = "mask-image 0.3s ease, -webkit-mask-image 0.3s ease";
    });
  });
}
