# myTailwindJhipster

This application was generated using JHipster 8.11.0, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v8.11.0](https://www.jhipster.tech/documentation-archive/v8.11.0).

## Project Structure

This application uses a Node.js/Express backend with TypeORM instead of the traditional Java/Spring Boot backend.

Node is required for generation and recommended for development. `package.json` is always generated for a better development experience with prettier, commit hooks, scripts and so on.

In the project root, JHipster generates configuration files for tools like git, prettier, eslint, husky, and others that are well known and you can find references in the web.

**Directory Structure:**

- `/src/main/webapp` - React frontend application
- `/src/main/server` - Node.js/Express backend with TypeORM
- `/src/main/docker` - Docker configurations for the application and services

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if omitted) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

- `npmw` - wrapper to use locally installed npm.
  JHipster installs Node and npm locally using the build tool by default. This wrapper makes sure npm is installed locally and uses it avoiding some differences different versions can cause. By using `./npmw` instead of the traditional `npm` you can configure a Node-less environment to develop or test your application.
- `/src/main/docker` - Docker configurations for the application and services that the application depends on

## Development

### Prerequisites

- Node.js >= 22.15.0
- npm
- PostgreSQL database

### Setup

1. Install dependencies for both frontend and backend:

```bash
npm install
cd src/main/server && npm install
```

2. Set up your database connection in `src/main/server/.env`:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

3. Run database migrations:

```bash
npm run migration:run
```

### Running the Application

Run the following commands to start the development servers:

```bash
# Terminal 1 - Start the Node.js backend (port 8080)
npm run server:dev

# Terminal 2 - Start the React frontend (port 9000)
npm start
```

The application will be available at `http://localhost:9000`

### Available Commands

**Backend (Node.js/Express) - Run from root:**

```bash
npm run server:build          # Build TypeScript
npm run server:dev            # Start development server with hot reload
npm run server:start          # Start production server
npm run server:seed           # Seed database with initial data
npm run server:lint           # Run ESLint on backend code

# Database migrations
npm run migration:generate    # Generate migration from entity changes
npm run migration:create      # Create empty migration file
npm run migration:run         # Run pending migrations
npm run migration:revert      # Rollback last migration
npm run migration:show        # Show migration status
```

**Frontend (React) - Run from root:**

```bash
npm start                     # Start development server
npm run build                 # Build for production
npm run lint                  # Run ESLint
npm run lint:fix              # Fix ESLint errors
npm test                      # Run tests
npm run prettier:format       # Format code
```

**Legacy commands (still available):**

```bash
npm run backend:start         # Same as server:dev
npm run backend:build         # Same as server:build
npm run backend:seed          # Same as server:seed
```

### Tailwind CSS Migration

This project has successfully migrated from Bootstrap/Reactstrap to Tailwind CSS.

**Completed:**

