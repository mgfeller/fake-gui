# Fake GUI

The example configuration below uses Auth0 for OIDC and OAuth2.

The "Default App" is a Regular Web App and corresponds to the OIDC_CLIENT_ID in the configuration.

It is authorized to use the Custom API with the identifier `api://fake-api-csharp`. 

`.envrc` example:

```
export WRAP_LOG=1
export APP_BASE_URL=http://localhost:3000
export OIDC_ISSUER=https://dev-f4e4a502196b.eu.auth0.com
export OIDC_WELL_KNOWN_URL=$OIDC_ISSUER/oauth2/.well-known
export OIDC_CONFIG_URL=$OIDC_WELL_KNOWN_URL/openid-configuration
export OIDC_CLIENT_ID=940447d1056fb818b949c5c236f9fc3221aa8861d94b5e6eba45dffd7a582ff5
export OIDC_AUDIENCE=api://fake-api-csharp
export OIDC_CLIENT_SECRET=ff95af44c424ab8e0c383e381685c642d2bd9808d1bf9611c9b2139dcdd200df
export OIDC_SCOPES="openid profile email"
export OIDC_REDIRECT_URI=http://localhost:3000/auth/callback
```

```
docker build -t fake-gui .
```

```
docker run -p 3000:3000 fake-gui
```