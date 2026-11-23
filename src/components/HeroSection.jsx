import { Link } from 'react-router-dom'
import SiteImage from './SiteImage'

const Leaf = ({ className = '', style }) => (
  <svg viewBox="0 0 40 40" className={`pointer-events-none absolute animate-float-leaf text-olive/40 ${className}`} style={style} aria-hidden="true">
    <path d="M6 34C6 18 16 7 34 6 34 24 24 34 6 34z" fill="currentColor" />
    <path d="M6 34C14 24 22 17 30 11" stroke="#FAF7F2" strokeWidth="1.2" fill="none" />
  </svg>
)

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <Leaf className="left-[4%] top-[12%] h-9 w-9" style={{ '--r': '-20deg' }} />
      <Leaf className="bottom-[10%] left-[44%] hidden h-6 w-6 sm:block" style={{ '--r': '35deg', animationDelay: '-3s' }} />
      <div className="container-x grid items-center gap-10 py-12 md:grid-cols-[1.05fr_1fr] md:py-20">
        <div className="max-w-xl">
          <h1 className="animate-fade-up text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">Small Choices. Greener Living.</h1>
          <p className="mt-6 max-w-md animate-fade-up text-lg leading-relaxed text-ink/70 [animation-delay:150ms]">
            EcoMart brings together independent Indian makers of reusable, repairable and recycled goods, each listed with what it&rsquo;s made of and how to look after it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up [animation-delay:300ms]">
            <Link to="/shop" className="btn-primary px-8 py-3.5">Shop now</Link>
            <a href="#categories" className="btn-outline px-8 py-3.5">Explore categories</a>
          </div>
        </div>
        <div className="relative animate-fade-in [animation-delay:200ms]">
          <div className="absolute -bottom-5 -left-5 hidden h-3/4 w-3/4 bg-cream sm:block" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden bg-sand shadow-lift">
            <SiteImage slot="hero" className="h-full w-full animate-drift" />
          </div>
        </div>
      </div>
    </section>
  )
}
