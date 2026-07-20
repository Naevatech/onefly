import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Calendar, ChevronDown, Loader2 } from 'lucide-react'
import { searchFlights } from '../suggestion/api'
import PlaceAutocomplete, { type PlaceSelection } from '../suggestion/PlaceAutocomplete'

const passengerOptions = Array.from({ length: 9 }, (_, i) => i + 1)

const Search = () => {
  const navigate = useNavigate()
  const [from, setFrom] = useState<PlaceSelection | null>({ label: 'New York', code: 'JFK' })
  const [to, setTo] = useState<PlaceSelection | null>({ label: 'Las Vegas', code: 'LAS' })
  const [date, setDate] = useState('2026-11-08')
  const [passengers, setPassengers] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const swapLocations = () => {
    setFrom(to)
    setTo(from)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError(null)

    if (!from || !to) {
      setSearchError('Pick a From and To from the dropdown suggestions.')
      return
    }

    if (!date) {
      setSearchError('Pick a departure date.')
      return
    }

    setIsSearching(true)

    try {
      const offers = await searchFlights({
        origin: from.code,
        destination: to.code,
        departureDate: date,
        passengers: Array.from({ length: passengers }, () => ({ type: 'adult' as const })),
      })

      navigate('/results', {
        state: {
          offers,
          searchParams: { origin: from, destination: to, date, passengers },
        },
      })
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Something went wrong searching flights.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="mx-auto w-4/5 max-w-(--page-max-width)">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] md:flex-row md:items-stretch"
      >
        <PlaceAutocomplete
          id="search-from"
          label="From"
          placeholder="City or airport"
          value={from}
          onChange={setFrom}
        />

        {/* Swap button */}
        <div className="flex items-center justify-center border-t border-border py-2 md:border-t-0 md:border-x md:px-2 md:py-0">
          <button
            type="button"
            onClick={swapLocations}
            aria-label="Swap origin and destination"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeftRight size={16} className="rotate-90 md:rotate-0" />
          </button>
        </div>

        <PlaceAutocomplete
          id="search-to"
          label="To"
          placeholder="City or airport"
          value={to}
          onChange={setTo}
          className="border-t border-border md:border-t-0"
        />

        {/* Date */}
        <div className="flex flex-1 items-center gap-3 border-t border-border px-5 py-4 md:border-t-0 md:border-l">
          <div className="flex flex-1 flex-col gap-1">
            <label
              htmlFor="search-date"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Date
            </label>
            <input
              id="search-date"
              type="date"
              ref={dateInputRef}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-semibold text-foreground outline-none [color-scheme:light] dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
          <Calendar
            size={16}
            className="shrink-0 cursor-pointer text-muted-foreground"
            onClick={() => dateInputRef.current?.showPicker?.()}
          />
        </div>

        {/* Passengers */}
        <div className="relative flex flex-1 items-center gap-3 border-t border-border px-5 py-4 md:border-t-0 md:border-l">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Passengers
            </span>
            <span className="text-sm font-semibold text-foreground">
              {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
            </span>
          </div>
          <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            aria-label="Number of passengers"
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
          >
            {passengerOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="p-3 md:flex md:items-center">
          <button
            type="submit"
            disabled={isSearching}
            className="glow-ring flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 md:w-auto md:rounded-full"
          >
            {isSearching && <Loader2 size={16} className="animate-spin" />}
            {isSearching ? 'Searching…' : 'Search flights'}
          </button>
        </div>
      </form>

      {searchError && (
        <p className="mt-3 text-center text-sm font-medium text-[var(--danger)]" role="alert">
          {searchError}
        </p>
      )}
    </div>
  )
}

export default Search