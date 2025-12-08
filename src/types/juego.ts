// src/types/juego.ts

export type Etiqueta = {
  id: number
  nombre: string
  slug: string
}

export type Juego = {
  id: string
  titulo: string
  descripcion: string
  imagen: string
  categoria?: string
  video?: string
  enlace_descarga?: string

  // ID / URL / iframe del widget de Steam
  // - Puede ser: "2356560", 2356560, "https://store.steampowered.com/widget/2356560/", "<iframe ...>"
  steam_widget_iframe?: string | number | null

  etiquetas?: Etiqueta[]
}
