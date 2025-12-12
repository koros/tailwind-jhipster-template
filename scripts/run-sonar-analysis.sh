#!/bin/bash

# SonarQube Analysis Script
# Automatically loads token from .env.sonar if it exists

set -e

ENV_FILE=".env.sonar"

# Load token from .env.sonar if it exists
if [ -f "$ENV_FILE" ]; then
  echo "📋 Loading configuration from $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Check if token is set, if not use empty (for token-less mode)
if [ -z "$SONAR_TOKEN" ]; then
  echo "⚠️  No SONAR_TOKEN found - running in token-less mode"
  echo "   Make sure SONAR_FORCEAUTHENTICATION=false in docker/sonar.yml"
else
  echo "✅ Using SONAR_TOKEN for authenticated analysis"
fi

# Run sonar scanner
echo "🔍 Running SonarQube analysis..."
sonar-scanner -Dsonar.login="${SONAR_TOKEN:-}"
