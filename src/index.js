const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const process = require('process');

const dir = process.env.GITHUB_WORKSPACE || '/github/workspace';
const commitPattern = '^(?:Release|Version) (\\S+)';

const {
  createTag,
  readJson,
  publishPackage,
  NeutralExitError
} = require('./utils');

async function main() {
  const config = {
    commitPattern,
    tagName: 'v%s',
    tagMessage: 'v%s',
    tagAuthor: { name: 'afeiship', email: '1290657123@qq.com' }
  };

  exec.exec('pwd');
  exec.exec('ls', [dir, '-alh']);
  exec.exec('cat', ['.git/config']);
  exec.exec('echo', ['$GITHUB_TOKEN']);
  exec.exec('echo', ['$NPM_AUTH_TOKEN']);
  exec.exec('printenv');
  await createTag(dir, config);
  await publishPackage(dir);
}

if (require.main === module) {
  main().catch((e) => {
    if (e instanceof NeutralExitError) {
      process.exitCode = 78;
    } else {
      process.exitCode = 1;
      console.log(e.message || e);
    }
  });
}
