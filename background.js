const ICON_ON = {
  16: 'icons/on/icon16.png',
  32: 'icons/on/icon32.png',
  48: 'icons/on/icon48.png',
  128: 'icons/on/icon128.png'
};
const ICON_OFF = {
  16: 'icons/off/icon16.png',
  32: 'icons/off/icon32.png',
  48: 'icons/off/icon48.png',
  128: 'icons/off/icon128.png'
};

function updateIconAndTitle(isOn) {
  const title = chrome.i18n.getMessage(isOn ? 'profileOn' : 'profileOff');
  chrome.action.setIcon({ path: isOn ? ICON_ON : ICON_OFF });
  chrome.action.setTitle({ title });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get(['gotomyprofile_on'], (result) => {
    const newState = !(result.gotomyprofile_on !== false);
    chrome.storage.sync.set({ gotomyprofile_on: newState }, () => {
      updateIconAndTitle(newState);
    });
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['gotomyprofile_on'], (result) => {
    updateIconAndTitle(result.gotomyprofile_on !== false);
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ gotomyprofile_on: true }, () => {
    updateIconAndTitle(true);
  });
});

let githubUserInfo = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'githubUserInfo') {
    githubUserInfo = {
      username: msg.username,
      avatarUrl: msg.avatarUrl
    };
  }
  if (msg && msg.type === 'updateIcon') {
    updateIconAndTitle(msg.isOn);
  }
  if (msg && msg.type === 'getGithubUserInfo') {
    sendResponse(githubUserInfo);
  }
}); 