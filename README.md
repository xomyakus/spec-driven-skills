# spec-native-skills

A curated collection of AI agent skills for spec-driven and large-scale development.

## Installation

```bash
npx skills add xomyakus/spec-native-skills
```

## Skills

| Skill                                    | Description                                                                                          |
|------------------------------------------|------------------------------------------------------------------------------------------------------|
| [sdx-commit](skills/sdx-commit/SKILL.md) | Analyze current git changes, group them by logical change, and make structured conventional commits. |

### sdx-commit

Automates the process of creating clean, structured Git commits. Instead of one mixed commit, it:

1. Analyzes your current diff and groups files by logical change
2. Drafts a conventional commit message for each group
3. Presents a plan for your review
4. Stages and commits each group individually

**Invoke:** `/sdx-commit`

**Example output:**
```
ba2314c feat(sdx): add initial CLI scaffold
044e321 feat(skills): add sdx-commit skill
6d1a7b3 chore(infra): add skills installation config
```

## License

MIT
