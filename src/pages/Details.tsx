import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plane, Leaf, Loader2 } from 'lucide-react'
import { getOffer, type OfferDetail } from '../suggestion/api'
import { formatDuration, formatDateTime, formatPrice, stopsLabel } from '../suggestion/format'

const Details = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [offer, setOffer] = useState<OfferDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    getOffer(id)
      .then((data) => {
        if (!cancelled) setOffer(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load this flight.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const handleConfirmBooking = () => {
    if (offer) navigate('/traveler-details', { state: { offer } })
  }

  if (isLoading) {
    return (
      <section className="mx-auto flex w-4/5 max-w-(--page-max-width) flex-col items-center gap-3 py-24 text-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading flight…</p>
      </section>
    )
  }

  if (error || !offer) {
    return (
      <section className="mx-auto flex w-4/5 max-w-(--page-max-width) flex-col items-center gap-4 py-24 text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Couldn&rsquo;t load this flight
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error || 'This offer could not be found.'}
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

  const slice = offer.slices[0]
  const firstSegment = slice?.segments[0]
  const airline = firstSegment?.airline || 'Airline'
  const logoUrl = firstSegment?.airlineLogoLockup || firstSegment?.airlineLogo

  return (
    <section className="mx-auto w-4/5 max-w-(--page-max-width) py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft size={16} />
        </button>
        <p className="text-sm text-muted-foreground">
          All available flights <span className="mx-1">/</span>
          <span className="text-foreground"> Flight details</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Main card */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          {/* Airline logo — falls back to a plane glyph if Duffel has no
              logo on file for this carrier (some smaller/regional airlines). */}
          <div className="mb-5 flex h-56 w-full items-center justify-center rounded-2xl border border-border bg-secondary/40 p-10 sm:h-64">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${airline} logo`}
                className="max-h-24 w-auto max-w-[70%] object-contain"
              />
            ) : (
              <Plane size={40} strokeWidth={1.5} className="text-muted-foreground" />
            )}
          </div>

          {/* Badges */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-primary">
              {stopsLabel(slice?.stops ?? 0)}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {airline}
            {firstSegment?.flightNumber && (
              <span className="text-muted-foreground"> · {firstSegment.flightNumber}</span>
            )}
          </h1>
          <p className="mb-5 text-sm text-muted-foreground">
            {offer.passengerCount} {offer.passengerCount === 1 ? 'passenger' : 'passengers'}
            {firstSegment?.aircraft && ` · ${firstSegment.aircraft}`}
          </p>

          {/* Route */}
          {slice && (
            <div className="flex items-center gap-4 border-t border-border py-5">
              <div>
                <p className="text-xs text-muted-foreground">{slice.originCity}</p>
                <p className="text-xl font-bold text-foreground">{slice.origin}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(slice.departingAt)}
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center gap-1 px-1">
                <span className="text-[11px] text-muted-foreground">
                  {formatDuration(slice.duration)}
                </span>
                <div className="flex w-full items-center">
                  <span className="h-px flex-1 border-t border-dashed border-border" />
                  <Plane size={14} className="mx-2 shrink-0 rotate-90 text-muted-foreground" />
                  <span className="h-px flex-1 border-t border-dashed border-border" />
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">{slice.destinationCity}</p>
                <p className="text-xl font-bold text-foreground">{slice.destination}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(slice.arrivingAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Price summary */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-base font-bold text-foreground">Price summary</h2>

          <div className="mb-5 flex items-center justify-between">
            <span className="text-base font-bold text-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">
              {formatPrice(offer.totalAmount, offer.totalCurrency)}
            </span>
          </div>

          {/* Carbon emissions shows here */}
          {offer.totalEmissionsKg && (
            <div className="mb-5 flex items-center gap-1.5 rounded-lg bg-secondary/40 px-3 py-2.5 text-xs text-muted-foreground">
              <Leaf size={13} className="shrink-0 text-[var(--success)]" />
              <span>
                Estimated {Number(offer.totalEmissionsKg).toLocaleString()} kg CO₂ for this
                itinerary
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary"
            >
              Message operator
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Details