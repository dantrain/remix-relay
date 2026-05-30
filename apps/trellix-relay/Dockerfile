# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.22.3
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# Throw-away build stage to reduce size of final image
FROM base AS build

# Copy application code
COPY --link . .

# Remove the workspace imports, they are already bundled
RUN sed -i '/workspace:*/d' package.json

# pnpm 11 no longer reads settings from the "pnpm" field in package.json, so the
# patches this standalone build needs live in a pnpm-workspace.yaml generated
# here (it is not committed, to avoid being treated as a second workspace root
# inside the monorepo). Build scripts are explicitly reviewed (set to false, as
# these packages ship prebuilt binaries and do not need to build) so pnpm does
# not print an "Ignored build scripts" warning. strictDepBuilds is disabled so
# any future unreviewed build-script dependency degrades to a warning rather
# than failing the deploy.
RUN cat > pnpm-workspace.yaml <<'EOF'
minimumReleaseAgeExclude:
  - '@cloudflare/workers-types'
strictDepBuilds: false
allowBuilds:
  '@apollo/protobufjs': false
  better-sqlite3: false
  esbuild: false
  sharp: false
  workerd: false
patchedDependencies:
  '@pothos/core@4.12.0': patches/@pothos__core@4.12.0.patch
  '@apollo/server@5.5.1': patches/@apollo__server@5.5.1.patch
EOF

# Install node modules
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "start" ]
