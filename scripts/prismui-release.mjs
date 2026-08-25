#!/usr/bin/env node

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/';
const DEFAULT_DIST_TAG = 'prismui-next';
const DEFAULT_REPOSITORY = 'Gengxin-Tech/prismui';
const DEFAULT_WORKFLOW_FILE = 'npm-publish.yml';
const DEFAULT_ENVIRONMENT = 'npm-publish';

const publishPackages = [
  {
    dir: 'packages/prismui-formula',
    expectedName: 'prismui-formula'
  },
  {
    dir: 'packages/prismui-core',
    expectedName: 'prismui-core'
  },
  {
    dir: 'packages/prismui-ui',
    expectedName: 'prismui-ui'
  },
  {
    dir: 'packages/prismui-office-viewer',
    expectedName: 'prismui-office-viewer'
  },
  {
    dir: 'packages/prismui-framework',
    expectedName: 'prismui-framework'
  },
  {
    dir: 'packages/prismui-i18n-runtime',
    expectedName: 'prismui-i18n-runtime'
  },
  {
    dir: 'packages/prismui-postcss',
    expectedName: 'prismui-postcss'
  },
  {
    dir: 'packages/prismui-theme-editor-helper',
    expectedName: 'prismui-theme-editor-helper'
  },
  {
    dir: 'packages/prismui-editor-core',
    expectedName: 'prismui-editor-core'
  },
  {
    dir: 'packages/prismui-editor',
    expectedName: 'prismui-editor'
  },
  {
    dir: 'packages/vite-plugin-prismui',
    expectedName: 'vite-plugin-prismui'
  }
];

const legacyPackageNames = new Set([
  'amis',
  'amis-core',
  'amis-ui',
  'amis-formula',
  'amis-editor',
  'amis-editor-core',
  'amis-theme-editor-helper',
  'amis-postcss',
  'i18n-runtime',
  'office-viewer',
  'vite-plugin-amisr'
]);

const burnedPackageVersions = new Map([
  // npm keeps unpublished versions reserved; the package name can be reused, but
  // these exact versions cannot be published again.
  ['prismui', new Set(['0.0.1', '0.1.3'])]
]);

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

function main() {
  const {command, options} = parseArgs(process.argv.slice(2));

  if (options.help || command === 'help') {
    printHelp();
    return;
  }

  const npmEnv = createNpmEnv(options.registry);

  try {
    if (command === 'verify') {
      verifyPublishPlan(options, npmEnv);
      return;
    }

    if (command === 'pack') {
      const plan = verifyPublishPlan(options, npmEnv);
      scrubDeclarationFiles(plan);
      packDryRun(plan, options, npmEnv);
      return;
    }

    if (command === 'publish') {
      const plan = verifyPublishPlan(options, npmEnv);
      scrubDeclarationFiles(plan);
      publish(plan, options, npmEnv);
      return;
    }

    if (command === 'trust-commands') {
      printTrustCommands(options);
      return;
    }

    throw new Error(`Unknown command: ${command}`);
  } finally {
    cleanupTempNpmConfig(npmEnv);
  }
}

