// background.js

chrome.runtime.onInstalled.addListener((event) => {
  if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    if (typeof chrome !== "undefined" && typeof chrome.tabs !== "undefined") {
      chrome.tabs.create({
        url: chrome.runtime.getURL("views/intro.html") + "?welcome=1",
      });
    } else {
      throw new Error("Did not find an API for tabs.create");
    }
  }
});
