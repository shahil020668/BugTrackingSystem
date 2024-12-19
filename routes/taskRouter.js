const express = require('express');
const { fetchAllTask, bugDetail, addComment , report, submit, Signup, login} = require('../controller/taskController');
const { render } = require('ejs');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.get('/', fetchAllTask);

// router.get('/report1', (req,res)=>{
//     res.render('bugReport',{ messages: {} });
// })

router.get('/bugdetail/:id',bugDetail);

router.get('/signup',(req, res)=>{
    const message = req.query.message || null; // Extract the message from the query parameter
    res.render('signup', { message }); // Pass the message to the template
})

router.post('/submitBug',submit)

router.get('/bugReport',report);

router.post('/signup',Signup);


router.post('/add_comment',addComment);

router.get('/logout',(req, res)=>{
    res.cookie("token","");
    res.redirect('/');
})

router.post('/login',login)

router.get('/loginpage',(req, res)=>{
    const message = req.query.message || null; // Extract message
    res.render('login', { message }); // Pass message to template
})

router.get('/contact',(req, res)=>{
    res.render('contact');
})

module.exports = router;
