export function throttle(func: Function, timeout = 10) {
  let waiting = false;
  return (...args: any[]) => {
    if (waiting) {
      return;
    }
    func(...args);
    waiting = true;
    setTimeout(() => (waiting = false), timeout);
  };
}

export const cx = (
  ...args: (string | { [k: string]: boolean } | undefined)[]
) => {
  const classes: string[] = [];
  args.forEach((arg) => {
    if (typeof arg === "string") {
      classes.push(arg);
    }
    if (typeof arg === "object") {
      Object.entries(arg).forEach(([k, v]) => {
        if (v === true) {
          classes.push(k);
        }
      });
    }
    if (typeof arg === "undefined") {
      // no-op
    }
  });
  return classes.join(" ");
};

export const getBoundedIdx = (i: number, { max }: { max: number }) =>
  (3 * max + i) % max;
