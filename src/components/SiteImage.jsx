import { useStore } from '../context/StoreContext'
import { slotByKey } from '../utils/images'
import ProductImage from './ProductImage'

// A site-wide image slot (hero, story photos...). Managed in Admin > Images.
export default function SiteImage({ slot, alt, className = '' }) {
  const { siteImage } = useStore()
  return <ProductImage src={siteImage(slot)} alt={alt ?? slotByKey(slot)?.alt ?? ''} className={className} />
}
