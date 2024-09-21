# useUndoRedoState

`useUndoRedoState` is a custom React hook that provides undo and redo functionality for state management. It allows you to easily integrate undo and redo capabilities into your React applications, giving users the ability to revert or reapply state changes with keyboard shortcuts or programmatic methods.

## Features

- **Keyboard Shortcuts**: The hook automatically sets up event listeners for keyboard shortcuts (`Cmd+Z` for undo and `Cmd+Shift+Z` for redo on macOS, or `Ctrl+Z` and `Ctrl+Shift+Z` on other platforms).
- **Programmatic Control**: In addition to keyboard shortcuts, you can control undo and redo operations programmatically by calling the provided `undo` and `redo` functions.
- **Customizable Stack Size**: You can customize the maximum size of the undo and redo stacks to control memory usage.
- **Callback Functions**: The hook supports optional callback functions that are called after undo or redo operations, allowing you to perform additional actions or side effects.
- **Reset State**: Provides a function to reset the state to its initial value.
- **Clear History**: Provides a function to clear both the undo and redo stacks.

## Installation

You can install the package via npm or yarn:

```bash
npm install react-undo-redo-state
```

```bash
yarn add react-undo-redo-state
```

## Usage

```jsx
import React from 'react';
import useUndoRedoState from 'react-undo-redo-state';

export default function CounterApp() {
  const [
    count,
    setCount,
    undo,
    redo,
    resetState,
    clearHistory
  ] = useUndoRedoState(0);

  return (
    <div className="w-full h-screen mt-20">
      <div className="flex flex-col gap-5 items-center">
        <p className="text-2xl">{count}</p>
        <div className="flex items-center gap-5">
          <button onClick={() => setCount(count - 1)}>Decrement</button>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
          <button onClick={resetState}>Reset</button>
          <button onClick={clearHistory}>Clear History</button>
        </div>
      </div>
    </div>
  );
}
```

The useUndoRedoState hook accepts two arguments:

1. `initialState`: The initial state value.
2. `options` (optional): An object containing configuration options:
 - 1. `maxStackSize`: The maximum size of the undo and redo stacks (default: 10).
 - 2. `onUndo`: A callback function to be called after an undo operation.
 - 3. `onRedo`: A callback function to be called after a redo operation.

The hook returns an array with six elements:

1. `state`: The current state value.
2. `setValue`: A function to set a new state value. This function automatically adds the previous state to the undo stack, enabling undo operations.
3. `undo`: A function to revert the state to the previous value in the undo stack.
4. `redo`: A function to apply the next value from the redo stack to the state.
5. `resetState`: A function to reset the state to the initial value.
6. `clearHistory`: A function to clear both the undo and redo stacks.

## Demo

Check out the useUndoRedoState hook demo [here](https://github.com/Dev-Bilaspure/useUndoRedoState-demo) featuring a simple Next.js counter app.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on the [GitHub repository](https://github.com/Dev-Bilaspure/react-undo-redo-state)

## License

This project is licensed under the MIT License.

### Summary of Changes:
1. **Updated Features Section:** Added details for the new `resetState` and `clearHistory` functions.
2. **Usage Example:** Updated the usage example to show the use of the new functions and the renamed `setValue` function.
3. **Return Object Documentation:** Updated the documentation to reflect returning an object instead of a tuple.