export const parentHtmlTabClick = () => {
  const parentHtmlTab = document.querySelector(".sc-parent-html-tab");
  parentHtmlTab.addEventListener("click", () => {
    console.log("parentHtmlTab clicked");
  });
};
