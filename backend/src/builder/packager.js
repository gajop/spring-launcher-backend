const { execSync } = require('child_process')
const assert = require('assert')
const { readFileSync, writeFileSync } = require('fs')

function createPackageJson (launcherDir, repoDir, repoFullName, version) {
  const configStr = readFileSync(`${repoDir}/dist_cfg/config.json`)
  const config = JSON.parse(configStr)

  assert(config.title != null)

  const repoDotName = repoFullName.replace(/\//g, '.')

  const packageTemplate = JSON.parse(readFileSync(`${launcherDir}/package.json`).toString())
  packageTemplate.name = config.title.replace(/ /g, '-')
  // eslint-disable-next-line no-template-curly-in-string
  packageTemplate.build.artifactName = config.title + '.${ext}' // '' is used on purpose, we want the spring to contain ${ext} as text
  packageTemplate.version = version
  packageTemplate.build.appId = `com.springrts.launcher.${repoDotName}`
  packageTemplate.build.publish.url = `https://spring-launcher.ams3.digitaloceanspaces.com/${repoFullName}`

  writeFileSync(`${repoDir}/package.json`, JSON.stringify(packageTemplate), 'utf8')
}

function buildRepository (repoDir, launcherDir, buildDir) {
  return execSync(`sh build_repo.sh ${repoDir} ${launcherDir} ${buildDir}`)
}

module.exports = {
  createPackageJson: createPackageJson,
  buildRepository: buildRepository
}