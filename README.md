# action-npm-publish
> Github action for npm publsih.

## usage
```yml
on: [push]

jobs:
  __tests__:
    runs-on: ubuntu-latest
    name: Test for npm-publish
    steps:
      - name: Hello world action step
        id: hello
        uses: afeiship/action-npm-publish@master
        with: # All of theses inputs are optional
          tag_name: "v%s"
          tag_message: "v%s"
          commit_pattern: "^Release (\\S+)"
```

## resources
- https://github.com/pascalgn/npm-publish-action
- https://help.github.com/cn/actions/automating-your-workflow-with-github-actions/creating-a-javascript-action
- https://github.com/actions/toolkit
