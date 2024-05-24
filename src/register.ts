import Alpine, { AlpineComponent } from "alpinejs";

export function registerLevel (id: string, cb: (...args: unknown[]) => AlpineComponent<{}>) {
  Alpine.data(`level_${id.replace(/\//g, '_')}`, cb)
}

export function registerComponent (name: string, cb: (...args: unknown[]) => AlpineComponent<{}>) {
  Alpine.data(name, cb)
}
