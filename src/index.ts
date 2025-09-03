import ArgoCD from './argo-cd';

import * as core from '@actions/core';
import stringArgv from 'string-argv';
import axios, {isAxiosError} from 'axios'

async function validateSubscription(): Promise<void> {
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`

  try {
    await axios.get(API_URL, {timeout: 3000})
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(
        'Subscription is not valid. Reach out to support@stepsecurity.io'
      )
      process.exit(1)
    } else {
      core.info('Timeout or API not reachable. Continuing to next step.')
    }
  }
}

async function run(): Promise<void> {
  try {
    await validateSubscription();
    const command = stringArgv(core.getInput('command', {required: false}).trim());
    core.debug(`[index] command: ${command}`);
    const options = stringArgv(core.getInput('options', {required: false}).trim());
    core.debug(`[index] options: ${options}`);
    const version = core.getInput('version', {required: false}).trim();
    core.debug(`[index] version: ${version}`);

    // Get executable
    const argocd = await ArgoCD.getOrDownload(version);

    const args = [...command, ...options];
    if (args) {
      const result = await argocd.callStdout(args);
      core.setOutput('output', result);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
