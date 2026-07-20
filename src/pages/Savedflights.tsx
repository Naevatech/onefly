import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Trash2, Loader2 } from 'lucide-react'
import { getSavedFlights, unsaveFlight, type SavedFlight } from '../suggestion/api'
import { formatPrice } from '../suggestion/format'

const initials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()


// "2026-11-08" → "Nov 2, 2026"
const formatDate = (iso: string) => {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Mongoose's  timestamp in user redable format
const formatRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  return `${Math.floor(diffDays / 30)} months ago`
}

const SavedFlights = () => {
  const navigate = useNavigate()
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const [flights, setFlights] = useState<SavedFlight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      navigate('/sign-in', { state: { from: { pathname: '/saved-flights' } } })
      return
    }

    let cancelled = false

    getToken().then((token) => {
      if (!token || cancelled) return
      getSavedFlights(token)
        .then((data) => {
          if (!cancelled) setFlights(data)
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, getToken, navigate])

  const handleRemove = async (offerId: string) => {
    setRemovingId(offerId)
    const previous = flights
    setFlights((prev) => prev.filter((f) => f.offerId !== offerId))

    try {
      const token = await getToken()
      if (!token) throw new Error('Not signed in')
      await unsaveFlight(token, offerId)
    } catch {
      // Failed — put it back.
      setFlights(previous)
    } finally {
      setRemovingId(null)
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto flex w-4/5 max-w-(--page-max-width) flex-col items-center gap-3 py-24 text-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading saved flights…</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-4/5 max-w-(--page-max-width) py-10">
      <div className="mb-6 border-b border-border pb-5">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Saved flights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {flights.length} saved {flights.length === 1 ? 'flight' : 'flights'}
        </p>
      </div>

      {flights.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            You haven&rsquo;t saved any flights yet — tap the heart on a search result to save
            one for later.
          </p>
          <Link
            to="/"
            className="glow-ring rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Search flights
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {flights.map((flight) => (
            <article
              key={flight.offerId}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {initials(flight.airline || '??')}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-foreground">
                  {flight.originCity} ({flight.origin}) → {flight.destinationCity} (
                  {flight.destination})
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {flight.airline || 'Airline'} · {formatDate(flight.departingAt)} · One way
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Saved {formatRelativeTime(flight.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(flight.totalAmount, flight.totalCurrency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(flight.offerId)}
                    disabled={removingId === flight.offerId}
                    aria-label="Remove from saved flights"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/flights/${flight.offerId}`)}
                  className="text-sm font-medium text-primary transition-colors hover:text-[var(--accent-hover)]"
                >
                  View flight →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SavedFlights