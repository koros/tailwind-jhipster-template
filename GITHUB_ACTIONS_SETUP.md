# GitHub Actions SonarQube Setup

This guide explains how to set up automated code quality analysis using GitHub Actions.

## Choose Your Approach

### Option 1: SonarCloud (Recommended)

**Best for:** Public repositories, teams wanting managed service

**Workflow file:** `.github/workflows/sonarcloud.yml`

#### Setup Steps

1. **Create SonarCloud Account**

   - Go to https://sonarcloud.io
   - Sign up with your GitHub account
   - Authorize SonarCloud to access your repositories

2. **Import Your Repository**

   - Click "+" → "Analyze new project"
   - Select your repository
   - Follow the setup wizard

3. **Get Your Credentials**

   After importing, you'll need:

   - **Organization Key**: Found in "My Account" → "Organizations"
   - **Project Key**: Shown on project dashboard (usually `username_repo-name`)
   - **Token**: "My Account" → "Security" → "Generate Token"

4. **Add GitHub Secrets**

   In your repository, go to Settings → Secrets and variables → Actions:

   ```
   SONAR_TOKEN=your-sonarcloud-token
   SONAR_ORGANIZATION=your-organization-key
   SONAR_PROJECT_KEY=your-project-key
   ```

5. **Enable Workflow**

   The workflow in `.github/workflows/sonarcloud.yml` is ready to use!

   Simply push to `main` or open a PR to trigger analysis.

6. **Add Badges to README**

   Replace `YOUR_PROJECT_KEY` with your actual project key:

   ```markdown
   [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
   [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=coverage)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
   [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=bugs)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
   [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
   ```

---

### Option 2: Self-Hosted SonarQube

**Best for:** Private repositories, on-premise requirements

**Workflow file:** `.github/workflows/sonar-self-hosted.yml`

#### Setup Steps

1. **Deploy SonarQube Publicly**

   Your SonarQube instance must be accessible from GitHub Actions runners.

   Options:

   - Deploy to cloud provider (AWS, Azure, GCP, DigitalOcean)
   - Use ngrok/cloudflare tunnel (for testing)
   - Configure firewall to allow GitHub Actions IPs

2. **Get SonarQube Token**

   On your SonarQube instance:

   - Login as admin
   - My Account → Security → Generate Token
   - Give it a name like "GitHub Actions"
   - Copy the token

3. **Add GitHub Secrets**

   In your repository, go to Settings → Secrets and variables → Actions:

   ```
   SONAR_TOKEN=your-sonarqube-token
   SONAR_HOST_URL=https://your-sonarqube-url.com
   ```

4. **Enable Workflow**

   Rename or delete `.github/workflows/sonarcloud.yml` to avoid conflicts.

   The self-hosted workflow will run on push/PR.

5. **Add Badges to README**

   Use your SonarQube instance URL:

   ```markdown
   [![Quality Gate Status](https://your-sonarqube-url.com/api/project_badges/measure?project=myTailwindJhipster&metric=alert_status)](https://your-sonarqube-url.com/dashboard?id=myTailwindJhipster)
   [![Coverage](https://your-sonarqube-url.com/api/project_badges/measure?project=myTailwindJhipster&metric=coverage)](https://your-sonarqube-url.com/dashboard?id=myTailwindJhipster)
   ```

---

## Workflow Features

Both workflows include:

✅ **Automatic Trigger** - Runs on push to main/develop and all PRs  
✅ **Test Coverage** - Runs Jest tests with coverage before analysis  
✅ **SonarQube Scan** - Analyzes code quality, security, and coverage  
✅ **Quality Gate** - Optional quality gate check  
✅ **PR Decorations** - (SonarCloud only) Comments on PRs with issues

## Customization

### Change Trigger Branches

Edit the workflow file:

```yaml
on:
  push:
    branches:
      - main
      - develop
      - staging # Add more branches
```

### Skip Analysis on Certain Paths

Add to workflow:

```yaml
on:
  push:
    paths-ignore:
      - 'docs/**'
      - '**.md'
```

### Adjust Test Coverage

By default, the workflow runs all tests. To skip specific tests:

```yaml
- name: Run tests with coverage
  run: |
    npm test -- --coverage --watchAll=false --testPathIgnorePatterns=e2e
```

## Viewing Results

### SonarCloud

- Dashboard: https://sonarcloud.io/dashboard?id=YOUR_PROJECT_KEY
- PR comments appear automatically
- Quality gate status visible in PR checks

### Self-Hosted

- Dashboard: https://your-sonarqube-url.com/dashboard?id=myTailwindJhipster
- Check workflow logs for analysis results
- No automatic PR decorations (requires webhook setup)

## Troubleshooting

### "Shallow clone" warning

Already fixed - workflows use `fetch-depth: 0`

### Coverage not showing

1. Ensure tests run: `npm test -- --coverage`
2. Check coverage paths in `sonar-project.properties`
3. Verify `coverage/lcov.info` is generated

### Quality gate fails

1. View detailed issues on SonarQube dashboard
2. Fix code smells, bugs, or security hotspots
3. May need to adjust quality gate thresholds

### SonarCloud: "Project not found"

- Verify `SONAR_PROJECT_KEY` matches exactly
- Check project exists on sonarcloud.io
- Ensure token has correct permissions

### Self-Hosted: "Connection refused"

- Verify `SONAR_HOST_URL` is publicly accessible
- Check firewall rules
- Test with `curl $SONAR_HOST_URL/api/system/status`

## Badge Status Meanings

| Badge                                                                     | Meaning                  |
| ------------------------------------------------------------------------- | ------------------------ |
| ![Passed](https://img.shields.io/badge/Quality%20Gate-passed-brightgreen) | All quality criteria met |
| ![Failed](https://img.shields.io/badge/Quality%20Gate-failed-red)         | Quality issues detected  |
| ![Coverage 85%](https://img.shields.io/badge/Coverage-85%25-yellow)       | Test coverage percentage |
| ![0 Bugs](https://img.shields.io/badge/Bugs-0-brightgreen)                | Number of bugs found     |
| ![5 Code Smells](https://img.shields.io/badge/Code%20Smells-5-yellow)     | Maintainability issues   |

## Next Steps

1. ✅ Choose your approach (SonarCloud or Self-Hosted)
2. ✅ Follow setup steps above
3. ✅ Push code or open a PR to trigger analysis
4. ✅ Add badges to your README
5. ✅ Monitor code quality over time
6. ✅ Set up quality gates in SonarQube settings

## Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SonarQube Badges API](https://docs.sonarqube.org/latest/user-guide/project-badges/)
