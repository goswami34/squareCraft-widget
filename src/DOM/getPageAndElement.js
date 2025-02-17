export async function getPageAndElement(targetElement) {
  let page = targetElement.closest("article[data-page-sections]");
  let block = targetElement.closest('[id^="block-"]');

  if (!page || !block) {
    console.warn("⚠️ No valid page or block found.");
    return {};
  }

  let blockType = "Unknown";
  if (block.classList.contains("sqs-block-html")) {
    blockType = "Text";
  } else if (block.classList.contains("sqs-block-image")) {
    blockType = "Image";
  } else if (block.classList.contains("sqs-block-button")) {
    blockType = "Button";
  }

  console.log("📌 Page ID:", page.getAttribute("data-page-sections"));
  console.log("📌 Block ID:", block.id);
  console.log("📌 Block Type:", blockType);
  console.log("📌 Full Block Element:", block);
  console.log("📌 Block Inner HTML:", block.innerHTML);

  return {
    pageId: page.getAttribute("data-page-sections"),
    elementId: block.id,
    blockType: blockType,
    blockElement: block,
    blockHTML: block.innerHTML
  };
}
