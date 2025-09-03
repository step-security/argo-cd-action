<p align="center">
  <img src=".github/argo-cd.png" alt="argo-cd" height="296px">
</p>
<h1 style="font-size: 56px; margin: 0; padding: 0;" align="center">
  argo-cd-action
</h1>
<p align="center">
  <img src="https://badgen.net/badge/TypeScript/strict%20%F0%9F%92%AA/blue" alt="Strict TypeScript">
</p>
<p align="center">
  <a href="https://github.com/step-security/argo-cd-action/actions?query=workflow%3Aintegration">
    <img src="https://github.com/step-security/argo-cd-action/workflows/integration/badge.svg" alt="integration test">
  </a>
</p>

GitHub action for executing Argo CD 🦑

## Usage

See the [ArgoCD CLI documentation](https://argoproj.github.io/argo-cd/user-guide/commands/argocd/) for the list of available commands and options.

```yml
- uses: step-security/argo-cd-action@v3
  with:
    version: 2.6.7
    command: version
    options: --client
```

### With GitHub API authentication

If you are running a lot of workflows/jobs quite frequently, you may run into GitHub's API rate limit due to pulling the CLI from the ArgoCD repository. To get around this limitation, add the `GITHUB_TOKEN` as shown below (or see [here](https://github.com/octokit/auth-action.js#createactionauth) for more examples) to utilize a higher rate limit when authenticated.

```yml
- uses: step-security/argo-cd-action@v3
  env:
    # Only required for first step in job where API is called
    # All subsequent setps in a job will not re-download the CLI
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    command: version
    options: --client
- uses: step-security/argo-cd-action@v3
  # CLI has already been downloaded in prior step, no call to GitHub API
  with:
    command: version
    options: --client
```
