const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// 使用Session中間件
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

// 使用Body Parser中間件解析表單資料
app.use(bodyParser.urlencoded({ extended: true }));

// 登入頁面路由
app.get('/', (req, res) => {
  res.send(`
    <h1>登入</h1>
    <form method="POST" action="/login">
      <label for="username">使用者名稱:</label>
      <input type="text" id="username" name="username" required><br>
      <label for="password">密碼:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">登入</button>
    </form>
  `);
});

// 登入請求處理
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Source IP
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;

  console.log(`[${new Date().toISOString()}] IP: ${clientIp} 使用者嘗試登入，username: ${username}, password: ${password}`);

  if (username === 'admin' && password === 'toodou1234') {
    // 設定登入成功的Session變數
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    // res.send('無效的使用者名稱或密碼');
    res.redirect('/');
  }
});

// 登入後的頁面
app.get('/dashboard', (req, res) => {
  // 檢查使用者是否已登入
  if (req.session.loggedIn) {
    res.send(`
      <h1>歡迎, ${req.session.username}!</h1>
      <p>這是你的個人儀表板。</p>
      <a href="/logout">登出</a>
    `);
  } else {
    res.redirect('/');
  }
});

// 登出處理
app.get('/logout', (req, res) => {
  // 清除Session變數並導向登入頁面
  req.session.destroy();
  res.redirect('/');
});

// 監聽3000埠
app.listen(3000, () => {
  console.log('應用程式已在 http://localhost:3000 上運行');
});
