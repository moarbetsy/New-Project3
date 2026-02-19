# Research Findings: React Folder Structure & Architecture

## Source: Robin Wieruch - React Folder Structure in 5 Steps [2025]

### Key Insights

#### 5-Step Progression for React Projects

**Step 1: Single File**
- Start with everything in one file (e.g., `src/app.js`)
- Acceptable for small projects and prototypes
- Multiple components in one file is tolerable if closely related

**Step 2: Multiple Files**
- Split components into separate files
- Rule of thumb: Extract when component becomes reusable
- Keep tightly coupled components together (e.g., List and ListItem)
- Use kebab-case for file names (e.g., `list-item.js`)

**Step 3: Folders for Components**
- Create one folder per component as complexity grows
- Each component folder contains:
  - `component.js` - Implementation
  - `test.js` - Tests
  - `style.css` - Styles
  - `index.js` - Public API (barrel file)

**Step 4: Technical Separation**
- Group by technical concerns within folders
- Separate: components, hooks, utils, constants, types
- Example structure:
  ```
  src/
  --- components/
  --- hooks/
  --- utils/
  --- constants/
  --- types/
  ```

**Step 5: Feature-Based Structure**
- Group by features/domains for large applications
- Each feature is self-contained module
- Example:
  ```
  src/
  --- features/
  ----- authentication/
  ----- dashboard/
  ----- profile/
  --- shared/
  ----- components/
  ----- hooks/
  ----- utils/
  ```

### Important Considerations

**Barrel Files (index.js)**
- Controversial in modern JavaScript
- Can make tree-shaking harder for bundlers
- Only export public API, not implementation details
- Consider omitting for better tree-shaking

**File Naming Conventions**
- Component files: `component.js` or `ComponentName.js`
- Test files: `test.js` or `spec.js` or `ComponentName.test.js`
- Style files: `style.css` or `styles.css` or `ComponentName.module.css`
- Use consistent convention across project

**When to Split Components**
- Component becomes reusable elsewhere
- File exceeds 200-300 lines
- Component has multiple responsibilities
- Testing becomes difficult

### Best Practices Extracted

1. **Start simple, evolve gradually** - Don't over-engineer early
2. **Colocation** - Keep related files close together
3. **Public APIs** - Define clear boundaries between modules
4. **Consistency** - Choose conventions and stick to them
5. **Scalability** - Structure should support growth without major refactoring

---

**Next Research Topics:**
- State management patterns (Zustand, Redux Toolkit, Context)
- Performance optimization techniques
- TypeScript integration best practices
- Testing strategies for React applications
