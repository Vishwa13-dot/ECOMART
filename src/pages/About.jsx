import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SiteImage from '../components/SiteImage'
import Reveal from '../components/Reveal'

const blocks = [
  ['Our mission', 'Make it easy to buy things that last, can be repaired or reused, and come with honest information about what they are made of.'],
  ['Our vision', 'A marketplace where independent makers can reach customers across India, and where shoppers can compare products on facts, not slogans.'],
  ['Our sustainability commitment', 'We don’t label products “eco-friendly” on material alone. Each listing shows its material, expected lifespan, care and disposal, and marks which statements come from the seller.'],
]

export default function About() {
  return (
    <>
      <PageHeader title="About EcoMart">A small marketplace for people who would rather buy fewer, better things.</PageHeader>
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">Our story</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-ink/75">
            <p>EcoMart began with a simple frustration: finding a good reusable bottle or a recycled-paper notebook meant scrolling past vague green claims, with little detail on what the product was actually made of.</p>
            <p>We started by talking to makers in Jaipur, Kochi and Kolkata, and asked each of them for the same few facts: material, care, lifespan and what to do with it afterwards. Those answers became the format of every product page here.</p>
          </div>
        </Reveal>
        <Reveal delay={100}><SiteImage slot="about-story" className="aspect-[4/3] w-full" /></Reveal>
      </section>
      <section className="bg-cream/60">
        <div className="container-x grid gap-10 py-16 md:grid-cols-3">
          {blocks.map(([t, d], i) => <Reveal key={t} delay={i * 80}><h3 className="text-2xl">{t}</h3><p className="mt-3 leading-relaxed text-ink/75">{d}</p></Reveal>)}
        </div>
      </section>
      <section className="container-x grid gap-12 py-16 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl">Why EcoMart</h2>
          <ul className="mt-5 space-y-3 text-ink/75">
            <li>Every listing includes material, durability, care and disposal information.</li>
            <li>Seller statements are labelled and not presented as verified fact.</li>
            <li>Simple pricing in rupees, with free delivery above ₹999.</li>
            <li>Returns within 7 days for unused items.</li>
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-3xl">Supporting sustainable businesses</h2>
          <p className="mt-5 leading-relaxed text-ink/75">Most of our sellers are small studios and family workshops. We review each application, ask for sample products and product details, and keep our seller fee low so makers keep more of every sale.</p>
          <Link to="/sell" className="btn-primary mt-6">Apply to sell on EcoMart</Link>
        </Reveal>
      </section>
    </>
  )
}
