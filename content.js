chrome.storage.sync.get(['gotomyprofile_on', 'gotomyprofile_tab'], (result) => {
  if (result.gotomyprofile_on === false) return;
  if (location.pathname !== "/") return;
  const meta = document.querySelector('meta[name="user-login"]');
  if (meta && meta.content) {
    const username = meta.content;
    let avatarUrl = null;
    const avatarImg = document.querySelector('img.avatar-user');
    if (avatarImg) {
      avatarUrl = avatarImg.src;
    }
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

