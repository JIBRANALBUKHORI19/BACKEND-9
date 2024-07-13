const session = require('express-session');
const express = require('express');
const mysql = require("mysql2");
const app = express();
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const connection = mysql.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'mahasiswa'
});
connection.connect(error =>{
    if (error) throw error;
    console.log("Server Aktif boss")
});

app.use(session({
    secret: 'secret-key',
    resave : false,
    saveUninitialized: false,
    session:{

    }
}))

const authenticate = (req, res, next) => {
    if(req?.session.isAuthenticated) {
        next()
    }else {
        res.status(401).send('tidak ter authentikasi')
    }
}

app.post('/register', (req, res) => {
    const {username, password} = req.body
    connection.query(`INSERT INTO user VALUES ('${username}',PASSWORD('${password}'))`,
        (error, results) => {
            if (error) throw error
            res.json({message: 'Data Berhasil Ditambahkan', id: results.insertId})
        })
})

app.post('/login', (req,res) => {
    const {username, password} = req.body
    connection.promise().query(`SELECT * FROM user WHERE username = '${username}' AND password = PASSWORD('${password}')`)
    .then((results) => {
        if(results.length > 0){
            req.session.isAuthenticated = true
            res.json({message: 'Berhasil Login'})
        } else {
            res.status(401).send('Username atau Password salah')
        }
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err)
        }else{
            res.send('logout')
        }
    })
})

app.get('/ibnu', (req, res) => {
    res.send('anda masuk pada route (GET)')
})

app.get('/jibran', authenticate, (req, res) => {
    res.send('anda masuk pada route (GET)')
})

app.post('/jibran', authenticate, (req, res) => {
    res.send('anda masuk pada route (GET)')
})

app.put('/jibran', authenticate, (req, res) => {
    res.send('anda masuk pada route (GET)')
})

app.delete('/jibran', authenticate, (req, res) => {
    res.send('anda masuk pada route (GET)')
})

app.listen(port, () => {
    console.log(`server berjalan dengan localhost:${port}`);
})