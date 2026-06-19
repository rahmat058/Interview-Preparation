# ReactJS Interview Questions & Answers (Split by Level)

---

## 🟢 Beginner Level – ReactJS Interview Questions

### 1. What is React?
React is a **JavaScript library** developed by **Facebook** for building **user interfaces**, especially for single-page applications. It allows developers to create large web applications that can update and render efficiently in response to data changes without reloading the page.

---

### 2. Why use React?
React offers several benefits:
- **Declarative syntax** makes code more predictable and easier to debug.
- **Component-based architecture** encourages reusable, maintainable code.
- It uses a **Virtual DOM** for faster rendering.
- It's backed by a strong community and ecosystem.

---

### 3. What is JSX?
JSX stands for **JavaScript XML**. It allows developers to write HTML-like syntax directly in JavaScript files. JSX makes it easier to visualize the UI structure and is compiled to `React.createElement()` calls under the hood.

```jsx
const element = <h1>Hello, React!</h1>;
```

---

### 4. What are components in React?
Components are the **building blocks of a React application**. They are reusable pieces of UI that return React elements. There are two types of components: **functional components** and **class components**.

```jsx
function Welcome() {
  return <h1>Hello, world!</h1>;
}
```

---

### 5. What is Virtual DOM?
The **Virtual DOM (VDOM)** is a lightweight JavaScript representation of the real DOM. When changes are made to the UI, React updates the Virtual DOM first and then efficiently updates the real DOM only where changes occurred, improving performance.

---

### 6. What is a functional component?
A **functional component** is a simple JavaScript function that returns JSX. It doesn't have its own state unless you use React hooks like `useState`.

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

---

### 7. What is a class component?
A **class component** is an ES6 class that extends `React.Component` and has a `render()` method. It can maintain its own state and lifecycle methods.

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

---

### 8. What are props in React?
**Props (short for properties)** are inputs to React components. They are passed from a parent component to a child component and are read-only. Props allow you to make your components dynamic and reusable.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

---

### 9. What is state in React?
**State** is a built-in object in class and functional components that allows components to create and manage their own data. State is mutable and used to store information that can change over the component's lifecycle.

```jsx
const [count, setCount] = useState(0);
```

---

### 10. What is useState?
`useState` is a **React Hook** that allows you to add state to functional components. It returns an array with two values: the current state and a function to update it.

```jsx
const [name, setName] = useState('Mohit');
```

---

### 11. What is useEffect?
`useEffect` is a **hook** used to perform side effects in functional components. Common use cases include data fetching, setting up subscriptions, and manually changing the DOM.

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);
```

---

### 12. What are fragments in React?
**Fragments** let you group a list of children elements without adding extra nodes to the DOM.

```jsx
<>
  <td>Hello</td>
  <td>World</td>
</>
```

---

### 13. What is an event in React?
Events in React are handled using camelCase syntax and JavaScript functions. They are used to respond to user actions like clicks, typing, or form submissions.

```jsx
<button onClick={handleClick}>Click Me</button>
```

---

### 14. What are controlled components?
**Controlled components** are form elements whose values are controlled by React state. The value of the input field is set by the component's state.

```jsx
<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
```

---

### 15. What are uncontrolled components?
**Uncontrolled components** manage their own state using the DOM, typically accessed via **refs** in React.

```jsx
const inputRef = useRef();

function handleSubmit() {
  alert(`Input: ${inputRef.current.value}`);
}

<input ref={inputRef} type="text" />
```

---


---
## 🟡 Intermediate Level – ReactJS Interview Questions

### 16. What is Context API?
The **Context API** allows you to share global data (like theme, user authentication) across the component tree without having to pass props down manually at every level (known as prop drilling).

```jsx
const MyContext = React.createContext();
<MyContext.Provider value={/* some value */}>
  <ChildComponent />
</MyContext.Provider>
```

---

### 17. What is prop drilling?
**Prop drilling** refers to passing data from a parent component to deeply nested child components through intermediary components that don’t necessarily need the data themselves.

---

### 18. What is React Router?
**React Router** is a standard library for routing in React applications. It enables the navigation between different views of various components in a single-page application (SPA).

React Router v7 (also applies to v6) uses a simplified API based on components like BrowserRouter, Routes, and Route.

```jsx
// App.jsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Home';
import About from './About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

---

### 19. What is Redux?
**Redux** is a predictable state container for JavaScript apps. It helps you manage application state in a central store and allows components to access any state they need.

---

### 20. What is lazy loading in React?
**Lazy loading** means loading components only when they’re needed, which helps improve performance and reduce the initial bundle size.

```jsx
const MyComponent = React.lazy(() => import('./MyComponent'));
```

---

### 21. What is Suspense?
`Suspense` is a React component that lets you show a fallback (like a loader) while waiting for lazy-loaded components to load.

```jsx
<Suspense fallback={<div>Loading...</div>}>
  <MyComponent />
</Suspense>
```

---

### 22. What is memoization in React?
**Memoization** is a performance optimization technique to cache the results of expensive function calls so they are not recalculated on every render.

---

### 23. What is React.memo?
`React.memo` is a **Higher Order Component (HOC)** that memoizes the rendered output of a functional component, preventing unnecessary re-renders if props haven't changed.

```jsx
export default React.memo(MyComponent);
```

---

### 24. What is useMemo?
`useMemo` is a hook used to memoize a computed value between renders.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

