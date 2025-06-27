// server.js
const express = require('express');
const cors = require('cors');
const { Octokit } = require('octokit');
require('dotenv').config(); // Bu satır .env dosyasını yükler

const app = express();
const port = 3001; // React uygulaması genelde 5173'te çalışır, farklı bir port seçelim

app.use(cors()); // Farklı portlardan gelen isteklere izin ver

// Node.js tarafında `process.env` kullanılır (VITE_ öneki gerekmez)
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// .env dosyasında GITHUB_TOKEN=... şeklinde tanımla

app.get('/api/repo-activity/:owner/:repo', async (req, res) => {
    try {
        const { owner, repo } = req.params;
        const { data } = await octokit.rest.repos.get({ owner, repo });
        res.json({
            stars: data.stargazers_count,
            forks: data.forks_count,
            open_issues: data.open_issues_count,
            name: data.name
        });
    } catch (error) {
        res.status(500).json({ message: 'GitHub API hatası', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend sunucusu http://localhost:${port} adresinde çalışıyor`);
});
