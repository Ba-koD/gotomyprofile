chrome.storage.sync.get(['gotomyprofile_on', 'gotomyprofile_tab'], (result) => {
  if (result.gotomyprofile_on === false) return;

  // AppHeader-user에서 avatar와 username만 추출
  let avatarUrl = null;
  let username = null;

  const avatarImg = document.querySelector('.AppHeader-user img.avatar');
  if (avatarImg) {
    avatarUrl = avatarImg.src;
  }

  const userBtn = document.querySelector('.AppHeader-user button[data-login]');
  if (userBtn) {
    username = userBtn.getAttribute('data-login');
  }

  if (username) {
    chrome.runtime.sendMessage({
      type: 'githubUserInfo',
      username,
      avatarUrl
    });
    let url = `/${username}`;
    if (result.gotomyprofile_tab && result.gotomyprofile_tab !== 'overview') {
      url += `?tab=${result.gotomyprofile_tab}`;
    }
    location.replace(url);
  }
}); 

