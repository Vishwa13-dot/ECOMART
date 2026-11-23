import { useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import { useStore } from '../../context/StoreContext'
import { SITE_SLOTS, defaultSiteRef, hasFileOverride } from '../../utils/images'
import AdminHeading from '../../components/AdminHeading'
import ImagePicker from '../../components/ImagePicker'

function Slot({ slot }) {
  const { siteImages, setSiteImage, addMedia, resolveImage } = useStore()
  const [pending, setPending] = useState(null) // unsaved choice: { dataUrl } | { url }
  const saved = siteImages[slot.key]
  const preview = pending ? pending.dataUrl || pending.url : resolveImage(saved || defaultSiteRef(slot.key))
  const save = () => { setSiteImage(slot.key, pending.dataUrl ? addMedia(pending.dataUrl) : pending.url); setPending(null) }
  return (
    <section className="border border-sand bg-white p-5">
      <h2 className="text-lg">{slot.label}</h2>
      <p className="mb-4 mt-0.5 text-xs text-ink/60">{slot.where}. Recommended shape: {slot.ratio}.</p>
      <ImagePicker
        preview={preview} ratio="aspect-[4/3]" isCustom={!!saved || !!pending}
        note={pending ? 'Preview only. Press “Save image” to publish it on the site.' : hasFileOverride.site(slot.key) ? 'Currently using a file from src/assets/images/site/.' : undefined}
        onPick={setPending}
        onReset={() => { if (pending) setPending(null); else setSiteImage(slot.key, null) }}
        resetLabel={pending ? 'Discard' : 'Reset to default'}
      />
      {pending && <button type="button" className="btn-primary btn-sm mt-3" onClick={save}>Save image</button>}
    </section>
  )
}

export default function AdminImages() {
  const { resetAllImages, mediaCount } = useStore()
  return (
    <>
      <AdminHeading title="Site images" action={<button className="btn-outline btn-sm" onClick={() => window.confirm('Reset EVERY image (products, categories and site images) to the defaults? Uploaded images will be deleted.') && resetAllImages()}>Reset all images</button>}>
        Banners and story photos used across the storefront. Product photos are edited under Products; category photos under Categories.
      </AdminHeading>
      <div className="mb-6 flex gap-3 border border-sand bg-cream/60 p-4 text-sm text-ink/75">
        <FiAlertTriangle className="mt-0.5 shrink-0 text-olive" />
        <p>Uploaded images are stored in this browser ({mediaCount} stored). For a permanent, shared setup, put the files in <code className="bg-white px-1">src/assets/images/</code> (see the README there) and redeploy.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">{SITE_SLOTS.map((s) => <Slot key={s.key} slot={s} />)}</div>
    </>
  )
}
