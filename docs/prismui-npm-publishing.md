# PrismUI npm Publishing Runbook

This runbook is for the PrismUI maintainers who publish the renamed unscoped `prismui-framework` / `prismui-*` packages. It assumes the package rename has already landed in package manifests and internal dependencies.

## What is automated

- `.github/workflows/npm-publish.yml` installs dependencies, optionally builds packages, verifies the PrismUI package set, performs `npm pack --dry-run`, and publishes with provenance through npm trusted publishing after trust is configured.
- `scripts/prismui-release.mjs` owns the publish package order and refuses to publish until the package manifests use the expected `prismui-*` names.
- The local bootstrap path can consume a temporary `NPM_TOKEN` or `NODE_AUTH_TOKEN` from the environment. The script writes the token only to a temporary npm user config outside the repository and deletes it after the process exits.

## Package order

The release script publishes these packages in order:

| Directory | Expected npm package |
| --- | --- |
| `packages/amis-formula` | `prismui-formula` |
| `packages/amis-core` | `prismui-core` |
| `packages/amis-ui` | `prismui-ui` |
| `packages/office-viewer` | `prismui-office-viewer` |
| `packages/amis` | `prismui-framework` |
| `packages/prismui-i18n-runtime` | `prismui-i18n-runtime` |
| `packages/prismui-postcss` | `prismui-postcss` |
| `packages/amis-theme-editor-helper` | `prismui-theme-editor-helper` |
| `packages/amis-editor-core` | `prismui-editor-core` |
| `packages/amis-editor` | `prismui-editor` |
| `packages/vite-plugin-amisr` | `vite-plugin-prismui` |

## Maintainer-only setup

These steps cannot be safely automated by Codex because npm requires account-level authority or proof-of-presence.

1. Sign in and confirm publish identity:

```bash
npm login
npm whoami
npm access ls-packages
```

2. Create a short-lived npm granular access token only for first publish bootstrap.

Use these settings:

- Expiration: 1 to 7 days.
- Packages and scopes: the narrowest read-write package publishing permission npm allows for first-package creation. After the packages exist, prefer exact package-level access.
- Bypass 2FA: enabled.
- Organizations: not required for these unscoped packages unless you are also changing org/team governance.

Do not commit this token, paste it into chat, or store it in shell profile files.

3. After the first publish, revoke the bootstrap token in npm immediately.

## First publish bootstrap

Run this only after the package rename branch has changed every package manifest to the expected names and versions.

```bash
export NPM_TOKEN='<short-lived granular token>'
npm run release:prismui:verify -- --tag beta
npm run release:prismui:pack -- --tag beta
npm run release:prismui:publish -- --tag beta --allow-local --no-provenance
unset NPM_TOKEN
```

Use prerelease versions for bootstrap smoke tests, for example `7.0.0-beta.1`, `7.0.0-beta.2`, and publish them under `beta`. Do not publish test builds under `latest`.

## Trusted publishing setup

After each package exists on npm, upgrade npm locally and print the trust commands:

```bash
npm install -g npm@^11.15.0
npm run release:prismui:trust-commands -- --yes
```

The generated commands use:

- GitHub repository: `Gengxin-Tech/prismui`
- Workflow file: `npm-publish.yml`
- GitHub environment: `npm-publish`
- Publishing permission: `--allow-publish`

Run the generated `npm trust github ...` commands while signed in with your npm maintainer account. npm may ask for 2FA. The first 2FA prompt can unlock a short browser session for the remaining package trust operations.

If you remove the `npm-publish` environment from the workflow, regenerate commands with an empty environment omitted by editing the script default or running the commands manually without `--env npm-publish`.

## Regular test release

Use GitHub Actions after trusted publishing has been configured:

1. Open `Actions` -> `npm publish PrismUI`.
2. Choose `Run workflow`.
3. Set `mode` to `dry-run` first.
4. Set `tag` to `beta` for the PrismUI 7 prerelease line.
5. Keep `build` enabled unless you are intentionally testing already-built artifacts.
6. Re-run with `mode=publish` after the dry run passes.

For production releases, push a tag matching `prismui-v*`. Tag-triggered releases publish with the `latest` npm dist-tag.

## Local commands

```bash
npm run release:prismui:verify -- --skip-registry
npm run release:prismui:verify -- --tag beta --skip-existing
npm run release:prismui:verify -- --tag beta
npm run release:prismui:pack -- --tag beta
npm run release:prismui:trust-commands -- --repo Gengxin-Tech/prismui --file npm-publish.yml --env npm-publish --yes
```

## Safety checks enforced by the script

- Every package name must exactly match the unscoped PrismUI target name.
- Every package must have `version`, `license`, and non-private publish metadata.
- `repository.url` must point to `Gengxin-Tech/prismui`; npm trusted publishing is sensitive to fork repository metadata.
- Internal package dependencies must not still reference the old `amis*`, `amis-postcss`, `i18n-runtime`, `office-viewer`, or `vite-plugin-amisr` package names.
- `prismui@0.0.1` and `prismui@0.1.3` are blocked because those versions were previously unpublished on npm and cannot be reused; the framework package now publishes as `prismui-framework`.
- A package version already present on the npm registry fails preflight before publish begins.
- During interrupted bootstrap releases, pass `--skip-existing` to treat already-published package versions as complete and continue with the remaining packages.
- Local publish is blocked unless `--allow-local` is passed explicitly.

## Official references

- npm trusted publishing: <https://docs.npmjs.com/trusted-publishers/>
- npm access tokens: <https://docs.npmjs.com/about-access-tokens/>
- npm token creation: <https://docs.npmjs.com/creating-and-viewing-access-tokens/>
- npm 2FA publishing requirements: <https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/>
- npm publish: <https://docs.npmjs.com/cli/commands/npm-publish/>
