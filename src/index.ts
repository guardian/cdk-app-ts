import path from 'path';
import { JsonFile, SampleDir, SampleFile } from 'projen';
import { TypeScriptAppProject, TypeScriptProjectOptions } from 'projen/lib/typescript';

export interface GuCDKTypescriptOptions {

  /**
   * Package name
   */
  name: string;

  /**
   * Dev dependencies of this module.
   *
   * Use package@^version syntax.
   */
  devDeps?: string[];

  /**
   * Target for synth.
   */
  outdir?: string;
}

/**
 * Create a Gu CDK Typescript project.
 *
 * @pjid gucdk-app-ts
 */
export class GuCDKTypescriptProject extends TypeScriptAppProject {
  constructor(options: GuCDKTypescriptOptions) {

    const tsOpts: TypeScriptProjectOptions = {
      defaultReleaseBranch: 'main',
      readme: {
        filename: 'README.md',
        contents: 'TODO',
      },

      devDeps: [
        '@guardian/eslint-config-typescript@^1.0.1',
        '@types/jest@^27.5.0',
        '@types/node@17.0.35',
        'eslint@^8.16.0',
        'jest@^27.5.1',
        'prettier@^2.6.2',
        'ts-jest@^27.1.4',
        'ts-node@^10.8.0',
        'typescript@~4.7.2',
        'eslint-config-prettier@^8.5.0',

        '@guardian/cdk@^45.0.0',
        'aws-cdk@2.25.0',
        'aws-cdk-lib@2.25.0',
        'constructs@10.1.17',
      ], // TODO version + add cdk stuff

      // Easier to manage these ourselves
      github: false,
      sampleCode: false,
      jest: false,
      prettier: false,
      eslint: false,

      srcdir: 'lib', // this defaults to src unfortunately for us

      ...options,
    };

    super(tsOpts);

    // Remove existing tasks
    this.removeTask('build');
    this.removeTask('clobber');
    this.removeTask('compile');
    this.removeTask('eslint');
    this.removeTask('package');
    this.removeTask('post-compile');
    this.removeTask('post-upgrade');
    this.removeTask('pre-compile');
    this.removeTask('projen');
    this.removeTask('test');
    this.removeTask('test-update');
    this.removeTask('upgrade');
    this.removeTask('watch');

    this.addFields({
      scripts: {
        build: 'tsc',
        test: 'jest',
        format: 'prettier --write "{lib,bin}/**/*.ts"',
        lint: 'eslint lib/** bin/** --ext .ts --no-error-on-unmatched-pattern',
        synth: 'cdk synth --path-metadata false --version-reporting false',
        diff: 'cdk diff --path-metadata false --version-reporting false',
      },

      prettier: '@guardian/prettier',

      jest: {
        testMatch: ['<rootDir>/lib/**/*.test.ts'],
        transform: {
          '^.+\\.tsx?$': 'ts-jest',
        },
        setupFilesAfterEnv: ['./jest.setup.js'],
      },

      eslintConfig: {
        root: true,
        env: {
          node: true,
          jest: true,
        },
        extends: ['@guardian/eslint-config-typescript', 'prettier'],
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
        },
        plugins: ['@typescript-eslint'],
        rules: {
          '@typescript-eslint/no-inferrable-types': 0,
          'import/no-namespace': 2,
        },
        ignorePatterns: ['**/*.js', '**/*.d.ts', 'node_modules', 'cdk.out'],
      },

    });

    new SampleFile(this, 'jest.setup.js', {
      contents: 'jest.mock("@guardian/cdk/lib/constants/tracking-tag");',
    });

    new JsonFile(this, 'cdk.json', {
      obj: {
        app: 'npx ts-node lib/cdk.ts',
        context: {
          'aws-cdk:enableDiffNoFail': 'true',
          '@aws-cdk/core:stackRelativeExports': 'true',
        },
      },
    });

    new SampleDir(this, 'lib', {
      //files: { 'foo.ts': 'BLAHBLAH' },
      sourceDir: path.join(__dirname, 'sample/lib'), // TODO
    });

    /**

├── .gitignore
├── README.md
├── bin
│   └── cdk.ts
├── cdk.json
├── jest.setup.js
├── lib
│   ├── __snapshots__
│   │   └── integration-test.test.ts.snap
│   ├── integration-test.test.ts
│   └── integration-test.ts
├── package-lock.json
├── package.json
└── tsconfig.json
     */

    // Only things to add: devDeps, CDK version

    // Github Actions (if self-contained CDK repository)?

    // How do updates work? I.e. to client projects? Depends on pinning story -
    // looks like semver, so will fetch latest compatible release on each synth.

    // What else?
    // Install @guardian/cdk and CDK itself
    // Add @guardian/prettier and eslint
    // Snapshot testing - but how to edit this file? - SampleDir class.
  }
}
