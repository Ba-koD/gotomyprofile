const body = document.body;
const tabs = document.querySelectorAll('.gh-tab');
const contents = document.querySelectorAll('.tab-content > div');
const userInfo = document.getElementById('userInfo');
const onoffBtn = document.getElementById('onoffBtn');

let isOn = true;

document.querySelectorAll('[data-i18n]').forEach(el => {
  el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
});

function selectTab(key) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === key));
  contents.forEach(c => { c.hidden = c.dataset.content !== key; });
}

function applyOnOff() {
  body.classList.toggle('off-mode', !isOn);
  onoffBtn.classList.toggle('off', isOn);
  onoffBtn.classList.toggle('on', !isOn);
}

function renderUserInfo(user) {
  userInfo.replaceChildren();
  if (!user || !user.username) return;
  if (user.avatarUrl) {
    const img = document.createElement('img');
    img.src = user.avatarUrl;
    img.alt = 'avatar';
    img.className = 'profile-avatar';
    userInfo.appendChild(img);
  }
  const span = document.createElement('span');
  span.textContent = user.username;
  span.title = user.username;
  span.className = 'profile-username';
  userInfo.appendChild(span);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    selectTab(tab.dataset.tab);
    chrome.storage.sync.set({ gotomyprofile_tab: tab.dataset.tab });
  });
});

onoffBtn.addEventListener('click', () => {
  isOn = !isOn;
  applyOnOff();
  chrome.storage.sync.set({ gotomyprofile_on: isOn });
  chrome.runtime.sendMessage({ type: 'updateIcon', isOn }).catch(() => {});
});

// Load all state first and render it in one pass while the content is hidden,
// so the popup never shows (or resizes for) intermediate states.
Promise.all([
  chrome.storage.sync.get(['gotomyprofile_on', 'gotomyprofile_tab']),
  chrome.storage.local.get('gotomyprofile_user')
]).then(([settings, local]) => {
  isOn = settings.gotomyprofile_on !== false;
  selectTab(settings.gotomyprofile_tab || 'overview');
  applyOnOff();
  renderUserInfo(local.gotomyprofile_user);
}).finally(() => {
  // Commit the final styles before transitions are re-enabled, so nothing animates on open.
  void body.offsetWidth;
  body.classList.remove('loading');
});
