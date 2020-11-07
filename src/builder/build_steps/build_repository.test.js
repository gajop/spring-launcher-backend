'use strict';

const fs = require('fs-extra');
const path = require('path');

const { prepareForBuild } = require('../process_build');
const { buildRepository } = require('./build_repository');

let TEST_DIR;
let repoDir;
let launcherDir;
let buildDir;
let artifactBaseNameWithVersion;
let buildInfo;

beforeEach(() => {
	TEST_DIR = fs.mkdtempSync('test');
	const repoFullName = 'gajop/test-repo';
	const repoPrefix = path.join(TEST_DIR, 'repo');
	launcherDir = path.join(TEST_DIR, 'launcher');
	buildDir = path.join(TEST_DIR, 'build');
	repoDir = `${repoPrefix}/${repoFullName}`;

	const gitUrl = `https://github.com/${repoFullName}.git`;

	buildInfo = prepareForBuild(repoFullName, gitUrl, repoDir, launcherDir);
	const version = buildInfo.version;
	const packageInfo = buildInfo.packageInfo;
	artifactBaseNameWithVersion = `${packageInfo.artifactBaseName}-${version}`;
});

afterEach(() => {
	fs.removeSync(TEST_DIR);
});

// FIXME: These two tests aren't really worth it: the 'ok-build-repo-all' one is enough

// test('ok-build-repo-portable-1', () => {
// 	expect(version != null).toBe(true);
// 	packageInfo.buildTypes = ['windows-portable'];
// 	buildRepository(repoDir, launcherDir, buildDir, packageInfo);

// 	const distDir = path.join(buildDir, 'dist');
// 	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}-portable.exe`))).toBe(true);
// });

// test('ok-build-repo-2', () => {
// 	expect(version != null).toBe(true);
// 	packageInfo.buildTypes = ['windows', 'linux', 'windows-portable'];
// 	buildRepository(repoDir, launcherDir, buildDir, packageInfo);

// 	const distDir = path.join(buildDir, 'dist');
// 	expect(fs.existsSync(path.join(distDir, 'latest-linux.yml'))).toBe(true);
// 	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}.AppImage`))).toBe(true);

// 	expect(fs.existsSync(path.join(distDir, 'latest.yml'))).toBe(true);
// 	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}.exe`))).toBe(true);
// 	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}.exe.blockmap`))).toBe(true);

// 	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}-portable.exe`))).toBe(true);
// });


test('ok-build-repo-all', () => {
	expect(buildInfo.version != null).toBe(true);
	buildRepository(repoDir, launcherDir, buildDir, buildInfo);

	const distDir = path.join(buildDir, 'dist');
	expect(fs.existsSync(path.join(distDir, 'latest-linux.yml'))).toBe(true);
	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}.AppImage`))).toBe(true);

	expect(fs.existsSync(path.join(distDir, 'latest.yml'))).toBe(true);
	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}.exe`))).toBe(true);
	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}.exe.blockmap`))).toBe(true);

	expect(fs.existsSync(path.join(distDir, `${artifactBaseNameWithVersion}-portable.exe`))).toBe(true);
});
