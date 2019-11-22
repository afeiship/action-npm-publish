const process = require('process');
const { join } = require('path');
const { spawn } = require('child_process');
const { readFile } = require('fs');

async function readJson(file) {
  const data = await new Promise((resolve, reject) =>
    readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
  return JSON.parse(data);
}

async function createTag(dir, config) {
  const { version } = await readJson(packageFile);
  const tagName = config.tagName.replace(/%s/g, version);
  const tagMessage = config.tagMessage.replace(/%s/g, version);
  const tagExists = await run(
    dir,
    'git',
    'rev-parse',
    '-q',
    '--verify',
    `refs/tags/${tagName}`
  ).catch((e) =>
    e instanceof ExitError && e.code === 1 ? false : Promise.reject(e)
  );

  if (tagExists) {
    console.log(`Tag already exists: ${tagName}`);
    throw new NeutralExitError();
  }

  const { name, email } = config.tagAuthor;
  await run(dir, 'git', 'config', 'user.name', name);
  await run(dir, 'git', 'config', 'user.email', email);

  await run(dir, 'git', 'tag', '-a', '-m', tagMessage, tagName);
  await run(dir, 'git', 'push', 'origin', `refs/tags/${tagName}`);

  console.log('Tag has been created successfully:', tagName);
}

async function publishPackage(dir) {
  const packageObj = await readJson(packageFile);
  await run(dir, 'npm', 'publish', '--access=public');

  console.log('Version has been published successfully:', packageObj.version);
}

function run(cwd, command, ...args) {
  console.log('Executing:', command, args.join(' '));
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'ignore', 'pipe']
    });
    const buffers = [];
    proc.stderr.on('data', (data) => buffers.push(data));
    proc.on('error', () => {
      reject(new Error(`command failed: ${command}`));
    });
    proc.on('exit', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        const stderr = Buffer.concat(buffers)
          .toString('utf8')
          .trim();
        if (stderr) {
          console.log(`command failed with code ${code}`);
          console.log(stderr);
        }
        reject(new ExitError(code));
      }
    });
  });
}

class ExitError extends Error {
  constructor(code) {
    super(`command failed with code ${code}`);
    this.code = code;
  }
}

class NeutralExitError extends Error {}

module.exports = {
  createTag,
  publishPackage,
  NeutralExitError
};
