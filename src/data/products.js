import { imageFor } from '../utils/format'

// Seller pool per category: [name, city]
const SELLERS = {
  reusable: [['GreenLoop Living', 'Pune'], ['Kaarigar Steelworks', 'Jaipur'], ['Terra Pantry', 'Bengaluru']],
  'personal-care': [['Bare Basin Co.', 'Kochi'], ['Neem & Nettle', 'Mysuru'], ['Ritu Botanicals', 'Dehradun']],
  'home-kitchen': [['Aangan Home', 'Ahmedabad'], ['Coir Collective', 'Alappuzha'], ['Slow Kitchen Co.', 'Chennai']],
  fashion: [['Thread & Tide', 'Kolkata'], ['Second Spin', 'Delhi'], ['Jutework Studio', 'Howrah']],
  stationery: [['Paperleaf', 'Pune'], ['Inkwell Collective', 'Hyderabad'], ['Corkline', 'Goa']],
  packaging: [['Packwell Naturals', 'Surat'], ['Kraftly', 'Mumbai'], ['Pulp Works India', 'Coimbatore']],
  gardening: [['Beej Garden Co.', 'Nashik'], ['Hariyali Supplies', 'Bhopal'], ['Rainroot', 'Bengaluru']],
  gifts: [['Haathi Handmade', 'Jaipur'], ['Sabai Craft Guild', 'Bhubaneswar'], ['Reclaim Studio', 'Pondicherry']],
}

// Plain-language care/disposal notes by category. These describe typical use, not environmental superiority.
const CAT = {
  reusable: {
    reusability: 'Made to be used repeatedly in place of single-use alternatives.',
    durability: 'Intended for long daily use when cleaned and stored as directed.',
    packaging: 'Shipped in paper-based packaging; no plastic fillers.',
    care: 'Wash with mild soap and warm water. Dry fully before storing.',
    disposal: 'At end of life, check local metal, glass or textile recycling for the main material.',
    caveat: 'A reusable item only replaces disposables if you use it many times, so choose what fits your routine.',
    blurb: 'Replaces a single-use item in your daily routine.',
  },
  'personal-care': {
    reusability: 'Reusable body or refillable container; consumable refills are sold separately where relevant.',
    durability: 'Lasts with regular use; wooden parts should be kept dry between uses.',
    packaging: 'Paper or cardboard outer packaging.',
    care: 'Rinse after use and let it air-dry. Keep wooden items away from standing water.',
    disposal: 'Separate materials where possible. Wooden parts can go to garden waste if untreated; check local rules.',
    caveat: 'Natural materials are not automatically lower-impact; how long you use the product matters most.',
    blurb: 'A simple swap for the bathroom shelf.',
  },
  'home-kitchen': {
    reusability: 'Designed for repeated use around the home.',
    durability: 'Durability depends on the material and how often it is used and washed.',
    packaging: 'Minimal paper packaging.',
    care: 'Rinse and air-dry after every use. Wash fabric items regularly.',
    disposal: 'Natural-fibre parts may be composted if clean; otherwise follow local recycling guidance.',
    caveat: 'Replace worn items only when needed; the most sustainable product is the one you keep using.',
    blurb: 'Everyday tools for cleaning, cooking and storage.',
  },
  fashion: {
    reusability: 'Made for repeated everyday use.',
    durability: 'Handmade and upcycled pieces can vary slightly in size and finish.',
    packaging: 'Shipped in a paper mailer or reused packaging.',
    care: 'Spot-clean or hand-wash gently as per the care label. Avoid prolonged sun exposure.',
    disposal: 'Donate or repair before discarding. Textile recycling is available in some cities.',
    caveat: 'Recycled or second-hand does not always mean lower impact than a well-made new item; buy only what you will wear or carry.',
    blurb: 'Made from recycled, reclaimed or pre-owned materials.',
  },
  stationery: {
    reusability: 'Notebooks and pens are used until full or empty; refillable items extend their life.',
    durability: 'Paper quality varies with recycled content; test before bulk buying.',
    packaging: 'Paper wrap, no plastic film.',
    care: 'Store in a dry place away from direct sunlight.',
    disposal: 'Paper parts are recyclable where paper recycling exists. Remove metal spirals and covers first.',
    caveat: 'Recycled paper can still be heavily processed; look at the seller note for details on content.',
    blurb: 'Paper goods for the desk, school bag or office.',
  },
  packaging: {
    reusability: 'Some items can be reused for shipping once or twice; others are single-use by design.',
    durability: 'Built for transit protection; strength depends on the grade and thickness listed.',
    packaging: 'Supplied flat or bundled with paper straps.',
    care: 'Keep dry. Flatten after use to save storage space.',
    disposal: 'Paper and cardboard: recycle where facilities exist. Compostable items need suitable composting conditions.',
    caveat: 'Compostable and recyclable depend on local facilities; check your area before relying on either.',
    blurb: 'Packing materials for small shops and gifting.',
  },
  gardening: {
    reusability: 'Planters, tools and kits are reusable season after season; seeds are single-use.',
    durability: 'Outdoor items weather over time; recycled plastic and metal parts last longest.',
    packaging: 'Paper or cardboard packaging.',
    care: 'Clean after each season. Store seeds in a cool, dry place.',
    disposal: 'Biodegradable pots can be planted or composted. Plastic and metal parts go to local recycling.',
    caveat: 'Plant only what suits your climate and space; seed packets list sowing windows for India.',
    blurb: 'Grow herbs, flowers and vegetables at home.',
  },
  gifts: {
    reusability: 'Most items are meant to be kept and reused as décor or everyday objects.',
    durability: 'Handmade pieces vary slightly; natural fibres may soften with use.',
    packaging: 'Gift-ready paper packaging; no plastic wrap.',
    care: 'Dust with a dry cloth. Keep away from damp areas.',
    disposal: 'Natural-fibre and wooden items can be repaired or passed on. Check local rules for composting.',
    caveat: 'A gift is most sustainable when it is something the person will actually keep and use.',
    blurb: 'Handmade and upcycled pieces from independent makers.',
  },
}