function parseArgs(argv) {
  const [command = 'verify', ...args] = argv;
  const options = {
    tag: DEFAULT_DIST_TAG,
    version: '',
    registry: DEFAULT_REGISTRY,
    repository: DEFAULT_REPOSITORY,
    workflowFile: DEFAULT_WORKFLOW_FILE,
    environment: DEFAULT_ENVIRONMENT,
    allowLocal: false,
    yes: false,
    skipRegistry: false,
    skipExisting: false,
    provenance: false,
    otp: '',
    help: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const readValue = () => {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${arg} requires a value`);
      }
      index += 1;
      return value;
    };

    if (arg.startsWith('--otp=')) {
      options.otp = arg.slice('--otp='.length);
    } else if (arg === '--otp') {
      options.otp = readValue();
    } else if (arg === '--tag') {
      options.tag = readValue();
    } else if (arg === '--version') {
      options.version = readValue();
    } else if (arg === '--registry') {
      options.registry = normalizeRegistry(readValue());
    } else if (arg === '--repo' || arg === '--repository') {
      options.repository = readValue();
    } else if (arg === '--file' || arg === '--workflow') {
      options.workflowFile = readValue();
    } else if (arg === '--env' || arg === '--environment') {
      options.environment = readValue();
    } else if (arg === '--allow-local') {
      options.allowLocal = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (arg === '--skip-registry') {
      options.skipRegistry = true;
    } else if (arg === '--skip-existing') {
      options.skipExisting = true;
    } else if (arg === '--provenance') {
      options.provenance = true;
    } else if (arg === '--no-provenance') {
      options.provenance = false;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  options.registry = normalizeRegistry(options.registry);
  return {command, options};
}

function normalizeRegistry(registry) {
  return registry.endsWith('/') ? registry : `${registry}/`;
}

function createNpmEnv(registry) {
  const token = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN;
  const env = {...process.env};

  if (!token || env.NPM_CONFIG_USERCONFIG) {
    return {env};
  }

  const tempDir = mkdtempSync(path.join(tmpdir(), 'prismui-npm-'));
  const userConfigPath = path.join(tempDir, '.npmrc');
  const registryUrl = new URL(registry);
  const authPath =
    registryUrl.pathname === '/'
      ? '/'
      : ensureTrailingSlash(registryUrl.pathname);

  writeFileSync(
    userConfigPath,
    [
      `registry=${registry}`,
      `//${registryUrl.host}${authPath}:_authToken=${token}`,
      ''
    ].join('\n'),
    {mode: 0o600}
  );

  env.NPM_CONFIG_USERCONFIG = userConfigPath;
  return {env, tempDir};
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function cleanupTempNpmConfig(npmEnv) {
  if (npmEnv.tempDir) {
    rmSync(npmEnv.tempDir, {force: true, recursive: true});
  }
}

function verifyPublishPlan(options, npmEnv) {
  const plan = loadPublishPlan();
  const errors = validatePlan(plan, options);

  if (errors.length > 0) {
    printPlan(plan);
    fail(
      `PrismUI publish plan is not ready:\n${errors
        .map(error => `- ${error}`)
        .join('\n')}`
    );
  }

  if (!options.skipRegistry) {
    checkRegistryAvailability(plan, options, npmEnv);
  }

  printPlan(plan);
  console.log(`Publish plan verified for dist-tag "${options.tag}".`);
  return plan;
}

function loadPublishPlan() {
  return publishPackages.map(pkg => {
    const packageDir = path.join(repoRoot, pkg.dir);
    const manifestPath = path.join(packageDir, 'package.json');

    if (!existsSync(manifestPath)) {
      return {...pkg, packageDir, manifestPath, manifest: null};
    }

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    return {...pkg, packageDir, manifestPath, manifest};
  });
}

function validatePlan(plan, options) {
  const errors = [];
  const expectedNames = new Set(plan.map(pkg => pkg.expectedName));

  for (const pkg of plan) {
    if (!pkg.manifest) {
      errors.push(`Missing manifest: ${relativePath(pkg.manifestPath)}`);
      continue;
    }

    if (pkg.manifest.name !== pkg.expectedName) {
      errors.push(
        `${relativePath(pkg.manifestPath)} name is "${
          pkg.manifest.name
        }", expected "${pkg.expectedName}"`
      );
    }

    if (!pkg.manifest.version) {
      errors.push(`${pkg.expectedName} is missing a version`);
    } else if (options.version && pkg.manifest.version !== options.version) {
      errors.push(
        `${pkg.expectedName} version is "${pkg.manifest.version}", expected release version "${options.version}"`
      );
    } else if (
      isBurnedPackageVersion(pkg.manifest.name, pkg.manifest.version)
    ) {
      errors.push(
        `${pkg.manifest.name}@${pkg.manifest.version} was previously unpublished on npm and cannot be reused`
      );
    }

    if (options.tag === 'latest' && pkg.manifest.version?.includes('-')) {
      errors.push(
        `${pkg.expectedName}@${pkg.manifest.version} is a prerelease and cannot be published with latest`
      );
    }

    if (pkg.manifest.private === true) {
      errors.push(`${pkg.expectedName} is private and cannot be published`);
    }

    if (!pkg.manifest.license) {
      errors.push(`${pkg.expectedName} is missing a license field`);
    }

    const repositoryUrl = getRepositoryUrl(pkg.manifest);
    if (
      !repositoryUrl ||
      !repositoryUrlMatches(repositoryUrl, options.repository)
    ) {
      errors.push(
        `${pkg.expectedName} repository.url must point to ${options.repository} for trusted publishing`
      );
    }

    for (const section of [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies'
    ]) {
      const dependencies = pkg.manifest[section] || {};
      for (const dependencyName of Object.keys(dependencies)) {
        if (legacyPackageNames.has(dependencyName)) {
          errors.push(
            `${pkg.expectedName} ${section} still references legacy package "${dependencyName}"`
          );
        }

        if (
          isPrismUIPackageName(dependencyName) &&
          !expectedNames.has(dependencyName)
        ) {
          errors.push(
            `${pkg.expectedName} ${section} references unmanaged package "${dependencyName}"`
          );
        }
      }
    }
  }

  return errors;
}

function isBurnedPackageVersion(name, version) {
  return burnedPackageVersions.get(name)?.has(version) || false;
}

function isPrismUIPackageName(name) {
  return (
    name === 'prismui' ||
    name === 'prismui-framework' ||
    name.startsWith('prismui-') ||
    name === 'vite-plugin-prismui'
  );
}

function getRepositoryUrl(manifest) {
  if (!manifest.repository) {
    return null;
  }

  if (typeof manifest.repository === 'string') {
    return manifest.repository;
  }

  return manifest.repository.url || null;
}

function repositoryUrlMatches(repositoryUrl, repository) {
  const normalized = repositoryUrl
    .replace(/^git\+/, '')
    .replace(/^https:\/\/github\.com\//, '')
    .replace(/^git@github\.com:/, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
    .toLowerCase();

  return normalized === repository.toLowerCase();
}

function checkRegistryAvailability(plan, options, npmEnv) {
  const errors = [];

  for (const pkg of plan) {
    const result = spawnSync(
      'npm',
      [
        'view',
        `${pkg.manifest.name}@${pkg.manifest.version}`,
        'version',
        `--registry=${options.registry}`,
        '--json'
      ],
      {cwd: repoRoot, encoding: 'utf8', env: npmEnv.env}
    );

    if (result.status === 0 && result.stdout.trim()) {
      if (options.skipExisting) {
        pkg.skipPublish = true;
        continue;
      }

      errors.push(
        `${pkg.manifest.name}@${pkg.manifest.version} already exists on ${options.registry}`
      );
      continue;
    }

    const stderr = result.stderr || '';
    const stdout = result.stdout || '';
    if (
      result.status !== 0 &&
      !/E404|404 Not Found|not found/i.test(`${stderr}\n${stdout}`)
    ) {
      errors.push(
        `Could not confirm registry availability for ${pkg.manifest.name}@${
          pkg.manifest.version
        }: ${stderr.trim()}`
      );
    }
  }

  if (errors.length > 0) {
    fail(
      `Registry preflight failed:\n${errors
        .map(error => `- ${error}`)
        .join('\n')}`
    );
  }
}

function packDryRun(plan, options, npmEnv) {
  for (const pkg of plan) {
    if (pkg.skipPublish) {
      console.log(
        `\n> skip pack dry-run ${pkg.manifest.name}@${pkg.manifest.version}; already exists on ${options.registry}`
      );
      continue;
    }

    runNpm(
      [
        'pack',
        pkg.packageDir,
        '--dry-run',
        '--json',
        `--registry=${options.registry}`
      ],
      npmEnv,
      `pack dry-run ${pkg.manifest.name}`
    );
  }
}

function publish(plan, options, npmEnv) {
  if (process.env.CI !== 'true' && !options.allowLocal) {
    fail(
      'Refusing to publish outside CI without --allow-local. Use this guard intentionally for bootstrap only.'
    );
  }

  for (const pkg of plan) {
    if (pkg.skipPublish) {
      console.log(
        `\n> skip publish ${pkg.manifest.name}@${pkg.manifest.version}; already exists on ${options.registry}`
      );
      continue;
    }

    const args = [
      'publish',
      pkg.packageDir,
      '--tag',
      options.tag,
      `--registry=${options.registry}`
    ];

    if (pkg.manifest.name.startsWith('@')) {
      args.push('--access', 'public');
    }

    if (options.provenance) {
      args.push('--provenance');
    }

    if (options.otp) {
      args.push(`--otp=${options.otp}`);
    }

    runNpm(args, npmEnv, `publish ${pkg.manifest.name}`);
  }
}

function scrubDeclarationFiles(plan) {
  let changedFiles = 0;

  for (const pkg of plan) {
    if (pkg.skipPublish) {
      continue;
    }

    for (const outputDir of ['lib', 'esm', 'dist']) {
      changedFiles += scrubDeclarationDir(path.join(pkg.packageDir, outputDir));
    }
  }

  if (changedFiles > 0) {
    console.log(
      `Scrubbed legacy internal paths from ${changedFiles} declaration file(s).`
    );
  }
}

function scrubDeclarationDir(dir) {
  if (!existsSync(dir)) {
    return 0;
  }

  let changedFiles = 0;
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changedFiles += scrubDeclarationDir(entryPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.d.ts')) {
      continue;
    }

    const source = readFileSync(entryPath, 'utf8');
    const scrubbed = scrubDeclarationSource(source);
    if (scrubbed !== source) {
      writeFileSync(entryPath, scrubbed);
      changedFiles += 1;
    }
  }

  return changedFiles;
}

function scrubDeclarationSource(source) {
  const declarationPathReplacements = [
    [
      'packages/prismui-theme-editor-helper/lib',
      'prismui-theme-editor-helper/lib'
    ],
    ['packages/prismui-editor-core/lib', 'prismui-editor-core'],
    ['packages/prismui-editor/lib', 'prismui-editor/lib'],
    ['packages/prismui-formula/lib', 'prismui-formula/lib'],
    ['packages/prismui-core/lib', 'prismui-core/lib'],
    ['packages/prismui-ui/lib', 'prismui-ui/lib'],
    ['packages/prismui-office-viewer/lib', 'prismui-office-viewer/lib'],
    ['packages/prismui-framework/lib', 'prismui-framework/lib']
  ];

  return declarationPathReplacements.reduce(
    (current, [from, to]) => current.replaceAll(from, to),
    source
  );
}

function printTrustCommands(options) {
  console.log('# npm CLI 11.5.1+ is required for npm trust.');
  console.log('npm install -g npm@^11.5.1');
  console.log('npm login');
  console.log('npm whoami');
  console.log('');

  for (const pkg of publishPackages) {
    const args = [
      'trust',
      'github',
      pkg.expectedName,
      '--repo',
      options.repository,
      '--file',
      options.workflowFile,
      '--allow-publish'
    ];

    if (options.environment) {
      args.push('--env', options.environment);
    }

    if (options.yes) {
      args.push('--yes');
    }

    console.log(`npm ${args.map(shellQuote).join(' ')}`);
  }
}

function printPlan(plan) {
  console.log('PrismUI publish package order:');
  for (const pkg of plan) {
    const actualName = pkg.manifest ? pkg.manifest.name : '<missing>';
    const version = pkg.manifest
      ? pkg.manifest.version || '<missing>'
      : '<missing>';
    const status = pkg.skipPublish ? ' (already exists; skipped)' : '';
    console.log(
      `- ${relativePath(pkg.dir)}: ${actualName}@${version} -> ${
        pkg.expectedName
      }${status}`
    );
  }
}

function printHelp() {
  console.log(`Usage: node scripts/prismui-release.mjs <command> [options]

Commands:
  verify          Validate PrismUI package names, metadata, dependencies, and registry availability.
  pack            Run npm pack --dry-run --json for every PrismUI package.
  publish         Publish every PrismUI package in dependency order.
  trust-commands  Print npm trust github commands for every PrismUI package.

Options:
  --tag <tag>             npm dist-tag, default: ${DEFAULT_DIST_TAG}
  --version <version>     Require every package manifest to match this version.
  --registry <url>        npm registry, default: ${DEFAULT_REGISTRY}
  --repo <owner/repo>     GitHub repository, default: ${DEFAULT_REPOSITORY}
  --file <workflow.yml>   GitHub workflow filename, default: ${DEFAULT_WORKFLOW_FILE}
  --env <environment>     GitHub environment name, default: ${DEFAULT_ENVIRONMENT}
  --skip-registry         Skip npm registry availability checks.
  --skip-existing         Treat package versions already on npm as already done and skip them.
  --allow-local           Allow publish outside CI for one-time bootstrap.
  --provenance            Pass --provenance to npm publish.
  --no-provenance         Do not pass --provenance to npm publish.
  --otp <code>            Pass a one-time password to npm publish; redacted from logs.
  --yes, -y               Include --yes in generated npm trust commands.
`);
}

function runNpm(args, npmEnv, label) {
  console.log(`\n> npm ${args.map(redactNpmArg).join(' ')}`);
  const result = spawnSync('npm', args, {
    cwd: repoRoot,
    env: npmEnv.env,
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status}`);
  }
}

function redactNpmArg(arg) {
  return arg.startsWith('--otp=') ? '--otp=******' : arg;
}

function fail(message) {
  throw new Error(message);
}

function relativePath(value) {
  return path.relative(repoRoot, path.resolve(repoRoot, value)) || '.';
}

function shellQuote(value) {
  if (/^[A-Za-z0-9_./:@-]+$/.test(value)) {
    return value;
  }

  return `'${value.replace(/'/g, `'"'"'`)}'`;
}
