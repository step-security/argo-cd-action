[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

<p align="center">
  <img src=".github/argo-cd.png" alt="argo-cd" height="296px">
</p>
<h1 style="font-size: 56px; margin: 0; padding: 0;" align="center">
  argo-cd-action
</h1>
<p align="center">
  <a href="https://github.com/step-security/argo-cd-action/actions?query=workflow%3Aintegration">
    <img src="https://github.com/step-security/argo-cd-action/workflows/integration/badge.svg" alt="integration test">
  </a>
</p>

GitHub action for installing and executing the [Argo CD](https://argo-cd.readthedocs.io/) CLI.

## Usage

See the [ArgoCD CLI documentation](https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd/) for the full list of available commands and options.

### Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `command` | Command passed to the ArgoCD CLI | No | |
| `options` | Options passed to the ArgoCD CLI command | No | |
| `version` | Version of ArgoCD CLI to install | No | `3.3.2` |
| `download-url` | Custom URL to download the ArgoCD CLI binary from (e.g., from a self-hosted server) | No | |

### Outputs

| Name | Description |
|------|-------------|
| `output` | Stdout from the ArgoCD CLI command execution |

### Basic

```yml
- uses: step-security/argo-cd-action@v3
  with:
    command: version
    options: --client
```

### With GitHub API authentication

If you run workflows frequently, you may hit GitHub's API rate limit when downloading the CLI from ArgoCD releases. Add `GITHUB_TOKEN` to authenticate and use a higher rate limit.

```yml
- uses: step-security/argo-cd-action@v3
  env:
    # Only required for first step in job where the CLI is downloaded
    # Subsequent steps in the same job will use the cached binary
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


### With a self-hosted ArgoCD server

Use the `download-url` input to download the CLI directly from your ArgoCD server instead of GitHub releases. This keeps your CLI version in sync with your server and avoids GitHub API rate limits.

```yml
- uses: step-security/argo-cd-action@v3
  with:
    download-url: https://argocd.example.com/download/argocd-linux-amd64
    command: version
    options: --client
```

### Authenticate and deploy

```yml
- name: Install ArgoCD CLI
  uses: step-security/argo-cd-action@v3
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

- name: Deploy application
  uses: step-security/argo-cd-action@v3
  with:
    command: app sync my-app
    options: >-
      --auth-token ${{ secrets.ARGOCD_AUTH_TOKEN }}
      --server ${{ secrets.ARGOCD_SERVER }}
      --grpc-web
```

### Capture command output

The action exposes the CLI stdout as a step output, which can be referenced in subsequent steps.

```yml
- name: List applications
  id: argocd
  uses: step-security/argo-cd-action@v3
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    command: app list
    options: >-
      --auth-token ${{ secrets.ARGOCD_AUTH_TOKEN }}
      --server ${{ secrets.ARGOCD_SERVER }}
      --grpc-web
      -o name

- name: Use output
  run: echo "${{ steps.argocd.outputs.output }}"
```

### Set a specific version

```yml
- uses: step-security/argo-cd-action@v3
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    version: 3.1.5
    command: version
    options: --client
```

### Install only (no command)

If you omit `command`, the action only installs the ArgoCD CLI and adds it to `PATH` for use in subsequent `run` steps.

```yml
- uses: step-security/argo-cd-action@v3
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

- run: argocd version --client
```

## Security

- Downloaded binaries from GitHub releases are verified against SHA256 checksums (available for ArgoCD v2.7.0+)
- `GITHUB_TOKEN` is automatically filtered from the environment when executing ArgoCD CLI commands
- When using `download-url`, checksum verification is skipped as the binary comes from your own infrastructure
