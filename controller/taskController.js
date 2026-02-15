const db = require('../dataBase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { connection } = require('mongoose');

// const createTask = async (req, res) => {
//     const {title,description,severity,project} = req.body;

//     try {
//         // Get a connection from the pool
//         const conn = await db.getConnection();

//         const generateBugId = () => {
//             const randomNumber = Math.floor(100 + Math.random() * 900); // Random number between 100 and 999
//             return `BUG${randomNumber}`;
//         };
        
//         const BugId = generateBugId(); // Example: BG234

//         const query = 'INSERT INTO Bug (BugID, Title, Description, Severity, ProjectName) VALUES (?,?,?,?,?)';
//         const [result] = await conn.execute(query, [
//             BugId,
//             title,
//             description,
//             severity,
//             project
//         ]);

//         console.log(`Inserted user with ID: ${result.insertId}`);
//         // Send a success response
//         res.status(201).render('bugReport', { messages: { success: 'Bug reported successfully!' } });
        
//         // Release the connection back to the pool
//         conn.release();
//     } catch (err) {
//         console.error('Error inserting data:', err);
//         res.status(500).send('Database error');
//     }

// };

const submit = async (req, res) => {
    const {title,description,severity,project} = req.body;
    try {
        const conn = await db.getConnection();

        const generateBugId = () => {
            const randomNumber = Math.floor(100 + Math.random() * 900); // Random number between 100 and 999
            return `BUG${randomNumber}`;
        };
        
        const BugId = generateBugId(); // Example: BG234

        const query = 'INSERT INTO Bug (BugID, Title, Description, Severity, ProjectName) VALUES (?,?,?,?,?)';
        const [result] = await conn.execute(query, [
            BugId,
            title,
            description,
            severity,
            project
        ]);
        console.log(`Inserted user with ID: ${result.insertId}`);
        // Redirect with a success message
        res.redirect('/bugReport?success=Bug reported successfully!');
    } catch (error) {
        console.error(error);

        // Redirect with an error message
        res.redirect('/bugReport?error=Failed to report the bug.');
    }
};



const report = async (req, res) => {
    const successMessage = req.query.success || null;
    const errorMessage = req.query.error || null;

    res.render('bugReport', {
        messages: {
            success: successMessage,
            error: errorMessage
        }
    });
};



const fetchAllTask = async (req, res) => {
    let conn;
    try {
        conn = await db.getConnection();
        const query = 'SELECT * FROM Bug';
        const [rows] = await conn.execute(query);  // Added 'await'
        res.render('index', { bugs: rows });
        } catch (err) {
        console.error("Failed to fetch tasks:", err);
        res.status(500).json({ error: "Failed to fetch tasks." });
    } finally {
        if (conn) conn.release();
    }
};

const bugDetail = async (req, res) => {
    const BugID = req.params.id;
    console.log("Received BugID:", BugID)
    console.log("Request Params:", req.params);
    console.log("Request Path:", req.path);
    if (!BugID) {
        return res.status(400).send('Bug ID is required.');
    }    
    let conn;
    try {
        conn = await db.getConnection();

        const query = 'SELECT * FROM Bug JOIN BugAssignment ON Bug.BugID = BugAssignment.BugID JOIN Developer ON BugAssignment.D_ID = Developer.D_ID WHERE Bug.BugID = ?'
        const [rows] = await conn.execute(query, [BugID]);
        
        if (rows.length === 0) {
            return res.status(404).send('Bug not found.');
        }
        const bug = rows[0];

        const commentQuery = 'SELECT * FROM Comments WHERE BugID = ? ORDER BY DatePosted DESC';
        const [commentRows] = await conn.execute(commentQuery, [BugID]);

        res.render('bugDetail', { bug: bug, comment: commentRows });
    } catch (err) {
        console.error("Failed to fetch bug details:", err);
        res.status(500).json({ error: "Failed to fetch bug details." });
    } finally {
        if (conn) conn.release();
    }
};


const addComment = async (req, res) => {
    const { bug_id, comment, developer_name } = req.body;

    if (!bug_id || !comment || !developer_name) {
        return res.status(400).send("Bug ID, comment, and developer name are required.");
    }

    let conn;
    try {
        conn = await db.getConnection();

        // Insert the comment along with developer's name into the database
        const query = `
            INSERT INTO Comments (BugID, D_Name, CommentText, DatePosted) 
            VALUES (?, ?, ?, NOW())
        `;
        await conn.execute(query, [bug_id, developer_name, comment]);

        // After inserting, redirect back to the bug detail page
        req.flash('success', 'Commented successfully!');
        res.redirect(`/bugdetail/${bug_id}?message=Commented successfully!`);

    } catch (err) {
        console.error("Failed to add comment:", err);
        res.status(500).send("Error adding comment.");
    } finally {
        if (conn) conn.release();
    }
};






const signup = async (req, res) => {
    
};




const Signup = async (req, res) => {
    let {username, email, password} = req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            conn = await db.getConnection();

            // Insert the comment along with developer's name into the database
            const query = `CALL RegisterNewUser(?, ?, ?)`;
            await conn.execute(query, [username,email,hash]);

            let token = jwt.sign({email}, "sh");
            res.cookie("token", token);
            const message = req.query.message || null; // Extract message
            res.render('login', { message }); // Pass message to template
        });
    });
};





const login = async (req, res) => {
    let { email, password } = req.body;

    conn = await db.getConnection();

    const query = `SELECT * FROM user WHERE email = ?`;
    const [rows] = await conn.execute(query, [email]);
    console.log(conn);

    if (rows.length === 0) {
        return res.redirect(`/signup?message=${encodeURIComponent('user not exist')}`);
    }

    const user = rows[0];

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            res.redirect('/');
        } else {
            res.redirect(`/loginpage?message=${encodeURIComponent('Incorrect password')}`);
        }
    });
};


/*
const deleteTaskById = async (req, res) => {
    // Implementation here
};

*/

module.exports = {
    fetchAllTask,
    bugDetail,
    addComment,
    signup,
    report,
    submit,
    Signup,
    login
};
