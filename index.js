const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

// const commit_pattern = core.getInput('commit_pattern');
// console.log(`Hello ${commit_pattern}!`);
// const time = new Date().toTimeString();
// core.setOutput('time', time);
// // Get the JSON webhook payload for the event that triggered the workflow
// const payload = JSON.stringify(github.context.payload, undefined, 2);
// console.log(`The event payload: ${payload}`);

async function main() {
  const dir = process.env.GITHUB_WORKSPACE || './src';
  console.log(`hello ${dir}`);
  exec('ls', ['-alh', dir]);
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
