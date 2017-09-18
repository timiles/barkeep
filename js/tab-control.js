export default class TabControl {

    constructor(document) {
        this.tabLinks = Array.from(document.getElementsByClassName('tab-link'));
        this.tabPanes = Array.from(document.getElementsByClassName('tab-pane'));

        this.tabLinks.forEach(
            tabLink => {
                tabLink.onclick = () => { this.openTab(TabControl._getTargetTabId(tabLink)); }
            });
    }

    static _getTargetTabId(tabLink) {
        return tabLink.getAttribute('href').substring(1);
    }

    openTab(targetTabId) {
        let toggleActive = (tabId, el) => {
            if (tabId === targetTabId) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
        this.tabLinks.forEach(
            tabLink => {
                toggleActive(TabControl._getTargetTabId(tabLink), tabLink);
            });
        this.tabPanes.forEach(
            tabContents => {
                toggleActive(tabContents.id, tabContents);
            });
    }
}