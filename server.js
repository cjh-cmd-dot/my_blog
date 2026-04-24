const express = require('express');
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
