import { useState, useCallback } from 'react';

export function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setFormatState = useCallback((newStateOrUpdater) => {
    setHistory((prevHistory) => {
      const currentState = prevHistory[currentIndex];
      const newState = typeof newStateOrUpdater === 'function' ? newStateOrUpdater(currentState) : newStateOrUpdater;
      
      // If nothing actually changed, return identical history
      if (JSON.stringify(currentState) === JSON.stringify(newState)) {
         return prevHistory;
      }

      // Truncate future history if we're not at the end and we make a new edit
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push(newState);
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, history.length - 1));
  }, [history.length]);

  return {
    state: history[currentIndex],
    setState: setFormatState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
