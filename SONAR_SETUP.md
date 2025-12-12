# SonarQube Setup Guide

## Quick Start

### For Local Development

1. **Start SonarQube:**

   ```bash
   npm run sonar:up
   ```

   Wait ~60 seconds for SonarQube to start

2. **Access SonarQube:**
   Open http://localhost:9001 in your browser

   - Default credentials: `admin / admin`

3. **Run Analysis (Token-less mode):**

   ```bash
   npm run sonar:analyze
   ```

   Since `SONAR_FORCEAUTHENTICATION=false`, no token is needed!

4. **View Results:**
   Check http://localhost:9001/dashboard?id=myTailwindJhipster

### For CI/CD Pipelines

1. **Generate Token (one time):**

   ```bash
   npm run sonar:setup
   ```

   This creates `.env.sonar` with your token

2. **Load Environment:**

   ```bash
   source .env.sonar
   ```

3. **Run Analysis:**
   ```bash
   npm run sonar:analyze
   ```

### All-in-One CI Command

For automated CI/CD workflows:

```bash
npm run sonar:ci
```

This will: start SonarQube → generate token → run analysis

## Available Scripts

| Script                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run sonar:up`      | Start SonarQube container                  |
| `npm run sonar:down`    | Stop SonarQube container                   |
| `npm run sonar:setup`   | Generate API token (saves to `.env.sonar`) |
| `npm run sonar:analyze` | Run code analysis                          |
| `npm run sonar:ci`      | Full CI workflow (up + setup + analyze)    |
| `npm run sonar:clean`   | Stop and remove all data                   |
| `npm run sonar:install` | Install sonar-scanner globally             |

## Configuration

### Environment Variables

The setup script creates `.env.sonar` with:

```bash
SONAR_HOST_URL=http://localhost:9001
SONAR_TOKEN=your-generated-token
```

### Sonar Project Properties

Edit `sonar-project.properties` to customize:

- Project key and name
- Source directories
- Test patterns
- Coverage reports
- Exclusions

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: SonarQube Analysis
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
  run: npm run sonar:analyze
```

### GitLab CI Example

```yaml
sonarqube:
  script:
    - npm run sonar:ci
  variables:
    SONAR_TOKEN: $SONAR_TOKEN
```

## Troubleshooting

### Can't access http://localhost:9001

1. Check container is running:

   ```bash
   docker ps | grep sonarqube
   ```

2. Check container logs:

   ```bash
   docker logs sonarqube
   ```

3. Wait longer - SonarQube can take 60-90 seconds to fully start

### Token generation fails

1. Ensure SonarQube is fully started (check logs)
2. Verify default credentials work: `admin / admin`
3. Try accessing the UI first: http://localhost:9001

### Analysis fails with "Insufficient privileges"

Two options:

1. Use token: `source .env.sonar && npm run sonar:analyze`
2. Keep token-less mode with `SONAR_FORCEAUTHENTICATION=false` (dev only)

## Production Recommendations

For production environments:

1. **Enable authentication:**
   Set `SONAR_FORCEAUTHENTICATION=true` in `docker/sonar.yml`

2. **Use secure tokens:**
   Store `SONAR_TOKEN` in your CI/CD secrets manager

3. **Change admin password:**
   Set `SONAR_ADMIN_PASSWORD` to a strong password

4. **Use external database:**
   Configure PostgreSQL instead of embedded H2

5. **Enable HTTPS:**
   Use reverse proxy (nginx) with SSL certificates

## Clean Up

Remove all SonarQube data and start fresh:

```bash
npm run sonar:clean
```

This removes containers and volumes.
