
export interface GridHistory<T> {
  past: T[][][];
  present: T[][];
  future: T[][][];
}

export const createHistory = <T>(initialState: T[][]): GridHistory<T> => {
  return {
    past: [],
    present: initialState,
    future: []
  };
};

export const saveHistory = <T>(history: GridHistory<T>, newState: T[][]): GridHistory<T> => {
  return {
    past: [...history.past, history.present],
    present: newState,
    future: []
  };
};

export const undo = <T>(history: GridHistory<T>): GridHistory<T> => {
  if (history.past.length === 0) return history;
  
  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, history.past.length - 1);
  
  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future]
  };
};

export const redo = <T>(history: GridHistory<T>): GridHistory<T> => {
  if (history.future.length === 0) return history;
  
  const next = history.future[0];
  const newFuture = history.future.slice(1);
  
  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture
  };
};
