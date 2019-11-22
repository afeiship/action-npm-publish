# action-npm-publish
> Github action for npm publsih.

## DO NOT USE
> GITHUB action has some problem.

## usage
```yml
on:
  push:
    branches:
      - master
jobs:
  __tests__:
    name: Test for npm-publish
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@master
      - name: Setup Git
        uses: fregante/setup-git-token@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Publish to npm
        uses: ./
        with: # All of theses inputs are optional
          tag_name: 'v%s'
          tag_message: 'v%s'
          commit_pattern: "^Release (\\S+)"
        env:
          NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }} # You need to set this in your repo settings
```

## resources
- https://github.com/pascalgn/npm-publish-action
- https://help.github.com/cn/actions/automating-your-workflow-with-github-actions/creating-a-javascript-action
- https://github.com/actions/toolkit
- https://github.com/afeiship/action-npm-publish/actions
