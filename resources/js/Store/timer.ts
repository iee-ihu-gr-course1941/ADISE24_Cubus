import {create} from 'zustand';

type IntervalState = {
  time: number;
  interval: NodeJS.Timeout | null;
  addTime: (value: number) => void;
  clearTime: () => void;
  start: (ms: number) => void;
  stop: () => void;
};

export const useTimerStore = create<IntervalState>(set => ({
  time: 0,
  interval: null,
  addTime: (value: number) => set(state => ({time: state.time + value})),
  clearTime: () => set({time: 0}),
  start: (ms: number) =>
    set(state => {
      if (state.interval) return state;
      return {
        interval: setInterval(() => set(state => ({time: state.time + 1})), ms),
      };
    }),
  stop: () =>
    set(state => {
      if (!state.interval) return state;
      clearInterval(state.interval);
      return {interval: null};
    }),
}));
