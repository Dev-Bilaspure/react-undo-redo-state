import { useState, useCallback, useEffect } from "react";

const DEFAULT_MAX_STACK_SIZE = 10;

type UndoRedoOptions = {
  maxStackSize?: number;
  onUndo?: () => void;
  onRedo?: () => void;
};

/**
 * A custom React hook that provides undo and redo functionality for state management.
 *
 * @template T - The type of the state value.
 * @param {T} initialState - The initial state value.
 * @param {UndoRedoOptions} [options] - An object containing configuration options.
 * @returns {[T, (newValue: T) => void, () => void, () => void, () => void, () => void]} An array containing:
 * - The current state value.
 * - A function to set a new state value.
 * - A function to revert the state to the previous value.
 * - A function to apply the next value from the redo stack.
 * - A function to reset the state to the initial value.
 * - A function to clear both the undo and redo stacks.
 */
const useUndoRedoState = <T>(
  initialState: T,
  options: UndoRedoOptions = {}
): [
  T,
  (newValue: T) => void,
  () => void,
  () => void,
  () => void,
  () => void
] => {
  const [state, setState] = useState<T>(initialState);
  const [undoStack, setUndoStack] = useState<T[]>([initialState]);
  const [redoStack, setRedoStack] = useState<T[]>([]);
  const {
    maxStackSize = DEFAULT_MAX_STACK_SIZE,
    onUndo = () => {},
    onRedo = () => {},
  } = options;

  const undo = useCallback(() => {
    if (undoStack.length > 1) {
      const newUndoStack = [...undoStack];
      const currentState = newUndoStack.pop();
      if (currentState !== undefined) {
        setRedoStack([state, ...redoStack]);
        setState(newUndoStack[newUndoStack.length - 1]);
        setUndoStack(newUndoStack);
      }
      onUndo();
    }
  }, [undoStack, redoStack, state, onUndo]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const currentState = newRedoStack.shift();
      if (currentState !== undefined) {
        setUndoStack(prevUndoStack => {
          const newUndoStack = [...prevUndoStack, state];
          if (newUndoStack.length > maxStackSize) {
            newUndoStack.shift();
          }
          return newUndoStack;
        });
        setState(currentState);
        setRedoStack(newRedoStack);
      }
      onRedo();
    }
  }, [redoStack, state, maxStackSize, onRedo]);

  const setValue = useCallback(
    (newValue: T) => {
      setUndoStack(prevUndoStack => {
        const newUndoStack = [...prevUndoStack, state];
        if (newUndoStack.length > maxStackSize) {
          newUndoStack.shift();
        }
        return newUndoStack;
      });
      setState(newValue);
      setRedoStack([]);
    },
    [state, maxStackSize]
  );

  const resetState = useCallback(() => {
    setState(initialState);
    setUndoStack([initialState]);
    setRedoStack([]);
  }, [initialState]);

  const clearHistory = useCallback(() => {
    setUndoStack([state]);
    setRedoStack([]);
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "z" && !event.shiftKey) {
          undo();
        } else if (event.key === "z" && event.shiftKey) {
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  return [
    /**
     * The current state value.
     */
    state,
    /**
     * Updates the state with a new value and adds the previous state to the undo stack.
     * @param {T} newValue - The new state value.
     */
    setValue,
    /**
     * Reverts the state to the previous value in the undo stack.
     */
    undo,
    /**
     * Applies the next value from the redo stack to the state.
     */
    redo,
    /**
     * Resets the state to the initial state value.
     */
    resetState,
    /**
     * Clears both the undo and redo stacks.
     */
    clearHistory,
  ];
};

export default useUndoRedoState;
