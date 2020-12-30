'use strict';

const { execSync } = require('child_process');
const fs = require('fs-extra');

function uploadBuild (buildDir, repoFullName, buildInfo) {
	const version = buildInfo.version;
	const artifactBaseName = buildInfo.packageInfo.artifactBaseName;

	const portablePath = `"${buildDir}/dist/${artifactBaseName}-${version}-portable.exe"`;
	const hasPortable = fs.existsSync(portablePath);

	console.log('Uploading the build...');

	let files = [
		`"${buildDir}/dist/${artifactBaseName}-${version}.exe"`,
		`"${buildDir}/dist/${artifactBaseName}-${version}.exe.blockmap"`,
		`"${buildDir}/dist/${artifactBaseName}-${version}.AppImage"`
	];
	if (hasPortable) {
		files.push(portablePath);
	}
	files = files.join(' ');

	const dest = `s3://spring-launcher/${repoFullName}`;

	console.log(`Copying ${files} to ${dest}...`);
	// 1) First we push the versioned artifact
	execSync(`s3cmd put ${files} "${dest}/" --recursive --acl-public`);

	// 2) Then we copy it to the non-versioned artifact
	// Caching it for up to 24h. Not sure if this is wanted
	execSync(`s3cmd cp "${dest}/${artifactBaseName}-${version}.exe" "${dest}/${artifactBaseName}.exe" --acl-public --add-header=Cache-Control:max-age=86400`);
	execSync(`s3cmd cp "${dest}/${artifactBaseName}-${version}.exe.blockmap" "${dest}/${artifactBaseName}.exe.blockmap" --acl-public --add-header=Cache-Control:max-age=86400`);
	execSync(`s3cmd cp "${dest}/${artifactBaseName}-${version}.AppImage" "${dest}/${artifactBaseName}.AppImage" --acl-public --add-header=Cache-Control:max-age=86400`);
	if (hasPortable) {
		execSync(`s3cmd cp "${dest}/${artifactBaseName}-${version}-portable.exe" "${dest}/${artifactBaseName}-portable.exe" --acl-public --add-header=Cache-Control:max-age=86400`);
	}

	// 3) Lastly we update the registry
	console.log('Updating latest registry...');
	execSync(`s3cmd put ${buildDir}/dist/*.yml "${dest}/" --recursive --acl-public --add-header=Cache-Control:max-age=86400`);
}

module.exports = {
	uploadBuild: uploadBuild
};
