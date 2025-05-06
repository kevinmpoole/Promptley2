// src/layouts/Layout.tsx
import { Outlet, NavLink } from "react-router-dom"
import { UniverseSelector } from "components/UniverseSelector"


export default function Layout() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded transition-colors duration-150 text-sm font-medium
     ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`

  return (
    
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar Nav */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-3">
      <div className="mb-6">
  <img
    src="/images/promptley-logo.png"
    alt="Promptley Logo"
    className="w-full max-w-[150px] mx-auto"
  />
    <UniverseSelector />
</div>


        <NavLink to="/browser" className={navLinkClass}>
          Card Deck
        </NavLink>
        <NavLink to="/face-maker" className={navLinkClass}>
          Face Maker
        </NavLink>
        <NavLink to="/shot-builder" className={navLinkClass}>
          Shot Builder
        </NavLink>
        <NavLink to="/magic" className={navLinkClass}>
          Magic Prompts
        </NavLink>
        <NavLink to="/timeline" className={navLinkClass}>
          Timeline Editor
        </NavLink>
        <NavLink to="/timeframe" className={navLinkClass}>
          TimeFrame
        </NavLink>
        <NavLink to="/prompt" className={navLinkClass}>
          Prompt Builder
        </NavLink>
      </aside>
<div className="mt-auto">
</div>

      {/* Main View */}
      <main className="flex-1 overflow-y-auto p-10 bg-zinc-950 text-white">
        <Outlet />
      </main>
    </div>
  )
}
