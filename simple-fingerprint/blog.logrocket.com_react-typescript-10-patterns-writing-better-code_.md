# React & TypeScript: 10 patterns for writing better code - LogRocket Blog

**URL:** https://blog.logrocket.com/react-typescript-10-patterns-writing-better-code/

---

Advisory boards aren’t only for executives. Join the LogRocket Content Advisory Board today →
BLOG
FEATURES
SOLUTIONS
START MONITORING FOR FREE
SIGN IN
Jul 10, 2025 ⋅ 11 min read
React & TypeScript: 10 patterns for writing better code
Peter Aideloje
I'm a passionate developer and technical writer whose interest aligns with full-stack software engineering, specifically Java, Csharp, and other frontend stacks like HTML5, CSS3, and JavaScript.
Table of contents
Benefits of using TypeScript in React
Typed component props and default props
Using discriminated unions for conditional rendering
What are discriminated unions, and when should you use them?
Exhaustive checking with the never type
Inferring types from APIs with ReturnType and typeOf
Using typeOf to infer types from functions or constants
Leveraging ReturnType<T> for function results
Extracting types from services and utility functions
Utility types: Pick, Omit, Partial, Record
Practical use cases for each utility type
Generic components and hooks
Writing reusable components with generics
Typing Refs and DOM elements
Context with strong typing
Using createContext with default values and undefined checks
Conclusion
See how LogRocket's Galileo AI surfaces the most severe issues for you
No signup required
Check it out

Building a scalable and maintainable React application is often accompanied by a series of challenges, including a lack of type safety, growing pains as projects expand, unreliable prop validation, and brittle DOM manipulation. While most of these issues can be handled by plain JavaScript, it lacks the guardrails required for long-term confidence in your codebase. That’s where TypeScript comes in to solve these recurring issues in a consistent and scalable way.

In this article, we’ll explore several proven patterns for writing safer, cleaner, and more readable code in React and TypeScript.

🚀 Sign up for The Replay newsletter

The Replay is a weekly newsletter for dev and engineering leaders.

Delivered once a week, it's your curated guide to the most important conversations around frontend dev, emerging AI tools, and the state of modern software.

Benefits of using TypeScript in React

TypeScript offers several advantages when used with a React application, including code quality and developer productivity:

Maintainability: It makes code more readable and self-documenting, which helps teams manage and scale projects effectively
Early error detection: It identifies bugs at compile time, allowing developers to resolve issues before they even affect end users
Better tooling: It provides superior IDE support with features like auto-completion, refactoring, and code navigation for a smoother development experience
Type safety: Catches type-related errors during development, reducing runtime bugs and improving code reliability
Confidence in refactoring: It enables safer code changes by ensuring that incorrect type usage is flagged immediately
Typed component props and default props

In TypeScript, interfaces are useful when describing component props, especially when you need to extend or implement them in multiple places. Here’s how you can declare and use props with an interface:

   import React from 'react';

   interface MyEmployeeProps {
     name: string;
     age: number;
     isEmployed?: boolean; // Optional property
   }

   const MyEmployee: React.FC<MyEmployeeProps> = ({
         name, 
         age, 
         isEmployed }) => {
     return (
       <div>
         <p>Name: {name}</p>
         <p>Age: {age}</p>
         {isEmployed !== undefined && <p>Employed: {isEmployed ? 'Yes' : 'No'}</p>}
       </div>
     );
   };

   export default MyEmployee;

You can also use type in place of interfaces if you’re composing types with unions or intersections, but for extensibility, interfaces are often preferred:

   import React from 'react';

   type SubmitButtonProps = {
     text: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary'; // Union type
   };

   const UserButton: React.FC<SubmitButtonProps> = ({
           text,
           onClick,
           variant }) => {
     return (
       <button onClick={onClick} className={variant === 'primary' ? 'primary-button' : 'secondary-button'}>
         {text}
       </button>
     );
   };

   export default UserButton;

In TypeScript with React, component props are treated as required unless you add a ? to mark one as optional. That rule holds true whether you use an interface or a type alias to describe the props.

required props:
interface MyEmployeeProps {
  requiredFullName: string;
  requiredAge: number;
}

const MyEmployee: React.FC<MyEmployeeProps> = ({
     requiredFullName,
     requiredAge}) => {
  return (
    <div>
      {requiredFullName} {requiredAge}
    </div>
  );
};

From the above, it is clear that requiredFullName and requiredAge are both required, and TypeScript will enforce this at compile-time by throwing an error.

