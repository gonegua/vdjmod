// src/app/dmca/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política DMCA y Aviso Legal | aA',
  description:
    'Política DMCA, aviso legal y procedimiento de notificaciones para aA.',
}

export default function DmcaPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold">
          Política DMCA y Aviso Legal de Derechos de Autor
        </h1>
        <p className="text-sm text-gray-500">
          Fecha de última actualización: 17 de noviembre de 2025
        </p>
      </header>

      <p>
        <strong>juegoversollasho.vercel.app/</strong> (en adelante, &quot;aA&quot;) es un
        índice público neutral de información sobre videojuegos y un agregador
        de enlaces disponibles abiertamente en Internet. El Sitio{' '}
        <strong>
          no aloja, distribuye, modifica ni almacena ningún archivo de
          videojuego, software o contenido protegido por derechos de autor
        </strong>
        .
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Naturaleza del Sitio</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            aA únicamente recopila y muestra información pública sobre
            lanzamientos de videojuegos (títulos, fechas, géneros,
            descripciones, capturas, etc.).
          </li>
          <li>
            Integra componentes y enlaces directos a las páginas oficiales de
            compra en plataformas legales para fomentar la adquisición legítima
            de los juegos.
          </li>
          <li>
            Los enlaces externos que puedan aparecer dirigen a sitios de
            terceros (servidores de alojamiento, foros, repositorios públicos,
            etc.) sobre los cuales aA no ejerce ningún control ni
            responsabilidad.
          </li>
          <li>
            aA no realiza, promueve ni facilita la elusión de medidas técnicas
            para la violación de protección (DRM).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Cumplimiento con la DMCA y legislación internacional
        </h2>
        <p>
          aA respeta plenamente los derechos de propiedad intelectual y cumple
          con la Digital Millennium Copyright Act (DMCA) de Estados Unidos, la
          Directiva 2001/29/CE de la Unión Europea y la legislación aplicable en
          materia de derechos de autor en todo el mundo.
        </p>
        <p>
          El Sitio actúa exclusivamente como proveedor de servicios de
          intermediación y motor de búsqueda de información pública, amparándose
          en las excepciones y limitaciones de responsabilidad previstas en:
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Sección 512 del Título 17 del Código de los Estados Unidos (DMCA
            safe harbor para &quot;information location tools&quot;).
          </li>
          <li>
            Artículo 14 de la Directiva 2000/31/CE (Directiva de Comercio
            Electrónico) sobre responsabilidad de prestadores de servicios de
            alojamiento y caché.
          </li>
          <li>
            Artículo 15 de la misma Directiva (ausencia de obligación general de
            supervisión).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          Procedimiento de notificaciones DMCA
        </h2>
        <p>
          Si considera que algún enlace o contenido indexado en aA infringe sus
          derechos de autor, le rogamos siga el siguiente procedimiento:
        </p>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            Envíe su reclamación al correo: <strong>aahspvdj@vk.com</strong>{' '}
            <span className="text-xs text-gray-500"></span>
          </li>
          <li>Incluya obligatoriamente la siguiente información:</li>
        </ol>
        <ul className="ml-4 list-inside list-disc space-y-1">
          <li>
            Identificación clara de la obra protegida por derechos de autor que
            se considera infringida.
          </li>
          <li>
            URL exacta en aA donde aparece el enlace presuntamente infractor.
          </li>
        </ul>
        <p>
          Una vez recibida la notificación y verificación, eliminaremos o
          desactivaremos el acceso al enlace señalado de la forma más inmediata
          (normalmente en menos de 24-48 horas).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Responsabilidad</h2>
        <p>
          aA no se hace responsable del contenido alojado en sitios de terceros
          ni del uso que los usuarios hagan de los enlaces externos. La
          presencia de un enlace no implica aprobación, patrocinio ni relación
          alguna con el sitio enlazado.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contacto</h2>
        <p>
          Para cualquier consulta relacionada con derechos de autor o alguna
          otra solicitud:
        </p>
        <p>
          <strong>Correo electrónico:</strong> aahspvdj@vk.com
        </p>
        <p>© 2025 aA</p>
      </section>
    </section>
  )
}
