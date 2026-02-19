# Research Findings: TypeScript Best Practices for React

## Source: LogRocket - React & TypeScript: 10 Patterns for Writing Better Code

### Key TypeScript Patterns for React

#### 1. Typed Component Props
- **Interfaces vs Types**: Use interfaces for extensibility, types for unions/intersections
- **Required vs Optional**: Props are required by default, use `?` for optional
- **Children Typing**: Use `React.ReactNode` for children prop
- **Default Props**: Use default parameters in functional components

```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ 
  required, 
  optional = 10,
  children 
}) => { /* ... */ };
```

#### 2. Discriminated Unions for State Management
- Model different states (loading, success, error) with type safety
- Use a discriminator field (e.g., `status`) to distinguish types
- TypeScript narrows types based on discriminator value
- Prevents accessing wrong properties for current state

```typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; message: string };
type DataState<T> = LoadingState | SuccessState<T> | ErrorState;
```

#### 3. Exhaustive Checking with `never`
- Ensures all union cases are handled
- Compiler error if new case added but not handled
- Use in switch default or if/else final branch
- Prevents runtime errors from unhandled states

#### 4. Type Inference with ReturnType and typeof
- `ReturnType<T>`: Extract return type from function
- `typeof`: Infer types from constants or functions
- Reduces duplication and maintains single source of truth
- Useful for API response types

#### 5. Utility Types
- **Pick<T, K>**: Select subset of properties
- **Omit<T, K>**: Exclude specific properties
- **Partial<T>**: Make all properties optional
- **Record<K, T>**: Create object type with specific keys/values

#### 6. Generic Components and Hooks
- Write reusable components that work with multiple types
- Type parameters provide flexibility while maintaining safety
- Useful for lists, forms, data displays

#### 7. Typing Refs and DOM Elements
- Use `React.RefObject<HTMLElement>` for refs
- Specific element types: `HTMLInputElement`, `HTMLDivElement`, etc.
- Enables proper autocomplete and type checking

#### 8. Strongly Typed Context
- Define context type explicitly
- Handle undefined states properly
- Create custom hooks for context consumption

### Benefits of TypeScript in React

**Code Quality**
- Early error detection at compile time
- Self-documenting code through types
- Better refactoring confidence

**Developer Experience**
- Superior IDE support (autocomplete, navigation)
- Reduced cognitive load
- Fewer runtime bugs

**Maintainability**
- Easier onboarding for new developers
- Clear contracts between components
- Scalable architecture

### Best Practices Summary

1. **Always use strict mode** in tsconfig.json
2. **Prefer interfaces** for component props (extensible)
3. **Use discriminated unions** for complex state
4. **Leverage utility types** to reduce duplication
5. **Type all props explicitly** - avoid `any`
6. **Use generics** for reusable components
7. **Implement exhaustive checking** for unions
8. **Type context properly** with default values
9. **Use proper DOM element types** for refs
10. **Infer types from APIs** to reduce maintenance

---

**Next Research Topics:**
- Performance optimization techniques
- Security best practices (CSP, SRI)
- Accessibility (WCAG 2.1 AA compliance)
- Testing strategies (Vitest, React Testing Library)
