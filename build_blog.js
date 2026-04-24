const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirsToCreate = [
    'public',
    'public/css',
    'public/js',
    'public/assets',
    'public/assets/video'
];

console.log('🚀 正在深度美化【小象的技术栈】...\n');

dirsToCreate.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// 1. 后端代码
const serverJsCode = `const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'posts.json');
const ADMIN_PASSWORD = "xiaoxiang_yyds"; 

if (!fs.existsSync(DATA_FILE)) { fs.writeFileSync(DATA_FILE, JSON.stringify([])); }

app.get('/api/posts', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(data.sort((a, b) => b.id - a.id));
});

app.get('/api/posts/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const post = data.find(p => p.id == req.params.id);
    res.json(post || { error: '未找到文章' });
});

app.post('/api/posts', (req, res) => {
    const { title, category, content, password } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ success: false, message: '密码错误' });
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    data.push({ id: Date.now(), title, category, content, date: new Date().toLocaleDateString() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(3000, () => console.log('✅ 服务器运行中: http://localhost:3000'));
`;

// 2. CSS 样式
const styleCssCode = `
* { box-sizing: border-box; transition: all 0.3s ease; }
body { margin: 0; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; color: #fff; overflow-x: hidden; }

.video-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -3; overflow: hidden; }
.video-background video { width: 100%; height: 100%; object-fit: cover; }
.video-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: rgba(10, 10, 20, 0.65); }
#sakura-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999; pointer-events: none; }

.container { width: 90%; max-width: 900px; margin: 0 auto; }
.site-header { backdrop-filter: blur(15px); background: rgba(255,255,255,0.05); padding: 25px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
.site-header h1 { margin: 0; font-size: 28px; background: linear-gradient(45deg, #fff, #ffd7e6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
nav { margin-top: 15px; }
nav a { color: rgba(255,255,255,0.8); text-decoration: none; margin-right: 25px; font-weight: 500; }
nav a:hover { color: #ffd7e6; text-shadow: 0 0 10px rgba(255,215,230,0.5); }

.profile-card { 
    background: rgba(255, 255, 255, 0.1); 
    backdrop-filter: blur(20px); 
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 24px; 
    padding: 40px; 
    margin: 40px 0; 
    display: flex; 
    align-items: center; 
    gap: 30px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}
.profile-avatar { min-width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(45deg, #ffd7e6, #ff99cc); display: flex; align-items: center; justify-content: center; font-size: 40px; }
.profile-info h2 { margin: 0 0 10px 0; font-size: 24px; }
.profile-info p { margin: 5px 0; color: rgba(255,255,255,0.7); line-height: 1.6; }

.card { 
    background: rgba(255, 255, 255, 0.08); 
    border-radius: 16px; 
    padding: 25px; 
    margin-bottom: 25px; 
    border: 1px solid rgba(255,255,255,0.05);
}
.card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.12); border-color: rgba(255,215,230,0.3); }
.card h3 { margin-top: 0; }
.card h3 a { color: #fff; text-decoration: none; font-size: 20px; }
.meta-line { font-size: 13px; color: #ffd7e6; opacity: 0.8; margin-top: 10px; }

.tool-btn { background: #ffd7e6; color: #333; border: none; padding: 12px 25px; border-radius: 12px; font-weight: bold; cursor: pointer; }
.tool-btn:hover { background: #fff; transform: scale(1.05); }
input, textarea { background: rgba(255,255,255,0.1) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.2) !important; }
`;

