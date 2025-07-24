chrome.storage.sync.get(['gotomyprofile_on'], (result) => {
  if (result.gotomyprofile_on === false) return;

  if (location.pathname !== "/") return;
  const meta = document.querySelector('meta[name="user-login"]');
  if (meta && meta.content) {
    const username = meta.content;
    if (username) {
      location.replace(`/${username}`);
    }
  }
}); 

