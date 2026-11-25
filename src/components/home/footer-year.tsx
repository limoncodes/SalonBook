"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

export function CopyrightYear() {
  return useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  )
}