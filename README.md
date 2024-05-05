# useUndoRedoState

`useUndoRedoState` is a custom React hook that provides undo and redo functionality for state management. It allows you to easily integrate undo and redo capabilities into your React applications, giving users the ability to revert or reapply state changes with keyboard shortcuts or programmatic methods.

## Features

- **Keyboard Shortcuts**: The hook automatically sets up event listeners for keyboard shortcuts (`Cmd+Z` for undo and `Cmd+Shift+Z` for redo on macOS, or `Ctrl+Z` and `Ctrl+Shift+Z` on other platforms).
- **Programmatic Control**: In addition to keyboard shortcuts, you can control undo and redo operations programmatically by calling the provided `handleUndo` and `handleRedo` functions.
- **Customizable Stack Size**: You can customize the maximum size of the undo and redo stacks to control memory usage.
- **Callback Functions**: The hook supports optional callback functions that are called after undo or redo operations, allowing you to perform additional actions or side effects.

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
import { useUndoRedoState } from "react-undo-redo-state";

const MyComponent = () => {
  const [state, setState] = useUndoRedoState('initial value');

  return (
    <div>
      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      {/* Other component code */}
    </div>
  );
};

```

The `useUndoRedoState` hook accepts two arguments:

1. `initialState`: The initial state value.
2. `options` (optional): An object containing configuration options:
    - `maxStackSize`: The maximum size of the undo and redo stacks (default: 10).
    - `onUndo`: A callback function to be called after an undo operation.
    - `onRedo`: A callback function to be called after a redo operation.

The hook returns an array with two elements:

1. `state`: The current state value.
2. `setState`: A function to set a new state value. This function automatically adds the previous state to the undo stack, enabling undo operations.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on the [GitHub repository](https://github.com/dev-bilaspure/react-undo-redo).

## License

This project is licensed under the MIT License.