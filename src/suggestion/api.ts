const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export type PlaceSuggestion = {
  id: string
  type: 'airport' | 'city'
  name: string
  cityName: string
  iataCode: string
}

export async function getPlaceSuggestions(query: string): Promise<PlaceSuggestion[]> {
  const res = await fetch(`${API_URL}/api/places/suggestions?query=${encodeURIComponent(query)}`)

  if (!res.ok) {
    throw new Error('Failed to fetch place suggestions')
  }

  const data = await res.json()
  return data.data as PlaceSuggestion[]
}

export type FlightSearchParams = {
  origin: string
  destination: string
  departureDate: string
  passengers: { type: 'adult' }[]
}

export type FlightSegment = {
  airline: string | null
  airlineLogo: string | null
  flightNumber: string | null
  aircraft: string | null
}

export type FlightSlice = {
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  departingAt: string
  arrivingAt: string
  duration: string
  stops: number
  segments: FlightSegment[]
}

export type FlightOffer = {
  id: string
  totalAmount: string
  totalCurrency: string
  slices: FlightSlice[]
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  const res = await fetch(`${API_URL}/api/flights/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || 'Something went wrong searching flights.')
  }

  const data = await res.json()
  return data.offers as FlightOffer[]
}

export type SavedFlight = {
  offerId: string
  airline: string | null
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  departingAt: string
  arrivingAt: string
  totalAmount: string
  totalCurrency: string
  createdAt: string
}

export async function getSavedFlights(token: string): Promise<SavedFlight[]> {
  const res = await fetch(`${API_URL}/api/saved-flights`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error('Failed to load saved flights')
  }

  const data = await res.json()
  return data.savedFlights as SavedFlight[]
}

export async function saveFlight(
  token: string,
  flight: Omit<SavedFlight, 'createdAt'>,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/saved-flights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(flight),
  })

  if (!res.ok) {
    throw new Error('Failed to save flight')
  }
}

export async function unsaveFlight(token: string, offerId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/saved-flights/${offerId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error('Failed to unsave flight')
  }
}

export type OfferDetailSegment = {
  airline: string | null
  airlineLogo: string | null
  airlineLogoLockup: string | null
  flightNumber: string | null
  aircraft: string | null
}

export type OfferDetailSlice = {
  origin: string
  originCity: string
  destination: string
  destinationCity: string
  departingAt: string
  arrivingAt: string
  duration: string
  stops: number
  segments: OfferDetailSegment[]
}

export type OfferDetail = {
  id: string
  totalAmount: string
  totalCurrency: string
  totalEmissionsKg: string | null
  slices: OfferDetailSlice[]
  passengerCount: number
}

export async function getOffer(id: string): Promise<OfferDetail> {
  const res = await fetch(`${API_URL}/api/flights/${id}`)

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || 'Failed to load this flight.')
  }

  return res.json() as Promise<OfferDetail>
}