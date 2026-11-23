export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isPhone = (v) => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, ''))
export const isPincode = (v) => /^[1-9]\d{5}$/.test(v.trim())
