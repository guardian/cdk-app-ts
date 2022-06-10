const { cdk } = require('projen');

const project = new cdk.JsiiProject({
  defaultReleaseBranch: 'main',
  name: '@guardian/cdk-app-ts',
  packageName: '@guardian/cdk-app-ts',
  description: 'projen starter for @guardian/cdk projects.',
  author: 'nicolas.long@theguardian.com',
  repositoryUrl: 'https://github.com/guardian/cdk-app-ts/',
  npmDistTag: 'latest',

  releaseToNpm: true,
  publishTasks: true,
  publishDryRun: true,

  github: false,

  deps: [
    'aws-cdk-lib@2.25.0',
    'constructs@10.1.17',
  ],

  devDeps: [
    'publib',
    'projen@0.57.9',
  ],

  peerDeps: [
    'projen',
  ],

  bundledDeps: [
    'aws-cdk@2.25.0',
    '@guardian/cdk@45.0.0',
    '@guardian/prettier@^1.0.0',
  ],
});

project.tsconfigDev.addInclude('sample');

// TODO really we should publish via a Github Action.
project.addTask('publish', {
  exec: 'publib',
  description: 'publish to npm (this requires an NPM_TOKEN env var to be available)',
});

// Ensure we ignore 'tmp' (which the integration test outputs).
project.tasks.tryFind('release').prependExec('rm -rf tmp', { name: 'clean-test-dir' });
project.addGitIgnore('tmp/');

project.synth();