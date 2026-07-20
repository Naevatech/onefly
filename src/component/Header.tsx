import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
} from '@clerk/clerk-react'

const navLinks = [
  { label: 'Flights', href: '/flights' },
  { label: 'Hotels', href: '/hotels' },
]

const Header = () => {
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Read saved theme (or system preference) on mount and apply the `.dark` class
  // that colors.css keys off of.
  useEffect(() => {
    const stored = localStorage.getItem('onefly-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = stored ? stored === 'dark' : prefersDark

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('onefly-theme', next ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-(--page-max-width) items-center justify-between md:w-4/5">
        {/* Logo */}
        <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
          onefly
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              className={
                i === 0
                  ? 'text-sm font-medium text-primary'
                  : 'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="glow-ring rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-9 w-9' } }} />
              <SignOutButton redirectUrl="/">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </SignOutButton>
            </div>
          </SignedIn>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
          </SignedIn>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-secondary"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex w-full max-w-(--page-max-width) flex-col gap-1 py-4 md:w-4/5">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={
                  i === 0
                    ? 'rounded-lg bg-[var(--accent-soft)] px-3 py-2.5 text-sm font-medium text-primary'
                    : 'rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground'
                }
              >
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-full bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="mt-2 border-t border-border pt-4">
                <SignOutButton redirectUrl="/">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                  >
                    <LogOut size={14} />
                    Log out
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header