optional props:
interface MyEmployeeProps {
  requiredFullName: string;
  optionalAge?: number;
}
const MyEmployee: React.FC<MyEmployeeProps> = ({ 
      requiredFullName,
      optionalAge }) => {
  return (
    <div>
      {requiredFullName} {optionalAge}
    </div>
  );
};

The optionalAge is marked with a ?, which indicates that it’s optional and can be safely omitted when using the component without causing any TypeScript errors.

default props and default parameter values (functional components):
    //this is the class component
class UserComponent extends React.Component<UserProps> {
         render(){
          return <div style={{ color: this.props.color, fontSize: this.props.fontSize
          }}>{this.props.title}</div>;
                }
             }

       UserComponent.defaultProps = {
           color: 'blue'
           fontSize: 20,
       };

    //this is the functional component (FC)
    const UserFunctionalComponent: React.FC<UserProps> = ({ 
            title, 
            color = "blue", 
            fontSize = 20 }) => {
               return <div style={{ color: color, fontSize: fontSize }}>{title}</div>;
            };     

By using the defaultProps property for class components, you’re able to set default values for props to ensure components behave in a predictable way even when some props are not provided. While in the functional components, you only need to assign default values directly in the function parameters for any optional props. This will make your code cleaner and also a guaranteed way to prevent runtime bugs from missing props.

Handling children:
    interface UserComponentProps {
        title: string;
        children: React.ReactNode;
    }
    const UserComponent: React.FC<UserComponentProps> = ({title, children}) => {
         return (
              <div>
                   <h1>{title}</h1>
                       {children}
              </div>
            );
        };

As you can see from the above, the children prop lets you pass contents between a component’s opening and closing tags represented by a large range of data types, like text, other components, or even multiple elements. This allows you to make components more flexible and reusable by letting them “wrap” or display whatever content you put inside them.

Using discriminated unions for conditional rendering
What are discriminated unions, and when should you use them?

When you build an app with TypeScript and React, you often deal with a single piece of data that can be in various states: loading, error, or success. Discriminated unions, sometimes called tagged unions or algebraic data types (ADTs), provide a tidy way to model these different forms. By grouping related types under one label, you keep type safety while easing the mental load during coding.

This clear separation makes it simple to decide which UI to show in your components because each state carries its own signature. In the examples that follow, we’ll see how this approach helps us write safer, more readable, and still expressive code:

type DataLoadingState = {
  status: 'request loading...';
};

type DataSuccessState<T> = {
  status: 'request success';
  data: T;
};

type DataErrorState = {
  status: 'request error';
  message: string;
};

type DataState<T> = DataLoadingState | DataSuccessState<T> | DataErrorState;

From the code snippet above, each type has a common trait, usually known as a discriminator or tag, that marks its kind, much like a status label. TypeScript leans on this tag whenever the shapes are piled into a union to tell them apart. Because each shape carries a distinct fixed value for that trait, the language knows exactly which one it is and can trim the type accordingly. Once the shapes are defined, you bundle them with the | operator, allowing you to model complex state in a way that stays safe and predictable.

Exhaustive checking with the never type

Exhaustive checking with the never type in TypeScript is a technique that ensures that all possible cases of a discriminated union are explicitly handled in a switch statement or conditional logic, allowing developers to catch unhandled scenarios at compile time through type safety.

It is worth noting that the never type represents a value that never occurs, i.e., unreachable code, and is used in exhaustive checks to ensure all cases of a discriminated union are properly handled. If a new case is added but not addressed, the compiler throws an error, which enhances type safety:

function DisplayData<T>({ state }: { state: DataState<T> }) {
  switch (state.status) {
    case 'loading':
      return <p>Loading Data</p>;
    case 'success':
      return <p>Data: {JSON.stringify(state.data)}</p>;
    case 'error':
      return <p>Error: {state.message}</p>;
    default:
      return <p>Unknown status</p>;
  }
}

The above illustrates the final step in using discriminated unions effectively in React components by employing conditional logic like a switch or an if statement based on the discriminator property (status). This will allow you to render different UI elements depending on the current state and catch missing branches at compile time, keeping your components both type-safe and error-resistant.

Over 200k developers use LogRocket to create better digital experiences
Learn more →
Inferring types from APIs with ReturnType and typeOf

Two powerful utilities by TypeScript are typeof and ReturnType<T>, which are used to infer types from existing values and extract the return type of functions, respectively, enabling safer and more maintainable code, especially when working with services, APIs, and utility functions.

Using typeOf to infer types from functions or constants

For constants, typeOf is used to infer the type of a variable (string) so it’s reusable throughout without the need for hardcoding it, as shown below:

