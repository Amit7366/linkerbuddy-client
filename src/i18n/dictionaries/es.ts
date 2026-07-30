import type { Dictionary } from "@/i18n/dictionaries/en";

export const es: Dictionary = {
  common: {
    signIn: "Iniciar sesión",
    getCustomList: "Lista personalizada",
    skipToMarketplace: "Ir al marketplace",
    loading: "Cargando página",
    toggleNav: "Abrir navegación",
    themeLight: "Cambiar a modo claro",
    themeDark: "Cambiar a modo oscuro",
    language: "Idioma",
    chooseLanguage: "Elegir idioma",
  },
  nav: {
    services: "Servicios",
    agencies: "Para agencias",
    howItWorks: "Cómo funciona",
    pricing: "Precios",
    resources: "Recursos",
    marketplace: "Marketplace",
    chooseMarket: "Elige un mercado",
  },
  marketplaceCountries: {
    IN: { name: "India", description: "Colocaciones .in verificadas" },
    US: { name: "Estados Unidos", description: "Sitios de autoridad en EE. UU." },
    ES: { name: "España", description: "Alcance en España y LatAm" },
    GB: { name: "Reino Unido", description: "Editores de nicho en el Reino Unido" },
    DE: { name: "Alemania", description: "Sitios del mercado DACH" },
    AU: { name: "Australia", description: "Guest posts en ANZ" },
    CA: { name: "Canadá", description: "Inventario canadiense" },
    AE: { name: "EAU", description: "Colocaciones en el Golfo" },
  },
  hero: {
    breadcrumbHome: "Inicio",
    breadcrumbGuest: "Sitios de guest post",
    breadcrumbIndia: "India",
    eyebrow: "Marketplace de colocaciones en India",
    titleLine1: "Guest posts indios.",
    titleLine2: "Verificados, no adivinados.",
    subtitle:
      "Encuentra sitios indios listos para publicar con tráfico orgánico real, precios transparentes y plazos en los que puedes planificar.",
    ctaBrowse: "Ver sitios verificados",
    ctaShortlist: "Crear mi shortlist",
    trust: {
      noFees: "Sin cargos ocultos",
      replacement: "Reemplazo en 7 días",
      reports: "Informes de URL en vivo",
    },
    campaignBuilder: "Constructor de campaña",
    indiaAuthority: "Enlaces de autoridad en India",
    liveInventory: "Inventario en vivo",
    searchPlaceholder: "Buscar por nicho, dominio o métrica...",
    sitesSelected: "2 sitios seleccionados",
    estimatedTotal: "Total estimado",
    continue: "Continuar →",
    trafficChecked: "Tráfico verificado",
    trafficDate: "14 jul 2026",
    stats: {
      websites: "Sitios indios",
      niches: "Nichos cubiertos",
      tat: "Días TAT promedio",
      dofollow: "Dofollow disponible",
    },
    qualityTitle: "Inventario con control de calidad",
    qualitySub: "Las métricas son datos de demostración",
  },
  marketplace: {
    kicker: "Descubrimiento inteligente",
    title: "Selecciona los sitios correctos en minutos",
    description:
      "Filtra por las métricas que importan, compara opciones y arma una sola lista de campaña.",
    badge: "Prototipo · Inventario demo",
    verified: "{count} colocaciones verificadas",
    updated: "actualizado para esta demo",
    sortBy: "Ordenar por",
    sort: {
      recommended: "Recomendado",
      price: "Precio: de menor a mayor",
      traffic: "Mayor tráfico",
      dr: "Mayor DR",
    },
    filters: {
      all: { label: "Todos los sitios", sub: "Inventario completo" },
      budget: { label: "Menos de $50", sub: "Opciones económicas" },
      authority: { label: "DR 40–60", sub: "Sitios de autoridad" },
      traffic: { label: "Tráfico 10K+", sub: "Alto tráfico" },
      Technology: { label: "Tecnología", sub: "Nicho tech" },
      Business: { label: "Negocios", sub: "Nicho business" },
      admin: { label: "Sitios admin", sub: "Control directo" },
    },
    columns: {
      website: "Sitio web",
      niche: "Nicho",
      dr: "DR",
      traffic: "Tráfico orgánico",
      indiaShare: "Cuota India",
      guestPost: "Guest post",
      tat: "TAT",
      action: "Acción",
    },
    addSite: "Añadir sitio",
    selected: "Seleccionado",
    viewMore: "Ver más colocaciones ↓",
    moreLoaded: "Más inventario demo cargado",
  },
  benefits: {
    kicker: "Hecho para comprar con confianza",
    title: "Cada señal que necesitas. Nada oculto.",
    items: {
      inventory: {
        title: "Inventario directo y confiable",
        description:
          "Sitios administrados y socios verificados con historial de colocaciones claro.",
      },
      processing: {
        title: "Procesamiento rápido de pedidos",
        description: "Tiempos de entrega claros y un flujo de aprobación simplificado.",
      },
      replacement: {
        title: "Garantía de reemplazo",
        description: "Política definida de reemplazo si un enlace elegible se elimina.",
      },
      report: {
        title: "Un informe en vivo",
        description: "URLs, textos ancla, páginas destino, costos y estado en un solo lugar.",
      },
    },
  },
  agency: {
    kicker: "Linkerbuddy para agencias",
    title: "Escala la entrega sin escalar el caos.",
    description:
      "Un socio confiable de colocaciones para campañas recurrentes, costos transparentes e informes listos para el cliente.",
    perks: {
      pricing: "Precios mayoristas para revendedores",
      manager: "Gestor de campaña dedicado",
      reports: "Informes white-label",
      inventory: "Inventario privado bajo petición",
    },
    cta: "Ver precios para agencias →",
    overview: "Resumen de campaña",
    month: "Julio 2026",
    metrics: {
      live: "Colocaciones activas",
      tat: "TAT promedio",
      ontime: "A tiempo",
    },
    toast: "Solicitud de precios para agencias recibida",
  },
  steps: {
    kicker: "Un flujo más claro",
    title: "Del brief al enlace en vivo en cuatro pasos",
    items: {
      "01": {
        title: "Filtra o comparte tu brief",
        description:
          "Elige colocaciones tú mismo o dinos tu nicho, tráfico y presupuesto.",
      },
      "02": {
        title: "Aprueba tu shortlist",
        description: "Revisa métricas, precios, reglas de contenido y plazos.",
      },
      "03": {
        title: "Publicamos",
        description:
          "Nuestro equipo coordina el contenido y la publicación en cada sitio seleccionado.",
      },
      "04": {
        title: "Recibe tu informe",
        description: "Obtén la URL en vivo y los detalles de campaña en un informe listo para el cliente.",
      },
    },
  },
  faq: {
    kicker: "Preguntas frecuentes",
    title: "Sabe exactamente qué estás pidiendo.",
    description: "Respuestas claras antes de comprometer el presupuesto de campaña.",
    contact: "¿Aún tienes dudas? Habla con el equipo →",
    items: {
      verified: {
        q: "¿Cómo se verifican los sitios y el tráfico?",
        a: "El inventario se revisa por visibilidad orgánica, tendencia de tráfico, calidad editorial, patrones de enlaces salientes e historial de publicación.",
      },
      dofollow: {
        q: "¿Los enlaces son permanentes y dofollow?",
        a: "Este prototipo muestra dónde se responderán con claridad las políticas y objeciones de compra antes del checkout.",
      },
      niches: {
        q: "¿Puedo pedir colocaciones de casino, crypto o CBD?",
        a: "Este prototipo muestra dónde se responderán con claridad las políticas y objeciones de compra antes del checkout.",
      },
      discounts: {
        q: "¿Ofrecen contenido y descuentos por volumen?",
        a: "Este prototipo muestra dónde se responderán con claridad las políticas y objeciones de compra antes del checkout.",
      },
    },
  },
  cta: {
    kicker: "Shortlist personalizada gratis",
    title: "Dinos cómo se ve una colocación perfecta.",
    description:
      "Comparte tu nicho, objetivo de tráfico y presupuesto. Prepararemos una lista lista para campaña.",
    niche: "Nicho objetivo",
    budget: "Presupuesto por sitio",
    email: "Email de trabajo",
    emailPlaceholder: "tu@agencia.com",
    submit: "Crear mi shortlist →",
    toast: "Solicitud de shortlist recibida",
  },
  footer: {
    blurb:
      "Guest posts, niche edits y campañas de colocación para agencias, revendedores y marcas ambiciosas.",
    marketplace: "Marketplace",
    company: "Empresa",
    legal: "Legal",
    indiaSites: "Sitios de India",
    adminSites: "Sitios admin",
    linkInsertions: "Inserciones de enlace",
    howItWorks: "Cómo funciona",
    faqs: "FAQs",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
    replacement: "Política de reemplazo",
    legalLine: "Privacidad · Términos · Política de reemplazo",
    copyright: "Prototipo para revisión.",
  },
  shortlist: {
    selectedOne: "{count} sitio seleccionado",
    selectedMany: "{count} sitios seleccionados",
    estimated: "Total estimado de guest post: ${total}",
    clear: "Limpiar",
    review: "Revisar shortlist →",
    ready: "Shortlist lista para revisar",
  },
  toast: {
    signInSoon: "El inicio de sesión llegará pronto",
    marketplaceSelected: "Marketplace de {name} seleccionado",
  },
  search: {
    title: "Buscar colocaciones",
    close: "Cerrar búsqueda",
    hint: "Escribe un dominio, nicho, DR o precio para encontrar colocaciones.",
    searching: "Buscando inventario…",
    empty: "Ninguna colocación coincide con “{query}”.",
    openSearch: "Abrir búsqueda de colocaciones",
  },
  contact: {
    open: "Abrir opciones de contacto",
    close: "Cerrar opciones de contacto",
    menu: "Opciones de contacto",
    email: "Email",
    whatsapp: "WhatsApp",
    phone: "Llamar",
  },
  pricing: {
    title: "Precios",
    subtitle:
      "Elige un plan según tu volumen de colocaciones. Mejora cuando tus campañas crezcan.",
    month: "mes",
    cta: "Empezar",
    noCard: "No se requiere tarjeta de crédito",
    compare: "Ver comparación de planes",
    plans: {
      startup: {
        name: "Startup",
        description:
          "Ideal para equipos pequeños y startups que quieren empezar con colocaciones.",
        features: {
          users: "Hasta 5 asientos de equipo",
          pages: "Hasta 25 colocaciones / mes",
          domains: "Acceso al marketplace de India",
          support: "Soporte por email",
        },
      },
      growth: {
        name: "Growth",
        description:
          "Perfecto para agencias en crecimiento que necesitan más volumen, informes y velocidad.",
        features: {
          users: "Hasta 15 asientos de equipo",
          pages: "Hasta 80 colocaciones / mes",
          domains: "Entrega prioritaria",
          support: "Informes de URL en vivo",
        },
      },
      enterprise: {
        name: "Enterprise",
        description:
          "Herramientas avanzadas para organizaciones grandes con campañas multi-mercado.",
        features: {
          users: "Asientos de equipo ilimitados",
          pages: "Volumen de colocaciones a medida",
          domains: "Inventario privado opcional",
          support: "Gestor de campaña dedicado",
        },
      },
    },
  },
};
