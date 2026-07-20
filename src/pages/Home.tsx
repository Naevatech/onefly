// import React from 'react'
import hero from '../assets/Hero.png'
import Features from '../component/Features'
import Search from '../component/Search'

const Home = () => {
  return (
    <>
    <section className="relative overflow-hidden bg-background w-full ">
      <img
        src={hero}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80 dark:opacity-[0.15] dark:invert"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container-page relative flex flex-col items-center gap-6 py-2 text-center sm:py-28 md:py-36">
        <h1 className="max-w-2xl font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
          It&rsquo;s more than
          <br />
          just a trip
        </h1>

        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Discover flights, stays, and experiences that make every journey
          worth remembering.
        </p>
      </div>

    </section>
      <Search />
      <Features />
    </>


  )
}

export default Home