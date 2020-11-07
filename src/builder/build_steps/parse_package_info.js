'use strict';

const assert = require('assert');
const { readFileSync } = require('fs');

function parsePackageInfo (repoDir) {
	const configStr = readFileSync(`${repoDir}/dist_cfg/config.json`);
	const config = JSON.parse(configStr);
	assert(config.title != null, 'Missing config title');

	let hasPortable = false;
	for (const setup of config.setups) {
		if (setup.package && setup.package.portable === true) {
			hasPortable = true;
			break;
		}
	}

	let buildTypes = ['windows', 'linux'];
	if (hasPortable) {
		buildTypes.push('windows-portable');
	}

	const artifactBaseName = config.title;

	let downloadLinks = [];
	for (const buildType of buildTypes) {
		let link = '';
		if (buildType === 'linux') {
			link = `${artifactBaseName}.AppImage`;
		} else if (buildType === 'windows-portable') {
			link = `${artifactBaseName}-portable.exe`;
		} else if (buildType === 'windows') {
			link = `${artifactBaseName}.exe`;
		} else {
			throw new `Unexpected buildType: ${buildType}`();
		}

		downloadLinks.push({
			platform: buildType,
			link: link
		});
	}

	return {
		title: config.title,
		buildTypes: buildTypes,
		downloadLinks: downloadLinks,
		artifactBaseName: artifactBaseName
	};
}

module.exports = {
	parsePackageInfo: parsePackageInfo
};
