import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import type { OfferDetail } from '../suggestion/api'

type Passenger = {
    title: string
    firstName: string
    lastName: string
    dateOfBirth: string
    nationality: string
    passportNumber: string
}

const emptyPassenger = (): Passenger => ({
    title: 'Mr',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
})

const titleOptions = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr']

// "1990-04-12" → "12/04/1990"
const formatDob = (iso: string) => {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
}

const inputStyles =
    'rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:border-primary'

const TravelerDetails = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const offer = (location.state as { offer?: OfferDetail } | null)?.offer
    const passengerCount = offer?.passengerCount ?? 1

    const [passengers, setPassengers] = useState<Passenger[]>(() =>
        Array.from({ length: passengerCount }, emptyPassenger),
    )
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        setPassengers((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
    }

    // This button will either handle payment checkout or seat selection and also will send an email to the user with the booking details
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        navigate('/seats', {
            state: { offer, passengers, contact: { email, phone } },
        })
    }

    if (!offer) {
        return (
            <section className="mx-auto flex w-4/5 max-w-(--page-max-width) flex-col items-center gap-4 py-24 text-center">
                <h2 className="font-heading text-2xl font-bold text-foreground">No flight selected</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                    Traveler details need a flight to book first — head back and pick one.
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
            <div className="mb-6">
                <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                    Traveler details
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Enter names exactly as they appear on each passport.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
                {passengers.map((passenger, index) => (
                    <div key={index} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                        <h2 className="mb-4 text-sm font-bold text-foreground">
                            Passenger {index + 1} · {index === 0 ? 'Lead traveler' : ' '}
                        </h2>

                        {/* Title / First name / Last name */}
                        <div className="mb-4 grid grid-cols-3 gap-3">
                            <select
                                value={passenger.title}
                                onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                                aria-label="Title"
                                className={inputStyles}
                            >
                                {titleOptions.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={passenger.firstName}
                                onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                                placeholder="First name"
                                aria-label="First name"
                                required
                                className={inputStyles}
                            />
                            <input
                                type="text"
                                value={passenger.lastName}
                                onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                                placeholder="Last name"
                                aria-label="Last name"
                                required
                                className={inputStyles}
                            />
                        </div>

                        {/* Date of birth / Nationality / Passport number */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Date of birth
                                </label>
                                <div className="relative flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
                                    <span
                                        className={
                                            passenger.dateOfBirth
                                                ? 'text-sm font-medium text-foreground'
                                                : 'text-sm font-normal text-muted-foreground'
                                        }
                                    >
                                        {passenger.dateOfBirth ? formatDob(passenger.dateOfBirth) : 'DD/MM/YYYY'}
                                    </span>
                                    <Calendar size={15} className="pointer-events-none shrink-0 text-muted-foreground" />
                                    <input
                                        type="date"
                                        value={passenger.dateOfBirth}
                                        onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                                        aria-label="Date of birth"
                                        required
                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Nationality
                                </label>
                                <input
                                    type="text"
                                    value={passenger.nationality}
                                    onChange={(e) => updatePassenger(index, 'nationality', e.target.value)}
                                    placeholder="e.g. Nigerian"
                                    required
                                    className={inputStyles}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Passport number
                                </label>
                                <input
                                    type="text"
                                    value={passenger.passportNumber}
                                    onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                                    placeholder="A01234567"
                                    required
                                    className={inputStyles}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Contact details */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <h2 className="text-sm font-bold text-foreground">Contact details</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        We&rsquo;ll send your e-ticket and trip updates here.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            className={inputStyles}
                        />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone number"
                            required
                            className={inputStyles}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="glow-ring rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                    >
                        Continue to confirm Payment
                    </button>
                </div>
            </form>
        </section>
    )
}

export default TravelerDetails