---

### 25. What is useCallback?
`useCallback` returns a memoized version of a callback function that only changes if one of its dependencies changes.

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

### 36. What are portals?
**Portals** allow rendering a child component into a different part of the DOM tree outside the parent component hierarchy.

```jsx
ReactDOM.createPortal(child, document.getElementById('modal-root'));
```

---

### 27. What is useRef?
`useRef` is a hook that returns a mutable ref object whose `.current` property persists across renders. Useful for accessing DOM nodes or keeping mutable variables.

```jsx
const inputRef = useRef();
<input ref={inputRef} />
```

---

### 28. What is forwardRef?
`forwardRef` is used to pass a ref through a component to one of its children.

```jsx
const FancyInput = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));
```

---

### 29. How does error handling work in React?
**Error Boundaries** in React is done using Error Boundaries – special components that catch JavaScript errors in their child component tree during rendering, in lifecycle methods, and in constructors.

react-error-boundary is a lightweight library that allows you to use error boundaries easily with functional components in React. It simplifies error handling and provides a FallbackComponent, reset mechanisms, and more.

---

### 30. How to optimize performance?
- Use `React.memo`, `useMemo`, and `useCallback`
- Avoid unnecessary re-renders
- Use lazy loading and code splitting
- Optimize rendering of large lists with virtualization

---

### 31. What are custom hooks?
**Custom hooks** are functions that use built-in hooks to encapsulate reusable logic, helping keep components clean and readable.

```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  return { count, increment: () => setCount(count + 1) };
}
```

---

### 32. What is defaultProps?
`defaultProps` allows you to set default values for props in class components. It ensures props have a fallback value if not provided.

```jsx
MyComponent.defaultProps = {
  name: 'Guest'
};
```

---

### 33. How to handle forms in React?
You can handle forms using controlled components (state) or uncontrolled components (refs). Controlled forms provide better control over input validation and behavior.

---

### 34. What is React Developer Tools?
A browser extension (Chrome/Firefox) that helps developers inspect the component hierarchy, state, props, hooks, and more in React applications.

---

### 35. What is the difference between children and props?
- `props` are custom attributes passed to a component.
- `children` is a special prop that includes any nested elements or components passed between the component's opening and closing tags.

```jsx
<MyComponent>Hello</MyComponent> // "Hello" is passed as children
```


# Top 15 Redux Toolkit + RTK Query Interview Questions (With Answers)

These are essential interview questions and answers focused on Redux Toolkit and RTK Query, ideal for beginner to intermediate developers.

---

### 1. What is Redux Toolkit?

Redux Toolkit is the official, recommended way to write Redux logic. It reduces boilerplate code and provides utilities like `createSlice`, `configureStore`, and `createAsyncThunk` to simplify Redux setup.

---

### 2. What are the benefits of using Redux Toolkit over traditional Redux?

* Less boilerplate
* Simplified setup
* Built-in Redux DevTools support
* Encourages best practices
* Includes RTK Query for efficient data fetching

---

### 3. What is a slice in Redux Toolkit?

A slice is a portion of the Redux state and the logic associated with it. You create a slice using `createSlice()`, which automatically generates action creators and reducers.

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
  }
});
```

---

### 4. What is `createAsyncThunk`?

It is used to handle asynchronous logic like API calls. It auto-generates `pending`, `fulfilled`, and `rejected` action types.

---

### 5. What is RTK Query?

RTK Query is a powerful data fetching and caching tool built into Redux Toolkit. It manages API calls, caching, loading states, and errors efficiently.

---

### 6. What does `createApi` do in RTK Query?

`createApi` sets up an API slice where you define endpoints using `builder.query` and `builder.mutation`. It auto-generates hooks for each endpoint.

---

### 7. What is the difference between `query` and `mutation` in RTK Query?

* `query`: For fetching data (GET)
* `mutation`: For modifying data (POST, PUT, DELETE)

---

### 8. What is `fetchBaseQuery`?

It is a default base query function built on `fetch()` for making HTTP requests. It simplifies making REST API calls.

---

### 9. What is `tagTypes` in RTK Query?

`tagTypes` define the types of data used for cache invalidation. Tags help manage refetching when data changes.

---

### 10. What is `providesTags` and `invalidatesTags`?

* `providesTags`: Used in queries to tag cached data.
* `invalidatesTags`: Used in mutations to tell RTK Query to invalidate and refetch related data.

---

### 11. How does caching work in RTK Query?

RTK Query automatically caches fetched data and reuses it on subsequent requests, reducing network calls. You can customize when it should refetch.

---

### 12. How do you handle loading and error states in RTK Query?

All query and mutation hooks return `isLoading`, `isError`, `data`, and `error` states, which you can use to show loaders or error messages.

```js
const { data, isLoading, isError } = useGetUsersQuery();
```

---

### 13. What is `reducerPath` in `createApi`?

`reducerPath` is the key in the Redux state where the API slice reducer is mounted. Example: `reducerPath: 'userApi'`

---

### 14. Can you use RTK Query without Redux Toolkit?

No, RTK Query is tightly coupled with Redux Toolkit and requires it to work properly.

---

### 15. How do you integrate RTK Query with your React components?

You use the auto-generated hooks like `useGetUsersQuery`, `useAddUserMutation`, etc., directly in your components to fetch and manipulate data.

---

Feel free to include these questions in your interviews, YouTube content, or job preparation notes!

