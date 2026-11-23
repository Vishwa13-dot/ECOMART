import { seedProducts } from './products'

const byId = Object.fromEntries(seedProducts.map((p) => [p.id, p]))

export const seedUsers = [
  { id: 'u0', name: 'EcoMart Admin', email: 'admin@ecomart.in', password: 'admin123', role: 'admin', joined: '2026-01-05T00:00:00.000Z' },
  { id: 'u1', name: 'Aarav Mehta', email: 'aarav@example.com', password: 'demo1234', role: 'customer', joined: '2026-03-12T00:00:00.000Z' },
  { id: 'u2', name: 'Diya Shah', email: 'diya@example.com', password: 'demo1234', role: 'customer', joined: '2026-04-02T00:00:00.000Z' },
  { id: 'u3', name: 'Kabir Nair', email: 'kabir@example.com', password: 'demo1234', role: 'customer', joined: '2026-05-21T00:00:00.000Z' },
  { id: 'u4', name: 'Meera Iyer', email: 'meera@example.com', password: 'demo1234', role: 'customer', joined: '2026-07-09T00:00:00.000Z' },
  { id: 'u5', name: 'Rohan Gupta', email: 'rohan@example.com', password: 'demo1234', role: 'customer', joined: '2026-09-30T00:00:00.000Z' },
]

const mk = (id, date, userIdx, lines, status, payment) => {
  const u = seedUsers[userIdx]
  const items = lines.map(([pid, qty]) => ({ id: pid, name: byId[pid].name, price: byId[pid].price, qty }))
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = subtotal >= 999 ? 0 : 79
  return {
    id, date, status, payment, items, subtotal, delivery, total: subtotal + delivery,
    customer: { name: u.name, email: u.email, phone: '9876543210', address: '12 Lake View Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  }
}

export const seedOrders = [
  mk('EM10021', '2026-06-14T10:00:00.000Z', 1, [['p1', 2], ['p5', 1]], 'Delivered', 'UPI'),
  mk('EM10034', '2026-07-22T10:00:00.000Z', 2, [['p21', 1]], 'Delivered', 'Card'),
  mk('EM10047', '2026-08-18T10:00:00.000Z', 3, [['p31', 2], ['p38', 1]], 'Delivered', 'Cash on delivery'),
  mk('EM10058', '2026-09-09T10:00:00.000Z', 1, [['p51', 1], ['p52', 2]], 'Delivered', 'UPI'),
  mk('EM10069', '2026-10-05T10:00:00.000Z', 4, [['p61', 1]], 'Shipped', 'Card'),
  mk('EM10073', '2026-10-27T10:00:00.000Z', 5, [['p71', 1], ['p10', 1]], 'Delivered', 'UPI'),
  mk('EM10081', '2026-11-12T10:00:00.000Z', 2, [['p14', 3]], 'Processing', 'Cash on delivery'),
  mk('EM10086', '2026-11-19T10:00:00.000Z', 3, [['p44', 1], ['p3', 1]], 'Processing', 'UPI'),
]

export const seedSellerApps = [
  { id: 'sa1', sellerName: 'Anjali Desai', business: 'Mitti Studio', email: 'anjali@mittistudio.in', phone: '9812345670', category: 'gifts', description: 'Hand-thrown clay planters and diyas from Kutch.', products: 'Planters, diyas, small vases (40 SKUs)', status: 'Pending', date: '2026-11-18T09:00:00.000Z' },
  { id: 'sa2', sellerName: 'Farhan Ali', business: 'Reuse Lab', email: 'farhan@reuselab.in', phone: '9900112233', category: 'fashion', description: 'Bags made from retired tent canvas.', products: 'Tote bags and pouches', status: 'Pending', date: '2026-11-20T09:00:00.000Z' },
  { id: 'sa3', sellerName: 'Sunita Rao', business: 'Green Shelf Refills', email: 'sunita@greenshelf.in', phone: '9701234567', category: 'personal-care', description: 'Refillable soaps and bath bars.', products: 'Bars and dispensers', status: 'Approved', date: '2026-10-30T09:00:00.000Z' },
]
