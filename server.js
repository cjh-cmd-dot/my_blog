const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "posts.json");
const CATEGORIES_FILE = path.join(__dirname, "categories.json");
const ADMIN_PASSWORD = "xiaoxiang_yyds";
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "8mb" }));
app.use(express.static(path.join(__dirname, "public")));

function ensureJsonFile(file, fallback) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2), "utf-8");
  }
}

function readJson(file, fallback) {
  ensureJsonFile(file, fallback);
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return Array.isArray(data) ? data : fallback;
  } catch (error) {
    console.error(`读取 ${path.basename(file)} 失败:`, error);
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2), "utf-8");
}

function readPosts() {
  return readJson(DATA_FILE, []);
}

function writePosts(posts) {
  writeJson(DATA_FILE, posts);
}

function readStoredCategories() {
  return readJson(CATEGORIES_FILE, []);
}

function writeStoredCategories(categories) {
  writeJson(CATEGORIES_FILE, categories);
}

function getAllCategories(posts = readPosts()) {
  const names = [
    ...readStoredCategories(),
    ...posts.map(post => post.category || "未分类"),
  ];

  return [...new Set(names.map(name => String(name || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function rememberCategory(category) {
  const name = String(category || "").trim() || "未分类";
  const categories = getAllCategories();
  if (!categories.includes(name)) {
    categories.push(name);
    writeStoredCategories(categories.sort((a, b) => a.localeCompare(b, "zh-CN")));
  }
  return name;
}

function verifyPassword(req, res) {
  if (req.body.password !== ADMIN_PASSWORD) {
    res.status(401).json({ success: false, message: "管理员密码不正确" });
    return false;
  }
  return true;
}

function normalizePost(input, existing = {}) {
  const title = String(input.title || "").trim();
  const category = rememberCategory(input.category);
  const content = String(input.content || "").trim();
  const summary = String(input.summary || "")
    .trim()
    .slice(0, 180);

  return {
    ...existing,
    title,
    category,
    summary,
    content,
    date: existing.date || new Date().toLocaleDateString("zh-CN"),
    updatedAt: new Date().toLocaleString("zh-CN"),
  };
}

app.get("/api/posts", (req, res) => {
  const posts = readPosts().sort((a, b) => Number(b.id) - Number(a.id));
  res.json(posts);
});

app.get("/api/categories", (req, res) => {
  res.json(getAllCategories());
});

app.post("/api/categories", (req, res) => {
  if (!verifyPassword(req, res)) return;

  const name = String(req.body.name || "").trim();
  if (!name) {
    return res.status(400).json({ success: false, message: "分类名称不能为空" });
  }

  rememberCategory(name);
  res.json({ success: true, message: "分类已创建", categories: getAllCategories() });
});

app.get("/api/posts/:id", (req, res) => {
  const post = readPosts().find(item => String(item.id) === String(req.params.id));
  if (!post) {
    return res.status(404).json({ success: false, message: "文档不存在" });
  }
  res.json(post);
});

app.post("/api/posts", (req, res) => {
  if (!verifyPassword(req, res)) return;

  const post = normalizePost(req.body);
  if (!post.title || !post.content) {
    return res.status(400).json({ success: false, message: "标题和内容不能为空" });
  }

  const posts = readPosts();
  posts.push({ ...post, id: Date.now() });
  writePosts(posts);
  res.json({ success: true, message: "文档已创建" });
});

app.put("/api/posts/:id", (req, res) => {
  if (!verifyPassword(req, res)) return;

  const posts = readPosts();
  const index = posts.findIndex(item => String(item.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "文档不存在" });
  }

  const nextPost = normalizePost(req.body, posts[index]);
  if (!nextPost.title || !nextPost.content) {
    return res.status(400).json({ success: false, message: "标题和内容不能为空" });
  }

  posts[index] = nextPost;
  writePosts(posts);
  res.json({ success: true, message: "文档已更新" });
});

app.delete("/api/posts/:id", (req, res) => {
  if (!verifyPassword(req, res)) return;

  const posts = readPosts();
  const nextPosts = posts.filter(item => String(item.id) !== String(req.params.id));
  if (nextPosts.length === posts.length) {
    return res.status(404).json({ success: false, message: "文档不存在" });
  }

  writePosts(nextPosts);
  res.json({ success: true, message: "文档已删除" });
});

app.listen(PORT, () => {
  console.log(`小象博客已启动: http://localhost:${PORT}`);
});
