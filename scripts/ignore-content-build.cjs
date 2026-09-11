const { execFileSync } = require('node:child_process');

function contentOnly(paths) {
  return paths.length > 0 && paths.every(path =>
    path === 'data/site-content.json' || path.startsWith('public/photos/'));
}

function ignoredBuild(env = process.env) {
  const previous = env.VERCEL_GIT_PREVIOUS_SHA;
  // Without a known successful deployment, keep the build (including first deploys).
  if (!previous || !/^[a-f0-9]{40}$/i.test(previous)) return false;
  try {
    const git = args => execFileSync('git', args, { encoding: 'utf8', timeout: 10000 });
    try {
      git(['cat-file', '-e', `${previous}^{commit}`]);
    } catch {
      // Vercel clones shallowly; many content commits can move the baseline out of reach.
      git(['fetch', '--no-tags', '--depth=1', 'origin', previous]);
    }
    // No rename detection: both the old and new paths must be safe to skip.
    const paths = git(['diff', '--name-only', '--no-renames', '-z', previous, 'HEAD', '--'])
      .split('\0').filter(Boolean);
    return contentOnly(paths);
  } catch {
    // Unavailable history or any Git failure must never suppress a code build.
    return false;
  }
}

if (require.main === module) {
  const skip = ignoredBuild();
  console.log(skip ? 'Content/photos only: build skipped.' : 'Code change or unknown baseline: build required.');
  // Vercel Ignored Build Step: 0 skips, 1 builds.
  process.exitCode = skip ? 0 : 1;
}

module.exports = { contentOnly, ignoredBuild };
