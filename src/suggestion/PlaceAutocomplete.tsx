import { useEffect, useRef, useState } from 'react'
import { getPlaceSuggestions, type PlaceSuggestion } from '../suggestion/api'

export type PlaceSelection = {
  label: string
  code: string
}

type PlaceAutocompleteProps = {
  id: string
  label: string
  placeholder?: string
  value: PlaceSelection | null
  onChange: (value: PlaceSelection | null) => void
  className?: string
}

const DEBOUNCE_MS = 700

const PlaceAutocomplete = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  className = '',
}: PlaceAutocompleteProps) => {
  const [query, setQuery] = useState(value?.label ?? '')
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)


  //Reset the origin and destination if its swap without retriggering a search
  useEffect(() => {
    setQuery(value?.label ?? '')
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (text: string) => {
    setQuery(text)
    setIsOpen(true)
    // Typing invalidates whatever was previously selected
    onChange(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (text.trim().length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await getPlaceSuggestions(text.trim())
        setSuggestions(results)
      } catch {
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, DEBOUNCE_MS)
  }

  const handleSelect = (place: PlaceSuggestion) => {
    onChange({ label: place.cityName, code: place.iataCode })
    setQuery(place.cityName)
    setIsOpen(false)
    setSuggestions([])
  }

  const showDropdown = isOpen && (isLoading || query.trim().length >= 2)

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-1 flex-col justify-center gap-1 px-5 py-4 ${className}`}
    >
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
      />

      {showDropdown && (
        <div className="absolute left-0 top-full z-20 mt-2 max-h-72 w-72 max-w-[80vw] overflow-y-auto rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
          {isLoading && <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p>}

          {!isLoading && suggestions.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">No matches</p>
          )}

          {!isLoading &&
            suggestions.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelect(place)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
              >
                <span className="min-w-0">
                  <span className="font-medium text-foreground">{place.cityName}</span>
                  <span className="text-muted-foreground">
                    {place.type === 'airport' ? ` — ${place.name}` : ' — All airports'}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                  {place.iataCode}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default PlaceAutocomplete