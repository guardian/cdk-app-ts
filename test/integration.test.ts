import { execSync } from 'child_process';
import { GuCDKTypescriptProject } from '../src';

test('synth (for inspection only)', () => {
  const outdir = 'tmp';
  execSync(`rm -rf ${outdir}`);

  const prj = new GuCDKTypescriptProject({ name: 'test', outdir });
  prj.synth();
});