// [name, price (INR), material, image keywords]
const RAW = {
  reusable: [
    ['Stainless Steel Straws, Set of 6', 349, '304-grade stainless steel with silicone tips', 'metal,straws,drink'],
    ['Stainless Steel Lunch Box, 3-Tier', 899, 'Food-grade stainless steel with polypropylene lid', 'lunchbox,steel,food'],
    ['Silicone Food Storage Bags, Set of 4', 799, 'Platinum-cured food-grade silicone', 'silicone,food,storage'],
    ['Reusable Coffee Cup with Cork Sleeve', 549, 'Borosilicate glass, silicone lid, cork sleeve', 'coffee,cup,takeaway'],
    ['Cloth Produce Bags, Set of 5', 399, 'Cotton muslin', 'cotton,bag,vegetables'],
    ['Beeswax Reusable Food Wraps, Set of 3', 599, 'Cotton, beeswax, tree resin and jojoba oil', 'beeswax,wrap,food'],
    ['Collapsible Shopping Bag', 249, 'Recycled polyester (rPET) fabric', 'shopping,tote,bag'],
    ['Reusable Paper-Towel Alternative, Pack of 10', 449, 'Cotton and bamboo-viscose blend cloth', 'kitchen,cloth,towel'],
  ],
  'personal-care': [
    ['Bamboo Comb, Wide Tooth', 199, 'Bamboo, untreated finish', 'bamboo,comb,hair'],
    ['Wooden Hairbrush with Rubber Cushion', 449, 'Beechwood handle, natural rubber cushion', 'wooden,hairbrush'],
    ['Solid Shampoo Bar, Neem & Tulsi', 299, 'Saponified plant oils, neem, tulsi extract', 'shampoo,bar,soap'],
    ['Solid Conditioner Bar, Hibiscus', 329, 'Plant butters, hibiscus extract', 'conditioner,bar,natural'],
    ['Natural Loofah Sponges, Pack of 3', 249, 'Dried luffa gourd', 'loofah,sponge,bath'],
    ['Refillable Soap Dispenser, Glass & Bamboo', 499, 'Glass bottle, bamboo collar, steel pump', 'soap,dispenser,glass'],
    ['Reusable Makeup-Remover Pads, Set of 7', 349, 'Bamboo-cotton terry with cotton laundry bag', 'makeup,remover,pads'],
    ['Refillable Deodorant Container', 399, 'Aluminium body with push-up base', 'deodorant,container'],
    ['Safety Razor with 10 Replaceable Blades', 899, 'Stainless steel blades, chrome-plated brass handle', 'safety,razor,shaving'],
    ['Reusable Cotton Swabs with Washable Tips', 349, 'Silicone tips, ABS handle, travel case', 'cotton,swab,bathroom'],
  ],
  'home-kitchen': [
    ['Coconut Coir Scrubbers, Pack of 4', 199, 'Coconut coir fibre', 'coconut,coir,scrubber'],
    ['Wooden Dishwashing Brush, Replaceable Head', 249, 'Beechwood handle, sisal bristles', 'dish,brush,wooden'],
    ['Natural-Fibre Cleaning Cloths, Set of 3', 349, 'Cotton and jute weave', 'cleaning,cloth,cotton'],
    ['Reusable Mop Pads, Set of 3', 599, 'Microfibre (polyester-polyamide)', 'mop,pads,floor'],
    ['Kitchen Compost Bin, 5 L', 1199, 'Stainless steel with carbon filter', 'compost,bin,kitchen'],
    ['Refillable Cleaning Bottles, Set of 3', 699, 'Amber glass with stainless-steel spray heads', 'spray,bottle,glass'],
    ['Recycled Glass Storage Jars, Set of 4', 899, 'Recycled glass, bamboo lids', 'glass,jars,pantry'],
    ['Reusable Silicone Baking Mat', 549, 'Food-grade silicone over fibreglass mesh', 'baking,mat,silicone'],
    ['Wooden Kitchen Utensil Set of 5', 799, 'Sheesham wood, food-safe oil finish', 'wooden,spoons,utensils'],
    ['Solar-Powered Garden Lights, Set of 4', 1299, 'ABS housing, solar cell, rechargeable battery', 'solar,garden,lights'],
  ],
  fashion: [
    ['Jute Handbag with Cotton Lining', 999, 'Jute, cotton lining, cotton handles', 'jute,handbag'],
    ['Cork Wallet, Slim Bifold', 1199, 'Cork fabric on cotton backing', 'cork,wallet'],
    ['Recycled-Fabric Backpack', 1799, 'Recycled PET fabric, cotton webbing', 'backpack,canvas'],
    ['Upcycled Denim Tote Bag', 1299, 'Pre-used denim, cotton lining', 'denim,tote,bag'],
    ['Handmade Fabric Pouches, Set of 3', 449, 'Cotton offcuts, metal zips', 'fabric,pouch,handmade'],
    ['Recycled-Fabric Scrunchies, Pack of 5', 299, 'Textile offcuts, elastic', 'scrunchie,hair,fabric'],
    ['Upcycled Brass and Fabric Earrings', 599, 'Reclaimed brass, textile scraps', 'earrings,handmade,jewellery'],
    ['Second-Hand Cotton Kurta, Inspected', 699, 'Pre-owned cotton, professionally laundered', 'kurta,cotton,clothing'],
    ['Reusable Cloth Shoe Bags, Set of 2', 349, 'Cotton canvas with drawstring', 'shoe,bag,cloth'],
    ['Reclaimed Fabric Keychains, Set of 4', 299, 'Textile offcuts, metal rings', 'keychain,fabric'],
  ],
  stationery: [
    ['Recycled-Paper Notebook, A5 Ruled', 179, 'Recycled paper pages and cover, thread-bound', 'notebook,recycled,paper'],
    ['Seed Pencils, Pack of 10', 349, 'Recycled paper casing, graphite core, seed capsule', 'pencils,seed'],
    ['Refillable Metal Pen with 3 Refills', 399, 'Aluminium body, replaceable ink cartridges', 'metal,pen,writing'],
    ['Recycled-Paper Folders, Pack of 5', 249, 'Recycled board', 'paper,folders,office'],
    ['Cork Cover Notebook', 349, 'Cork cover, recycled paper pages', 'cork,notebook'],
    ['Reusable Whiteboard Notebook', 799, 'Laminated pages with wipeable surface, spiral binding', 'whiteboard,notebook'],
    ['Recycled-Paper Gift Tags, Pack of 25', 149, 'Recycled kraft paper, jute twine', 'gift,tags,kraft'],
    ['Recycled Cardboard Desk Organiser', 599, 'Recycled cardboard, water-based finish', 'desk,organizer,cardboard'],
    ['Paper-Based Sticky Notes, 6 Pads', 249, 'Paper with plant-based adhesive (seller-stated)', 'sticky,notes,desk'],
    ['Recycled-Paper Envelopes, Pack of 25', 199, 'Recycled paper', 'envelopes,paper'],
  ],
  packaging: [
    ['Recycled Cardboard Shipping Boxes, Pack of 10', 599, 'Corrugated recycled cardboard', 'cardboard,shipping,box'],
    ['Kraft Paper Mailers, Pack of 25', 499, 'Kraft paper with paper-based seal strip', 'kraft,mailer,package'],
    ['Paper-Based Packing Tape, 3 Rolls', 399, 'Kraft paper tape, water-activated adhesive', 'packing,tape,paper'],
    ['Moulded-Pulp Protective Packaging, Pack of 20', 699, 'Moulded paper pulp', 'pulp,packaging,protective'],
    ['Recycled-Paper Gift Bags, Pack of 12', 449, 'Recycled paper, cotton handles', 'gift,bag,paper'],
    ['Reusable Shipping Bags, Pack of 10', 899, 'Recycled polyethylene with zip closure', 'shipping,bags,reusable'],
    ['Paper Cushioning Rolls, 50 m', 549, 'Honeycomb kraft paper', 'paper,cushioning,wrap'],
    ['Compostable Food Containers, Pack of 25', 799, 'Sugarcane bagasse (compostability certificate available from seller)', 'bagasse,food,container'],
  ],
  gardening: [
    ['Seed Starter Kit with Tray', 649, 'Coir pellets, recycled plastic tray, plant markers', 'seed,starter,kit'],
    ['Coconut Coir Pots, Pack of 6', 399, 'Compressed coconut coir', 'coir,pots,seedling'],
    ['Kitchen Herb Seeds, Set of 6', 349, 'Open-pollinated seeds (organic status seller-stated)', 'herb,seeds,garden'],
    ['Home Composting Kit', 1499, 'Recycled HDPE bin, aeration tools, starter culture', 'compost,garden,bin'],
    ['Recycled-Plastic Planters, Set of 3', 899, 'Recycled HDPE, drainage holes', 'planters,pots,plants'],
    ['Water-Saving Drip Irrigation Kit', 1299, 'PVC tubing, polypropylene fittings, timer', 'drip,irrigation,garden'],
    ['Rainwater Collection Diverter Kit', 1699, 'UV-stabilised polypropylene, brass fittings', 'rainwater,barrel,garden'],
    ['Plantable Seed-Paper Cards, Pack of 10', 299, 'Recycled paper embedded with wildflower seeds', 'seed,paper,cards'],
    ['Recycled-Material Bird Feeder', 549, 'Reclaimed wood, recycled metal roof', 'bird,feeder,garden'],
    ['Solar-Powered Garden Lamp', 799, 'Powder-coated steel, solar cell, rechargeable battery', 'solar,lamp,garden'],
  ],
  gifts: [
    ['Sustainable Gift Hamper', 1999, 'Assorted: bamboo, cotton, glass and recycled paper items', 'gift,hamper,basket'],
    ['Handmade Sabai Grass Basket', 699, 'Sabai grass, hand-coiled', 'woven,basket,handmade'],
    ['Upcycled Tin Lantern', 899, 'Upcycled tin, brass accents', 'lantern,tin,decor'],
    ['Recycled-Glass Vase', 799, 'Recycled glass, hand-blown', 'glass,vase,flowers'],
    ['Handmade Paper Stationery Set', 499, 'Cotton-rag handmade paper', 'handmade,paper,stationery'],
    ['Reusable Festive Decorations, Set of 6', 649, 'Cotton fabric, wood, jute', 'festive,decoration,diwali'],
    ['Plantable Greeting Cards, Pack of 6', 449, 'Seed-embedded recycled paper', 'greeting,cards,paper'],
    ['Handmade Fabric Gift Wrap, Set of 3', 399, 'Cotton fabric squares, hand-hemmed', 'gift,wrap,fabric'],
    ['Reclaimed-Wood Wall Décor', 1499, 'Reclaimed teak offcuts', 'reclaimed,wood,wall'],
    ['Artisan Jute and Cork Coasters, Set of 4', 549, 'Hand-woven jute, cork backing', 'coasters,jute,table'],
  ],
}

