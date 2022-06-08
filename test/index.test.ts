import { Testing } from 'projen';
import { GuCDKTypescriptProject } from '../src';

test('should match synth snapshot', () => {
  const prj = new GuCDKTypescriptProject({ name: 'test' });
  expect(Testing.synth(prj)).toMatchSnapshot();
});

