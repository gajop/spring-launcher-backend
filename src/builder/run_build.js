'use strict';

const { makeBuild } = require('./process_build');

if (require.main === module) {
	const args = process.argv;
	if (args.length < 3) {
		console.log('Missing GitHub repository name');
		process.exit(-1);
	}

	const repoFullName = args[2];
	runBuild(repoFullName);
}


function runBuild(repoFullName) {
	const buildPrefix = 'build';
	const repoPrefix = 'repo';

	const gitUrl = `https://github.com/${repoFullName}.git`;

	const buildDir = `${buildPrefix}/${repoFullName}`;
	const repoDir = `${repoPrefix}/${repoFullName}`;
	const launcherDir = `${repoPrefix}/spring-launcher`;

	console.log(`Making build for ${gitUrl}...`);

	makeBuild(repoFullName, gitUrl, repoDir, launcherDir, buildDir);
}

module.exports = {
	runBuild: runBuild
};