const DAY = 864e5
let n = 0
export const seedProducts = []
Object.entries(RAW).forEach(([cat, rows]) => {
  rows.forEach((r, i) => {
    n += 1
    const [name, price, material, kw] = r
    const seller = SELLERS[cat][i % 3]
    const c = CAT[cat]
    const age = (n * 11) % 120
    seedProducts.push({
      id: `p${n}`,
      name,
      cat,
      price,
      oldPrice: n % 5 === 0 ? Math.round((price * 1.2) / 5) * 5 : null,
      material,
      desc: `${name} in ${material.toLowerCase()}. ${c.blurb} Sold by ${seller[0]}, ${seller[1]}.`,
      seller: { name: seller[0], city: seller[1] },
      images: [imageFor(kw, n), imageFor(kw, n + 200), imageFor(kw, n + 400)],
      sold: 20 + ((n * 53) % 380),
      createdAt: new Date(Date.UTC(2026, 10, 23) - age * DAY).toISOString(),
      featured: n % 8 === 3,
      eco: {
        material,
        reusability: c.reusability,
        durability: c.durability,
        packaging: c.packaging,
        care: c.care,
        disposal: c.disposal,
        sellerNote: `${seller[0]} describes this product as made in small batches in ${seller[1]}. EcoMart has not independently verified this statement.`,
        caveat: c.caveat,
      },
    })
  })
})

