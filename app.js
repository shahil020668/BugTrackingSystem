const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();

app.use(cookieParser());

// Set up views and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

const flash = require('connect-flash');
const session = require('express-session');

app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: true }));
app.use(flash());

// Import routers and controllers
const { taskRouter, pinngRouter } = require('./routes');
const { createTask } = require('./controller/taskController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/', taskRouter);
app.use('/report',taskRouter);

// app.get('/cookie', (req, res)=>{
//     res.cookie("name","harsh");
//     res.send("done");
// })

// app.get('/read',(req, res)=>{
//     console.log(req.cookies);
//     res.send("read page");
// })

// app.get('/pas',(req, res)=>{
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash("pas", salt, function(err, hash) {
//             console.log(hash);
            
//         });
//     });
// })

// app.get('/check',(req, res)=>{
    // bcrypt.compare("pas", "$2b$10$0Kyt1rd7/HDpxOLsIeDu9./HqJW4Q6coVYjinPSWig7n4AylD7RsO", function(err, result) {
    //     console.log(result);
        
    // });
// })

// Start the server
app.listen(3000, () => {
    console.log('Server is running on PORT : 3000...');
});