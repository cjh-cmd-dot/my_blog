const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const titleEl = document.getElementById("post-title");
const metaEl = document.getElementById("post-meta");
const contentEl = document.getElementById("post-content");

if (!titleEl || !metaEl || !contentEl) {
  console.error("article.html 缺少必要元素");
} else {
  const post = posts.find(item => item.id === id);

  if (post) {
    document.title = post.title;
    titleEl.textContent = post.title;
    metaEl.textContent = `分类：${post.category} | 日期：${post.date}`;
    contentEl.innerHTML = post.content;
  } else {
    document.title = "文章不存在";
    titleEl.textContent = "文章不存在";
    metaEl.textContent = "";
    contentEl.innerHTML = "<p>没有找到这篇文章。</p>";
  }
}