const NAMES = ['Aarav M.', 'Diya S.', 'Kabir N.', 'Meera I.', 'Rohan G.', 'Ananya P.', 'Vikram R.', 'Isha K.', 'Neha T.', 'Arjun D.']
const POOL = [
  [5, 'Well made and exactly as described', 'Feels sturdy and the finish is neat. Arrived in simple paper packaging.'],
  [4, 'Good quality for the price', 'Does the job. I wish the listing had a few more photos, but the product itself is fine.'],
  [5, 'Using it every day', 'Been using this daily for a few weeks and it has held up well so far.'],
  [4, 'Nice and simple', 'Looks better in person. Delivery took four days to Bengaluru.'],
  [3, 'Decent, but not perfect', 'Works as expected. The size was slightly smaller than I imagined, so check the dimensions.'],
  [5, 'Great gift', 'Bought this for a friend and she liked it. Neat packaging too.'],
  [4, 'Happy with it', 'Solid build. Instructions on care were helpful.'],
]
export const seedReviews = []
seedProducts.forEach((p, i) => {
  const count = 3 + (i % 4)
  for (let k = 0; k < count; k++) {
    const t = POOL[(i + k * 2) % POOL.length]
    seedReviews.push({
      id: `r${i}_${k}`,
      productId: p.id,
      name: NAMES[(i + k * 3) % NAMES.length],
      rating: t[0],
      title: t[1],
      text: t[2],
      date: new Date(Date.UTC(2026, 10, 20) - ((i * 5 + k * 17) % 150) * DAY).toISOString(),
    })
  }
})

export const testimonials = [
  { name: 'Priya Venkatesan', city: 'Chennai', text: 'I like that every product tells me what it is made of and how to look after it. No vague green claims, just the facts.' },
  { name: 'Sameer Khan', city: 'Mumbai', text: 'Ordered a small hamper for my sister. It arrived in paper packaging and looked lovely with no plastic in sight.' },
  { name: 'Lakshmi Rao', city: 'Hyderabad', text: 'As a seller, the application was simple and the team replied within two days. Customers can see my story on each product page.' },
]
