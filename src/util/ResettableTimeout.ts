/**
 * A resettable and observable timeout.
 */
export class ResettableTimeout {
  /**
   * Delay of each reset trigger.
   * @private
   */
  private readonly delay: number

  /**
   * Currently registered listeners.
   * @private
   */
  private readonly _listeners: ((succeeded: boolean) => void)[] = []

  /**
   * Creates the resettable timeout with the given delay.
   * @param delay The delay after reset before triggering.
   */
  constructor(delay: number) {
    this.delay = delay
  }

  /**
   * True if succeeded.
   * @private
   */
  private _succeeded = false

  /**
   * Current timeout handle.
   * @private
   */
  private _handle: ReturnType<typeof setTimeout> = null!

  /**
   * Current handler function.
   */
  private _fn: () => void = () => {}

  /**
   * True if succeeded.
   */
  get succeeded() {
    return this._succeeded
  }

  /**
   * Adds a listener for succeeded.
   * @param fn The listener.
   * @returns Returns removing the registration.
   */
  addSucceededListener(fn: (succeeded: boolean) => void) {
    this._listeners.push(fn)
    return () => {
      const index = this._listeners.indexOf(fn)
      if (index >= 0) this._listeners.splice(index, 1)
    }
  }

  /**
   * Resets the timeout.
   */
  reset() {
    this._succeeded = false
    this._listeners.forEach((fn) => fn(false))
    if (this._handle) clearTimeout(this._handle)
    this._handle = setTimeout(() => {
      this._fn()
      this._succeeded = true
      this._listeners.forEach((fn) => fn(true))
    }, this.delay)
  }

  /**
   * Sets the handler. If already succeeded, the handler is invoked
   * immediately.
   * @param fn The handler.
   */
  setHandle(fn: () => void) {
    // Can go immediately.
    if (this._succeeded) {
      fn()
      return
    }

    this._fn = fn
    this.reset()
  }

  /**
   * Removes the handler.
   */
  clearHandle() {
    this._fn = () => {}
    this.reset()
  }
}
