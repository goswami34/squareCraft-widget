export function findIds(){
    function logAllCollections() {
        document.querySelectorAll('[id^="collection-"]').forEach(element => {
    
        });
    }
    
    function sectionAndId(event) {
        const block = event.target.closest('[id^="block-"]');
        if (block) {
            return;
        }
    
        const section = event.target.closest('section[data-section-id]');
        if (section) {
        }
    }
    
    function logPageId() {
        const pageElement = document.querySelector('article[data-page-sections]');
        if (pageElement) {
        }
    }
    
    function initializeLogging() {
        logAllCollections();
        logPageId();
        document.addEventListener('click', sectionAndId);
    }

    initializeLogging();
    
}