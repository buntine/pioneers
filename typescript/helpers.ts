module helpers {
  // Creates a circular mask of `radius` at `x`, `y` and executes `f`.
  // The original state of `ctx` is restored upon exit.
  export function onMask(ctx:any, x:number, y:number, radius:number, f: () => void): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.clip();

    f();

    ctx.restore();
  }
}
