import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Heart, Share2, Plane } from 'lucide-react'
import type { FlightOffer } from '../suggestion/api'
import { getSavedFlights, saveFlight, unsaveFlight } from '../suggestion/api'
import type { PlaceSelection } from '../suggestion/PlaceAutocomplete'
import { formatDuration, formatDateTime, formatPrice, stopsLabel } from '../suggestion/format'

type ResultLocationState = {
  offers?: FlightOffer[]
  searchParams?: {
    origin: PlaceSelection
    destination: PlaceSelection
    date: string
    passengers: number
  }
}

const Result = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignedIn, getToken } = useAuth()
  const { offers = [], searchParams } = (location.state as ResultLocationState) ?? {}
  const [saved, setSaved] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isSignedIn) return

    let cancelled = false

    getToken().then((token) => {
      if (!token || cancelled) return
      getSavedFlights(token)
        .then((flights) => {
          if (!cancelled) setSaved(new Set(flights.map((f) => f.offerId)))
        })
        .catch(() => {
          console.log("flight handled")
        })
    })

    return () => {
      cancelled = true
    }
  }, [isSignedIn, getToken])

  const toggleSaved = async (offer: FlightOffer) => {
    if (!isSignedIn) {
      // Send them to sign in, then back to these exact results — same
      navigate('/sign-in', { state: { from: location } })
      return
    }

    const wasSaved = saved.has(offer.id)
    setSaved((prev) => {
      const next = new Set(prev)
      wasSaved ? next.delete(offer.id) : next.add(offer.id)
      return next
    })

    try {
      const token = await getToken()
      if (!token) throw new Error('Not signed in')

      if (wasSaved) {
        await unsaveFlight(token, offer.id)
      } else {
        const slice = offer.slices[0]
        const firstSegment = slice?.segments[0]
        await saveFlight(token, {
          offerId: offer.id,
          airline: firstSegment?.airline ?? null,
          origin: slice?.origin ?? '',
          originCity: slice?.originCity ?? '',
          destination: slice?.destination ?? '',
          destinationCity: slice?.destinationCity ?? '',
          departingAt: slice?.departingAt ?? '',
          arrivingAt: slice?.arrivingAt ?? '',
          totalAmount: offer.totalAmount,
          totalCurrency: offer.totalCurrency,
        })
      }
    } catch (err) {
      // Revert if the request actually failed.
      setSaved((prev) => {
        const next = new Set(prev)
        wasSaved ? next.add(offer.id) : next.delete(offer.id)
        return next
      })
    }
  }

  //Return if the user has not refresh
  if (offers.length === 0) {
    return (
      <section className="mx-auto flex w-4/5 max-w-(--page-max-width) flex-col items-center gap-4 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">No results to show</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Run a search first — flight results only appear here right after a search, and don&rsquo;t
          persist across a page refresh yet.
        </p>
        <Link
          to="/"
          className="glow-ring rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Search flights
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto w-4/5 max-w-(--page-max-width) py-10">
      {/* Heading */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {searchParams
              ? `${searchParams.origin.label} → ${searchParams.destination.label}`
              : 'Available flights'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {offers.length} {offers.length === 1 ? 'flight' : 'flights'} found
            {searchParams &&
              ` · ${searchParams.passengers} ${searchParams.passengers === 1 ? 'passenger' : 'passengers'}`}
          </p>
        </div>
        <Link
          to="/"
          className="text-sm font-medium text-primary transition-colors hover:text-[var(--accent-hover)]"
        >
          Modify search
        </Link>
      </div>

      {/* Results list */}
      <div className="flex flex-col gap-4">
        {offers.map((offer) => {
          const slice = offer.slices[0]
          const firstSegment = slice?.segments[0]
          const airline = firstSegment?.airline || 'Airline'
          const flightNumber = firstSegment?.flightNumber

          return (
            <article
              key={offer.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
            >
              {/* Airline logo — falls back to a plane glyph if Duffel has no
                  logo on file for this carrier (some smaller/regional airlines). */}
              <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/40 p-3 sm:h-20 sm:w-20">
                {firstSegment?.airlineLogo ? (
                  <img
                    src={firstSegment.airlineLogo}
                    alt={`${airline} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Plane size={20} strokeWidth={1.5} className="text-muted-foreground" />
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary">
                    {stopsLabel(slice?.stops ?? 0)}
                  </span>
                  {firstSegment?.aircraft && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
                      {firstSegment.aircraft}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-foreground">
                  {airline}
                  {flightNumber && <span className="text-muted-foreground"> · {flightNumber}</span>}
                </h3>
                {searchParams && (
                  <p className="mb-3 text-xs text-muted-foreground">
                    {searchParams.passengers}{' '}
                    {searchParams.passengers === 1 ? 'passenger' : 'passengers'}
                  </p>
                )}

                {/* Route */}
                {slice && (
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">{slice.originCity}</p>
                      <p className="text-sm font-bold text-foreground">{slice.origin}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(slice.departingAt)}
                      </p>
                    </div>

                    <div className="flex w-24 flex-col items-center gap-0.5 sm:w-32">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDuration(slice.duration)}
                      </span>
                      <div className="flex w-full items-center">
                        <span className="h-px flex-1 border-t border-dashed border-border" />
                        <Plane size={11} className="mx-1 shrink-0 rotate-90 text-muted-foreground" />
                        <span className="h-px flex-1 border-t border-dashed border-border" />
                      </div>
                    </div>

                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">{slice.destinationCity}</p>
                      <p className="text-sm font-bold text-foreground">{slice.destination}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(slice.arrivingAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden self-stretch border-l border-border sm:block" />

              {/* Price + actions */}
              <div className="flex flex-row items-center justify-between gap-4 border-t border-border pt-4 sm:w-36 sm:shrink-0 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                <div className="flex items-center gap-2 sm:self-end">
                  <button
                    type="button"
                    onClick={() => toggleSaved(offer)}
                    aria-label={saved.has(offer.id) ? 'Remove from saved' : 'Save flight'}
                    aria-pressed={saved.has(offer.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Heart
                      size={13}
                      className={saved.has(offer.id) ? 'fill-primary text-primary' : ''}
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Share flight"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Share2 size={13} />
                  </button>
                </div>

                <p className="text-xl font-bold text-foreground sm:text-2xl">
                  {formatPrice(offer.totalAmount, offer.totalCurrency)}
                </p>

                <div className="hidden w-full flex-col gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => navigate(`/flights/${offer.id}`)}
                    className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Booking Now
                  </button>
                </div>
              </div>

              {/* Actions — mobile only, full width below the price row */}
              <div className="flex w-full gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => navigate(`/flights/${offer.id}`)}
                  className="flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  Booking Now
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Result