import * as child_process from 'child_process';
import { readFileSync } from 'fs';
import * as path from 'path';
import { JsonFile, SampleDir, SampleFile, Task } from 'projen';
import { TypeScriptAppProject, TypeScriptProjectOptions } from 'projen/lib/typescript';

export interface GuCDKTypescriptOptions {

  /**
   * Package name
   */
  readonly name: string;

  /**
   * Target for synth.
   */
  readonly outdir?: string;
}

/**
 * Create a Gu CDK Typescript project.
 *
 * @pjid gucdk-app-ts
 */
export class GuCDKTypescriptProject extends TypeScriptAppProject {
  lintFix: Task; // asigned to re-use in postsynth

  constructor(options: GuCDKTypescriptOptions) {

    const defaults: GuCDKTypescriptOptions = {
      name: 'TODO',
    };

    const tsOpts: TypeScriptProjectOptions = {
      defaultReleaseBranch: 'main',
      readme: {
        filename: 'README.md',
        contents: readme(),
      },

      devDeps: [
        '@guardian/eslint-config-typescript@^1.0.1',
        '@guardian/prettier@^1.0.0',
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

        '@guardian/cdk-app-ts', // required for subsequent synths ('npx projen') to work!
      ],

      // Easier to manage these ourselves
      github: false,
      sampleCode: false,
      jest: false,
      prettier: false,
      eslint: false,

      srcdir: 'lib', // this defaults to src unfortunately for us

      ...defaults,
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

    // Define our own tasks
    this.addTask('dependencies', { exec: this.package.installCommand, description: 'Install dependencies based on lockfile' });
    this.addTask('test', { exec: 'jest', description: 'Run tests' });
    this.addTask('lint', { exec: 'eslint --ext .ts --no-error-on-unmatched-pattern lib/**', description: 'Lint sources using eslint' });
    this.lintFix = this.addTask('lint:fix', { exec: 'eslint --ext .ts --no-error-on-unmatched-pattern --fix lib/**', description: 'Lint sources using eslint' });
    this.addTask('synth', { exec: 'cdk synth --path-metadata false --version-reporting false', description: 'synth CDK stack(s)' });
    this.addTask('diff', { exec: 'cdk diff --path-metadata false --version-reporting false', description: 'diff CDK stack' });

    this.addFields({
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
        app: 'npx ts-node lib/app.ts',
        context: {
          'aws-cdk:enableDiffNoFail': 'true',
          '@aws-cdk/core:stackRelativeExports': 'true',
        },
      },
    });

    new SampleDir(this, 'lib', {
      sourceDir: path.join(__dirname, '..', 'sample/lib'),
    });
  }

  postSynthesize(): void {
    const out = child_process.execSync(this.runTaskCommand(this.lintFix));
    console.log(out.toString('utf-8'));

    console.log('Synth complete! See README.md for usage.');
  }
}

const readme = (): string => {
  return readFileSync(path.join(__dirname, '..', 'sample/README.md')).toString('utf-8');
};