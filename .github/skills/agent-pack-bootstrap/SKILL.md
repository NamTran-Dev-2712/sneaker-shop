---
name: agent-pack-bootstrap
description: 'Create or upgrade a reusable set of custom agents (architect, coder, database, debug, performance, planner) with strong auto-discovery triggers, minimal tool boundaries, and quality checks. Use for setting up agent files in new projects or standardizing existing agent packs.'
argument-hint: 'Describe project stack, required agent roles, and whether to sync multiple folders (e.g., .github/agents + .claude/agents).'
user-invocable: true
disable-model-invocation: false
---

# Agent Pack Bootstrap

Builds and standardizes a high-quality multi-role agent pack that is reusable across projects.

## When to Use
- You need to create agent files from scratch.
- Existing agent files are empty/inconsistent.
- You want better auto-selection (routing) without manually choosing agent every time.
- You want parallel agent sets for multiple ecosystems (e.g., GitHub Copilot + Claude).

## Inputs
- Target folders (e.g., `.github/agents`, `.claude/agents`)
- Required role list (default: architect, coder, database, debug, performance, planner)
- Project-specific constraints (optional)

## Procedure
1. **Audit Current State**
   - Read all target agent files.
   - Classify each file as: `empty`, `partial`, `usable`, or `conflicting`.

2. **Decide Strategy (Branching)**
   - If mostly `empty` → bootstrap full content for all roles.
   - If mostly `partial` → preserve strong sections, patch weak sections.
   - If `conflicting` across folders → normalize using a single canonical spec.

3. **Define Role Contracts**
   - One role per file, one core mission.
   - Add clear boundaries (what NOT to do).
   - Keep toolset minimal per role.

4. **Improve Auto-Discovery**
   - Write keyword-rich `description` with trigger phrases.
   - Include typical user intents and domain terms.
   - Avoid vague descriptions like “helpful agent”.

5. **Write/Update Files**
   - Keep naming stable for compatibility.
   - Ensure frontmatter is valid YAML.
   - Ensure behavior sections are concise and action-oriented.

6. **Quality Verification**
   - Validate no syntax/diagnostic issues.
   - Check every role has: mission, constraints, workflow, output format.
   - Confirm parallel folders are aligned in intent.

7. **Finalize with Usage Guidance**
   - Provide sample prompts per role.
   - List known limitations of auto-selection.
   - Suggest follow-up customizations (skills/prompts/instructions).

## Decision Points
- **Read-only roles?** Choose which agents must avoid edit/execute.
- **Visibility?** Decide if some agents should be hidden from picker.
- **Strictness level?** Generic reusable defaults vs project-specific hard guardrails.

## Completion Criteria
- All required files exist and are non-empty.
- Descriptions are trigger-rich and role-specific.
- Tool boundaries are minimal and intentional.
- No diagnostics in target files.
- User receives examples and next customizations.

## Output
Return:
1. Updated files
2. Role-by-role summary
3. Verification status
4. Open questions for tightening behavior
