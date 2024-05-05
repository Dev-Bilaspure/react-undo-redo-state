import { useState, useCallback, useEffect } from "react";
const DEFULT_MAX_STACK_SIZE = 10;

/**
 * A custom React hook that provides undo and redo functionality for state management.
 *
 * @template T - The type of the state value.
 * @param {T} initialState - The initial state value.
 * @param {Object} options - An object containing configuration options.
 * @param {number} [options.maxStackSize=DEFULT_MAX_STACK_SIZE] - The maximum size of the undo and redo stacks.
 * @param {Function} [options.onUndo] - A callback function to be called after an undo operation.
 * @param {Function} [options.onRedo] - A callback function to be called after a redo operation.
 * @returns {[T, (newValue: T) => void]} An array containing the current state value and a function to set a new state value.
 */
const useUndoRedoState = <T>(
  initialState: T,
  options?: {
    maxStackSize?: number;
    onUndo?: () => void;
    onRedo?: () => void;
  }
): [T, (newValue: T) => void] => {
  const [state, setState] = useState<T>(initialState);
  const [undoStack, setUndoStack] = useState<T[]>([initialState]);
  const [redoStack, setRedoStack] = useState<T[]>([]);
  const {
    maxStackSize = DEFULT_MAX_STACK_SIZE,
    onUndo = () => {},
    onRedo = () => {},
  } = options || {};

  /**
   * Handles the undo operation by reverting the state to the previous value in the undo stack.
   */
  const handleUndo = useCallback(() => {
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
  }, [undoStack, redoStack, state]);

  /**
   * Handles the redo operation by applying the next value from the redo stack.
   */
  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const currentState = newRedoStack.shift();
      if (currentState !== undefined) {
        setUndoStack([...undoStack, state]);
        setState(currentState);
        setRedoStack(newRedoStack);
      }
      onRedo();
    }
  }, [undoStack, redoStack, state]);

  /**
   * Updates the state with a new value and adds the previous state to the undo stack.
   * @param {T} newValue - The new state value.
   */
  const setValue = useCallback(
    (newValue: T) => {
      const newUndoStack = [...undoStack, state];
      if (newUndoStack.length > maxStackSize) {
        newUndoStack.shift();
      }
      setState(newValue);
      setUndoStack(newUndoStack);
      setRedoStack([]);
    },
    [undoStack, state, maxStackSize]
  );

  /**
   * Sets up event listeners for keyboard shortcuts (Cmd+Z for undo, Cmd+Shift+Z for redo).
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey) {
        if (event.key === "z" && !event.shiftKey) {
          handleUndo();
        } else if (event.key === "z" && event.shiftKey) {
          handleRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  return [state, setValue] as const;
};

export default useUndoRedoState;
