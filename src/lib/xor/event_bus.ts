export default class EventBus {
  private listeners = new Map<string, Function[]>

  emit(name: string, data: Record<string, any>) {
    const listeners = this.listeners.get(name);

    listeners?.forEach(fn => fn.call(fn, data))
  }

  on (name: string, callback: Function) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name)?.push(callback)
  }
}
