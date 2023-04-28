const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 建立資料庫連線
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'BackendSecurity'
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL database');
    console.log(err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
  res.send('WOW I\'m now on web !');
});

// 處理 GET /users 的請求
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error retrieving users from database');
        return;
      }
      res.send(results);
    });
  });




  const bcrypt = require('bcrypt');

// 處理註冊請求的路由，使用 async function，因為要用到 await
app.post('/register', async (req, res) => {
    // 從請求中取得 email 和 password
    const { email, password } = req.body;
  
    // 使用 bcrypt 來將密碼進行雜湊加密 注意要 npm install bcrypt 才能使用bcrypt.hash()
    const saltRounds = 10; // 設定雜湊強度，越高越安全但效能較低
    const hashedPassword = await bcrypt.hash(password, saltRounds); // 使用 bcrypt 將密碼進行雜湊加密
  
    // 將使用者資料儲存到資料庫中
    const query = `INSERT INTO TestUsers (email, hashed_password) VALUES ('${email}', '${hashedPassword}')`; // SQL 查詢字串
    connection.query(query, (err, result) => { // 執行 SQL 查詢
      if (err) {
        console.log(err);
        res.status(500).send('Error registering user'); // 若出現錯誤，回傳錯誤訊息
        return;
      }
      res.status(201).send('User registered successfully'); // 若註冊成功，回傳成功訊息
    });
  });
  



// // 處理用戶登入請求的路由
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     // 從資料庫中取得儲存的使用者資訊，假設使用者資訊已經儲存在 users 陣列中
//     const user = users.find(user => user.email === email);
  
//     if (!user) {
//       // 若使用者不存在，回傳錯誤訊息
//       return res.status(401).send('Invalid email or password');
//     }
  
//     // 比對使用者輸入的密碼和從資料庫中取得的已加密密碼是否相符
//     const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
//     if (!isPasswordMatch) {
//       // 若密碼不相符，回傳錯誤訊息
//       return res.status(401).send('Invalid email or password');
//     }
  
//     // 若密碼相符，回傳登入成功訊息
//     res.send('Logged in successfully');
//   });
  



// 處理用戶登入請求的路由
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // 撈取符合輸入email的使用者資訊，透過email查找TestUsers資料表中的資料
    const query = `SELECT * FROM TestUsers WHERE email = '${email}'`;
    connection.query(query, async (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Server Error');
        return;
      }
      // 若無符合的使用者資訊，回傳錯誤訊息
      if (results.length === 0) {
        return res.status(401).send('無符合的使用者資訊');
      }
      const user = results[0];
      // 比對使用者輸入的密碼和從資料庫中取得的已加密密碼是否相符
      const isPasswordMatch = await bcrypt.compare(password, user.hashed_password);
      if (!isPasswordMatch) {
        // 若密碼不相符，回傳錯誤訊息
        return res.status(401).send('密碼不相符');
      }
      // 若密碼相符，回傳登入成功訊息
      res.send('Logged in successfully');
    });
  });
  
  
  


// 啟動伺服器
app.listen(3000, () => {
    console.log('Server started on port 3000');
  });



