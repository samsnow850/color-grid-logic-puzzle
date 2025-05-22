
export interface GridHistory<T> {
  past: T[][];
  present: T[][];
  future: T[][];
}

export function createHistory<T>(initialState: T[][]): GridHistory<T> {
  return {
    past: [],
    present: JSON.parse(JSON.stringify(initialState)),
    future: [],
  };
}

export function recordHistory<T>(history: GridHistory<T>, newPresent: T[][]): GridHistory<T> {
  return {
    past: [...history.past, history.present],
    present: JSON.parse(JSON.stringify(newPresent)),
    future: [],
  };
}

export function undo<T>(history: GridHistory<T>): GridHistory<T> {
  if (history.past.length === 0) return history;
  
  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, history.past.length - 1);
  
  return {
    past: newPast,
    present: JSON.parse(JSON.stringify(previous)),
    future: [history.present, ...history.future],
  };
}

export function redo<T>(history: GridHistory<T>): GridHistory<T> {
  if (history.future.length === 0) return history;
  
  const next = history.future[0];
  const newFuture = history.future.slice(1);
  
  return {
    past: [...history.past, history.present],
    present: JSON.parse(JSON.stringify(next)),
    future: newFuture,
  };
}

export function canUndo<T>(history: GridHistory<T>): boolean {
  return history.past.length > 0;
}

export function canRedo<T>(history: GridHistory<T>): boolean {
  return history.future.length > 0;
}
