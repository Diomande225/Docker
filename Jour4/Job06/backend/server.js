const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'projetdb',
};

let connection;

// Fonction pour établir une connexion à la base de données
function connectToDatabase() {
    connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database. Retrying in 5 seconds...', err);
            setTimeout(connectToDatabase, 5000);
        } else {
            console.log('Connected to database');
            createTable();
        }
    });

    connection.on('error', (err) => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToDatabase();
        } else {
            throw err;
        }
    });
}

// Créer la table si elle n'existe pas
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
        )
    `;
    connection.query(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created or already exists');
            insertSampleData();
        }
    });
}

// Insérer des données d'exemple
function insertSampleData() {
    const sql = `
        INSERT INTO users (name, email) 
        SELECT * FROM (SELECT 'John Doe', 'john@example.com') AS tmp
        WHERE NOT EXISTS (
            SELECT name FROM users WHERE name = 'John Doe'
        ) LIMIT 1
    `;
    connection.query(sql, (err) => {
        if (err) {
            console.error('Error inserting sample data:', err);
        } else {
            console.log('Sample data inserted or already exists');
        }
    });
}

// Initialisation de la connexion à la base de données
connectToDatabase();

// Routes
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API du backend de votre projet Docker !');
});

app.get('/api/status', (req, res) => {
    connection.query('SELECT NOW() AS currentTime', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ status: 'error', message: 'Database query failed' });
        } else {
            res.json({ status: 'success', currentTime: results[0].currentTime });
        }
    });
});

app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ status: 'error', message: 'Database query failed' });
        } else {
            res.json(results);
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
}); 