
export interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

export function createHistory<T>(initialState: T): History<T> {
  return {
    past: [],
    present: initialState,
    future: []
  };
}

export function saveHistory<T>(history: History<T>, newPresent: T): History<T> {
  return {
    past: [...history.past, history.present],
    present: newPresent,
    future: []
  };
}

export function undo<T>(history: History<T>): History<T> {
  if (history.past.length === 0) return history;
  
  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, history.past.length - 1);
  
  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future]
  };
}

export function redo<T>(history: History<T>): History<T> {
  if (history.future.length === 0) return history;
  
  const next = history.future[0];
  const newFuture = history.future.slice(1);
  
  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture
  };
}
