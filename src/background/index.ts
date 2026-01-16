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
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: "power-mode-enable",
    title: "Enable for this website",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "power-mode-disable",
    title: "Disable for this website",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "power-mode-separator",
    type: "separator",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "power-mode-settings",
    title: "Settings",
    contexts: ["all"],
  });
});

function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "power-mode-settings" && tab?.id) {
    openSidePanel(tab.id);
    return;
  }

  const domain = tab?.url ? getDomain(tab.url) : null;
  if (!domain) return;

  if (info.menuItemId === "power-mode-enable") {
    chrome.storage.local.get(["blockedDomains"], (result) => {
      const blockedDomains: string[] = result.blockedDomains ?? [];
      const index = blockedDomains.indexOf(domain);
      if (index > -1) {
        blockedDomains.splice(index, 1);
        chrome.storage.local.set({ blockedDomains });
      }
    });
  }

  if (info.menuItemId === "power-mode-disable") {
    chrome.storage.local.get(["blockedDomains"], (result) => {
      const blockedDomains: string[] = result.blockedDomains ?? [];
      if (!blockedDomains.includes(domain)) {
        blockedDomains.push(domain);
        chrome.storage.local.set({ blockedDomains });
      }
    });
  }
});
