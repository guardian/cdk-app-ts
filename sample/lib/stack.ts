import { GuStackProps, GuStack } from '@guardian/cdk/lib/constructs/core';
import type { App } from 'aws-cdk-lib';

export class MyStack extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);
  }
}