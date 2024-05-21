# Contributing

This document outlines the rules and guidelines that apply to the OBELISK project. All contributors are expected to strictly follow them to ensure that the workflow is consistent and the repository is easy to maintain. Feel free to ask any questions regarding contributions or any other topic.

Please note that this document might (and probably will) change in the future. By contributing you are expected to keep up with all of the updates.


## Branches

There are three types of branches:
- `release branch` - which can be created and merged to from `develop` by DevOps only. For example `release-v1.2.1`
- `develop branch` - we merge feature branches to this branch
- `feature branch` - a branch that introduces specific feature. It must be named consistently with Jira issue ID - for example `OK-215`

Branches that don't fall under any of the branch types listed above are not allowed.

`--force` is allowed only on the feature branches and under the condition that you work on the branch alone, which will be the case for most branches.


## Commits

We use slightly modified version of [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). A special hook has been prepared for this purpose. It can be found [here](https://github.com/OBELISK-TEAM/OBELISK/tree/develop/.githooks/prepare-commit-msg). In order to use it, copy the `prepare-commit-msg` file to `.git/hooks` directory. Using it on Linux might also require changing the execution privelleges: `chmod +x prepare-commit-msg`. To run the hook, use the following command: `commit -a`.

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

We use `squash and merge` when merging to the `develop` branch. `rebase and merge` is allowed only if each of the commit in the pull request introduce one, consistent logical change.

After the merge the source branch should be deleted.


## Manual Tests

If you decide that changes made in your pull request require a manual test, add step-by-step test scenario to the description of the pull request. Don't forget `test-required` label. After successfully conducting the manual test, the tester should replace `test-required` label with `tested-ok` label. Otherwise, the tester should describe what went wrong during manual test in the pull request.