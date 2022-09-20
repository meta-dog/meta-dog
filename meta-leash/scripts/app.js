var CurrentAppID;

let retriesLeft = 100;

function getIdFromUrl() {
  const url = location.pathname;
  const appId = url.match(/\/(?:rift|quest)\/(?<id>[0-9]+)/);
  return appId ? parseInt(appId.groups.id, 10) : -1;
}

function getReferralUsernameFromId(id) {
  // TODO: Call the API and get the username
  return "itsoktobeup";
}

async function getReferralUrl() {
  const id = getIdFromUrl();
  const username = getReferralUsernameFromId(id);
  return Promise.resolve(
    `https://www.oculus.com/appreferrals/${username}/${id}`
  );
}

function addClickEventToClone(clone, url) {
  clone.onclick = () => window.open(url, "_blank", "noreferrer");
}

function addStylesToClone(clone) {
  const text = clone.firstChild.lastChild;
  text.innerText = "Get 25% Discount!";
  const setBaseColor = () => (text.style = "color: #0880fa;");
  const setHoverColor = () => (text.style = "color: #fff;");
  setBaseColor();
  text.addEventListener("mouseover", setHoverColor);
  text.addEventListener("mouseout", setBaseColor);
  const container = clone.firstChild;
  container.addEventListener("mouseover", setHoverColor);
  container.addEventListener("mouseout", setBaseColor);
}

function appendDiscountChildToMenu(purchaseContextMenu, referralUrl) {
  const contextMenuItemClone = purchaseContextMenu.firstChild.cloneNode(true);
  purchaseContextMenu.appendChild(contextMenuItemClone);

  addClickEventToClone(contextMenuItemClone, referralUrl);
  addStylesToClone(contextMenuItemClone);
}

function getPurchaseMenus() {
  return document.getElementsByClassName(
    "app-purchase__detail app-purchase__context-menu"
  );
}

function retryAppendDiscounts(referralUrl) {
  const purchaseContextMenus = getPurchaseMenus();
  if (purchaseContextMenus.length > 0) {
    [...purchaseContextMenus].forEach((menu) =>
      appendDiscountChildToMenu(menu, referralUrl)
    );
    return;
  }

  if (retriesLeft === 1) return;

  retriesLeft -= 1;
  setTimeout(() => retryAppendDiscounts(referralUrl), 1000);
}

function addDiscountIfAvailable() {
  getReferralUrl().then((url) => {
    setTimeout(() => retryAppendDiscounts(url), 1000);
  });
}

(async () => addDiscountIfAvailable())();
