chrome.storage.sync.get(['gotomyprofile_on', 'gotomyprofile_tab'], (result) => {
  if (result.gotomyprofile_on === false) return;

  function tryRedirect() {
    const userBtn = document.querySelector('button[data-login]');
    
    if (userBtn) {
      const username = userBtn.getAttribute('data-login');
      const avatarImg = userBtn.querySelector('img');
      const avatarUrl = avatarImg ? avatarImg.src : null;

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
        return true;
      }
    }
    return false;
  }

  if (tryRedirect()) return;

  const observer = new MutationObserver(() => {
    if (tryRedirect()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => observer.disconnect(), 5000);
}); 

