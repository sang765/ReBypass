# GitHub Actions Workflows

This directory contains GitHub Actions workflows that automate various tasks for the ReBypass project.

## Auto Label Issues Workflow

The `label-issues.yml` workflow automatically applies labels to issues based on their content and template used.

### How it works

1. **Trigger**: The workflow runs when issues are opened or edited
2. **Processing**: Uses the `actions/labeler` action to analyze issue content
3. **Labeling**: Applies appropriate labels based on:
   - Issue template metadata (YAML frontmatter)
   - Keywords in issue titles and descriptions
   - Environment information (platform, browser, etc.)

### Label Configuration

Labels are defined in `.github/labeler.yml`:

#### Template-based Labels
- **Bug Reports**: Automatically labeled with `Bug`
- **Feature Requests**: Labeled with `Featured Request` and `enhancement`
- **Questions**: Labeled with `Question` and `Help Wanted`

#### Status Labels
- `Complete` - This is complete fix the issue
- `Closed (Impossible)` - The issue has been closed due to impossibility
- `Duplicate` - This issue or pull request already exists
- `Invalid` - This doesn't seem right
- `Wontfix` - This will not be worked on
- `TODO` - Todo for issue list

#### Browser Labels
- `Gecko` - Mask as gecko browser like Firefox, Zen Browser, etc...
- `Chromium` - Masking as chromium browser like Chrome, Edge, etc...
- `Firefox`, `Chrome`, `Edge`, `Safari`, `Brave`, `Opera`, `Vivaldi` - Specific browser labels

#### Platform Labels
- `Windows`, `Linux`, `macOS`, `Android`, `iOS`, `iPadOS`, `watchOS`, `tvOS`
- `FreeBSD`, `OpenBSD`, `NetBSD`
- `Ubuntu`, `Debian`, `CentOS`, `Red Hat`, `Fedora`, `Arch`, `Gentoo`
- Windows versions: `Windows 10`, `Windows 11`, `Windows 8`, `Windows 7`, etc.
- macOS versions: `macOS Monterey`, `macOS Big Sur`, `macOS Catalina`, etc.

#### Special Labels
- `Documentation` - Improvements or additions to documentation
- `Good First Issue` - Good for newcomers
- `Frist Pull Request` - First pull request from this user
- `Security` - Security-related issues

#### Keywords-based Labels
Labels are also applied based on keywords found in issue titles and descriptions.

### Issue Templates

The project includes three issue templates:

1. **Bug Report** (`bug_report.md`) - For reporting bugs (labeled with `Bug`)
2. **Feature Request** (`feature_request.md`) - For suggesting new features (labeled with `Featured Request`, `enhancement`)
3. **Question/Help** (`question.md`) - For asking questions or requesting help (labeled with `Question`, `Help Wanted`)

Each template includes YAML frontmatter that defines default labels and metadata.

### Customization

To modify labeling behavior:

1. Edit `.github/labeler.yml` to change label rules
2. Update issue templates to change default labels
3. Add new templates as needed for different issue types