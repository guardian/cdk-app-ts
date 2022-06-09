import { execSync } from 'child_process';
import { GuCDKTypescriptProject } from '../src';

test.skip('synth (for inspection only)', () => {
  const outdir = 'tmp';
  execSync(`rm -rf ${outdir}`);

  const prj = new GuCDKTypescriptProject({ name: 'test', outdir });
  prj.synth();

  // TODO run e.g. test and lint on the output and check exit codes. Then delete
  // the directory again.
});