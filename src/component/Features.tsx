import { Map, Armchair, Smartphone, Users } from 'lucide-react'

const features = [
  {
    icon: Map,
    title: 'Connecting you to the world',
    description:
      'Endless possibilities. Discover flights to over 5,000 destinations across more than 190 countries.',
  },
  {
    icon: Armchair,
    title: 'Comfort on the go',
    description:
      'Kick back with free Wi-Fi, extra legroom seats, and in-flight entertainment. That\u2019s what modern air travel is about.',
  },
  {
    icon: Smartphone,
    title: 'Choose, book, travel',
    description:
      'From your screen to your seat in seconds. You do the searching, we\u2019ll take care of the rest.',
  },
  {
    icon: Users,
    title: 'Go together',
    description:
      'Book for the whole group in one go \u2014 friends, family, or colleagues, all on the same itinerary.',
  },
]

const Features = () => {
  return (
    <section className="border-border bg-background py-16 sm:py-20">
      <div className="mx-auto grid w-4/5 max-w-(--page-max-width) grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 sm:gap-x-8">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-4xl bg-primary">
              <Icon size={24} className="text-primary-foreground" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 font-heading text-base font-bold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features