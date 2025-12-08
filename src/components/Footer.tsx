// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} aA.
        </p>

        <nav className="flex flex-wrap justify-center gap-4 md:justify-end">
          {/* Cambia o elimina estos enlaces según lo que tengas en tu proyecto */}
          <Link href="/acerca" className="hover:text-gray-800"></Link>
          <Link href="/dmca" className="hover:text-gray-800">
            DMCA
          </Link>
          <Link href="/privacidad" className="hover:text-gray-800"></Link>
          <Link href="/contacto" className="hover:text-gray-800">
            Contacto
          </Link>
        </nav>
      </div>
    </footer>
  )
}
