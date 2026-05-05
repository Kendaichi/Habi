import {
  ArrowLeft,
  Phone,
  Navigation,
  BadgeCheck,
  Star,
  MapPin,
  Download,
  Package,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { BottomNav } from '@/components/artisan/BottomNav'

const inventory = [
  {
    name: 'HDPE Flakes',
    price: '₱42/kg',
    qty: '450 kg',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY3Pe9_JCJAG5hpQ8VM1ybmRIcNv3izEBeDLBiBv0xmwMqjG2Rqnk6b2y3CCw6590QQItpbsWWgSKjBSknt_XjapHgkTirsMjR-GIjBJWM9yDZtt_ajWEjlKavUUxS7S1L2tpUNfQaGRfR_hrjWRBFisIfme07w5mz0Ntng4pP_cMlqad5ulSY81Whjhef5HQAJIyqq2H8nB5tDwVF_iKZxpjjfKhlmg8KyYfHRhv_GGpXOXa3TIwFJ0emZuZxdPg4zyqa3iMp4ca2',
  },
  {
    name: 'Clear PET',
    price: '₱18/kg',
    qty: '1,200 kg',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeESIM0SO3D_OFUu8hbsLfCj1ikD22gVjIml9R87WFwUUbNqOBE3UfoF_aJ_jB1JL-15MhNs2vnM_62KAZ402d2piDDgUD0EYS8MGpDnGvwtkhX9lecXg4M-HhdZuyPW71B1HrdtpUgDlcYRjmb9HpoJ-LJZbdZfu-dE_e6_WLpxYR2jU6fYloHVjVFN58G9_6JDKDqYgd-nqxtB_VYPNaLflJ0kF5f0w3D0ef2T7rVAf3FP2zu3Ga3v3ukaYT6QHSsqnp1qm1O3lu',
  },
  {
    name: 'Corrugated Box',
    price: '₱8.50/kg',
    qty: '3,400 kg',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXRgsIzjMPZ4MFKHW_NqvYiU8hsWm8hO6Nn1j92Q89FQoqQDXcexAZrLJIZ2XiKXwNOf_BnoiVvg-gfnrImv5Kx6digPxkfZ8EE7Zf_5RxQ1ffs3UE6AgfCJdOPqzswWkuB1PIJoSbgN7AkIv7o0XBAKViG1MGH5p2WkwHfrZlyNl42VmbbJKCxhZUWrfgHw_DMI0ZYQOZYnOR8liWqmSHeQ5SeMEZqF_yd2sMtlMJc3z80sEjqBHzEu2HZIJUufEgIAAG-9m6',
  },
  {
    name: 'Mixed Metals',
    price: '₱115/kg',
    qty: '120 kg',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBVXb2wo2B8AHy9vldS-yzOEtJg9YTHlkZ7aNHiwv7SN7rSubP4SHWAUF0mpac7G3px5Ubwk8D3agpP2ghvq17JdhcQ53daTtM8QBsoLCpWLlxPKtOVbjPX2OKLVVOSXLNP8BtP73y3Mg6fRgB0OcOYd4cCgTrPwJgMsKvO0XErxM9DV3wrL7WYkvsk1_Y9XxR9_uB_uIT_k9vemuTUMeoC5sRYo9XQfaghmntqFShk4o7H6hqlc-CktC2HKDB3GC0SRxt9EW9StX5',
  },
]

const processSteps = [
  {
    icon: <RefreshCw className="text-forest h-8 w-8" />,
    title: 'Eco-Shredding',
    desc: 'Precision reduction of materials using low-emission hardware to minimize carbon footprint during processing.',
  },
  {
    icon: <Sparkles className="text-forest h-8 w-8" />,
    title: 'UV Sanitization',
    desc: 'Advanced ultraviolet light treatment ensures all inventory is pathogen-free and ready for artisanal reuse.',
  },
]

const galleryImgs = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOh8id_otJI8rJ_Wz2_MwvrH-x7JXf7Az_IPBJIpFMwUkP_JaMpHEG-CBa7r4gKA0ydqpNVnM27MJlpPO4ImCmBpKCMgKWIOFk12iWllUYBqr_evz6SI24wncCeUdR6Hc44v8VGf4XhUwRCJonlXRN3I_-Z5r4eNcV5hY513_pHC2ck6kaGi5tUDbUeLfBpqWl3Kh1BIk6dInOJNS-Nezl6wQUoh2hThaZpkaVMs3Q3teWonhgjvO-FOHs_2I9yHjkNSV2w0IcB6aI',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn1XXrzurX8XE-4BgEEJsKd_41pc9_PE-ft9FzyZ6ZwdLp4lQ51vT6k8CQU09CFLq2bVehfnE_Qr2bsqwKN9FOZ677w7huMJojv31P_VxfcCSg1y5-lYXklImuWz5qr0WUP2cx_tfpfqlcqW0D_m2Fcs1JOCwSR3JPZcmsCHHAq8OlpgEvhSxOqBxq7vr7vuC7-CBriAJeiPm7BDJT1vUhWDApLWJhzwyNwOTIolEpTX3uU_Un6zbFOvTvwMUH0Gwz-i2VFQFOQoHa',
    span: 'col-span-2',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4EHDl6053Smk5zzAjPoYLhDkI2nY6xilGWOeJkuDTgpPTAEK3xSYaJpXUUsy8u1Hcd9HlhJKPkWCEhO4hjvNODxZWUTDb8AoKuSYFvVjLpl5JPZWyxaz3vJyUMmbIXiDhWOstexOXeefOYn0g1u8rBDCMbF4sem1bqgTWkqcKN1AaQqeHKFgNzP8cDdRBsR0Nw9gmPI5BduNCSFdW5a8g8UzMkj0RJdFadQmR-Kq51gpt8qJKMPok5yKe3bN67w9P7otssy6IMUT6',
    span: '',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoMZinIAibVb4LF2gYau6dMFs983mQ7LKFFYK0dUftiKY1EEAAsMDbwbMmDk3YWzC3g73ONcaSbpv82uvBY7BfXXO-FPyosjf5gu5AhT3xfvwqsdgw2KPHdiF1qWqyQkpBTYKv2I9KE-wWVz-QMyOLB1lXaWtoxozO5lA0a-TYv-wvvgHc95rK7EuK-DIUpB_HxWv8GXyBuc2smP1xkeVPSNXDCAf32kRXKGGLelem_QdHRfBQ_BVVV7qASXqjRKFtLAQZi',
    span: '',
  },
]

