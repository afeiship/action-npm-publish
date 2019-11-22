const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');

const dir = process.env.GITHUB_WORKSPACE || '/github/workspace';
const eventFile = '/github/workflow/event.json';
const commitPattern = '^(?:Release|Version) (\\S+)';

const { createTag, publishPackage, NeutralExitError } = require('./utils');

async function main() {
  const eventObj = await readJson(eventFile);
  const { name, email } = eventObj.repository.owner;
  const config = {
    commitPattern,
    tagName: 'v%s',
    tagMessage: 'v%s',
    tagAuthor: { name, email }
  };

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
