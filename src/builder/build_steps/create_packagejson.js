'use strict';

const { execSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');

const INTERNAL_VER = '1';

function getVersionFromGit(repoDir) {
	return `${INTERNAL_VER}.` + execSync('git rev-list --count HEAD', { cwd: repoDir }).toString().trim() + '.0';
}

function createPackagejson (launcherDir, repoDir, repoFullName, version) {
	const configStr = fs.readFileSync(`${repoDir}/dist_cfg/config.json`);
	const config = JSON.parse(configStr);

	assert(config.title != null, 'Missing config title');

	const repoDotName = repoFullName.replace(/\//g, '.');

	const packageTemplate = JSON.parse(fs.readFileSync(`${launcherDir}/package.json`).toString());
	packageTemplate.name = config.title.replace(/ /g, '-');
	// eslint-disable-next-line no-template-curly-in-string
	packageTemplate.build.artifactName = config.title + '-${version}.${ext}'; // '' is used on purpose, we want the spring to contain ${ext} as text
	packageTemplate.version = version;
	packageTemplate.build.appId = `com.springrts.launcher.${repoDotName}`;
	packageTemplate.build.publish.url = `${packageTemplate.build.publish.url}/${repoFullName}`;
	if (config.dependencies != null) {
		for (const dependency in config.dependencies) {
			packageTemplate.dependencies[dependency] = config.dependencies[dependency];
		}
	}

	fs.writeFileSync(`${repoDir}/package.json`, JSON.stringify(packageTemplate), 'utf8');
}

module.exports = {
	createPackagejson: createPackagejson,
	getVersionFromGit: getVersionFromGit
};
