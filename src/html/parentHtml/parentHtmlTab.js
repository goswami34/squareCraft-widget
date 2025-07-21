(
    async function parentHtmlTab() {
        const tabs = document.querySelectorAll(".tabHeader");
        const contentContainer = document.querySelector(".sc-rounded-6px.sc-mt-6");
        const activeIndicator = document.querySelector(".sc-absolute"); // The moving indicator

        const tabData = {
            design: `
                 <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
        <div class="sc-flex sc-gap-2 sc-items-center"><img loading="lazy"
                src="https://goswami34.github.io/squareCraft-widget/public/T.svg" alt="">
            <p>Typography</p>
        </div>
        <img src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">
    </div>
    <div class="sc-h-1px sc-bg-3f3f3f"></div>
    <div
        class="sc-flex sc-px-2 sc-mt-2 sc-items-center sc-justify-between">
        <div class="sc-flex sc-gap-2 sc-items-center">
            <div class="toggle-container" id="toggleSwitch">
                <div class="toggle-bullet"></div>
            </div>
            <p id="toggleText" class="sc-text-sm">Enable</p>
        </div>
        <div id="resetButton" 
        class="sc-flex sc-cursor-pointer sc-items-center sc-py-1px sc-rounded-15px sc-gap-2 sc-bg-3f3f3f sc-px-2">
        <p class="sc-text-sm">Reset</p>
        <img id="resetIcon" 
            src="https://goswami34.github.io/squareCraft-widget/public/reset.svg"
            width="12px" />
    </div>
    
    </div>
    <div class="sc-h-1px sc-mt-2 sc-bg-3f3f3f"></div>
    <div class="sc-mt-2">
        <div
            class="sc-flex sc-px-2 sc-w-full sc-items-center sc-justify-between sc-gap-2">
            <div
                class="sc-cursor-pointer sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-text-sm sc-py-1px sc-rounded-6px sc-text-color-white sc-justify-center">
                Normal</div>
            <div
                class="sc-cursor-pointer sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-text-sm sc-py-1px sc-rounded-6px sc-items-center sc-justify-center">
                Hover</div>
        </div>
        <div class="sc-px-4">
            <div class="sc-h-1px  sc-mt-2 sc-bg-3f3f3f"></div>
        </div>
    </div>

    <div class="sc-mt-6 sc-px-2 sc-flex sc-justify-between">
        <p class="sc-text-sm">Text</p>
        <img src="https://goswami34.github.io/squareCraft-widget/public/eye.svg" width="12px" />
    </div>

    <div class="sc-mt-2 sc-grid sc-w-full sc-grid-cols-12 sc-gap-2 sc-px-2">
        <div id="sc-font-family" class="sc-flex sc-col-span-8 sc-cursor-pointer sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center sc-h-full">
            <div class="sc-bg-494949 sc-w-full sc-px-2 sc-py-1px ">
                <p class="sc-text-sm sc-font-light">Sf Pro sans</p>
            </div>
            <div class="sc-bg-3f3f3f sc-px-2" style="height: 27px; padding: 0 8px;">
                <img class="sc-h-full sc-rotate-180" width="12px"
                    src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">

            </div>
        </div>
        <div class="sc-flex sc-justify-between sc-col-span-4  sc-rounded-6px sc-border sc-border-solid sc-border-585858 sc-items-center sc-h-full">
           <div class="sc-flex sc-items-center sc-w-full">
            <div class=" sc-bg-494949  sc-px-2 sc-w-full sc-py-1px ">
                <p class="sc-text-sm  sc-font-light">14</p>
            </div>
            <div class="sc-border-r   sc-border-585858 sc-h-full"></div>
            <div class="sc-bg-494949  sc-px-1 sc-w-full sc-py-1px ">
                <p class="sc-text-sm sc-font-light">px</p>
            </div>
           </div>
            <div class="sc-bg-3f3f3f sc-px-1" style="height: 27px; padding: 0 8px;">
                <img class=" sc-rounded-6px sc-rotate-180" width="12px"
                    src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">

            </div>
        </div>
    </div>


    <div class="sc-mt-2 sc-grid sc-px-2 sc-w-full sc-grid-cols-12 sc-gap-2 ">
        <div class="sc-flex sc-col-span-7 sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center sc-h-full">
            <div class="sc-bg-494949 sc-px-2 sc-w-full  sc-py-1px ">
                <p class="sc-text-sm sc-font-light">Regular</p>
            </div>
            <div class="sc-bg-3f3f3f sc-px-2" style="height: 27px; padding: 0 8px;">
                <img class="sc-h-full sc-rotate-180" width="12px"
                    src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">

            </div>
        </div>
        <div class="sc-flex sc-justify-between sc-col-span-4  sc-rounded-6px sc-border sc-border-solid sc-border-585858 sc-items-center sc-h-full">
          <div class="sc-flex sc-mx-auto sc-items-center sc-justify-center">
            <img class=" sc-rounded-6px sc-rotate-180" width="12px"
            src="https://goswami34.github.io/squareCraft-widget/public/dot.svg" alt="">
          </div>
          <div class="sc-border-r   sc-border-585858 sc-h-full"></div>
            <div class="sc-flex sc-mx-auto sc-items-center sc-justify-center sc-border sc-border-585858 sc-w-13px sc-border-solid sc-h-13px">

            </div>
            <div class="sc-border-r   sc-border-585858 sc-h-full"></div>
            
            <img class=" sc-rounded-6px sc-rotate-180 sc-flex sc-mx-auto sc-items-center sc-justify-center" width="12px"
            src="https://goswami34.github.io/squareCraft-widget/public/gap.svg" alt="">
        </div>
    </div>



    <div class="sc-mt-2"> </div>
                `,
            advanced: `
                    <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
                        <p class="sc-text-sm">Advanced Settings</p>
                    </div>
                    <div class="sc-h-1px sc-bg-3f3f3f"></div>
                `,
            presets: `
                    <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
                        <p class="sc-text-sm">Preset Options</p>
                    </div>
                    <div class="sc-h-1px sc-bg-3f3f3f"></div>
                `
        };

        tabs.forEach(tab => {
            tab.addEventListener("click", function () {
                tabs.forEach(t => t.classList.remove("sc-active-tab"));

                this.classList.add("sc-active-tab");

                const selectedTab = this.textContent.trim().toLowerCase();
                contentContainer.innerHTML = tabData[selectedTab] || "";

                const tabRect = this.getBoundingClientRect();
                const parentRect = this.parentElement.getBoundingClientRect();
                activeIndicator.style.left = `${tabRect.left - parentRect.left}px`;
                activeIndicator.style.width = `${tabRect.width}px`;
            });
        });
        document.addEventListener("click", function (event) {
            const toggle = event.target.closest("#toggleSwitch");
            if (toggle) {
                const toggleText = document.getElementById("toggleText");
                toggle.classList.toggle("active");
                if (toggleText) {
                    toggleText.textContent = toggle.classList.contains("active") ? "Enabled" : "Enable";
                }
            }
        });

        document.addEventListener("click", function (event) {
            const resetButton = event.target.closest("#resetButton");
            if (resetButton) {
                const resetIcon = resetButton.querySelector("#resetIcon");
                if (resetIcon) {
                    resetIcon.classList.add("rotate-animation");
                    setTimeout(() => {
                        resetIcon.classList.remove("rotate-animation");
                    }, 1000);
                }
            }
        });


        // its the https://goswami34.github.io/squareCraft-widget/src/html/parentHtml/parentHtmlTab.js
    }
)()