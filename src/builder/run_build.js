'use strict';

const { makeBuild } = require('./process_build');

if (require.main === module) {
	const args = process.argv;
	if (args.length < 3) {
		console.log('Missing GitHub repository name');
		process.exit(-1);
	}
	let useGenericBackend = true;
	if (args.length >= 4) {
		useGenericBackend = args[3] != '--no-generic-backend';
	}

	const repoFullName = args[2];
	runBuild(repoFullName, useGenericBackend);
}


function runBuild(repoFullName, useGenericBackend) {
	const buildPrefix = 'build';
	const repoPrefix = 'repo';

	const gitUrl = `https://github.com/${repoFullName}.git`;

	const buildDir = `${buildPrefix}/${repoFullName}`;
	const repoDir = `${repoPrefix}/${repoFullName}`;
	const launcherDir = `${repoPrefix}/spring-launcher`;

	console.log(`Making build for ${gitUrl}...`);

	makeBuild(repoFullName, gitUrl, repoDir, launcherDir, buildDir, useGenericBackend);
}

module.exports = {
	runBuild: runBuild
};
