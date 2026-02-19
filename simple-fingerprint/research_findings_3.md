# Research Findings: Web Application Security Best Practices

## Content Security Policy (CSP)

### Overview
Content Security Policy is a security feature that helps prevent or minimize cross-site scripting (XSS) attacks, clickjacking, and other code injection attacks by controlling which resources a document can load.

### Implementation Methods

**HTTP Header (Recommended)**
```
Content-Security-Policy: default-src 'self'; img-src 'self' example.com
```

**HTML Meta Tag (Alternative)**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```

### Key CSP Directives

**Fetch Directives** - Control resource loading:
- `default-src` - Fallback for all resource types
- `script-src` - JavaScript sources
- `style-src` - CSS stylesheet sources
- `img-src` - Image sources
- `font-src` - Font sources
- `connect-src` - AJAX, WebSocket, EventSource
- `media-src` - Audio/video sources
- `object-src` - `<object>`, `<embed>`, `<applet>`
- `frame-src` - Frame sources

**Other Important Directives**:
- `base-uri` - Restricts `<base>` element URLs
- `form-action` - Restricts form submission targets
- `frame-ancestors` - Clickjacking protection
- `upgrade-insecure-requests` - Upgrades HTTP to HTTPS

### Source Expression Types

**Keywords** (must be quoted):
- `'none'` - Block all resources
- `'self'` - Same-origin only
- `'unsafe-inline'` - Allow inline scripts/styles (NOT RECOMMENDED)
- `'unsafe-eval'` - Allow eval() (NOT RECOMMENDED)

**Nonces** (Recommended for scripts/styles):
```
Content-Security-Policy: script-src 'nonce-{random-value}'
```
```html
<script nonce="{random-value}">/* code */</script>
```

**Requirements for nonces**:
- Must be cryptographically random
- Must be different for every HTTP response
- Must be unpredictable
- Requires server-side templating (cannot use static HTML)

**Hashes** (For static inline scripts):
```
Content-Security-Policy: script-src 'sha256-{base64-hash}'
```
- Calculate hash of script contents (SHA-256, SHA-384, or SHA-512)
- Base64 encode the result
- Add to CSP with algorithm prefix

**Host-based**:
- `example.com` - Specific domain
- `*.example.com` - All subdomains
- `https://example.com` - Specific protocol + domain

### Strict CSP Pattern (Recommended)

**Best practice for modern applications**:
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'nonce-{random}' 'strict-dynamic';
  style-src 'nonce-{random}';
  object-src 'none';
  base-uri 'none';
```

Benefits:
- Nonce-based approach prevents XSS
- `'strict-dynamic'` allows dynamically loaded scripts
- Blocks dangerous features (eval, inline handlers)
- Prevents clickjacking

### XSS Attack Vectors CSP Protects Against

1. **External malicious scripts**: Blocks unauthorized script sources
2. **Inline script tags**: Requires nonce or hash
3. **Inline event handlers**: Blocked by default (onclick, onerror, etc.)
4. **javascript: URLs**: Blocked by default
5. **Dangerous APIs**: Can block eval(), setTimeout(string), etc.

### Testing and Deployment

**Report-Only Mode** (for testing):
```
Content-Security-Policy-Report-Only: default-src 'self'
```
- Doesn't enforce policy
- Reports violations to specified endpoint
- Use to test before enforcing

**Violation Reporting**:
```
Content-Security-Policy: default-src 'self'; report-uri /csp-violation-report
```

### CSP Deployment Strategy

1. **Start with Report-Only mode**
2. **Monitor violation reports**
3. **Refine policy based on legitimate violations**
4. **Gradually enforce policy**
5. **Continuously monitor and update**

---

## Subresource Integrity (SRI)

### Overview
SRI is a security feature that enables browsers to verify that resources fetched from CDNs are delivered without unexpected manipulation.

### Implementation

**Basic syntax**:
```html
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

### How SRI Works

1. **Generate hash** of resource content
2. **Add integrity attribute** with hash to HTML tag
3. **Browser fetches resource** from CDN
4. **Browser calculates hash** of fetched content
5. **Browser compares hashes** - if match, resource loads; if not, blocked

### Hash Generation

**Using OpenSSL**:
```bash
cat library.js | openssl dgst -sha384 -binary | openssl base64 -A
```

**Using online tools**:
- SRI Hash Generator websites
- Build tools can automate this

### Supported Algorithms
- SHA-256 (minimum)
- SHA-384 (recommended)
- SHA-512 (most secure)

### Multiple Hashes
Can provide multiple hashes for fallback:
```html
<script 
  integrity="sha384-hash1 sha512-hash2"
  ...>
</script>
```

### CORS Requirement
Must include `crossorigin` attribute for cross-origin resources:
```html
<script src="https://cdn.com/lib.js" 
  integrity="sha384-..." 
  crossorigin="anonymous">
</script>
```

### Benefits of SRI

1. **CDN compromise protection** - Prevents modified scripts from executing
2. **Supply chain security** - Verifies third-party resources
3. **Integrity verification** - Ensures resources haven't been tampered with
4. **Defense in depth** - Additional layer beyond HTTPS

### Limitations

- Requires updating hashes when resources change
- Only works for resources with integrity attribute
- Doesn't protect against vulnerabilities in the original library
- Requires CORS for cross-origin resources

### Best Practices

1. **Always use SRI for CDN resources**
2. **Use SHA-384 or SHA-512** for stronger security
3. **Automate hash generation** in build process
4. **Include crossorigin attribute** for cross-origin resources
5. **Monitor for integrity failures** in production
6. **Keep hashes updated** when upgrading libraries

---

## Combined Security Strategy

**Layered Security Approach**:
1. **CSP** - Controls what resources can load and execute
2. **SRI** - Verifies integrity of external resources
3. **HTTPS** - Encrypts data in transit
4. **Input Sanitization** - Prevents injection attacks
5. **Output Encoding** - Safely renders user content

**Defense in Depth**: Each layer provides protection even if others fail.

---

**Next Research Topics:**
- Performance optimization (code splitting, lazy loading)
- Accessibility (WCAG 2.1 AA implementation)
- Modern build tools (Vite, esbuild)
- Testing frameworks (Vitest, Playwright)
