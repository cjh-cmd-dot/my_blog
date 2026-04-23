const postList = document.getElementById("post-list");

if (postList) {
  const grouped = {};

  posts.forEach(post => {
    if (!grouped[post.category]) {
      grouped[post.category] = [];
    }
    grouped[post.category].push(post);
  });

  Object.keys(grouped).forEach(category => {
    const section = document.createElement("section");
    section.className = "card category-block";

    let html = `<h2>${category}</h2>`;

    grouped[category].forEach(post => {
      html += `
        <div class="card">
          <h3><a href="article.html?id=${post.id}">${post.title}</a></h3>
          <p class="meta-line">分类：${post.category} | 日期：${post.date}</p>
          <p>${post.summary}</p>
        </div>
      `;
    });

    section.innerHTML = html;
    postList.appendChild(section);
  });
}