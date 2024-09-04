const bcrypt = require('bcrypt');
const { jwtsign } = require('../services/auth');
const saltRounds = 10;
const { client } = require('../connection');


const HandleSignup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email;
        `;
        const values = [username, email, hash];
        const result = await client.query(query, values);
        const newUser = result.rows[0];

        const token = jwtsign({ email: newUser.email });

        res.status(201).json({
            message: 'User created successfully',
            user: { username: newUser.username, email: newUser.email },
            token: token,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
}

const HandleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await client.query(query, values);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwtsign({ email: user.email });
            res.cookie('token', token);
            res.cookie('_id', user.id);
            res.status(200).json({
                message: 'User authenticated',
                user: { username: user.username, email: user.email },
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports = { HandleSignup, HandleLogin };
