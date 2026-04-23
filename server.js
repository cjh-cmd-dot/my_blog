const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'posts.json');

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

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
    const { title, category, content } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const newPost = {
        id: Date.now(),
        title,
        category,
        content,
        date: new Date().toLocaleDateString()
    };
    data.push(newPost);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(3000, () => console.log('✅ 小象的技术栈已启动: http://localhost:3000'));
