declare const browser: typeof chrome & {
  sidebarAction?: {
    open(): Promise<void>;
    toggle(): Promise<void>;
  };
};

function openSidePanel(tabId?: number) {
  if (typeof browser !== "undefined" && browser.sidebarAction) {
    // Firefox
    browser.sidebarAction.open();
  } else if (chrome.sidePanel && tabId) {
    // Chrome
    chrome.sidePanel.open({ tabId });
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (typeof browser !== "undefined" && browser.sidebarAction) {
    browser.sidebarAction.toggle();
  } else if (chrome.sidePanel && tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("sidepanel/sidepanel.html") });

  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: "power-mode-settings",
    title: "Power Mode Settings",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "power-mode-settings" && tab?.id) {
    openSidePanel(tab.id);
  }
});