// 3. 首页 HTML
const indexHtmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>小象的技术栈</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="video-background"><video autoplay muted loop playsinline><source src="assets/video/bg.mp4" type="video/mp4"></video></div>
    <div class="video-overlay"></div>
    <canvas id="sakura-canvas"></canvas>

    <div class="page-content">
        <header class="site-header">
            <div class="container">
                <h1>小象的技术栈</h1>
                <nav><a href="index.html">首页</a><a href="about.html">关于我</a><a href="admin.html">写文章</a></nav>
            </div>
        </header>
        <main class="container">
            <section class="profile-card">
                <div class="profile-avatar">🐘</div>
                <div class="profile-info">
                    <h2>你好，我是陈俊豪</h2>
                    <p>专注 ROS 2、ESP32 嵌入式开发与机器人技术。</p>
                    <p>正在探索轮腿机器人与计算机视觉的边界。 <a href="about.html" style="color:#ffd7e6; text-decoration:none;">了解更多 →</a></p>
                </div>
            </section>

            <h2 style="margin-top:40px;">最新发布</h2>
            <div id="post-list"></div>
        </main>
    </div>
    <script src="js/main.js"></script>
    <script>
        fetch('/api/posts').then(res => res.json()).then(posts => {
            const list = document.getElementById('post-list');
            if(posts.length === 0) return list.innerHTML = '<p style="color:#fff;">暂无文章，去写一篇吧！</p>';
            list.innerHTML = posts.map(post => \`
                <div class="card">
                    <h3><a href="article.html?id=\${post.id}">\${post.title}</a></h3>
                    <p class="meta-line">分类：\${post.category} | \${post.date}</p>
                </div>
            \`).join('');
        });
    </script>
</body>
</html>`;

// 4. 关于我 HTML
const aboutHtmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>关于我 - 小象的技术栈</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="video-background"><video autoplay muted loop playsinline><source src="assets/video/bg.mp4" type="video/mp4"></video></div>
    <div class="video-overlay"></div>
    <canvas id="sakura-canvas"></canvas>

    <div class="page-content">
        <header class="site-header"><div class="container"><h1>关于我</h1><nav><a href="index.html">返回首页</a></nav></div></header>
        <main class="container" style="margin-top:40px;">
            <div class="card" style="padding:40px;">
                <h2>👋 个人简介</h2>
                <p>我是陈俊豪（CJH），一名对机器人技术充满热情的开发者。</p>
                
                <h3 style="margin-top: 30px;">🚀 技术栈</h3>
                <ul>
                    <li><strong>机器人系统:</strong> ROS 2, 熟悉节点通信、TF坐标转换。</li>
                    <li><strong>嵌入式开发:</strong> ESP32-S3, ESP-IDF 框架, 擅长 TWAI (CAN总线) 电机控制。</li>
                    <li><strong>计算机视觉:</strong> Intel RealSense D435 深度相机应用, 目标检测与 ROI 处理。</li>
                    <li><strong>项目管理:</strong> 熟练使用 Git / GitHub 进行版本控制。</li>
                </ul>

                <h3 style="margin-top: 30px;">🛠️ 正在进行的项目</h3>
                <ul>
                    <li><strong>Car_Controller:</strong> 基于 ESP32-S3 的高性能轮式/轮腿控制平台。</li>
                    <li><strong>vision_pkg:</strong> 基于 ROS 2 的 3D 目标识别与追踪包。</li>
                </ul>

                <p style="margin-top:40px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px;">
                    📧 联系我：可以通过 GitHub (cjh-cmd-dot) 找到我。
                </p>
            </div>
        </main>
    </div>
    <script src="js/main.js"></script>
</body>
</html>`;

// 5. 详情页 HTML
const articleHtmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>文章详情 - 小象的技术栈</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://unpkg.com/vditor/dist/index.css" />
</head>
<body>
    <div class="video-background"><video autoplay muted loop playsinline><source src="assets/video/bg.mp4" type="video/mp4"></video></div>
    <div class="video-overlay"></div>
    <canvas id="sakura-canvas"></canvas>

    <div class="page-content">
        <header class="site-header">
            <div class="container">
                <h1 id="p-title">加载中...</h1>
                <nav><a href="index.html">返回首页</a></nav>
            </div>
        </header>
        <main class="container">
            <article class="card">
                <p id="p-meta" class="meta-line" style="margin-bottom: 20px;"></p>
                <div id="p-content"></div>
            </article>
        </main>
    </div>

    <script src="https://unpkg.com/vditor/dist/method.min.js"></script>
    <script src="js/main.js"></script>
    <script>
        const id = new URLSearchParams(window.location.search).get('id');
        fetch(\`/api/posts/\${id}\`)
            .then(res => res.json())
            .then(post => {
                document.title = post.title + " - 小象的技术栈";
                document.getElementById('p-title').innerText = post.title;
                document.getElementById('p-meta').innerText = \`分类：\${post.category} | 发布日期：\${post.date}\`;
                
                Vditor.preview(document.getElementById('p-content'), post.content, {
                    theme: 'dark', hljs: { style: 'dracula' }
                });
            });
    </script>
</body>
</html>`;

// 6. 发布页 HTML (带密码保护)
const adminHtmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>发布文章 - 小象的技术栈</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://unpkg.com/vditor/dist/index.css" />
</head>
<body>
    <div class="video-background"><video autoplay muted loop playsinline><source src="assets/video/bg.mp4" type="video/mp4"></video></div>
    <div class="video-overlay"></div>
    <canvas id="sakura-canvas"></canvas>

    <div class="page-content">
        <header class="site-header"><div class="container"><h1>发布新文章</h1><nav><a href="index.html">返回首页</a></nav></div></header>
        <main class="container">
            <div class="card">
                <input type="password" id="admin-pwd" placeholder="请输入管理员密码" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:none; outline:none; font-family: inherit;">
                <input type="text" id="post-title" placeholder="输入文章标题..." style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:none; outline:none; font-family: inherit;">
                <input type="text" id="post-cate" placeholder="分类（如：ROS 2, ESP32）" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:none; outline:none; font-family: inherit;">
                <div id="vditor"></div>
                <button onclick="submitPost()" class="tool-btn" style="margin-top: 15px; width: 100%;">确认发布</button>
            </div>
        </main>
    </div>

    <script src="https://unpkg.com/vditor/dist/index.min.js"></script>
    <script src="js/main.js"></script>
    <script>
        const vditor = new Vditor('vditor', {
            height: 500,
            placeholder: '在此输入内容，支持粘贴图片和代码块...',
            theme: 'dark', preview: { theme: { current: 'dark' } }, cache: { enable: false }
        });

        function submitPost() {
            const title = document.getElementById('post-title').value;
            const category = document.getElementById('post-cate').value;
            const password = document.getElementById('admin-pwd').value;
            const content = vditor.getValue();

            if(!title || !content || !password) return alert("标题、内容和密码不能为空");

            fetch('/api/posts', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ title, category, content, password })
            }).then(res => res.json()).then(data => {
                if(data.success) {
                    alert('发布成功！'); window.location.href = 'index.html';
                } else {
                    alert(data.message);
                }
            });
        }
    </script>
</body>
</html>`;

// 写入文件
fs.writeFileSync(path.join(__dirname, 'server.js'), serverJsCode);
fs.writeFileSync(path.join(__dirname, 'public/css/style.css'), styleCssCode);
fs.writeFileSync(path.join(__dirname, 'public/index.html'), indexHtmlCode);
fs.writeFileSync(path.join(__dirname, 'public/about.html'), aboutHtmlCode);
fs.writeFileSync(path.join(__dirname, 'public/article.html'), articleHtmlCode);
fs.writeFileSync(path.join(__dirname, 'public/admin.html'), adminHtmlCode);

console.log('✨ 美化完成，代码已全部写入！');
console.log('👉 运行 node server.js 看看效果吧！');