export default async function HubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await params

  return (
    <div className="bg-cream min-h-screen pb-28">
      {/* Header */}
      <header className="border-border bg-cream/90 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-5 backdrop-blur-sm">
        <Link href="/artisan/materials" className="text-forest hover:bg-forest/10 rounded-full p-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-heading text-forest text-base font-bold">Hub Details</span>
        <div className="w-9" />
      </header>

      <div className="space-y-10 px-5 pt-6">
        {/* Hero */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-forest/10 text-forest flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
              <BadgeCheck className="h-3 w-3" />
              Verified Hub
            </span>
            <div className="text-mustard flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="fill-mustard h-3.5 w-3.5" />
              ))}
              <Star className="fill-mustard/40 h-3.5 w-3.5" />
              <span className="text-stone ml-1 text-xs">(4.9/5)</span>
            </div>
          </div>

          <h1 className="font-heading text-forest mb-2 text-3xl leading-tight font-bold">
            Koronadal Recyclers
          </h1>
          <p className="text-stone mb-6 text-sm leading-relaxed">
            An artisanal approach to waste management in South Cotabato. We transform discarded
            materials into pristine resources through indigenous wisdom and modern technology.
          </p>

          <div className="flex gap-3">
            <button className="bg-forest text-cream hover:bg-forest/90 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-lg transition-all active:scale-95">
              <Phone className="h-4 w-4" />
              Contact to Reserve
            </button>
            <button className="border-border text-charcoal hover:bg-muted flex flex-1 items-center justify-center gap-2 rounded-xl border bg-white py-3 text-sm font-semibold transition-all active:scale-95">
              <Navigation className="h-4 w-4" />
              Get Directions
            </button>
          </div>

          {/* Hub image */}
          <div className="group relative mt-6 aspect-4/3 overflow-hidden rounded-3xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4iqbk--auG-6iHrCCy_XwPiPsZAwFuM5fJQJzGIHYjR8qCJ7byzPSp5o7FHxoZnOtxMPwdZ9bMpHFEgUmzAZ4U_34XjhHt5mEblQ9Z3dwLhG5Eokt_N_juzm_tvMkwqs5Q44-LIK2-vpJkVCoRWmAZYhEhdNP7PdMyx1jNfKEhxvcO0EzVqT9DIt7KxhGIvkkpo0fgmMjO1WXYaVjSx9WdArg7d6C_BmBE-Nli6u98KSSmh0XeFdh2mze3oxenjyLsSqPwNYIfrW9"
              alt="Koronadal Recyclers facility"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/90 p-3 backdrop-blur-md">
              <div className="bg-muted h-12 w-12 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGI5gFGaOAz764M-0vlpn9bdpgwKF3zvmJxyncoRad6mSxLDmfsJH35ec1qRwtE4chKe-hahnqkI8LLLEEj7HOcnu43EsqdMsh-YfYpJscYSmPKFRtfG8di1-BPzcO1O8CdPL-i-SCn2DT9zCMSBvpntoX4j2eGfLE9Tarqcp_YN_Z46_sOqe-X9yp5dEGifpqGTeBwTRXpsay9aDSGsangT72fhJo_QtOMAriuht2DlYPU9HLZZnsdFGFq4sv8rW-RsJN5iHfVXPX"
                  alt="Map"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-terracotta text-[10px] font-bold tracking-wider uppercase">
                  Location
                </p>
                <p className="text-charcoal text-sm font-bold">General Santos Drive, Koronadal</p>
              </div>
              <MapPin className="text-stone ml-auto h-4 w-4" />
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-border border-t pt-8">
          <h3 className="font-heading text-forest mb-2 text-xl font-bold">Our Ginhawa Process</h3>
          <p className="text-stone mb-6 text-sm">
            We believe that even discarded items deserve a second life of dignity. Our process is
            designed to ensure maximum purity and safety.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {processSteps.map((step) => (
              <div
                key={step.title}
                className="border-border bg-muted rounded-3xl border p-6 transition-all hover:shadow-lg"
              >
                <div className="mb-4">{step.icon}</div>
                <h4 className="font-heading text-charcoal mb-2 text-base font-bold">
                  {step.title}
                </h4>
                <p className="text-stone text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live inventory */}
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="font-heading text-forest text-xl font-bold">Live Inventory</h3>
              <p className="text-stone text-xs">Updated today at 8:30 AM</p>
            </div>
            <button className="text-forest flex items-center gap-1 text-xs font-semibold hover:underline">
              Download Price List
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {inventory.map((item) => (
              <div
                key={item.name}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-muted aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-start justify-between gap-1">
                    <h5 className="font-heading text-charcoal text-sm leading-snug font-bold">
                      {item.name}
                    </h5>
                    <span className="text-mustard shrink-0 text-xs font-bold">{item.price}</span>
                  </div>
                  <div className="text-stone mb-3 flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-semibold">{item.qty} Available</span>
                  </div>
                  <button className="border-forest text-forest hover:bg-forest hover:text-cream w-full rounded-xl border py-2 text-xs font-bold transition-colors">
                    Add to Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="pb-4">
          <h3 className="font-heading text-forest mb-6 text-center text-xl font-bold">
            Inside the Hub
          </h3>
          <div className="grid auto-rows-[150px] grid-cols-2 gap-3">
            {galleryImgs.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-3xl ${img.span}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={`Hub gallery ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  )
}
