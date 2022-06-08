const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'cdk-app-ts',
  packageName: '@guardian/cdk-app-ts',
  description: 'projen starter for @guardian/cdk projects.',

  github: false,

  deps: [
    'projen',
    '@guardian/cdk@45.0.0',
    'aws-cdk@2.25.0',
    'aws-cdk-lib@2.25.0',
    'constructs@10.1.17',
    '@guardian/prettier@^1.0.0',
  ],

  // packageName: undefined,  /* The "name" in package.json. */
});

project.addGitIgnore('tmp/'); // Used in integration test.

project.eslint.addExtends();

project.synth();