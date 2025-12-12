#!/bin/bash

# SonarQube Setup Script
# Automates token generation for CI/CD pipelines
# Usage: ./scripts/setup-sonar.sh

set -e

SONAR_HOST="${SONAR_HOST:-http://localhost:9001}"
SONAR_USER="${SONAR_USER:-admin}"
SONAR_PASS="${SONAR_PASS:-admin}"
TOKEN_NAME="jhipster-token-$(date +%Y%m%d)"
ENV_FILE=".env.sonar"

echo "🔧 Setting up SonarQube..."
echo "Host: $SONAR_HOST"

# Wait for SonarQube to be ready
echo "⏳ Waiting for SonarQube to start..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s -f "$SONAR_HOST/api/system/status" > /dev/null 2>&1; then
    STATUS=$(curl -s "$SONAR_HOST/api/system/status" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    if [ "$STATUS" = "UP" ]; then
      echo "✅ SonarQube is ready!"
      break
    fi
  fi
  
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "   Attempt $RETRY_COUNT/$MAX_RETRIES - Waiting..."
  sleep 5
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ SonarQube failed to start after $MAX_RETRIES attempts"
  echo "   Please check: docker logs sonarqube"
  exit 1
fi

# Check if authentication is enabled
AUTH_CHECK=$(curl -s -w "%{http_code}" -o /dev/null "$SONAR_HOST/api/authentication/validate")

if [ "$AUTH_CHECK" = "401" ] || [ "$AUTH_CHECK" = "200" ]; then
  echo "🔑 Generating API token..."
  
  # Generate token using SonarQube API
  RESPONSE=$(curl -s -u "$SONAR_USER:$SONAR_PASS" \
    -X POST "$SONAR_HOST/api/user_tokens/generate?name=$TOKEN_NAME" 2>/dev/null || true)
  
  if [ -z "$RESPONSE" ]; then
    echo "⚠️  Token generation not available or auth disabled"
    echo "   For token-less analysis, ensure SONAR_FORCEAUTHENTICATION=false"
    echo ""
    echo "💡 You can still run analysis without a token in dev mode"
    exit 0
  fi
  
  # Extract token from response
  TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$TOKEN" ]; then
    # Save token to .env.sonar file
    echo "SONAR_TOKEN=$TOKEN" > "$ENV_FILE"
    echo "SONAR_HOST_URL=$SONAR_HOST" >> "$ENV_FILE"
    
    echo "✅ Token generated and saved to $ENV_FILE"
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Load the environment: source $ENV_FILE"
    echo "  2. Run analysis: npm run sonar:analyze"
    echo "  3. View results: $SONAR_HOST"
    echo ""
    echo "For CI/CD, set SONAR_TOKEN as environment variable"
  else
    echo "❌ Failed to extract token from response"
    echo "   Response: $RESPONSE"
    exit 1
  fi
else
  echo "⚠️  Authentication is disabled (dev mode)"
  echo "   You can run analysis without a token"
  echo ""
  echo "Next steps:"
  echo "  1. Run analysis: npm run sonar:analyze"
  echo "  2. View results: $SONAR_HOST"
fi