- ✅ Bootstrap and Reactstrap dependencies removed from `package.json`
- ✅ Bootstrap imports removed from `src/main/webapp/app/app.scss`
- ✅ Tailwind CSS configured with extended theme (colors: brand #533f03, navbar #353d47, accent #009cd8)
- ✅ Tailwind preflight enabled for consistent base styles
- ✅ Custom component library created (`Button`, `Badge`, `Card`, `Modal` with subcomponents)
- ✅ Core components migrated (11 files including user-management, todo entities, health, login)
- ✅ RTL support preserved via `postcss-rtlcss` and `setTextDirection` locale handling

**Component Library:**

Custom Tailwind components are available in `app/shared/components/`:

- `Button`: Supports 9 variants (primary, secondary, info, success, warning, danger, light, dark, link), multiple sizes, and router integration
- `Badge`: Pill-shaped badges with 7 color variants
- `Card`: Simple container with consistent styling
- `Modal`: Full-featured modal with Header/Body/Footer subcomponents

**Usage:**

```tsx
import { Button, Badge, Card, Modal, ModalHeader, ModalBody, ModalFooter } from 'app/shared/components';

// Button example
<Button variant="primary" size="lg">Click me</Button>
<Button tag={Link} to="/path" variant="info">Navigate</Button>

// Badge example
<Badge variant="success">Active</Badge>

// Modal example
<Modal isOpen={isOpen} toggle={handleClose}>
  <ModalHeader toggle={handleClose}>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
  </ModalFooter>
</Modal>
```

**RTL Support:**

- Locale toggle sets `<html dir="rtl"|"ltr">`
- `postcss-rtlcss` automatically transforms directional utilities (e.g., `ml-4` becomes `mr-4` in RTL)
- Supports 50+ locales including `ar-ly` for Arabic

**Remaining Work:**

Some files still contain Reactstrap imports and need migration:

- Navigation components (header, menus) - using `Navbar`, `Nav`, `DropdownMenu`
- Account pages - using `Row`, `Col`, `Alert`, `Form`
- Admin pages - using `Table`, `Input`, `FormText`
- Footer component

These will cause runtime errors if accessed. Migration pattern:

- Replace `Row`/`Col` with Tailwind flex/grid utilities
- Replace `Alert` with custom Tailwind alert component or toast notifications
- Replace `Form` with standard HTML forms
- Replace `Table` with Tailwind table structure

Npm is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](package.json). You can also run `./npmw update` and `./npmw install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `./npmw help update`.

The `./npmw run` command will list all the scripts available to run for this project.

### Administration Menu (Customized)

This Node.js adaptation removes Java/Spring-specific administration features that relied on endpoints not implemented in this backend.

Active administration items:

- User Management – manage users and authorities
- Health – system health check via `/management/health`
- API – embedded Swagger UI via `/admin/docs`

Removed legacy items (Spring Boot specific):

- Metrics (Spring Actuator metrics)
- Configuration (Spring environment/config props)
- Logs (dynamic log level management)
- Database (H2 console)

Potential future equivalents:

- Process metrics (Node memory, uptime)
- Sanitized environment inspection
- Dynamic logger level controls

Currently only actively supported features are shown to keep the UI clean.

### Authentication (Cookie-based Refresh Tokens)

The application now uses a short-lived JWT access token (stored in memory / session/local storage depending on "Remember me") and a long-lived refresh token stored exclusively in an HttpOnly, SameSite=Strict cookie.

Key points:

- Login (`POST /api/authenticate`) sets `refreshToken` HttpOnly cookie and returns only `id_token` in the JSON + `Authorization: Bearer` header.
- Refresh (`POST /api/refresh-token`) requires no body; the cookie is sent automatically (`axios.defaults.withCredentials = true`). It rotates both the access and refresh tokens and re-sets the cookie.
- Logout (`POST /api/logout`) clears the cookie and invalidates the hashed refresh token server-side.
- Refresh tokens are hashed (bcrypt) before persistence; the database never stores plaintext refresh tokens.
- Frontend removed all storage of refresh tokens (legacy keys are cleaned up). Multi-tab sessions now remain valid because the cookie is shared across tabs; only the access token is duplicated per tab.

Security improvements vs previous implementation:

1. Eliminates exposure of refresh token to JavaScript (mitigates XSS exfiltration risk).
2. Rotates refresh token on every use, shrinking replay window.
3. Strict cookie attributes: `HttpOnly`, `SameSite=Strict`, and `Secure` in production reduce CSRF and network interception risks.

Operational notes:

- If the refresh cookie is missing or invalid the interceptor triggers logout.
- Remember-me extends refresh token lifetime (4x) exactly as before but via cookie max-age.
- To invalidate all sessions for a user, clear the hashed refresh token column (`refreshToken`) in `jhi_user` or call logout while authenticated.

Future hardening options (not yet implemented):

- Maintain a refresh token version / rotation counter to instantly revoke older tokens.
- Add IP / UA binding metadata to detect anomalous refresh attempts.
- Implement sliding session expiry (shorten max lifetime after inactivity).

### PWA Support

JHipster ships with PWA (Progressive Web App) support, and it's turned off by default. One of the main components of a PWA is a service worker.

The service worker initialization code is commented out by default. To enable it, uncomment the following code in `src/main/webapp/index.html`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(function () {
      console.log('Service Worker Registered');
    });
  }
</script>
```

