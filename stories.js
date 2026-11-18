const language = document.getElementById('language');
const labels = {
  market: ['逛集市', '逛集市', 'Market'],
  register: ['注册体验', '註冊體驗', 'Try sign-up'],
  title: ['校园分享', '校園分享', 'Campus stories'],
  count: ['12 篇公开帖子', '12 篇公開帖子', '12 public posts'],
  photos: ['点开图片查看原图', '點開圖片查看原圖', 'Select a photo to view the original']
};
language.addEventListener('change', () => {
  const index = language.selectedIndex;
  document.documentElement.lang = ['zh-Hans', 'zh-Hant', 'en'][index];
  document.title = labels.title[index] + ' · PolyMart';
  for (const element of document.querySelectorAll('[data-label]')) element.textContent = labels[element.dataset.label][index];
});
function openLinkedStory() {
  const story = document.getElementById(location.hash.slice(1));
  if (story instanceof HTMLDetailsElement) story.open = true;
}
window.addEventListener('hashchange', openLinkedStory);
openLinkedStory();
