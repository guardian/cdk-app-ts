const { cdk } = require('projen');

const project = new cdk.JsiiProject({
  defaultReleaseBranch: 'main',
  name: 'cdk-app-ts',
  packageName: '@guardian/cdk-app-ts',
  description: 'projen starter for @guardian/cdk projects.',
  author: 'nicolas.long@theguardian.com',
  repositoryUrl: 'https://github.com/guardian/cdk-app-ts/',

  npmDistTag: 'latest',
  npmRegistryUrl: 'https://npm.pkg.github.com',

  github: false,

  deps: [
    'aws-cdk-lib@2.25.0',
    'constructs@10.1.17',
  ],

  bundledDeps: [
    'projen',
    'aws-cdk@2.25.0',
    '@guardian/cdk@45.0.0',
    '@guardian/prettier@^1.0.0',
  ],

  // packageName: undefined,  /* The "name" in package.json. */
});

project.addGitIgnore('tmp/'); // Used in integration test.

project.synth();