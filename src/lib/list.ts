const KEY = 'voedingsapp_list_v1'
const EVENT = 'voedingsapp_list_change'

export function getList(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function isInList(id: string): boolean {
  return getList().includes(id)
}

/** Toggle item in/out of list. Returns true if now in list. */
export function toggleList(id: string): boolean {
  const list = getList()
  const idx = list.indexOf(id)
  if (idx >= 0) {
    list.splice(idx, 1)
    localStorage.setItem(KEY, JSON.stringify(list))
    window.dispatchEvent(new Event(EVENT))
    return false
  } else {
    list.push(id)
    localStorage.setItem(KEY, JSON.stringify(list))
    window.dispatchEvent(new Event(EVENT))
    return true
  }
}

export function clearList(): void {
  localStorage.setItem(KEY, '[]')
  window.dispatchEvent(new Event(EVENT))
}

export const LIST_CHANGE_EVENT = EVENT
