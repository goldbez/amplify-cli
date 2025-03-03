#!/bin/bash -e

git config --global user.name aws-amplify-bot
git config --global user.email aws@amazon.com

if [[ "$CIRCLE_BRANCH" =~ ^tagged-release ]]; then
  if [[ "$CIRCLE_BRANCH" =~ ^tagged-release-without-e2e-tests\/.* ]]; then
    # Remove tagged-release-without-e2e-tests/
    export NPM_TAG="${CIRCLE_BRANCH/tagged-release-without-e2e-tests\//}"
  elif [[ "$CIRCLE_BRANCH" =~ ^tagged-release\/.* ]]; then
    # Remove tagged-release/
    export NPM_TAG="${CIRCLE_BRANCH/tagged-release\//}"
  fi
  if [ -z "$NPM_TAG" ]; then
    echo "Tag name is missing. Name your branch with either tagged-release/<tag-name> or tagged-release-without-e2e-tests/<tag-name>"
    exit 1
  fi

  npx lerna version --exact --preid=$NPM_TAG --conventional-commits --conventional-prerelease --yes --no-push --include-merged-tags --message "chore(release): Publish tagged release $NPM_TAG [ci skip]" --no-commit-hooks --force-publish '@aws-amplify/cli-internal'

# @latest release
elif [[ "$CIRCLE_BRANCH" == "release" ]]; then
  # create release commit and release tags
  npx lerna version --exact --conventional-commits --conventional-graduate --yes --no-push --include-merged-tags --message "chore(release): Publish latest [ci skip]" --no-commit-hooks --force-publish '@aws-amplify/cli-internal'

# release candidate or local publish for testing / building binary
else
  # create release commit and release tags
  npx lerna version --preid=rc.$(git rev-parse --short HEAD) --exact --conventional-prerelease --conventional-commits --yes --no-push --include-merged-tags --message "chore(release): Publish rc [ci skip]" --no-commit-hooks --force-publish '@aws-amplify/cli-internal'
fi
