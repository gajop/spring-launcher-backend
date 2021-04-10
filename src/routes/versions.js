
const express = require('express');

const router = express.Router();

const sqlite3 = require('sqlite3');
const { open } =  require('sqlite');

let db;
(async () => {
	db = await open({
		filename: process.env.NEXTGEN_SQLITE_FILE,
		driver: sqlite3.Database
	});

	db.on('trace', (data) => {
		console.error(data);
	});

	let version_count = await db.get('SELECT COUNT(*) FROM versions');
	version_count = version_count['COUNT(*)'];
	console.log(`Total versions: ${version_count}`);
})();

router.post('/from-springname', async (req, res) => {
	const results = await db.get('SELECT nextgenName FROM versions where springName = ?', req.body.springName);
	const nextgenName = results['nextgenName'];
	if (nextgenName) {
		res.status(200).json({
			nextgenName: nextgenName
		});
	} else {
		res.status(404);
	}
});


module.exports = router;