const API_BASE_URL = "https://api.newpayment.com/services/api/v1/transfer";
type ApiBaseUrlType = typeOf API_BASE_URL;

You can also use typeOf to get the function type, which is useful for typing callbacks:

const getEmployeeDetails = (employeeId: number) => ({
    employeeId,
    employeeName: "Peter Aideloje",
    employeeEmail: "aidelojepeter123@gmail.com",
    position: "Software Engineer",
});

// using typeof to get the function type
type GetEmployeeDetailsFnType = typeof getEmployeeDetails;
Leveraging ReturnType<T> for function results

This pattern is very useful when a utility/service function returns structured data. This way, you automatically derive the result type using Returntype, ensuring consistency across your code base. By combining Returntype and typeof, you keep types synchronized with function signatures, avoiding manual duplication and reducing the risk of type mismatch:

// Get the return type of the getUser function
const employeeDetails : EmployeeDetails = {
    employeeId = 3,
    employeeName: "Peter Aideloje",
    employeeEmail: "aidelojepeter123@gmail.com",
    position: "Software Engineer", 
};

type EmployeeDetails = ReturnType<typeof getEmployeeDetails>;
Extracting types from services and utility functions

This helps to derive the result type automatically from the structured data of a utility or service function, thereby ensuring consistency in consuming components, as shown below:

//utility function
function calculateTotalFee (price: number, quantity: number){
  return {
     total: price * quantity,
     currency: "GBP",
  };
}

// extracting return type of utility function
type TotalSummary = ReturnType<typeof calculateTotalFee>;

const summary: TotalSummary = {
  total: 100,
  currency: "GBP",
};
Utility types: Pick, Omit, Partial, Record

TypeScript comes with a set of built-in utility types that make it easier to build new types from the ones you’ve already defined flexibly. These tools help to shape component props, organize state, reduce redundancy, and improve code maintainability in React projects. Below are some practical use cases of the most commonly used utility types you’ll find handy in a React + TypeScript setup.

Practical use cases for each utility type
(i) Pick<Type, Keys>

The Pick utility type is used to construct a new type by selecting specific properties from a large Type thereby enhancing type safety and reducing redundancy:

interface Employee{
          employeeId: number,
          employeeName: String,
          employeeEmail: String,
          employeePosition: String,
}
type EmployeePreview = Pick<Employee, 'employeeId' | 'employeeName'>;
const preview : Employeepreview = {
         employeeId: 35,
         employeeName: "Peter Aideloje",
};

This is great for displaying minimal data in a list or component.

(ii) Omit<Type, Keys>

The Omit utility type is the direct opposite of Pick type, used to create a new type by excluding specific properties from an existing type:

interface Employee{
          employeeId: number,
          employeeName: String,
          employeeEmail: String,
          employeePosition: String,
}

type EmployeeWithoutEmail = Omit<Employee, 'employeeEmail'>;
const employee : EmployeeWithoutEmail = {
         employeeId: 35,
         employeeName: "Peter Aideloje",
         employeePosition: "Software Engineer",
};

This is great for excluding unnecessary information or sensitive fields such as passwords, email, or database ID.

(iii) Partial<Type>

The Partial utility type makes all properties in a type optional. This is useful when you are updating an object when not all properties must be provided:

interface Employee{
          employeeId: number,
          employeeName: String,
          employeeEmail: String,
          employeePosition: String,
}

type PartialEmployee = Partial<Employee>;
const partialEmployee : PartialEmployee = {
         employeeName: "Peter Aideloje",
};
(iv) Record<Keys, Type>

The Record utility type creates an object with a specific set of keys and types:

type Roles = "admin" | "employee" | "viewer";

type Permissions = Record<Role, string[]>;

const permissions: Permissions = {
     admin["read", "write", "delete"],
     employee["read", "write"],
     viewer["read"],
};

Utility types in TypeScript help to reduce code repetition when defining props or state by reusing and reshaping existing types. They’re also great for modelling flexible data structures, such as dynamic form inputs or API responses, making your codebase cleaner and easier to maintain.

Generic components and hooks
Writing reusable components with generics

Generics in TypeScript help developers to make reusable UI elements capable of managing multiple data types while keeping strong type safety. They shine better and are more important when used in React to design components that are not tied to a particular data type. This flexibility makes your React component more dynamic and can fit into various types as required in any part of your application. To achieve this, follow these steps below to set up your project:

First, open your terminal or command prompt to run the command to create a new React project using TypeScript:

npx create-react-app react-project --template typescript

(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)