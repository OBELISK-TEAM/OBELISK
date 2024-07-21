# Contributing

This document outlines the rules and guidelines that apply to the OBELISK project. All contributors are expected to strictly follow them to ensure that the workflow is consistent and the repository is easy to maintain. Feel free to ask any questions regarding contributions or any other topic.

Please note that this document might (and probably will) change in the future. By contributing you are expected to keep up with all of the updates.


## Branches

There are three types of branches:
- `release branch` - which can be created and merged to from `develop` by DevOps only. For example `release-v1.2.1`
- `develop branch` - we merge feature branches to this branch
- `feature branch` - a branch that introduces specific feature. It must be named consistently with Jira issue ID - for example `OK-215`

Branches that don't fall under any of the branch types listed above are not allowed.

Pushing with `--force` is not allowed. Pushing with `--force-with-lease` is allowed only on the feature branches and under the condition that you work on the branch alone, which will be the case for most branches.


## Commits

We use slightly modified version of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). A special hook has been prepared for this purpose. It can be found [here](https://github.com/OBELISK-TEAM/OBELISK/tree/develop/.githooks/prepare-commit-msg). In order to use it, copy the `prepare-commit-msg` file to `.git/hooks` directory. Using it on Linux might also require changing the execution permissions: `chmod +x prepare-commit-msg`. To run the hook, use the following command: `git commit -a`.

In order to preserve consistency among the commits please don't use any other hooks that modify commit messages.

Please note that the hook might be updated in the future. By contributing, you are expected to use the latest version of `prepare-commit-msg` hook.


## Pull Requests

When making a pull request, use all labels that apply.

Pull requests that are not ready to merge must be marked as a `draft` and labeled as `do-not-merge`.

Pull request can be merged under the following conditions:
- [github action pipelines](https://github.com/OBELISK-TEAM/OBELISK/blob/develop/.github/workflows) have successfully passed
- there is at least one approving review
- the feature has successfully passed a manual test (labeled as `tested-ok`) - if the manual test was required (check [Manual Tests](#manual-tests))

We merge pull requests we authored. Avoid merging other pull requests (exception: the author of the pull request doesn't have a write access to the target branch)

We use `squash and merge` when merging to the `develop` branch. `rebase and merge` is allowed only if each of the commit in the pull request introduces one, consistent logical change.

After the merge the source branch should be deleted.


## Manual Tests

If you decide that changes made in your pull request require a manual test, add step-by-step test scenario to the description of the pull request. Don't forget `test-required` label. After successfully conducting the manual test, the tester should replace `test-required` label with `tested-ok` label. Otherwise, the tester should describe what went wrong during manual test in the pull request.


## Commit Messages and Pull Request Titles

GitHub actions will check if the commit message or pull request title follows the rules. If it doesn't, the action will fail and the pull request won't be able to merge.

### Format:

- Type of Change - the message must start with one of the following types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Optional Scope - an optional scope can be included in parentheses, e.g., `(api)`, `(backend)`.
- Jira Issue ID - a mandatory Jira issue ID must be included in square brackets, e.g., `[OK-123]`.
- Description - a short description must follow, starting with a capital letter.

### Example format:
`[type](optional scope)[JIRA-ISSUE] Description`

Examples of correct commit messages / pull request titles:
- `ci(github)[OK-215] Add github action for building the project`
- `fix[OK-215] Fix bug in the user data endpoint`

### Example of incorrect commit messages / pull request titles:

- `feat[OK-215] add new endpoint for fetching user data` - no capital letter at the beginning of the description
- `feat(backend) Add new endpoint for fetching user data` - missing JIRA issue ID
- `test(frontend): [OK-215] Add new test for the user data endpoint` - unnecessary colon
- `docs (backend) [OK-215] Add new documentation for the user data endpoint` - unnecessary spaces