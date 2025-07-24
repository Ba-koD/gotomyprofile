// 탭 전환 및 리다이렉트 탭 설정
const tabs = document.querySelectorAll('.gh-tab');
const contents = document.querySelectorAll('.tab-content > div');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    contents.forEach(c => c.style.display = 'none');
    const show = document.querySelector(`[data-content="${tab.dataset.tab}"]`);
    if (show) show.style.display = '';
    // 선택한 탭을 저장 (redirect용)
    chrome.storage.sync.set({ gotomyprofile_tab: tab.dataset.tab });
  });
});

// 팝업이 열릴 때 마지막 선택 탭을 active로
chrome.storage.sync.get(['gotomyprofile_tab'], (result) => {
  const tabKey = result.gotomyprofile_tab || 'overview';
  const tab = document.querySelector(`.gh-tab[data-tab="${tabKey}"]`);
  if (tab) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    contents.forEach(c => c.style.display = 'none');
    const show = document.querySelector(`[data-content="${tabKey}"]`);
    if (show) show.style.display = '';
  }
});

// 다국어 메시지 동적 적용
function setI18nText() {
  const tabMap = [
    { selector: '[data-content="overview"]', key: 'tabOverviewDesc' },
    { selector: '[data-content="repositories"]', key: 'tabRepositoriesDesc' },
    { selector: '[data-content="projects"]', key: 'tabProjectsDesc' },
    { selector: '[data-content="packages"]', key: 'tabPackagesDesc' },
    { selector: '[data-content="stars"]', key: 'tabStarsDesc' }
  ];
  tabMap.forEach(({ selector, key }) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = chrome.i18n.getMessage(key);
  });
}
setI18nText();

// 사용자 정보 표시(기존 코드 유지)
function renderUserInfo(user) {
  const userInfo = document.getElementById('userInfo');
  if (!userInfo) return;
  userInfo.innerHTML = '';
  if (user && user.username) {
    userInfo.style.display = 'flex';
    userInfo.style.alignItems = 'center';
    userInfo.style.gap = '8px';
    userInfo.style.flexGrow = '1';
    if (user.avatarUrl) {
      const img = document.createElement('img');
      img.src = user.avatarUrl;
      img.alt = 'avatar';
      img.style.width = '28px';
      img.style.height = '28px';
      img.style.borderRadius = '50%';
      userInfo.appendChild(img);
    }
    const span = document.createElement('span');
    span.textContent = user.username;
    span.style.fontWeight = 'bold';
    span.style.marginLeft = '6px';
    span.style.fontSize = '1em';
    userInfo.appendChild(span);
  } else {
    userInfo.innerHTML = '';
    userInfo.style.display = '';
    userInfo.style.flexGrow = '0';
  }
}
chrome.runtime.sendMessage({ type: 'getGithubUserInfo' }, (user) => {
  renderUserInfo(user);
});

// ON/OFF 상태 관리 (toggle 변수 없이)
let isOn = true;

function updateUI() {
  const tabs = document.querySelector('.gh-tabs');
  const tabContent = document.getElementById('tabContent');
  const userInfo = document.getElementById('userInfo');
  const onoffBtn = document.getElementById('onoffBtn');
  const offMessage = document.getElementById('offMessage');
  const body = document.body;
  if (isOn) {
    if (body) body.classList.remove('off-mode');
    if (tabs) { tabs.style.opacity = 1; tabs.style.pointerEvents = 'auto'; }
    if (tabContent) { tabContent.style.opacity = 1; tabContent.style.pointerEvents = 'auto'; }
    if (userInfo) { userInfo.style.opacity = 1; userInfo.style.pointerEvents = 'auto'; userInfo.style.display = ''; }
    if (onoffBtn) {
      onoffBtn.textContent = 'OFF';
      onoffBtn.classList.remove('on');
      onoffBtn.classList.add('off');
    }
    if (offMessage) { offMessage.style.opacity = 0; offMessage.style.pointerEvents = 'none'; offMessage.style.display = 'none'; }
    // 항상 최신 userInfo 표시
    chrome.runtime.sendMessage({ type: 'getGithubUserInfo' }, renderUserInfo);
  } else {
    if (body) body.classList.add('off-mode');
    if (tabs) { tabs.style.opacity = 0; tabs.style.pointerEvents = 'none'; }
    if (tabContent) { tabContent.style.opacity = 0; tabContent.style.pointerEvents = 'none'; }
    if (userInfo) { userInfo.style.opacity = 0; userInfo.style.pointerEvents = 'none'; userInfo.style.display = 'none'; }
    if (onoffBtn) {
      onoffBtn.textContent = 'ON';
      onoffBtn.classList.remove('off');
      onoffBtn.classList.add('on');
    }
    if (offMessage) {
      offMessage.style.opacity = 1;
      offMessage.style.pointerEvents = 'auto';
      offMessage.style.display = 'flex';
      offMessage.innerHTML = chrome.i18n.getMessage('offMessage');
    }
  }
}

// 초기 상태 불러오기
chrome.storage.sync.get(['gotomyprofile_on'], (result) => {
  isOn = result.gotomyprofile_on !== false;
  updateUI();
});

document.getElementById('onoffBtn').addEventListener('click', () => {
  isOn = !isOn;
  chrome.storage.sync.set({ gotomyprofile_on: isOn }, () => {
    chrome.runtime.sendMessage({ type: 'updateIcon', isOn });
    updateUI();
  });
}); 