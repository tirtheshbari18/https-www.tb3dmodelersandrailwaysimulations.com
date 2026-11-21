const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Step 1: Safely Archive all VG-branded products ---');
  const allProducts = await prisma.product.findMany();
  let archivedCount = 0;
  for (const p of allProducts) {
    if (p.name.includes('VG ') || p.name.includes('VG-') || p.slug.startsWith('vg-') || p.id.startsWith('prod-academy') || p.id.startsWith('prod-humsafar') || p.id.startsWith('prod-sleeper') || p.id.startsWith('prod-tricolour') || p.id.startsWith('prod-amrit') || p.id.startsWith('prod-bangladesh') || p.id.startsWith('prod-pnb') || p.id.startsWith('prod-vistadome') || p.id.startsWith('prod-chaircar') || p.id.startsWith('prod-maitree')) {
      await prisma.product.update({
        where: { id: p.id },
        data: { status: 'ARCHIVED' }
      });
      console.log('Archived VG product:', p.name, '(' + p.id + ')');
      archivedCount++;
    }
  }
  console.log('Total archived VG products:', archivedCount);

  console.log('\n--- Step 2: Ensure Categories exist ---');
  const categories = [
    { id: 'cat-lhb', name: 'LHB Coaches', slug: 'lhb-coaches', order: 1, description: 'Indian Railways Linke Hofmann Busch (LHB) stainless steel coaching stock.' },
    { id: 'cat-locos', name: 'Locomotives', slug: 'locomotives', order: 2, description: 'High-power electric and diesel locomotives engineered for mainline routes.' },
    { id: 'cat-trainboards', name: 'Train Boards', slug: 'trainboards', order: 3, description: 'Official bilingual metal destination plates and coach indicator boards.' },
    { id: 'cat-routes', name: 'Railway Routes', slug: 'routes-scenery', order: 4, description: 'Scenic Indian Railways routes, catenary, signalling, and station models.' },
    { id: 'cat-sim', name: 'Simulation Assets', slug: 'simulation-assets', order: 5, description: 'Advanced physics parameters, audio soundsets, and cab configurations.' }
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { id: cat.id },
      update: { name: cat.name, slug: cat.slug, order: cat.order, description: cat.description },
      create: cat
    });
    console.log('Upserted category:', cat.name);
  }

  console.log('\n--- Step 3: Insert 15 Authentic Indian Railways Products ---');
  const irProducts = [
    {
      id: 'ir-lhb-sleeper',
      name: 'Indian Railways LHB Sleeper Coach',
      slug: 'indian-railways-lhb-sleeper-coach',
      sku: 'TB-IR-SL-01',
      categoryId: 'cat-lhb',
      regularPrice: 1200,
      salePrice: 1000,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Popular Choice',
      discountPercent: 16.67,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.0',
      fileSize: '185 MB',
      image: '/assets/tbpro/lhb_sleeper.png',
      shortDesc: 'High-fidelity Linke Hofmann Busch (LHB) Sleeper Class (LWSCN) coach 3D model for Open Rails and MSTS.',
      description: 'Authentic Indian Railways LHB Sleeper Class (LWSCN) passenger coach engineered with precision FIAT bogies, calibrated air-brake deceleration curves, detailed night-lit passenger berths, animated entrance doors, and Western/Central/Northern Railway liveries.'
    },
    {
      id: 'ir-lhb-3ac',
      name: 'LHB AC 3-Tier Coach',
      slug: 'lhb-ac-3-tier-coach',
      sku: 'TB-IR-3AC-02',
      categoryId: 'cat-lhb',
      regularPrice: 900,
      salePrice: 750,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Special Offer',
      discountPercent: 16.67,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.5',
      fileSize: '192 MB',
      image: '/assets/tbpro/lhb_ac_3tier.avif',
      shortDesc: 'Indian Railways LHB AC 3-Tier (LWACCN) passenger coach with sealed tinted windows and realistic interior lighting.',
      description: 'Authentic Indian Railways LHB AC 3-Tier (LWACCN) coach for Open Rails and MSTS. Features precision sealed tinted glass windows, rooftop AC unit detailing, authentic FIAT bogie suspension dynamics, realistic interior cabin lighting, and calibrated friction curves.'
    },
    {
      id: 'ir-lhb-2ac',
      name: 'LHB AC 2-Tier Coach',
      slug: 'lhb-ac-2-tier-coach',
      sku: 'TB-IR-2AC-03',
      categoryId: 'cat-lhb',
      regularPrice: 1000,
      salePrice: 850,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: false,
      specialOfferText: 'Special Offer',
      discountPercent: 15,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.5',
      fileSize: '195 MB',
      image: '/assets/tbpro/lhb_ac_2tier.avif',
      shortDesc: 'Premium Indian Railways LHB AC 2-Tier (LWACCW) passenger coach simulation asset.',
      description: 'Premium Indian Railways LHB AC 2-Tier (LWACCW) passenger coach simulation asset. Designed with spacious berth spacing, curtain physics textures, LED reading lamps night mode, and authentic stainless steel anti-telescopic body shell structure.'
    },
    {
      id: 'ir-lhb-1ac',
      name: 'LHB First AC Coach',
      slug: 'lhb-first-ac-coach',
      sku: 'TB-IR-1AC-04',
      categoryId: 'cat-lhb',
      regularPrice: 1200,
      salePrice: 999,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Flagship Asset',
      discountPercent: 16.75,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.0',
      fileSize: '210 MB',
      image: '/assets/tbpro/lhb_ac_first.jpg',
      shortDesc: 'Ultra-luxurious LHB AC First Class (LWFAC) coach simulation asset for premier Rajdhani and Duronto consists.',
      description: 'Ultra-luxurious LHB AC First Class (LWFAC) coach simulation asset for premier Rajdhani and Duronto consists. Features 2-berth and 4-berth lockable coupe cabin models, carpeted aisles, custom night illumination, and smooth high-speed bogie tracking up to 160 km/h.'
    },
    {
      id: 'ir-lhb-cc',
      name: 'LHB Chair Car Coach',
      slug: 'lhb-chair-car-coach',
      sku: 'TB-IR-CC-05',
      categoryId: 'cat-lhb',
      regularPrice: 800,
      salePrice: 650,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Express Pack',
      discountPercent: 18.75,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.8',
      fileSize: '175 MB',
      image: '/assets/tbpro/lhb_chaircar.png',
      shortDesc: 'Standard daytime LHB AC Chair Car (LWSCZAC) coach asset designed for Shatabdi, Intercity, and Jan Shatabdi expresses.',
      description: 'Standard daytime LHB AC Chair Car (LWSCZAC) coach asset designed for Shatabdi, Intercity, and Jan Shatabdi expresses. Features 3x2 ergonomic seating layout, overhead luggage racks, animated plug doors, and authentic dual-tone blue/grey livery.'
    },
    {
      id: 'ir-lhb-ecc',
      name: 'LHB Executive Chair Car Coach',
      slug: 'lhb-executive-chair-car-coach',
      sku: 'TB-IR-ECC-06',
      categoryId: 'cat-lhb',
      regularPrice: 1100,
      salePrice: 900,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: false,
      specialOfferText: 'Premium Class',
      discountPercent: 18.18,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.5',
      fileSize: '188 MB',
      image: '/assets/tbpro/lhb_exec_chaircar.jpg',
      shortDesc: 'Elite LHB Executive AC Chair Car (LWFCZAC) 3D rolling stock model with 2x2 recliner seating.',
      description: 'Elite LHB Executive AC Chair Car (LWFCZAC) 3D rolling stock model. Replicating the 2x2 spacious recliner seating of prestigious Shatabdi and Tejas services with panoramic window visibility, footrest detailing, and sound-insulated cabin audio.'
    },
    {
      id: 'ir-lhb-gen',
      name: 'LHB General Coach',
      slug: 'lhb-general-coach',
      sku: 'TB-IR-GS-07',
      categoryId: 'cat-lhb',
      regularPrice: 600,
      salePrice: 450,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Special Price',
      discountPercent: 25,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.2',
      fileSize: '160 MB',
      image: '/assets/tbpro/lhb_general.png',
      shortDesc: 'Unreserved LHB Second Class (LS / GS) passenger coach asset for high-density express trains.',
      description: 'Unreserved LHB Second Class (LS / GS) passenger coach asset. Features high-capacity interior bench seating, dual entrance vestibules with handrails, authentic safety barred windows, and rugged FIAT bogie suspension for high-density express trains.'
    },
    {
      id: 'ir-lhb-pantry',
      name: 'LHB Pantry Car',
      slug: 'lhb-pantry-car',
      sku: 'TB-IR-WCB-08',
      categoryId: 'cat-lhb',
      regularPrice: 750,
      salePrice: 600,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: false,
      specialOfferText: 'Essential Rake',
      discountPercent: 20,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.3',
      fileSize: '168 MB',
      image: '/assets/tbpro/lhb_pantry_car.jpg',
      shortDesc: 'Indian Railways LHB AC Hot Buffet / Pantry Car (LWCBAC) rolling stock model.',
      description: 'Indian Railways LHB AC Hot Buffet / Pantry Car (LWCBAC) rolling stock model. Features kitchen equipment detailing, storage compartments, distinctive roof ventilators, service loading doors, and authentic under-slung water tanks.'
    },
    {
      id: 'ir-lhb-eog',
      name: 'LHB Generator Car',
      slug: 'lhb-generator-car',
      sku: 'TB-IR-EOG-09',
      categoryId: 'cat-lhb',
      regularPrice: 750,
      salePrice: 600,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: false,
      specialOfferText: 'Power Car',
      discountPercent: 20,
      compatibility: 'Open Rails / MSTS',
      version: 'v1.4',
      fileSize: '172 MB',
      image: '/assets/tbpro/lhb_generator_car.jpg',
      shortDesc: 'LHB End-on-Generation (LWLRRM) Power Car / Generator Van with Guard\'s Compartment.',
      description: 'LHB End-on-Generation (LWLRRM) Power Car / Generator Van with Guard\'s Compartment. Features realistic diesel generator cooling grilles, roof exhaust silencers, luggage freight area, red flasher lamp, and guard cabin equipment.'
    },
    {
      id: 'ir-loco-wap7',
      name: 'Indian Railways WAP-7 Locomotive',
      slug: 'indian-railways-wap-7-locomotive',
      sku: 'TB-IR-WAP7-10',
      categoryId: 'cat-locos',
      regularPrice: 1500,
      salePrice: 1200,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Top Performer',
      discountPercent: 20,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.2',
      fileSize: '245 MB',
      image: '/assets/tbpro/wap7_locomotive.jpg',
      shortDesc: 'Indian Railways flagship 6000 HP 3-phase AC passenger electric locomotive (WAP-7).',
      description: 'Indian Railways flagship 6000 HP 3-phase AC passenger electric locomotive (WAP-7). Engineered with high-fidelity Co-Co bogies, regenerative dynamic braking curves, dual pantographs, authentic cab sounds, and Navodit / White livery options for Open Rails and MSTS.'
    },
    {
      id: 'ir-loco-wap5',
      name: 'Indian Railways WAP-5 Locomotive',
      slug: 'indian-railways-wap-5-locomotive',
      sku: 'TB-IR-WAP5-11',
      categoryId: 'cat-locos',
      regularPrice: 1500,
      salePrice: 1200,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: false,
      specialOfferText: 'High Speed 160kph',
      discountPercent: 20,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.0',
      fileSize: '235 MB',
      image: '/assets/tbpro/wap5_locomotive.jpg',
      shortDesc: 'High-speed 6000 HP Bo-Bo electric passenger locomotive (WAP-5) capable of 160 km/h commercial operations.',
      description: 'High-speed 6000 HP Bo-Bo electric passenger locomotive (WAP-5) capable of 160 km/h commercial operations. Built with ABB traction motor physics, aerodynamic front profile, high-geared acceleration dynamics, and classic CLW white/red livery.'
    },
    {
      id: 'ir-loco-wag9',
      name: 'Indian Railways WAG-9 Locomotive',
      slug: 'indian-railways-wag-9-locomotive',
      sku: 'TB-IR-WAG9-12',
      categoryId: 'cat-locos',
      regularPrice: 1400,
      salePrice: 1100,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Heavy Freight',
      discountPercent: 21.43,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.1',
      fileSize: '240 MB',
      image: '/assets/tbpro/wag9_locomotive.jpg',
      shortDesc: 'Heavy freight powerhouse 6122 HP Co-Co electric locomotive (WAG-9 / WAG-9HC).',
      description: 'Heavy freight powerhouse 6122 HP Co-Co electric locomotive (WAG-9 / WAG-9HC). Features massive tractive effort (up to 460 kN), authentic dark green livery, heavy train drag physics, and dual air-brake compressor sounds for hauling 58-BOXN rakes.'
    },
    {
      id: 'ir-trainboards-pack',
      name: 'Indian Railways Train Boards',
      slug: 'indian-railways-train-boards',
      sku: 'TB-IR-TB-13',
      categoryId: 'cat-trainboards',
      regularPrice: 0,
      salePrice: 0,
      isFree: true,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: false,
      specialOfferText: 'Free Download',
      discountPercent: 0,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.5',
      fileSize: '45 MB',
      image: '/assets/tbpro/ir_trainboards.jpg',
      shortDesc: 'Comprehensive library of authentic bilingual destination boards and coach indicator boards.',
      description: 'Comprehensive library of authentic bilingual destination boards, train nameplates, and coach indicator boards for Indian Railways LHB consists across Western (WR), Central (CR), and East Coast (ECoR) zones. Free high-definition texture package.'
    },
    {
      id: 'ir-route-assets',
      name: 'MSTS Indian Railways Route Assets',
      slug: 'msts-indian-railways-route-assets',
      sku: 'TB-IR-ROUTE-14',
      categoryId: 'cat-routes',
      regularPrice: 1200,
      salePrice: 950,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Route Builder Kit',
      discountPercent: 20.83,
      compatibility: 'Open Rails / MSTS',
      version: 'v2.0',
      fileSize: '512 MB',
      image: '/assets/tbpro/railway_route_bridge.webp',
      shortDesc: 'High-fidelity route builder asset pack for Microsoft Train Simulator and Open Rails.',
      description: 'High-fidelity route builder asset pack for Microsoft Train Simulator and Open Rails. Includes 25 kV AC catenary poles, Indian railway color light signal gantries, ballast track shapes, steel truss river bridges, platform structures, and level crossing gates.'
    },
    {
      id: 'ir-or-sim-assets',
      name: 'Open Rails Indian Railways Simulation Assets',
      slug: 'open-rails-indian-railways-simulation-assets',
      sku: 'TB-IR-SIM-15',
      categoryId: 'cat-sim',
      regularPrice: 500,
      salePrice: 350,
      status: 'AVAILABLE',
      stockQuantity: 999,
      isSpecialOffer: true,
      specialOfferText: 'Physics & Sound',
      discountPercent: 30,
      compatibility: 'Open Rails',
      version: 'v1.5',
      fileSize: '120 MB',
      image: '/assets/tbpro/msts_openrails_sim.jpg',
      shortDesc: 'Dedicated physics, lighting, and sound calibration kit for Open Rails.',
      description: 'Dedicated physics, lighting, and sound calibration kit for Open Rails. Includes tuned .eng and .wag friction parameters for LHB FIAT bogies, 3-phase GTO/IGBT traction inverter audio, track joint click-clack curves, and high-definition cabview configurations.'
    }
  ];

  for (const prod of irProducts) {
    const { image, ...productData } = prod;
    const upserted = await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: [{ url: image, isPrimary: true, order: 0 }]
        }
      },
      create: {
        ...productData,
        images: {
          create: [{ url: image, isPrimary: true, order: 0 }]
        }
      }
    });
    console.log('Upserted Indian Railways product:', upserted.name, '(' + upserted.id + ')');
  }

  // Also ensure prod-whr is ACTIVE and categorized under cat-routes
  const whr = await prisma.product.findUnique({ where: { id: 'prod-whr' } });
  if (whr) {
    await prisma.product.update({
      where: { id: 'prod-whr' },
      data: {
        status: 'AVAILABLE',
        categoryId: 'cat-routes'
      }
    });
    console.log('Confirmed WHR Route product is AVAILABLE under cat-routes');
  }

  console.log('\n--- Migration Complete Successfully ---');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
