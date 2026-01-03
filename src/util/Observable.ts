/**
 * An observable value.
 */
export class Observable<T> {
  /**
   * Currently registered listeners.
   * @private
   */
  private readonly _listeners: ((value: T) => void)[] = []

  /**
   * The current value backing.
   * @private
   */
  private _value: T

  constructor(value: T) {
    this._value = value
  }

  /**
   * The current value.
   */
  get value() {
    return this._value
  }

  /**
   * The current value.
   */
  set value(to: T) {
    if (to !== this._value) {
      this._value = to
      this._listeners.forEach((fn) => void fn(to))
    }
  }

  /**
   * Adds a listener for value.
   * @param fn The listener.
   * @returns Returns removing the registration.
   */
  addListener(fn: (value: T) => void) {
    this._listeners.push(fn)
    return () => {
      const index = this._listeners.indexOf(fn)
      if (index >= 0) this._listeners.splice(index, 1)
    }
  }
}
