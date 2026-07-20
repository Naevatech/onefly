import { Link } from 'react-router-dom'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-4/5 max-w-(--page-max-width) py-5 text-center text-xs text-muted-foreground sm:text-sm">
        &copy; {year} Onefly Travel Ltd.{' '}
        <Link to="/" className="font-medium text-primary hover:text-[var(--accent-hover)]">
          Flights
        </Link>{' '}
        powered by the Duffel API. Not a real booking.
      </div>
    </footer>
  )
}

export default Footer