import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================================================
  // REGIONS & COMUNAS (Chile)
  // ============================================================================
  
  const regions = [
    {
      name: "Región de Los Lagos",
      nameEn: "Los Lagos Region",
      slug: "los-lagos",
      order: 10,
      comunas: [
        { name: "Puerto Varas", slug: "puerto-varas" },
        { name: "Puerto Montt", slug: "puerto-montt" },
        { name: "Osorno", slug: "osorno" },
        { name: "Castro", slug: "castro" },
        { name: "Ancud", slug: "ancud" },
        { name: "Quellón", slug: "quellon" },
        { name: "Frutillar", slug: "frutillar" },
      ],
    },
    {
      name: "Región de Aysén",
      nameEn: "Aysén Region",
      slug: "aysen",
      order: 11,
      comunas: [
        { name: "Coyhaique", slug: "coyhaique" },
        { name: "Puerto Aysén", slug: "puerto-aysen" },
        { name: "Chile Chico", slug: "chile-chico" },
        { name: "Cochrane", slug: "cochrane" },
        { name: "Puerto Cisnes", slug: "puerto-cisnes" },
      ],
    },
    {
      name: "Región de Magallanes",
      nameEn: "Magallanes Region",
      slug: "magallanes",
      order: 12,
      comunas: [
        { name: "Punta Arenas", slug: "punta-arenas" },
        { name: "Puerto Natales", slug: "puerto-natales" },
        { name: "Porvenir", slug: "porvenir" },
        { name: "Torres del Paine", slug: "torres-del-paine" },
      ],
    },
    {
      name: "Región de La Araucanía",
      nameEn: "La Araucanía Region",
      slug: "araucania",
      order: 9,
      comunas: [
        { name: "Temuco", slug: "temuco" },
        { name: "Pucón", slug: "pucon" },
        { name: "Villarrica", slug: "villarrica" },
        { name: "Angol", slug: "angol" },
      ],
    },
    {
      name: "Región Metropolitana",
      nameEn: "Metropolitan Region",
      slug: "metropolitana",
      order: 13,
      comunas: [
        { name: "Santiago", slug: "santiago" },
        { name: "Cajón del Maipo", slug: "cajon-del-maipo" },
        { name: "San José de Maipo", slug: "san-jose-de-maipo" },
      ],
    },
  ];

  console.log("📍 Seeding regions and comunas...");
  
  for (const regionData of regions) {
    const { comunas, ...regionInfo } = regionData;
    
    const region = await prisma.region.upsert({
      where: { slug: regionInfo.slug },
      update: regionInfo,
      create: regionInfo,
    });

    for (const comunaData of comunas) {
      await prisma.comuna.upsert({
        where: {
          regionId_slug: {
            regionId: region.id,
            slug: comunaData.slug,
          },
        },
        update: comunaData,
        create: {
          ...comunaData,
          regionId: region.id,
        },
      });
    }
    
    console.log(`  ✓ ${regionInfo.name}: ${comunas.length} comunas`);
  }

  // ============================================================================
  // DEMO USER (Client)
  // ============================================================================
  
  console.log("👤 Creating demo user...");
  
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@aventura.cl" },
    update: {},
    create: {
      email: "demo@aventura.cl",
      name: "Demo User",
      phone: "+56912345678",
      phoneVerified: true,
      role: "CLIENT",
      status: "ACTIVE",
      language: "es",
    },
  });

  console.log(`  ✓ Demo user created: ${demoUser.email}`);

  // ============================================================================
  // DEMO GUIDE (For Fase 2)
  // ============================================================================
  
  console.log("🧭 Creating demo guide...");
  
  const losLagosRegion = await prisma.region.findUnique({
    where: { slug: "los-lagos" },
  });

  const puertoVaras = await prisma.comuna.findFirst({
    where: { slug: "puerto-varas" },
  });

  const demoGuide = await prisma.user.upsert({
    where: { email: "guia@aventura.cl" },
    update: {},
    create: {
      email: "guia@aventura.cl",
      name: "Carlos Montaña",
      phone: "+56987654321",
      phoneVerified: true,
      role: "GUIDE",
      status: "ACTIVE",
      language: "es",
      regionId: losLagosRegion?.id,
      comunaId: puertoVaras?.id,
    },
  });

  console.log(`  ✓ Demo guide created: ${demoGuide.email}`);

  // ============================================================================
  // DEMO SERVICES (Experiencias)
  // ============================================================================
  
  console.log("🏔️  Creating demo services...");

  // Get other regions for more variety
  const aysenRegion = await prisma.region.findUnique({
    where: { slug: "aysen" },
  });
  const coyhaique = await prisma.comuna.findFirst({
    where: { slug: "coyhaique" },
  });

  const magallanesRegion = await prisma.region.findUnique({
    where: { slug: "magallanes" },
  });
  const puertoNatales = await prisma.comuna.findFirst({
    where: { slug: "puerto-natales" },
  });

  const araucaniaRegion = await prisma.region.findUnique({
    where: { slug: "araucania" },
  });
  const pucon = await prisma.comuna.findFirst({
    where: { slug: "pucon" },
  });

  const services = [
    {
      title: "Kayak en el Lago Llanquihue",
      titleEn: "Kayaking on Llanquihue Lake",
      slug: "kayak-lago-llanquihue",
      description:
        "Disfruta de un increíble tour de kayak en el lago Llanquihue con vistas espectaculares a los volcanes Osorno y Calbuco. Perfecto para principiantes y familias.",
      category: "KAYAK",
      difficulty: "PRINCIPIANTE",
      duration: "MEDIO_DIA",
      priceBase: 35000,
      minParticipants: 2,
      maxParticipants: 8,
      regionId: losLagosRegion?.id || "",
      comunaId: puertoVaras?.id || "",
      lat: -41.3201,
      lng: -72.9814,
      included: [
        "Kayak y equipo completo",
        "Guía certificado",
        "Seguro de accidentes",
        "Snack y agua",
      ],
      notIncluded: ["Transporte al punto de encuentro", "Almuerzo"],
      whatToBring: [
        "Ropa cómoda que pueda mojarse",
        "Zapatos deportivos",
        "Protector solar",
        "Gafas de sol",
      ],
      providedGear: [
        "Kayak individual o doble",
        "Remo",
        "Chaleco salvavidas",
        "Faldón impermeable",
      ],
      status: "APPROVED",
      verified: true,
      featured: true,
      guideId: demoGuide.id,
    },
    {
      title: "Rafting Río Petrohué - Clase III",
      titleEn: "Petrohué River Rafting - Class III",
      slug: "rafting-rio-petrohue",
      description:
        "Aventura de rafting en el impresionante Río Petrohué con rápidos clase III. Atraviesa aguas cristalinas rodeado de bosque nativo y vistas al volcán.",
      category: "RAFTING",
      difficulty: "INTERMEDIO",
      duration: "MEDIO_DIA",
      priceBase: 45000,
      minParticipants: 4,
      maxParticipants: 12,
      regionId: losLagosRegion?.id || "",
      comunaId: puertoVaras?.id || "",
      lat: -41.1558,
      lng: -72.4486,
      included: [
        "Bote de rafting",
        "Equipo completo (casco, chaleco, traje de neopreno)",
        "Guía experto",
        "Seguro",
        "Transporte desde Puerto Varas",
      ],
      notIncluded: ["Comidas", "Propinas"],
      whatToBring: [
        "Ropa de baño",
        "Toalla",
        "Zapatos que se puedan mojar",
        "Cambio de ropa",
      ],
      providedGear: [
        "Traje de neopreno",
        "Casco",
        "Chaleco salvavidas",
        "Remo",
      ],
      status: "APPROVED",
      verified: true,
      featured: true,
      guideId: demoGuide.id,
    },
    {
      title: "Trekking Volcán Osorno - Ascenso Cumbre",
      titleEn: "Osorno Volcano Trekking - Summit Climb",
      slug: "trekking-volcan-osorno",
      description:
        "Desafío de alta montaña para alcanzar la cumbre del emblemático Volcán Osorno (2,652m). Experiencia técnica con vistas panorámicas incomparables de la región.",
      category: "MONTANISMO",
      difficulty: "AVANZADO",
      duration: "DIA_COMPLETO",
      priceBase: 85000,
      minParticipants: 2,
      maxParticipants: 6,
      regionId: losLagosRegion?.id || "",
      comunaId: puertoVaras?.id || "",
      lat: -41.1031,
      lng: -72.4934,
      included: [
        "Guía UIAGM certificado",
        "Equipo técnico (crampones, piolet, arnés)",
        "Casco",
        "Seguro de montaña",
        "Transporte",
        "Desayuno y almuerzo",
      ],
      notIncluded: ["Botas de montaña", "Ropa técnica de alta montaña"],
      whatToBring: [
        "Botas de montaña rígidas",
        "Ropa térmica",
        "Chaqueta impermeable",
        "Gafas de sol categoría 4",
        "Guantes técnicos",
        "Mochila 30L",
      ],
      providedGear: ["Crampones", "Piolet", "Arnés", "Casco", "Cuerdas"],
      status: "APPROVED",
      verified: true,
      guideId: demoGuide.id,
    },
    {
      title: "Pesca con Mosca en Río Puelo",
      titleEn: "Fly Fishing on Puelo River",
      slug: "pesca-mosca-rio-puelo",
      description:
        "Jornada de pesca con mosca en el río Puelo, conocido por sus truchas arcoíris y marrones. Ideal para pescadores intermedios y avanzados.",
      category: "PESCA",
      difficulty: "INTERMEDIO",
      duration: "DIA_COMPLETO",
      priceBase: 95000,
      minParticipants: 1,
      maxParticipants: 4,
      regionId: losLagosRegion?.id || "",
      comunaId: puertoVaras?.id || "",
      lat: -41.6167,
      lng: -72.3333,
      included: [
        "Guía de pesca profesional",
        "Embarcación",
        "Equipo de pesca (caña, reel, línea)",
        "Moscas",
        "Almuerzo gourmet",
        "Transporte",
      ],
      notIncluded: ["Licencia de pesca (se puede tramitar)", "Propinas"],
      whatToBring: [
        "Ropa cómoda de capas",
        "Sombrero",
        "Gafas polarizadas",
        "Protector solar",
      ],
      providedGear: [
        "Caña de mosca",
        "Reel",
        "Waders",
        "Botas de vadeo",
        "Chaleco de pesca",
      ],
      status: "APPROVED",
      verified: true,
      guideId: demoGuide.id,
    },
    {
      title: "Trekking Parque Tagua Tagua - Circuito Lagunas",
      titleEn: "Tagua Tagua Park Trekking - Lagoons Circuit",
      slug: "trekking-tagua-tagua",
      description:
        "Caminata de día completo por el Parque Tagua Tagua, explorando lagunas de aguas turquesas, bosque nativo y miradores con vista a glaciares.",
      category: "TREKKING",
      difficulty: "BASICO",
      duration: "DIA_COMPLETO",
      priceBase: 55000,
      minParticipants: 3,
      maxParticipants: 10,
      regionId: losLagosRegion?.id || "",
      comunaId: puertoVaras?.id || "",
      lat: -41.2167,
      lng: -71.8333,
      included: [
        "Guía experimentado",
        "Transporte ida y vuelta",
        "Box lunch",
        "Seguro",
      ],
      notIncluded: ["Bastones de trekking", "Mochila"],
      whatToBring: [
        "Calzado de trekking",
        "Mochila 20-30L",
        "Ropa de capas",
        "Chaqueta cortaviento",
        "Botella de agua 1.5L",
        "Snacks personales",
      ],
      providedGear: ["Bastones (disponibles bajo pedido)"],
      status: "APPROVED",
      verified: false,
      guideId: demoGuide.id,
    },
    {
      title: "Kayak en Laguna San Rafael - Glaciar",
      titleEn: "San Rafael Lagoon Kayaking - Glacier",
      slug: "kayak-laguna-san-rafael",
      description:
        "Remada épica entre témpanos de hielo en la Laguna San Rafael, acercándote al impresionante Glaciar San Rafael. Una experiencia única en la Patagonia chilena.",
      category: "KAYAK",
      difficulty: "INTERMEDIO",
      duration: "MULTI_DIA",
      priceBase: 450000,
      minParticipants: 4,
      maxParticipants: 8,
      regionId: aysenRegion?.id || "",
      comunaId: coyhaique?.id || "",
      lat: -46.6833,
      lng: -73.8500,
      included: [
        "Kayak de expedición",
        "Equipo completo",
        "Guía especializado",
        "Camping y carpas",
        "Todas las comidas",
        "Transporte marítimo",
      ],
      notIncluded: ["Vuelo a Balmaceda", "Seguro de viaje"],
      whatToBring: [
        "Saco de dormir -5°C",
        "Ropa impermeable",
        "Ropa térmica",
        "Botas impermeables",
      ],
      providedGear: ["Kayak doble", "Spray skirt", "Remo", "Chaleco salvavidas"],
      status: "APPROVED",
      verified: true,
      featured: true,
      guideId: demoGuide.id,
    },
    {
      title: "Trekking Glaciar Grey - Torres del Paine",
      titleEn: "Grey Glacier Trekking - Torres del Paine",
      slug: "trekking-glaciar-grey",
      description:
        "Caminata al mirador del Glaciar Grey dentro del Parque Nacional Torres del Paine. Vistas impresionantes del campo de hielo Patagónico Sur.",
      category: "TREKKING",
      difficulty: "INTERMEDIO",
      duration: "DIA_COMPLETO",
      priceBase: 75000,
      minParticipants: 2,
      maxParticipants: 12,
      regionId: magallanesRegion?.id || "",
      comunaId: puertoNatales?.id || "",
      lat: -51.0333,
      lng: -73.0667,
      included: [
        "Entrada al parque",
        "Guía certificado",
        "Box lunch",
        "Transporte desde Puerto Natales",
      ],
      notIncluded: ["Bastones de trekking", "Seguro personal"],
      whatToBring: [
        "Botas de trekking",
        "Chaqueta cortaviento",
        "Gorro y guantes",
        "Agua 2L",
        "Lentes de sol",
      ],
      providedGear: [],
      status: "APPROVED",
      verified: true,
      featured: true,
      guideId: demoGuide.id,
    },
    {
      title: "Rafting Río Trancura - Clase IV",
      titleEn: "Trancura River Rafting - Class IV",
      slug: "rafting-rio-trancura",
      description:
        "Adrenalina pura en los rápidos clase IV del río Trancura en Pucón. Perfecto para aventureros experimentados que buscan emoción extrema.",
      category: "RAFTING",
      difficulty: "AVANZADO",
      duration: "MEDIO_DIA",
      priceBase: 52000,
      minParticipants: 4,
      maxParticipants: 10,
      regionId: araucaniaRegion?.id || "",
      comunaId: pucon?.id || "",
      lat: -39.2833,
      lng: -71.9667,
      included: [
        "Bote de rafting",
        "Equipo completo",
        "Guía profesional",
        "Seguro",
        "Fotografías",
      ],
      notIncluded: ["Almuerzo", "Transporte"],
      whatToBring: [
        "Ropa de baño",
        "Toalla",
        "Zapatos deportivos",
        "Cambio de ropa",
      ],
      providedGear: ["Traje de neopreno", "Casco", "Chaleco", "Remo"],
      status: "APPROVED",
      verified: true,
      guideId: demoGuide.id,
    },
    {
      title: "Ciclismo MTB Senderos Villarrica",
      titleEn: "MTB Cycling Villarrica Trails",
      slug: "ciclismo-mtb-villarrica",
      description:
        "Recorre los mejores senderos de mountain bike alrededor del lago Villarrica. Combinación perfecta de técnica, paisaje y diversión sobre dos ruedas.",
      category: "CICLISMO",
      difficulty: "INTERMEDIO",
      duration: "MEDIO_DIA",
      priceBase: 38000,
      minParticipants: 2,
      maxParticipants: 8,
      regionId: araucaniaRegion?.id || "",
      comunaId: pucon?.id || "",
      lat: -39.2917,
      lng: -71.9583,
      included: [
        "Bicicleta de montaña",
        "Casco",
        "Guía experto",
        "Snack y agua",
        "Seguro",
      ],
      notIncluded: ["Almuerzo", "Ropa técnica"],
      whatToBring: [
        "Ropa deportiva",
        "Zapatillas deportivas",
        "Protector solar",
        "Lentes de sol",
      ],
      providedGear: ["Bicicleta MTB", "Casco", "Guantes"],
      status: "APPROVED",
      verified: true,
      guideId: demoGuide.id,
    },
    {
      title: "Escalada en Roca - Cochrane",
      titleEn: "Rock Climbing - Cochrane",
      slug: "escalada-roca-cochrane",
      description:
        "Jornada de escalada deportiva en las paredes de granito de Cochrane, Aysén. Rutas para todos los niveles con vistas espectaculares al valle.",
      category: "ESCALADA",
      difficulty: "INTERMEDIO",
      duration: "DIA_COMPLETO",
      priceBase: 68000,
      minParticipants: 2,
      maxParticipants: 6,
      regionId: aysenRegion?.id || "",
      comunaId: coyhaique?.id || "",
      lat: -47.2500,
      lng: -72.5667,
      included: [
        "Equipo de escalada completo",
        "Guía UIAGM",
        "Seguro",
        "Almuerzo",
        "Transporte",
      ],
      notIncluded: ["Zapatillas de escalada (arriendo disponible)"],
      whatToBring: [
        "Ropa cómoda deportiva",
        "Zapatillas de escalada (o arriendo)",
        "Protector solar",
        "Agua",
      ],
      providedGear: ["Arnés", "Casco", "Cuerdas", "Mosquetones", "Cintas exprés"],
      status: "APPROVED",
      verified: true,
      guideId: demoGuide.id,
    },
    {
      title: "Observación de Ballenas - Puerto Natales",
      titleEn: "Whale Watching - Puerto Natales",
      slug: "observacion-ballenas-natales",
      description:
        "Navegación por el Seno Última Esperanza para avistar ballenas jorobadas, orcas y delfines australes. Experiencia marina inolvidable en la Patagonia.",
      category: "OTROS",
      difficulty: "PRINCIPIANTE",
      duration: "MEDIO_DIA",
      priceBase: 65000,
      minParticipants: 4,
      maxParticipants: 20,
      regionId: magallanesRegion?.id || "",
      comunaId: puertoNatales?.id || "",
      lat: -51.7167,
      lng: -72.5167,
      included: [
        "Navegación en catamarán",
        "Guía naturalista",
        "Café y snacks",
        "Binoculares",
      ],
      notIncluded: ["Almuerzo", "Ropa impermeable"],
      whatToBring: [
        "Chaqueta cortaviento impermeable",
        "Gorro y guantes",
        "Cámara fotográfica",
        "Medicamento para mareos (si es necesario)",
      ],
      providedGear: ["Binoculares", "Chalecos salvavidas"],
      status: "APPROVED",
      verified: true,
      guideId: demoGuide.id,
    },
  ];

  for (const serviceData of services) {
    const service = await prisma.service.create({
      data: {
        ...serviceData,
        publishedAt: new Date(),
      },
    });

    // Add sample images
    await prisma.serviceImage.createMany({
      data: [
        {
          serviceId: service.id,
          url: `https://res.cloudinary.com/demo/image/upload/v1/services/${service.slug}/1.jpg`,
          altText: `${service.title} - Imagen principal`,
          order: 0,
        },
        {
          serviceId: service.id,
          url: `https://res.cloudinary.com/demo/image/upload/v1/services/${service.slug}/2.jpg`,
          altText: `${service.title} - Vista panorámica`,
          order: 1,
        },
      ],
    });

    console.log(`  ✓ ${service.title}`);
  }

  console.log("\n✨ Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
