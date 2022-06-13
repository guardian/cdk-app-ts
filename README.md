# @guardian/cdk-app-ts

**WARNING: this repository is currently experimental. We are evaluating projen
but have not decided to use it yet.**

A [projen](https://github.com/projen/projen) starter-kit for @guardian/cdk apps.

To create a new project run the following from within a `cdk` directory in your
repository:

    $ npx projen new --from @guardian/cdk-app-ts

Unlike most starter-kits, projen is not a one-off generator, and synthesized
files should not be manually edited. The only files you should edit are:

* `lib/` - your Typescript CDK files and tests
* `.projenrc.js` - to update settings, e.g. to add extra dev dependencies (run
  `npx projen` to re-synth after any changes)

Tasks, such as `test`, `lint`, etc., can be run using:

    $ npx projen [task]

To list all possible tasks and their descriptions run:

    $ npx projen --help

## Publishing new versions


