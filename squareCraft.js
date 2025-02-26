(async function squareCraft() {
    const widgetScript = document.getElementById("squarecraft-script");
    if (!widgetScript) {
      console.error(":x: Widget script not found! Ensure the script tag exists with id 'squarecraft-script'.");
      return;
    }
  
    const token = widgetScript.dataset?.token;
    const squareCraft_u_id = widgetScript.dataset?.uId; 
    const squareCraft_w_id = widgetScript.dataset?.wId; 
    const userId = localStorage.getItem("squareCraft_u_id");
    const widgetId = localStorage.getItem("squareCraft_w_id");
    
    if (token) {
        console.log("🔑 Token received:", token);
        localStorage.setItem("squareCraft_auth_token", token);
        document.cookie = `squareCraft_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
      }
  
    if (squareCraft_u_id) {
        console.log("👤 User ID received:", squareCraft_u_id);
        localStorage.setItem("squareCraft_u_id", squareCraft_u_id);
        document.cookie = `squareCraft_u_id=${squareCraft_u_id}; path=.squarespace.com;`;
  
    }
  
    if (squareCraft_w_id) {
        console.log("🛠️ Widget ID received:", squareCraft_w_id);
        localStorage.setItem("squareCraft_w_id", squareCraft_w_id);
        document.cookie = `squareCraft_w_id=${squareCraft_w_id}; path=.squarespace.com;`;
    }
    
    const link = document.createElement("link");
    link.rel = "stylesheet";  
    link.type = "text/css";
    link.href = "https://fatin-webefo.github.io/squareCraft-Plugin/src/styles/parent.css";
    document.head.appendChild(link);
  
    const fontSizes = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 , 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const LetterSpacing = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16., 17, 18, 19, 20, 21, 22, 23, 24, 25];
    let fontSizeOptions = '';
    for (let size of fontSizes) {
      fontSizeOptions += `<option value="${size}">${size}px</option>`;
    }
  
  
    if (token) localStorage.setItem("squareCraft_auth_token", token);
    if (userId) localStorage.setItem("squareCraft_u_id", userId);
    if (widgetId) localStorage.setItem("squareCraft_w_id", widgetId);
  
    let selectedElement = null;
    let appliedStyles = new Set();
  
    function getPageId() {
      let pageElement = document.querySelector("article[data-page-sections]");
      return pageElement ? pageElement.getAttribute("data-page-sections") : null;
    }
  
    let pageId = getPageId();
    if (!pageId) console.warn(":warning: No page ID found. Plugin may not work correctly.");
  
    function applyStylesToElement(elementId, css) {
      if (!elementId || !css) return;
  
      let styleTag = document.getElementById(`style-${elementId}`);
      if (styleTag) {
        styleTag.remove();  // Remove the old styles before adding new ones
      }
  
      styleTag = document.createElement("style");
      styleTag.id = `style-${elementId}`;
      document.head.appendChild(styleTag);
  
      let cssText = `#${elementId} { `;
      Object.keys(css).forEach(prop => {
          cssText += `${prop}: ${css[prop]} !important; `;
      });
      cssText += "}";
      
  
      if (css["border-radius"]) {
        cssText += `#${elementId} { overflow: hidden !important; }`;
      }
  
      styleTag.innerHTML = cssText;
      appliedStyles.add(elementId);
      console.log(`:white_check_mark: Styles Persisted for ${elementId}`);
    }
  
    async function fetchModifications(retries = 3) {
      if (!pageId) return;
  
      try {
          const response = await fetch(
              `https://webefo-backend.vercel.app/api/v1/get-modifications?userId=${userId}`,
              {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
                  },
              }
          );
  
          const data = await response.json();
  
          console.log("📥 Get method", data);
          if (!data.modifications || data.modifications.length === 0) {
              console.warn("⚠️ No styles found for this page.");
              return;
          }
  
          data.modifications.forEach(({ pageId: storedPageId, elements }) => {
              if (storedPageId === pageId) {
                  elements.forEach(({ elementId, css }) => {
                      applyStylesToElement(elementId, css);
                  });
              }
          });
  
      } catch (error) {
          console.error("❌ Error fetching modifications:", error);
          if (retries > 0) {
              console.log(`🔄 Retrying fetch... (${retries} left)`);
              setTimeout(() => fetchModifications(retries - 1), 2000);
          }
      }
  }
  
  
    async function saveModifications(elementId, css) {
      if (!pageId || !elementId || !css) {
        console.warn(":warning: Missing required data to save modifications.");
        return;
      }
  
      applyStylesToElement(elementId, css);
      console.log(":satellite_antenna: Saving modifications for:", { pageId, elementId, css });
  
      const modificationData = {
        userId,
        token,
        widgetId,
        modifications: [{ pageId, elements: [{ elementId, css }] }],
      };
  
      try {
        const response = await fetch("https://webefo-backend.vercel.app/api/v1/modifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || localStorage.getItem("squareCraft_auth_token")}`,
            "userId": userId,
            "pageId": pageId,
            "widget-id": widgetId,
          },
          body: JSON.stringify(modificationData),
        });
  
        console.log(":white_check_mark: Changes Saved Successfully!", await response.json());
      } catch (error) {
        console.error(":x: Error saving modifications:", error);
      }
    }
  
    function createWidget() {
      const widgetContainer = document.createElement("div");
      widgetContainer.id = "squarecraft-widget-container";
      widgetContainer.classList.add("squareCraft-fixed", "squareCraft-text-color-white", "squareCraft-universal", "squareCraft-z-99999");
      widgetContainer.style.display = "none"; // Hide the widget by default
  
  
      widgetContainer.innerHTML = `
         <div
           class="squareCraft-p-4  squareCraft-text-color-white squareCraft-border squareCraft-border-solid squareCraft-border-3d3d3d squareCraft-bg-color-2c2c2c squareCraft-rounded-15px squareCraft-w-300px">
           <div class="squareCraft-flex squareCraft-poppins squareCraft-universal squareCraft-items-center squareCraft-justify-between">
              <img class="squareCraft-cursor-grabbing squareCraft-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png" width="140px" />
             
           </div>
           <p class="squareCraft-text-sm squareCraft-mt-6 squareCraft-poppins squareCraft-font-light">Lorem Ipsum is simply dummy text
              of the printing and typesetting industry.
           </p>
           <div
              class="squareCraft-mt-6 squareCraft-poppins squareCraft-border-t squareCraft-border-dashed squareCraft-border-color-494949  squareCraft-w-full">
           </div>
           <div class="squareCraft-mt-6 squareCraft-poppins squareCraft-flex  squareCraft-items-center squareCraft-universal">
              <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader ">Design</p>
              <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader">Advanced</p>
              <p class="squareCraft-text-sm squareCraft-px-4 squareCraft-cursor-pointer tabHeader">Presets</p>
           </div>
           <div
              class="squareCraft-border-t squareCraft-border-solid squareCraft-relative squareCraft-border-color-494949 squareCraft-w-full">
              <div
                 class="squareCraft-absolute squareCraft-top-0 squareCraft-left-0 squareCraft-bg-colo-EF7C2F squareCraft-w-16 squareCraft-h-1px">
              </div>
           </div>
           <div
              class="squareCraft-rounded-6px  squareCraft-mt-6  squareCraft-border squareCraft-border-solid squareCraft-border-EF7C2F squareCraft-bg-color-3d3d3d">
              <div class="squareCraft-flex squareCraft-p-2 squareCraft-items-center squareCraft-justify-between">
                 <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center">
                    <img loading="lazy"
                       src="https://fatin-webefo.github.io/squareCraft-Plugin/public/T.svg" alt="">
                    <p class="squareCraft-universal squareCraft-poppins">Typography</p>
                 </div>
                 <img src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
              </div>
              <div class="squareCraft-h-1px squareCraft-bg-3f3f3f"></div>
              <div
                 class="squareCraft-flex squareCraft-px-2   squareCraft-items-center squareCraft-justify-between">
                 <div class="squareCraft-flex squareCraft-gap-2 squareCraft-items-center">
                    <div class="toggle-container" id="toggleSwitch">
                       <div class="toggle-bullet"></div>
                    </div>
                    <p id="toggleText" class="squareCraft-text-sm squareCraft-poppins">Enable</p>
                 </div>
              </div>
              <div class="squareCraft-h-1px  squareCraft-bg-3f3f3f"></div>
              <div class="squareCraft-mt-2">
                 <div
                    class="squareCraft-flex squareCraft-poppins squareCraft-px-2  squareCraft-items-center squareCraft-justify-between squareCraft-gap-2">
                    <div
                       class="squareCraft-cursor-pointer squareCraft-bg-color-EF7C2F squareCraft-w-full squareCraft-font-light squareCraft-flex squareCraft-items-center squareCraft-text-sm squareCraft-py-1px squareCraft-rounded-6px squareCraft-text-color-white squareCraft-justify-center">
                       Normal
                    </div>
                    <div
                       class="squareCraft-cursor-pointer squareCraft-bg-3f3f3f squareCraft-w-full squareCraft-text-color-white squareCraft-font-light squareCraft-flex squareCraft-text-sm squareCraft-py-1px squareCraft-rounded-6px squareCraft-items-center squareCraft-justify-center">
                       Hover
                    </div>
                 </div>
                 <div class="squareCraft-px-4">
                    <div class="squareCraft-h-1px  squareCraft-mt-2 squareCraft-bg-3f3f3f"></div>
                 </div>
              </div>
              <div class=" squareCraft-mt-2 squareCraft-px-2 squareCraft-flex squareCraft-justify-between">
                 <p class="squareCraft-text-sm squareCraft-universal squareCraft-poppins">Text</p>
                 <img src="https://fatin-webefo.github.io/squareCraft-Plugin/public/eye.svg" width="12px" />
              </div>
              <div class="squareCraft-mt-2  squareCraft-grid squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 squareCraft-px-2">
                 <div id="squareCraft-font-family" 
                    class="squareCraft-flex  squareCraft-bg-494949 squareCraft-h-9 squareCraft-col-span-7 squareCraft-cursor-pointer squareCraft-rounded-6px squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div class=" squareCraft-w-full   squareCraft-px-2  ">
                       <p class="squareCraft-text-sm  squareCraft-poppins  squareCraft-font-light">Sf Pro sans</p>
                    </div>
                    <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                       <img class=" squareCraft-rotate-180" width="12px"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
                    </div>
                 </div>
                 <div class="squareCraft-flex squareCraft-bg-transparent squareCraft-h-9 squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-4   squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center ">
                    <div class="squareCraft-flex squareCraft-text-color-white squareCraft-items-center ">
                       <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-4 squareCraft-rounded-6px squareCraft-items-center  ">
                          <div class="squareCraft-font-size-container squareCraft-poppins squareCraft-universal squareCraft-flex squareCraft-justify-between squareCraft-items-center squareCraft-flex squareCraft-items-center  
                             squareCraft-rounded-6px 
                             ">
                             <input type="text" id="squareCraftFontSizeInput" value="16" 
                                class="squareCraft-font-size-input squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white 
                                squareCraft-bg-transparent  squareCraft-universal squareCraft-font-light">
                                  <div class="squareCraft-v-line"></div>
                             <div class="squareCraft-flex squareCraft-items-center  squareCraft-justify-center  squareCraft-items-center">
                                <p class="squareCraft-flex squareCraft-font-light squareCraft-text-sm squareCraft-px-1_5 squareCraft-items-center squareCraft-justify-center squareCraft-items-center">
                                   px
                             </div>
                             <div class="squareCraft-bg-3f3f3f squareCraft-px-2 squareCraft-ml-1" style="height: 27px; padding: 0 8px; border-radius: 0px 5px 5px 0px;">
                                <img class=" squareCraft-rotate-180 " width="12px" 
                                   src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
                             </div>
                          </div>
                          <div id="squareCraftFontSizeOptions" class="squareCraft-hidden  squareCraft-h-44 squareCraft-font-sm squareCraft-bg-3f3f3f squareCraft-w-20
                             squareCraft-rounded-6px squareCraft-border squareCraft-border-585858 squareCraft-absolute 
                             squareCraft-mt-1">
                             ${fontSizes?.map(size => `
                             <div class="squareCraft-dropdown-item squareCraft-py-1px squareCraft-text-center  squareCraft-text-sm" 
                                data-value="${size}">${size}</div>
                             `).join('')}
                          </div>
                       </div>
                    </div>
                    <div class="squareCraft-border-r squareCraft-border-585858 "></div>
                 </div>
              </div>
              <div class="squareCraft-mt-2  squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                 <div class="squareCraft-flex squareCraft-bg-494949  squareCraft-col-span-6  squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div class="  squareCraft-px-2 squareCraft-w-full  ">
                       <p class="squareCraft-text-sm squareCraft-universal squareCraft-poppins squareCraft-font-light">Regular</p>
                    </div>
                    <div class="squareCraft-bg-3f3f3f squareCraft-px-2" style="height: 27px; padding: 0 8px;">
                       <img class=" squareCraft-mx-auto squareCraft-rotate-180" width="10px"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/arrow.svg" alt="">
                    </div>
                 </div>
                 <div class="squareCraft-flex squareCraft-justify-between squareCraft-col-span-4  squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-items-center ">
                    <div class="squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center">
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180" width="12px"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/dot.svg" alt="">
                    </div>
                      <div class="squareCraft-v-line"></div>
                    <div class="squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center squareCraft-border squareCraft-border-585858 squareCraft-w-13px squareCraft-border-solid squareCraft-h-13px">
                    </div>
                      <div class="squareCraft-v-line"></div>
                    <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-flex squareCraft-mx-auto squareCraft-items-center squareCraft-justify-center" width="12px"
                       src="https://fatin-webefo.github.io/squareCraft-Plugin/public/gap.svg" alt="">
                 </div>
              </div>
              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2 ">
                 <div class="squareCraft-flex squareCraft-col-span-5 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                       <img id="squareCraftTextAlignLeft" data-align="left"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (1).svg"
                          class="squareCraft-cursor-pointer alignment-icon   squareCraft-mx-auto"  alt="">
                       <div class="squareCraft-v-line"></div>
                       <img id="squareCraftTextAlignRight" data-align="right"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (3).svg"
                          class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto"  alt="">
                       <div class="squareCraft-v-line"></div>
                       <img id="squareCraftTextAlignCenter" data-align="center"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (2).svg"
                          class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto"  alt="">
                       <div class="squareCraft-v-line"></div>
                       <img id="squareCraftTextAlignJustify" data-align="justify"
                          src="https://fatin-webefo.github.io/squareCraft-Plugin/public/alignment (4).svg"
                          class="squareCraft-cursor-pointer alignment-icon    squareCraft-mx-auto "  alt="">
                    </div>
                 </div>
                 <div class="squareCraft-flex squareCraft-text-color-white squareCraft-justify-between squareCraft-col-span-3 
                    squareCraft-rounded-6px squareCraft-border squareCraft-border-solid squareCraft-border-585858 
                    squareCraft-items-center squareCraft-w-full ">
                    <div class="squareCraft-Letter-spacing-container squareCraft-flex squareCraft-justify-between squareCraft-items-center squareCraft-flex squareCraft-items-center squareCraft-border 
                       squareCraft-border-solid squareCraft-border-3d3d3d  squareCraft-rounded-6px 
                       ">
                       <input type="text" id="squareCraftLetterSpacingInput" value="15px" class="squareCraft-Letter-spacing-input squareCraft-font-light squareCraft-text-sm squareCraft-text-color-white 
                          squareCraft-bg-transparent squareCraft-w-full  squareCraft-py-1px squareCraft-font-light">
                       <div class="">
                          <img id="squareCraftLetterSpacingDropdown"
                             src="https://fatin-webefo.github.io/squareCraft-Plugin/public/line-spacing.svg"
                             class=" squareCraft-px-1 squareCraft-ml-1 squareCraft-mx-auto squareCraft-cursor-pointer" >
                       </div>
                    </div>
                    <div id="squareCraftLetterSpacingOptions" class="squareCraft-hidden squareCraft-h-44 squareCraft-font-sm squareCraft-bg-3f3f3f squareCraft-w-20
                       squareCraft-rounded-6px squareCraft-border squareCraft-border-585858 squareCraft-absolute 
                       squareCraft-mt-1">
                       ${LetterSpacing?.map(gap => `
                       <div class="squareCraft-dropdown-item squareCraft-py-1px squareCraft-text-center  squareCraft-text-sm"
                          data-value="${gap}">${gap}</div>
                       `).join('')}
                    </div>   
                 </div>
  
              </div>
              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-px-2 squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                      <p class="squareCraft-font-bold squareCraft-universal squareCraft-text-sm  ">B</p>
                       <div class="squareCraft-v-line"></div>
                      <p class="squareCraft-font-italic squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-mx-auto">I</p>
                       <div class="squareCraft-v-line"></div>
                     <p class="squareCraft-font-underline squareCraft-universal squareCraft-text-sm squareCraft-text-center squareCraft-mx-auto">U</p>
                       <div class="squareCraft-v-line"></div> 
                       <p class="squareCraft-font-underline squareCraft-universal squareCraft-text-sm squareCraft-text-center squareCraft-mx-auto">abc</p>
                       <div class="squareCraft-v-line"></div> 
                       <img id="squareCraftTextAlignJustify" data-align="justify"
                       src="https://fatin-webefo.github.io/squareCraft-Plugin/public/T.png"
                       class="squareCraft-cursor-pointer  "  alt="">
                      
                    </div>
                 </div>
              </div>
              <div class="squareCraft-mt-2 squareCraft-grid squareCraft-px-2 squareCraft-w-full squareCraft-grid-cols-12 squareCraft-gap-2">
                 <div class="squareCraft-flex squareCraft-col-span-6 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-poppins  squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                      <p class=" squareCraft-mx-2 squareCraft-w-full squareCraft-text-center squareCraft-universal squareCraft-text-sm ">AG</p>
                       <div class="squareCraft-v-line"></div>
                      <p class=" squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-w-full squareCraft-mx-auto">ag</p>
                       <div class="squareCraft-v-line"></div>
                       <p class=" squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-w-full squareCraft-mx-auto">Ag</p>
                       <div class="squareCraft-v-line"></div> 
                       <p class=" squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-w-full squareCraft-mx-auto">AG</p>
                       <div class="squareCraft-v-line"></div> 
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-1_5" width="12px"
                       src="https://fatin-webefo.github.io/squareCraft-Plugin/public/dot.svg" alt="">
                      
                    </div>
                 </div>
  
                 <div class="squareCraft-flex squareCraft-col-span-5 squareCraft-justify-between squareCraft-border squareCraft-border-solid squareCraft-border-585858 squareCraft-rounded-6px squareCraft-items-center ">
                    <div
                       class="squareCraft-flex squareCraft-poppins  squareCraft-items-center squareCraft-justify-between squareCraft-w-full ">
                      <p class=" squareCraft-mx-2 squareCraft-w-full squareCraft-text-center squareCraft-universal squareCraft-text-sm ">RLT</p>
                       <div class="squareCraft-v-line"></div>
                      <p class=" squareCraft-universal  squareCraft-text-sm squareCraft-text-center squareCraft-w-full squareCraft-mx-auto">LTR</p>
                       <div class="squareCraft-v-line"></div>
                       <img class=" squareCraft-rounded-6px squareCraft-rotate-180 squareCraft-px-2" width="12px"
                       src="https://fatin-webefo.github.io/squareCraft-Plugin/public/dot.svg" alt="">                  
                    </div>
                 </div>
              </div>
             
  
           
              <div class="squareCraft-mt-2"> </div>
           </div>
           <div class="squareCraft-mt-4">
              <div
                 class="squareCraft-flex  squareCraft-items-center squareCraft-justify-between squareCraft-gap-2">
                 <div
                    class="squareCraft-cursor-pointer squareCraft-poppins squareCraft-bg-color-EF7C2F squareCraft-w-full squareCraft-font-light squareCraft-flex squareCraft-items-center squareCraft-text-sm squareCraft-py-1 squareCraft-rounded-6px squareCraft-text-color-white squareCraft-justify-center">
                    Publish
                 </div>
                 <div
                    class="squareCraft-cursor-pointer squareCraft-poppins squareCraft-bg-3f3f3f squareCraft-w-full squareCraft-text-color-white squareCraft-font-light squareCraft-flex squareCraft-text-sm squareCraft-py-1 squareCraft-rounded-6px squareCraft-items-center squareCraft-justify-center">
                    Reset
                 </div>
              </div>
            
           </div>
        </div>
      `;
      document.documentElement.appendChild(widgetContainer);
      makeWidgetDraggable();
      setInterval(makeWidgetDraggable, 1000);
    }
  
    function createWidgetIcon() {
      if (document.getElementById("squarecraft-widget-icon")) return;
  
      const widgetIcon = document.createElement("img");
      widgetIcon.id = "squarecraft-widget-icon";
      widgetIcon.src = "https://i.ibb.co.com/pry1mVGD/Group-28-1.png"; // Icon URL
  
      widgetIcon.classList.add(
          "squareCraft-absolute", 
          "squareCraft-top-5", 
          "squareCraft-rounded-md",
          "squareCraft-px-2",
          "squareCraft-w-16",
          "squareCraft-py-1",
          "squareCraft-bg-color-2c2c2c",
          "squareCraft-right-5",  
          "squareCraft-cursor-pointer",
          "squareCraft-z-9999"
      );
  
      widgetIcon.addEventListener("click", function () {
          alert("Click on an element to open the widget.");
      });
  
      document.body.appendChild(widgetIcon);
  }
  
  
    setInterval(makeWidgetDraggable, 1000);
  
    function makeWidgetDraggable() {
      const widget = document.getElementById("squarecraft-widget-container");
  
      if (!widget) {
          console.warn("❌ Widget not found.");
          return;
      }
  
      // Apply styles to allow free movement
      widget.style.position = "fixed"; // Change from "absolute" to "fixed" for full-page dragging
      widget.style.cursor = "grab";
      widget.style.zIndex = "99999"; // Ensure it's above other elements
  
      let offsetX = 0, offsetY = 0, isDragging = false;
  
      widget.addEventListener("mousedown", (event) => {
          event.preventDefault();
          isDragging = true;
  
          offsetX = event.clientX - widget.getBoundingClientRect().left;
          offsetY = event.clientY - widget.getBoundingClientRect().top;
  
          widget.style.transition = "none";
          widget.style.userSelect = "none";
          widget.style.cursor = "grabbing";
  
          document.addEventListener("mousemove", moveAt);
          document.addEventListener("mouseup", stopDragging);
      });
  
      function moveAt(event) {
          if (!isDragging) return;
  
          let newX = event.clientX - offsetX;
          let newY = event.clientY - offsetY;
          newX = Math.max(0, Math.min(window.innerWidth - widget.offsetWidth, newX));
          newY = Math.max(0, Math.min(window.innerHeight - widget.offsetHeight, newY));
  
          widget.style.left = `${newX}px`;
          widget.style.top = `${newY}px`;
      }
  
      function stopDragging() {
          isDragging = false;
          widget.style.cursor = "grab";
          document.removeEventListener("mousemove", moveAt);
          document.removeEventListener("mouseup", stopDragging);
  
          localStorage.setItem("widget_X", widget.style.left);
          localStorage.setItem("widget_Y", widget.style.top);
      }
  
      let lastX = localStorage.getItem("widget_X");
      let lastY = localStorage.getItem("widget_Y");
      if (lastX && lastY) {
          widget.style.left = lastX;
          widget.style.top = lastY;
      } else {
          widget.style.left = "50px"; // Default position
          widget.style.top = "50px";
      }
  
      console.log("✅ Fully Flexible Widget Dragging Enabled.");
  }
  
  
  
  makeWidgetDraggable();
  
  
  setTimeout(makeWidgetDraggable, 1000);
  
  
  
  window.addEventListener("load", () => {
      setTimeout(makeWidgetDraggable, 500); // Wait for the widget to load
      createWidgetIcon();
  
  });
  window.addEventListener("load", () => {
    createWidget();  // Ensure widget is created first
    setTimeout(makeWidgetDraggable, 500); // Apply draggability after it's added to DOM
  });
  
  
    async function loadFontsWithPagination(page = 1, perPage = 20) {
      try {
          const response = await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk");
          const data = await response.json();
          return data.items.slice((page - 1) * perPage, page * perPage); // Paginate fonts
      } catch (error) {
          console.error("❌ Error fetching Google Fonts:", error);
          return [];
      }
  }
  
  
  async function fontfamilies() {
    let currentPage = 1;
    const perPage = 20;
    const fontDropdown = document.getElementById("squareCraft-font-family");
  
    // Ensure the dropdown container is created
    let fontList = document.getElementById("squareCraft-font-list");
    if (!fontList) {
        fontList = document.createElement("div");
        fontList.id = "squareCraft-font-list";
        fontList.classList.add("squareCraft-absolute", "squareCraft-top-full", "squareCraft-left-0", 
            "squareCraft-w-full", "squareCraft-max-h-200px", "squareCraft-overflow-y-auto", 
            "squareCraft-hidden", "squareCraft-z-1000", "squareCraft-border", "squareCraft-border-585858", 
            "squareCraft-rounded-6px", "squareCraft-bg-2c2c2c");
        
        fontDropdown.appendChild(fontList);
    }
  
    async function loadMoreFonts() {
        const fonts = await loadFontsWithPagination(currentPage, perPage);
  
        fonts.forEach(font => {
            const option = document.createElement("div");
            option.textContent = font.family;
            option.style.fontFamily = font.family;
            option.classList.add("squareCraft-py-1px", "squareCraft-text-white", "squareCraft-text-sm", 
                "squareCraft-cursor-pointer", "squareCraft-px-2");
  
            option.addEventListener("mouseover", () => option.classList.add("squareCraft-bg-494949"));
            option.addEventListener("mouseout", () => option.classList.remove("squareCraft-bg-494949"));
  
            option.addEventListener("click", async () => {
                document.querySelector("#squareCraft-font-family p").textContent = font.family;
                document.querySelector("#squareCraft-font-family p").style.fontFamily = font.family;
                fontList.classList.add("squareCraft-hidden");
  
                if (selectedElement) {
                    let css = { "font-family": font.family };
                    await saveModifications(selectedElement.id, css);
                    applyStylesToElement(selectedElement.id, css);
                }
            });
  
            fontList.appendChild(option);
        });
  
        currentPage++;
    }
  
    fontDropdown.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevents dropdown from closing immediately
        fontList.classList.toggle("squareCraft-hidden");
  
        if (fontList.children.length === 0) {
            loadMoreFonts();
        }
    });
  
    document.addEventListener("click", (event) => {
        if (!fontDropdown.contains(event.target)) {
            fontList.classList.add("squareCraft-hidden");
        }
    });
  }
  
  
  
  
  setTimeout(() => {
    fontfamilies();
  }, 1000);
  
  
  
  
  
    function attachEventListeners() {
      document.body.addEventListener("click", (event) => {
          let block = event.target.closest('[id^="block-"]');
          const widget = document.getElementById("squarecraft-widget-container");
      
          if (block) {
              document.querySelectorAll(".squareCraft-outline").forEach(el => {
                  el.classList.remove("squareCraft-outline");
                  el.style.outline = ""; 
              });
      
              block.classList.add("squareCraft-outline");
              block.style.outline = "2px dashed #EF7C2F"; 
              selectedElement = block;
      
              widget.classList.remove("squareCraft-hidden");
      
          } else if (!widget.contains(event.target)) {
              widget.classList.add("squareCraft-hidden");
          }
      });
      
      ;
      
  
      const fontSizeInput = document.getElementById("squareCraftFontSizeInput");
      const fontSizeDropdown = document.getElementById("squareCraftFontSizeDropdown");
      const fontSizeOptions = document.getElementById("squareCraftFontSizeOptions");
  
      fontSizeDropdown.addEventListener("click", function () {
        fontSizeOptions.classList.toggle("squareCraft-hidden");
      });
  
      fontSizeOptions.addEventListener("click", function (event) {
        if (!event.target.classList.contains("squareCraft-dropdown-item")) return;
        fontSizeInput.value = event.target.dataset.value;
        fontSizeOptions.classList.add("squareCraft-hidden");
  
        if (selectedElement) {
          let css = { "font-size": `${event.target.dataset.value}px` };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      });
  
      fontSizeInput.addEventListener("input", function () {
        if (selectedElement) {
          let css = { "font-size": `${fontSizeInput.value}px` };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      });
  
      const letterSpacingInput = document.getElementById("squareCraftLetterSpacingInput");
      const letterSpacingDropdown = document.getElementById("squareCraftLetterSpacingDropdown");
      const letterSpacingOptions = document.getElementById("squareCraftLetterSpacingOptions");
  
      letterSpacingDropdown.addEventListener("click", function () {
        letterSpacingOptions.classList.toggle("squareCraft-hidden");
      });
  
      letterSpacingOptions.addEventListener("click", function (event) {
        if (!event.target.classList.contains("squareCraft-dropdown-item")) return;
        letterSpacingInput.value = event.target.dataset.value;
        letterSpacingOptions.classList.add("squareCraft-hidden");
  
        if (selectedElement) {
          let css = { "letter-spacing": `${event.target.dataset.value}px` };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      });
  
      letterSpacingInput.addEventListener("input", function () {
        if (selectedElement) {
          let css = { "letter-spacing": `${letterSpacingInput.value}px` };
          applyStylesToElement(selectedElement.id, css);
          saveModifications(selectedElement.id, css);
        }
      });
  
      // Text Alignment Handling
      document.querySelectorAll(".alignment-icon").forEach(icon => {
        icon.addEventListener("click", async function () {
          if (!selectedElement) return;
          const alignment = this.getAttribute("data-align");
  
          let css = { "text-align": alignment };
          applyStylesToElement(selectedElement.id, css);
          await saveModifications(selectedElement.id, css);
  
          console.log(`✅ Applied text alignment: ${alignment} to ${selectedElement.id}`);
        });
      });
    }
  
  
  
  
    document.addEventListener("DOMContentLoaded", function () {
      createWidgetIcon();
  
      makeWidgetDraggable();
      function insertCustomAdminIcon() {
        const adminNavbar = document.querySelector("[data-test='editor-header']"); // Target the Squarespace admin navbar
  
        if (!adminNavbar) {
            console.warn("Admin navbar not found. Retrying...");
            setTimeout(insertCustomAdminIcon, 1000); // Retry in case the page hasn't fully loaded
            return;
        }
  
        if (document.getElementById("customAdminIcon")) return;
  
        const customIcon = document.createElement("img");
        customIcon.src = "https://i.ibb.co.com/VpxFTKBz/Group-29.jpg"; // Your icon URL
        customIcon.id = "customAdminIcon";
        customIcon.style.cursor = "pointer";
        customIcon.style.marginLeft = "15px"; // Adjust spacing
        customIcon.style.width = "32px"; // Icon size
        customIcon.style.height = "32px";
        
        customIcon.addEventListener("click", function () {
            alert("Custom Plugin Clicked!");
        });
  
        adminNavbar.appendChild(customIcon);
        console.log("✅ Custom admin icon added!");
    }
  
    insertCustomAdminIcon();
    function checkURL() {
      const currentURL = window.location.href;
      let widgetContainer = document.getElementById("squarecraft-widget-container");
  
      console.log("Current URL:", currentURL);
  
      if (currentURL.includes("/#")) {
          console.log("✅ Widget is VISIBLE on the Code Injection page.");
          
          if (!widgetContainer) {
              createWidget(); 
              setTimeout(() => {
                  widgetContainer = document.getElementById("squarecraft-widget-container");
                  if (widgetContainer) makeWidgetDraggable(); 
              }, 500); 
          } else {
              widgetContainer.style.display = "block"; 
              makeWidgetDraggable(); 
          }
  
      } else {
          console.log("❌ Widget is HIDDEN on other pages.");
          if (widgetContainer) widgetContainer.style.display = "none"; 
      }
  }
  
  
    
  
      checkURL();
      setInterval(checkURL, 1000);
      setInterval(makeWidgetDraggable, 1000);
  
      createWidget();
      makeWidgetDraggable();
      attachEventListeners();
      fetchModifications();
      makeWidgetDraggable();
  
      const fontSizeInput = document.getElementById("squareCraftFontSizeInput");
      const dropdownArrow = document.getElementById("squareCraftFontSizeDropdown");
      const dropdownOptions = document.getElementById("squareCraftFontSizeOptions");
  
      document.body.addEventListener("click", (event) => {
          let block = event.target.closest('[id^="block-"]');
          if (!block) return;
  
          if (selectedElement) selectedElement.style.outline = "";
          selectedElement = block;
          selectedElement.style.outline = "2px dashed #EF7C2F";
  
          let computedFontSize = window.getComputedStyle(selectedElement).fontSize;
          fontSizeInput.value = parseInt(computedFontSize, 10); 
      });
  
      dropdownArrow.addEventListener("click", function (event) {
          event.stopPropagation();
          dropdownOptions.classList.toggle("squareCraft-hidden");
      });
  
      dropdownOptions.addEventListener("click", function (event) {
          if (event.target.classList.contains("squareCraft-dropdown-item")) {
              fontSizeInput.value = event.target.dataset.value;
              dropdownOptions.classList.add("squareCraft-hidden");
  
              if (selectedElement) {
                  let css = { "font-size": `${event.target.dataset.value}px` };
                  applyStylesToElement(selectedElement.id, css);
                  saveModifications(selectedElement.id, css);
              }
          }
      });
  
      document.addEventListener("click", function (event) {
          if (!dropdownArrow.contains(event.target) && !dropdownOptions.contains(event.target)) {
              dropdownOptions.classList.add("squareCraft-hidden");
          }
      });
  
      fontSizeInput.addEventListener("input", function () {
          if (selectedElement) {
              let css = { "font-size": `${fontSizeInput.value}px` };
              applyStylesToElement(selectedElement.id, css);
              saveModifications(selectedElement.id, css);
          }
      });
  });
  
  
  
  })();