Note: [Workbox](https://developers.google.com/web/tools/workbox/) powers JHipster's service worker. It dynamically generates the `service-worker.js` file.

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

```
./npmw install --save --save-exact leaflet
```

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

```
./npmw install --save-dev --save-exact @types/leaflet
```

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Note: There are still a few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

## Building for production

### Packaging as jar

To build the final jar and optimize the myTailwindJhipster application for production, run:

```
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```
./mvnw -Pprod,war clean verify
```

### JHipster Control Center

JHipster Control Center can help you manage and control your application(s). You can start a local control center server (accessible on http://localhost:7419) with:

```
docker compose -f src/main/docker/jhipster-control-center.yml up
```

## Testing

### Spring Boot tests

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest][]. They're located near components and can be run with:

```
./npmw test
```

## Others

### Code quality using Sonar

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker compose -f src/main/docker/sonar.yml up -d
```

Note: we have turned off forced authentication redirect for UI in [src/main/docker/sonar.yml](src/main/docker/sonar.yml) for out of the box experience while trying out SonarQube, for real use cases turn it back on.

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner) or by using the maven plugin.

Then, run a Sonar analysis:

```
./mvnw -Pprod clean verify sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

If you need to re-run the Sonar phase, please be sure to specify at least the `initialize` phase since Sonar properties are loaded from the sonar-project.properties file.

```
./mvnw initialize sonar:sonar -Dsonar.login=admin -Dsonar.password=admin
```

Additionally, Instead of passing `sonar.password` and `sonar.login` as CLI arguments, these parameters can be configured from [sonar-project.properties](sonar-project.properties) as shown below:

```
sonar.login=admin
sonar.password=admin
```

For more information, refer to the [Code quality page][].

### Docker Compose support

JHipster generates a number of Docker Compose configuration files in the [src/main/docker/](src/main/docker/) folder to launch required third party services.

For example, to start required services in Docker containers, run:

```
docker compose -f src/main/docker/services.yml up -d
```

To stop and remove the containers, run:

```
docker compose -f src/main/docker/services.yml down
```

[Spring Docker Compose Integration](https://docs.spring.io/spring-boot/reference/features/dev-services.html) is enabled by default. It's possible to disable it in application.yml:

```yaml
spring:
  ...
  docker:
    compose:
      enabled: false
```

You can also fully dockerize your application and all the services that it depends on.
To achieve this, first build a Docker image of your app by running:

```sh
npm run java:docker
```

Or build a arm64 Docker image when using an arm64 processor os like MacOS with M1 processor family running:

```sh
npm run java:docker:arm64
```

Then run:

```sh
docker compose -f src/main/docker/app.yml up -d
```

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the Docker Compose sub-generator (`jhipster docker-compose`), which is able to generate Docker configurations for one or several JHipster applications.

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 8.11.0 archive]: https://www.jhipster.tech/documentation-archive/v8.11.0
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v8.11.0/development/
[Using Docker and Docker-Compose]: https://www.jhipster.tech/documentation-archive/v8.11.0/docker-compose
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v8.11.0/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v8.11.0/running-tests/
[Code quality page]: https://www.jhipster.tech/documentation-archive/v8.11.0/code-quality/
[Setting up Continuous Integration]: https://www.jhipster.tech/documentation-archive/v8.11.0/setting-up-ci/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Webpack]: https://webpack.github.io/
[BrowserSync]: https://www.browsersync.io/
[Jest]: https://jestjs.io
[Leaflet]: https://leafletjs.com/
[DefinitelyTyped]: https://definitelytyped.org/
