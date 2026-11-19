const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding VG-3D Modelers & Railway Simulations Database ---');

  // 1. Website Settings
  await prisma.websiteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'VG-3D Modelers & Railway Simulations',
      tagline: 'High-Precision 3D Models & Rolling Stock for Open Rails and MSTS',
      founderName: 'Varun Ganesh',
      contactEmail: 'support@vg3dmodelersandrailwaysimulations.com',
      contactPhone: '+91 98401 23456',
      whatsappNumber: '+919840123456',
      currencySymbol: '₹',
      currencyCode: 'INR',
      heroTitle: 'Crafting The Future of Indian Railway Simulations',
      heroSubtitle: 'Hyper-realistic LHB coaches, Vistadome, locos, and route assets built with engineering precision for Open Rails & MSTS.',
      disclaimerText: 'VG-3D Modelers & Railway Simulations is an independent digital creator platform operated by Varun Ganesh. All simulation models, rolling stock add-ons, and visual assets are crafted for train simulation enthusiasts and personal virtual railway operations. Indian Railways is a registered trademark of the Ministry of Railways, Government of India; all liveries, emblems, and coach types are artistic and engineering digital representations.',
      termsContent: 'All 3D models, textures, sound files, and configuration files distributed by VG-3D Modelers & Railway Simulations are protected under intellectual property laws. Digital purchases grant a non-exclusive, non-transferable personal license to run the assets in Open Rails and Microsoft Train Simulator. Redistribution, commercial resale, public re-uploading, or reverse engineering of 3D meshes without prior written consent from Varun Ganesh is strictly prohibited.',
      privacyContent: 'VG-3D Modelers & Railway Simulations values your privacy. We collect minimal personal information (name, email address, transaction identifiers) necessary to process orders, facilitate secure digital downloads, and provide customer support. We do not store credit card or payment credential details; all payments are processed through PCI-DSS certified gateways (Razorpay/Stripe). We never sell your data to third parties.',
      eulaContent: 'End User License Agreement (EULA): By downloading, installing, or operating any add-on package from VG-3D Modelers & Railway Simulations, you agree to be bound by the terms of this license. You may use this product on your personal computer systems solely for entertainment and personal simulation. You may not extract 3D geometry or textures for use in other commercial games or monetization streams without written authorization.',
      refundContent: 'Digital Product Refund Policy: Because digital simulator files (.zip, .rar, .7z) are delivered immediately upon order confirmation and cannot be returned, all digital sales are generally final. However, if you encounter an irrecoverable technical defect or corrupted file download that our technical support team cannot resolve within 5 business days, we will gladly provide a full refund or replacement credit.'
    }
  });

  // 2. Users (Admin and Demo User)
  const adminPasswordHash = await bcrypt.hash('Admin@VG3D#2025', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vg3dmodelers.com' },
    update: {
      status: 'APPROVED',
      approvedAt: new Date(),
    },
    create: {
      name: 'Varun Ganesh (Admin)',
      firstName: 'Varun',
      lastName: 'Ganesh',
      email: 'admin@vg3dmodelers.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'APPROVED',
      phone: '+91 98401 23456',
      country: 'India',
      state: 'Tamil Nadu',
      isVerified: true,
      approvedAt: new Date(),
    }
  });

  const demoUserPasswordHash = await bcrypt.hash('Passenger@2025', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@trainsim.com' },
    update: {
      status: 'APPROVED',
      approvedAt: new Date(),
    },
    create: {
      name: 'Tirthesh Bari',
      firstName: 'Tirthesh',
      lastName: 'Bari',
      email: 'demo@trainsim.com',
      passwordHash: demoUserPasswordHash,
      role: 'USER',
      status: 'APPROVED',
      phone: '+91 98765 01234',
      country: 'India',
      state: 'Maharashtra',
      isVerified: true,
      approvedAt: new Date(),
    }
  });

  // 3. Product Categories
  const categories = [
    {
      id: 'cat-lhb',
      name: 'LHB Coaches',
      slug: 'lhb-coaches',
      description: 'Linke Hofmann Busch high-speed stainless steel passenger coaches.',
      order: 1
    },
    {
      id: 'cat-chaircar',
      name: 'Chair Car Coaches',
      slug: 'chair-car',
      description: 'Executive Class and AC Chair Car coaches for Shatabdi and Intercity expresses.',
      order: 2
    },
    {
      id: 'cat-sleeper',
      name: 'Sleeper Coaches',
      slug: 'sleeper-coaches',
      description: 'AC 3-Tier, AC 2-Tier, First AC, and Non-AC sleeper rolling stock.',
      order: 3
    },
    {
      id: 'cat-vistadome',
      name: 'Vistadome Coaches',
      slug: 'vistadome-coaches',
      description: 'Panoramic glass-canopy observation coaches for scenic mountain routes.',
      order: 4
    },
    {
      id: 'cat-humsafar',
      name: 'Humsafar Coaches',
      slug: 'humsafar-coaches',
      description: 'Special all-AC 3-Tier coaches with signature geometric vinyl livery.',
      order: 5
    },
    {
      id: 'cat-bangladesh',
      name: 'Bangladesh Coaches',
      slug: 'bangladesh-coaches',
      description: 'Export variant LHB coaches operated by Bangladesh Railway.',
      order: 6
    },
    {
      id: 'cat-locos',
      name: 'Locomotives & Cabs',
      slug: 'locomotives',
      description: 'Electric and Diesel locomotives with precision cabs and sound engineering.',
      order: 7
    },
    {
      id: 'cat-routes',
      name: 'Routes & Scenery',
      slug: 'routes-scenery',
      description: 'High-performance 3D trackside structures, catenary, stations, and signals.',
      order: 8
    }
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat
    });
  }

  // 4. Projects (The 7 Exact Projects from the Reference Website)
  const projectsData = [
    {
      id: 'proj-01',
      projectNo: '01',
      title: 'VG LHB Chaircar Coaches',
      slug: 'vg-lhb-chaircar-coaches',
      subtitle: 'Indian Railways High Speed Shatabdi & Intercity Rolling Stock',
      description: 'A masterfully engineered 3D simulation model of Indian Railways Linke Hofmann Busch (LHB) Chair Car coaches. This project represents hundreds of hours of precision CAD drafting and photo-texturing, featuring both Executive Class (EC - LWFCZAC) and Second AC Chair Car (CC - LWSCZAC) coaches.\n\nEvery coach includes high-fidelity FIAT-SIG bogies with authentic coil springs, damper struts, and disc brake calipers. The interior features full 3D passenger cabins with 2x2 and 3x2 reclining pushback seats, luggage racks, LED lighting strips, and interactive passenger views for Open Rails Train Simulator.',
      fullContent: 'Compatibility: Open Rails 1.4+, Open Rails 1.5.1, MSTS with MSTS Bin 1.8.\nPolygon Count: ~42,500 vertices per coach with 4 Levels of Detail (LODs) for butter-smooth framerates.\nTextures: 4096x4096px PBR-styled exterior liveries (Classic Shatabdi Blue, Swarna Gold, Tejas Yellow).\nAudio: Custom stereo axle sounds, curve squeal, air brake release hiss, and gangway bellows resonance.',
      mainImage: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1200&auto=format&fit=crop',
      status: 'COMPLETED',
      compatibility: 'Open Rails 1.4+, MSTS Bin 1.8',
      order: 1,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1200&auto=format&fit=crop', caption: 'Exterior view of VG LHB Chaircar in classic Shatabdi livery' },
        { url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop', caption: 'Detailed FIAT-SIG bogie and suspension assembly' },
        { url: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=1200&auto=format&fit=crop', caption: 'Interior passenger cabin view with pushback seating' }
      ]
    },
    {
      id: 'proj-02',
      projectNo: '02',
      title: 'VG LHB Vistadome Coaches',
      slug: 'vg-lhb-vistadome-coaches',
      subtitle: 'Panoramic Observation Coaches with 360-Degree Glass Canopy',
      description: 'The crown jewel of Indian scenic train travel. The VG LHB Vistadome Coach is engineered for routes like the Mumbai-Goa Konkan Railway, Kalka-Shimla, and the Dooars. Built with an expansive transparent curved glass roof, rear observation lounge deck, and 180-degree rotatable passenger luxury seats.\n\nIn Open Rails, players can toggle between driver view, conductor station, and scenic passenger bay cameras with realistic interior lighting and glass reflection maps.',
      fullContent: 'Features include:\n- True-to-life 180-degree rotatable seats with folding armrests.\n- Electrically operated automatic sliding compartment doors.\n- Observation lounge bay at the rear end with panoramic glass wall.\n- Custom .wag physics calibrated for 120 km/h riding comfort.\n- Real glass shader parameters with subtle sun tinting.',
      mainImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1200&auto=format&fit=crop',
      status: 'COMPLETED',
      compatibility: 'Open Rails 1.4+ (Requires Glass Shader support)',
      order: 2,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1200&auto=format&fit=crop', caption: 'VG LHB Vistadome coach on scenic mountain line' },
        { url: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1200&auto=format&fit=crop', caption: 'Panoramic observation glass canopy detail' }
      ]
    },
    {
      id: 'proj-03',
      projectNo: '03',
      title: 'VG LHB Sleeper Coaches',
      slug: 'vg-lhb-sleeper-coaches',
      subtitle: 'AC 3-Tier, AC 2-Tier & First Class Sleeper Stock',
      description: 'The backbone of long-distance passenger travel across Indian Railways. This project encompasses the full suite of LHB Sleeper stock: LWACCN (3-Tier AC), LWACCW (2-Tier AC), LWFAC (First AC), and LWSCN (Non-AC 3-Tier Sleeper).\n\nFeatures authentic berth configurations, fold-out middle berths, night curtains, detailed washroom modules, and accurate end-of-train power car (EOG / SLR) coaches.',
      fullContent: 'Technical Specifications:\n- Complete rake consistency with real Indian Railways consist (.con) files included.\n- Detailed night textures with ambient passenger cabin reading lamps.\n- Realistic bogie hunting motion and spring deflection under load.\n- Fully modeled brake reservoirs, battery boxes, and underframe piping.',
      mainImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop',
      status: 'COMPLETED',
      compatibility: 'Open Rails & MSTS',
      order: 3,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop', caption: 'LHB 3-Tier AC Sleeper coach in classic Rajdhani red livery' },
        { url: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=1200&auto=format&fit=crop', caption: 'Night lighting render of sleeper berths and gangway' }
      ]
    },
    {
      id: 'proj-04',
      projectNo: '04',
      title: 'VG LHB Humsafar Coaches',
      slug: 'vg-lhb-humsafar-coaches',
      subtitle: 'Signature All-AC 3-Tier Express Rolling Stock',
      description: 'The striking modern fleet of Indian Railways, the Humsafar Express features a vibrant blue, orange, and white geometric wrap livery. The VG model faithfully reproduces this complex graphic scheme with seamless UV mapping across all coach panels and fluted roof corrugations.\n\nIncludes tea and coffee vending machine corner, smoke detection sensor lamps, and digital passenger destination boards.',
      fullContent: 'Livery details:\n- High-resolution vector-rendered geometric vinyl patterns.\n- Crisp Indian Railways emblem and braille coach indicators.\n- Realistic air conditioner condenser fans and rooftop housing.\n- Includes Hot Buffet Car (Pantry) with full kitchen interior.',
      mainImage: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1200&auto=format&fit=crop',
      status: 'COMPLETED',
      compatibility: 'Open Rails 1.4+, MSTS Bin 1.8',
      order: 4,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1200&auto=format&fit=crop', caption: 'VG LHB Humsafar Express coach with geometric livery' },
        { url: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1200&auto=format&fit=crop', caption: 'Rooftop AC and bogie disc brake details' }
      ]
    },
    {
      id: 'proj-05',
      projectNo: '05',
      title: 'VG LHB Bangladesh Coaches',
      slug: 'vg-lhb-bangladesh-coaches',
      subtitle: 'Bangladesh Railway Export Specification LHB Coaches',
      description: 'Exported from India to Bangladesh Railway, these LHB coaches serve on cross-border prestige trains like the Maitree Express and Benapole Express. Built to custom BR technical specifications with distinct livery colors (dark forest green with yellow/red stripes).\n\nFeatures custom dual air-and-vacuum brake piping, modified vestibule bellows, and authentic Bangla typography destination boards.',
      fullContent: 'Highlights:\n- Authentic Bangladesh Railway (BR) markings and bilingual text.\n- Calibrated for 1676mm broad gauge simulation.\n- Custom sound recordings of cross-border trains on jointed rail tracks.\n- Both AC Chair Car and Non-AC Shovon Chair variants included.',
      mainImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      status: 'COMPLETED',
      compatibility: 'Open Rails & MSTS',
      order: 5,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop', caption: 'Bangladesh Railway LHB coach in forest green livery' }
      ]
    },
    {
      id: 'proj-06',
      projectNo: '06',
      title: '3D Models for Routes',
      slug: '3d-models-for-routes',
      subtitle: 'Trackside Structures, Stations, Overpasses & Signals',
      description: 'A comprehensive 3D asset library created specifically for Indian route builders in Open Rails and MSTS. Rather than relying on generic western scenery, this pack provides 100% authentic Indian trackside infrastructure.\n\nIncludes overhead equipment (OHE) catenary portals, cantilever masts, tension pulleys, station platforms with tin shed roofs, water columns, color-light signals with accurate aspect animations, and level crossing gate booms.',
      fullContent: 'Included Objects:\n- 24 OHE Catenary types (single track, double track, yard spans).\n- 12 Station platform modular sections (straight, curved, ramps).\n- Foot Over Bridges (FOB) with realistic metal trusswork.\n- Indian semaphore and 4-aspect MACL (Multiple Aspect Colour Light) signals.\n- Ultra-low draw calls to maintain high FPS across busy route sections.',
      mainImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=1200&auto=format&fit=crop',
      status: 'COMPLETED',
      compatibility: 'Open Rails & MSTS Route Editor',
      order: 6,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=1200&auto=format&fit=crop', caption: 'Indian railway station platform and OHE mast assets' }
      ]
    },
    {
      id: 'proj-07',
      projectNo: '07',
      title: 'Work in Progress',
      slug: 'work-in-progress',
      subtitle: 'Upcoming Releases & Under-Development Prototypes',
      description: 'Behind the scenes at VG-3D Modelers. Our engineering workbench is currently prototyping several exciting high-fidelity projects:\n\n1. Vande Bharat Trainset 2.0 (Semi-high speed 16-car EMU with aerodynamic nose cone, regenerative brake simulation, and panoramic passenger interiors).\n2. WAP-7 6000HP Electric Locomotive High-Voltage Roof Equipment update with Faiveley pantograph.\n3. Complete 1980s Vintage ICF Maroon Coaches with authentic screw couplers and vacuum brake dynamics.',
      fullContent: 'Status: In active 3D CAD modeling and beta testing.\nEstimated Releases: Q2 & Q3 2025.\nCommunity members who pre-register can participate in closed beta test runs on our Discord server.',
      mainImage: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=1200&auto=format&fit=crop',
      status: 'WORK_IN_PROGRESS',
      compatibility: 'Open Rails Train Simulator',
      order: 7,
      isPublished: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=1200&auto=format&fit=crop', caption: 'CAD wireframe prototype of next-generation trainset' }
      ]
    }
  ];

  for (const proj of projectsData) {
    const { images, ...projFields } = proj;
    const createdProject = await prisma.project.upsert({
      where: { id: proj.id },
      update: projFields,
      create: projFields
    });

    // Delete existing images for this project and re-create
    await prisma.projectImage.deleteMany({ where: { projectId: createdProject.id } });
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.projectImage.create({
          data: {
            projectId: createdProject.id,
            url: images[i].url,
            caption: images[i].caption,
            order: i
          }
        });
      }
    }
  }

  // 5. Products in Store
  const productsData = [
    {
      id: 'prod-01',
      slug: 'vg-lhb-shatabdi-chair-car-pack',
      name: 'VG LHB Shatabdi AC Chair Car Pack (EOG + CC + EC)',
      sku: 'VG-LHB-CC-01',
      shortDesc: 'Complete Indian Railways Shatabdi Express rake add-on with Executive Class and Chair Cars for Open Rails & MSTS.',
      description: 'The definitive Shatabdi Express add-on for train simulation enthusiasts. Crafted from authentic Linke Hofmann Busch blueprints, this pack features the complete formation of the high-speed Shatabdi fleet.\n\nIncluded coaches:\n- LWSCZAC (AC Chair Car - 78 Seats)\n- LWFCZAC (Executive Class Chair Car - 56 Seats with pushback mechanism)\n- LWLRRM (End on Generation Power Car with diesel generator audio)\n\nEvery coach features 3D modeled interior cabins with accurate passenger seating, working night lights, high-poly FIAT-SIG bogies, realistic disc brake textures, and custom Open Rails sound effects.',
      fullSpecs: JSON.stringify({
        "Simulator Compatibility": "Open Rails 1.4+, MSTS Bin 1.8",
        "Geometry Detail": "42,000 Polygons per coach (4 LODs)",
        "Texture Resolution": "4096x4096px HD Liveries",
        "Bogie Type": "FIAT-SIG High-Speed Air Spring Bogie",
        "Audio System": "44.1 kHz Stereo Axle and Flange Audio",
        "Physics Engine": "Calibrated .wag physics with real mass and aerodynamic drag",
        "Liveries Included": "Classic Shatabdi Blue & Grey, Modern Swarna Gold"
      }),
      regularPrice: 799,
      salePrice: 599,
      isFree: false,
      categoryId: 'cat-chaircar',
      compatibility: 'Open Rails / MSTS',
      version: 'v2.4',
      fileSize: '142 MB',
      status: 'AVAILABLE',
      isFeatured: true,
      isNewArrival: false,
      installGuide: '1. Extract the downloaded ZIP archive.\n2. Copy the "VG_LHB_Shatabdi" folder into your simulator\'s "TRAINS/TRAINSET" directory.\n3. Copy the included .con files into "TRAINS/CONSISTS".\n4. Launch Open Rails and select any Shatabdi activity or Explore Route.',
      images: [
        'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_LHB_Shatabdi_v2.4_Release.zip',
          fileName: 'VG_LHB_Shatabdi_v2.4_Release.zip',
          fileFormat: 'ZIP',
          fileSize: '142 MB',
          version: 'v2.4',
          storagePath: '/downloads/files/VG_LHB_Shatabdi_v2.4_Release.zip',
          isPublicFree: false
        }
      ]
    },
    {
      id: 'prod-02',
      slug: 'vg-lhb-vistadome-tourist-coach-pack',
      name: 'VG LHB Vistadome Tourist Coach Pack (ORTS Edition)',
      slug: 'vg-lhb-vistadome-tourist-coach-pack',
      sku: 'VG-LHB-VD-02',
      shortDesc: 'Indian Railways panoramic glass-roof observation car with 180° rotatable passenger seats and rear observation deck.',
      description: 'Experience the wonder of scenic mountain and coastal railways from the best seat on the train. The VG LHB Vistadome coach features an expansive curved transparent glass canopy, luxury 180-degree swiveling seats, automatic sliding doors, and a dedicated rear observation deck.\n\nOptimized for Open Rails Train Simulator with advanced glass shaders, dynamic sun glare reflections, and realistic coach ride dynamics.',
      fullSpecs: JSON.stringify({
        "Simulator Compatibility": "Open Rails 1.4+ (Requires Shader 3.0+)",
        "Geometry Detail": "48,500 Polygons",
        "Texture Resolution": "4K Ultra HD Textures",
        "Observation Features": "Rear observation deck view + Rotatable Passenger view (Keys 5 & 8)",
        "Physics Engine": "Custom .wag file calibrated for 120 km/h comfort dynamics"
      }),
      regularPrice: 899,
      salePrice: 699,
      isFree: false,
      categoryId: 'cat-vistadome',
      compatibility: 'Open Rails',
      version: 'v2.1',
      fileSize: '118 MB',
      status: 'AVAILABLE',
      isFeatured: true,
      isNewArrival: true,
      installGuide: 'Extract archive contents directly into your Open Rails TRAINS/TRAINSET directory. Consist templates included.',
      images: [
        'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_LHB_Vistadome_v2.1.zip',
          fileName: 'VG_LHB_Vistadome_v2.1.zip',
          fileFormat: 'ZIP',
          fileSize: '118 MB',
          version: 'v2.1',
          storagePath: '/downloads/files/VG_LHB_Vistadome_v2.1.zip',
          isPublicFree: false
        }
      ]
    },
    {
      id: 'prod-03',
      slug: 'vg-lhb-rajdhani-express-complete-rake-pack',
      name: 'VG LHB Rajdhani Express Complete Rake Pack',
      sku: 'VG-LHB-RAJ-03',
      shortDesc: 'The complete red-and-silver Rajdhani fleet: First AC (H1), 2-Tier AC (A1), 3-Tier AC (B1), Pantry Car & Power Car.',
      description: 'The flagship of Indian Railways passenger service. This comprehensive add-on delivers a complete 22-coach Rajdhani Express rake with every single coach type represented down to individual coach numbering and route boards for Mumbai, Howrah, and Bangalore Rajdhani services.\n\nIncludes fully modeled Hot Buffet / Pantry Car with cooking equipment, detailed 2-Tier and 3-Tier AC sleeper compartments with reading lamps, and generator car with authentic Cummins engine idling sounds.',
      fullSpecs: JSON.stringify({
        "Coaches Included": "LWFAC (First AC), LWACCW (2-Tier AC), LWACCN (3-Tier AC), LWCBAC (Pantry/Buffet), LWLRRM (Power Car)",
        "Geometry Detail": "41,000 Polygons / coach",
        "Textures": "High-gloss Rajdhani Red & Silver stainless steel finish",
        "Simulator": "Open Rails 1.4+ / MSTS Bin"
      }),
      regularPrice: 1499,
      salePrice: 1199,
      isFree: false,
      categoryId: 'cat-sleeper',
      compatibility: 'Open Rails / MSTS',
      version: 'v3.0',
      fileSize: '286 MB',
      status: 'AVAILABLE',
      isFeatured: true,
      isNewArrival: false,
      installGuide: 'Extract archive into TRAINS/TRAINSET/VG_LHB_RAJDHANI. Ready-to-run consists provided for 18-coach and 22-coach trains.',
      images: [
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_LHB_Rajdhani_Complete_v3.0.rar',
          fileName: 'VG_LHB_Rajdhani_Complete_v3.0.rar',
          fileFormat: 'RAR',
          fileSize: '286 MB',
          version: 'v3.0',
          storagePath: '/downloads/files/VG_LHB_Rajdhani_Complete_v3.0.rar',
          isPublicFree: false
        }
      ]
    },
    {
      id: 'prod-04',
      slug: 'vg-lhb-humsafar-express-special-livery-pack',
      name: 'VG LHB Humsafar Express Special Livery Pack',
      sku: 'VG-LHB-HUM-04',
      shortDesc: 'Vibrant geometric vinyl wrap all-AC 3-Tier passenger rake with animated passenger info display screens.',
      description: 'Bring the vibrant, modern colors of Indian Railways Humsafar Express to your simulator. Includes 3-Tier AC coaches (LWACCN) and Generator Power Cars (LWLRRM) adorned with high-resolution geometric artwork and bilingual route boards.',
      fullSpecs: JSON.stringify({
        "Coaches": "LWACCN, LWLRRM",
        "Texture": "4096px Ultra-sharp vinyl print UV mappings",
        "Features": "Interior LED aisle illumination, GPS info screens",
        "Simulator": "Open Rails & MSTS"
      }),
      regularPrice: 799,
      salePrice: 599,
      isFree: false,
      categoryId: 'cat-humsafar',
      compatibility: 'Open Rails / MSTS',
      version: 'v1.8',
      fileSize: '135 MB',
      status: 'AVAILABLE',
      isFeatured: false,
      isNewArrival: true,
      installGuide: 'Copy VG_LHB_Humsafar folder into your TRAINSET directory.',
      images: [
        'https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_LHB_Humsafar_v1.8.zip',
          fileName: 'VG_LHB_Humsafar_v1.8.zip',
          fileFormat: 'ZIP',
          fileSize: '135 MB',
          version: 'v1.8',
          storagePath: '/downloads/files/VG_LHB_Humsafar_v1.8.zip',
          isPublicFree: false
        }
      ]
    },
    {
      id: 'prod-05',
      slug: 'vg-bangladesh-railway-lhb-rake-pack',
      name: 'VG Bangladesh Railway LHB Rake Pack (Maitree / Benapole Express)',
      sku: 'VG-LHB-BR-05',
      shortDesc: 'High-speed export LHB coaches operated by Bangladesh Railway in distinctive green and red livery.',
      description: 'Accurately modeled to Bangladesh Railway export blueprints, featuring custom dual brake hoses, bilingual Bangla/English station plaques, and distinct passenger seating configurations.',
      fullSpecs: JSON.stringify({
        "Coaches": "AC Chair Car, Shovon Chair, Power Car",
        "Operator": "Bangladesh Railway (BR)",
        "Livery": "Dark Green & Crimson Red stripe",
        "Gauge": "Broad Gauge (1676mm)"
      }),
      regularPrice: 999,
      salePrice: 749,
      isFree: false,
      categoryId: 'cat-bangladesh',
      compatibility: 'Open Rails / MSTS',
      version: 'v1.5',
      fileSize: '155 MB',
      status: 'AVAILABLE',
      isFeatured: false,
      isNewArrival: false,
      installGuide: 'Extract archive into your TRAINSET folder.',
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_BR_LHB_Maitree_v1.5.zip',
          fileName: 'VG_BR_LHB_Maitree_v1.5.zip',
          fileFormat: 'ZIP',
          fileSize: '155 MB',
          version: 'v1.5',
          storagePath: '/downloads/files/VG_BR_LHB_Maitree_v1.5.zip',
          isPublicFree: false
        }
      ]
    },
    {
      id: 'prod-06',
      slug: 'vg-indian-railways-route-builder-3d-asset-library-vol-1',
      name: 'VG Indian Railways Route Builder 3D Asset Library Vol. 1',
      sku: 'VG-RT-ASSET-06',
      shortDesc: 'Over 60 authentic Indian trackside structures, OHE catenary masts, platforms, signals, and footbridges.',
      description: 'Essential toolkit for Open Rails and MSTS route developers. High-performance, low-drawcall 3D assets that transform any railway route into an authentic Indian landscape. Includes 25kV OHE catenary sets, modular platform sheds, station nameboards with customizable textures, water cranes, and animated level crossing gates.',
      fullSpecs: JSON.stringify({
        "Asset Count": "64 Distinct 3D Objects (.s and .sd files)",
        "Optimization": "LODs on all models, low-drawcall textures",
        "Route Editor": "Compatible with TSRE5 and MSTS Route Editor"
      }),
      regularPrice: 1299,
      salePrice: 899,
      isFree: false,
      categoryId: 'cat-routes',
      compatibility: 'Open Rails / MSTS',
      version: 'v2.0',
      fileSize: '210 MB',
      status: 'AVAILABLE',
      isFeatured: false,
      isNewArrival: false,
      installGuide: 'Copy the "SHAPES" and "TEXTURES" directories directly into your target route folder. Add entries to route .ref file.',
      images: [
        'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_Route_Builder_Assets_v2.0.7z',
          fileName: 'VG_Route_Builder_Assets_v2.0.7z',
          fileFormat: '7Z',
          fileSize: '210 MB',
          version: 'v2.0',
          storagePath: '/downloads/files/VG_Route_Builder_Assets_v2.0.7z',
          isPublicFree: false
        }
      ]
    },
    {
      id: 'prod-07',
      slug: 'vg-open-rails-authentic-fiat-bogie-audio-pack',
      name: 'VG Open Rails Authentic FIAT Bogie Audio & Track Resonance Pack',
      sku: 'VG-AUD-FREE-07',
      shortDesc: 'Free community sound pack capturing the high-speed acoustic hum and track joint clicks of LHB FIAT bogies.',
      description: 'A gift to the Open Rails community! Recorded from actual onboard and trackside microphone arrays on the Konkan Railway and Delhi-Agra section. Replaces generic simulator sounds with authentic high-speed wheel-rail interaction, FIAT damper squeaks, flange rubbing on curves, and air brake hiss.',
      fullSpecs: JSON.stringify({
        "Sample Rate": "44.1 kHz 16-Bit Crisp Stereo WAVs",
        "Tracks": "Inside passenger cabin sound + External trackside sound",
        "License": "Free for personal non-commercial simulation use"
      }),
      regularPrice: 0,
      salePrice: 0,
      isFree: true,
      categoryId: 'cat-lhb',
      compatibility: 'Open Rails',
      version: 'v1.2',
      fileSize: '48 MB',
      status: 'AVAILABLE',
      isFeatured: true,
      isNewArrival: false,
      installGuide: 'Copy "sound" folder into your simulator SOUND directory. Detailed instructions included in Readme.txt.',
      images: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_FIAT_Bogie_Audio_v1.2_FREE.zip',
          fileName: 'VG_FIAT_Bogie_Audio_v1.2_FREE.zip',
          fileFormat: 'ZIP',
          fileSize: '48 MB',
          version: 'v1.2',
          storagePath: '/downloads/files/VG_FIAT_Bogie_Audio_v1.2_FREE.zip',
          isPublicFree: true
        }
      ]
    },
    {
      id: 'prod-08',
      slug: 'vg-msts-to-open-rails-physics-and-consist-converter-tool',
      name: 'VG MSTS to Open Rails Physics & Consist Converter Tool',
      sku: 'VG-TOOL-FREE-08',
      shortDesc: 'Free utility script to upgrade legacy MSTS .wag and .eng files with modern Open Rails physics parameters.',
      description: 'Update your older rolling stock library to modern Open Rails physics standards in seconds. Automatically calculates accurate Davis drag friction coefficients, mass distribution, air brake propagation times, and modern coupler slack dynamics.',
      fullSpecs: JSON.stringify({
        "System": "Windows 10 / 11 64-bit",
        "Application": "Standalone Portable Executable (.exe)",
        "License": "Freeware"
      }),
      regularPrice: 0,
      salePrice: 0,
      isFree: true,
      categoryId: 'cat-lhb',
      compatibility: 'Open Rails / MSTS',
      version: 'v2.0.1',
      fileSize: '15 MB',
      status: 'AVAILABLE',
      isFeatured: false,
      isNewArrival: false,
      installGuide: 'No installation required. Unzip and run VG_Physics_Converter.exe.',
      images: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop'
      ],
      files: [
        {
          name: 'VG_Physics_Converter_v2.0.1_FREE.zip',
          fileName: 'VG_Physics_Converter_v2.0.1_FREE.zip',
          fileFormat: 'ZIP',
          fileSize: '15 MB',
          version: 'v2.0.1',
          storagePath: '/downloads/files/VG_Physics_Converter_v2.0.1_FREE.zip',
          isPublicFree: true
        }
      ]
    }
  ];

  for (const prod of productsData) {
    const { images, files, ...prodFields } = prod;
    const createdProduct = await prisma.product.upsert({
      where: { id: prod.id },
      update: prodFields,
      create: prodFields
    });

    // Recreate images
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: images[i],
            alt: prod.name,
            isPrimary: i === 0,
            order: i
          }
        });
      }
    }

    // Recreate files safely
    const existingFiles = await prisma.productFile.findMany({ where: { productId: createdProduct.id } });
    for (const ef of existingFiles) {
      await prisma.downloadLog.deleteMany({ where: { fileId: ef.id } }).catch(() => {});
      await prisma.downloadEntitlement.deleteMany({ where: { productFileId: ef.id } }).catch(() => {});
    }
    await prisma.productFile.deleteMany({ where: { productId: createdProduct.id } });
    if (files && files.length > 0) {
      for (const f of files) {
        await prisma.productFile.create({
          data: {
            productId: createdProduct.id,
            name: f.name,
            fileName: f.fileName,
            fileFormat: f.fileFormat,
            fileSize: f.fileSize,
            version: f.version,
            storagePath: f.storagePath,
            isPublicFree: f.isPublicFree
          }
        });
      }
    }
  }

  // 6. Services (The 6 Exact Services from Requirement 11)
  const servicesData = [
    {
      id: 'srv-01',
      serviceNo: '01',
      title: 'Engineering Design',
      slug: 'engineering-design',
      description: 'Precision CAD drafting and structural engineering based on real-world rolling stock blueprints and railway standards.',
      fullDetails: 'We translate manufacturer schematics and technical dimensional drawings into millimeter-accurate digital specifications. Our engineering design process accounts for axle load limits, suspension travel clearances, aerodynamic body profiles, and authentic bogie geometry for both Indian Railways broad gauge and international standard gauge systems.',
      icon: 'Cpu',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
      order: 1,
      isPublished: true
    },
    {
      id: 'srv-02',
      serviceNo: '02',
      title: '3D Modelling',
      slug: '3d-modelling',
      description: 'High-detail polygon modeling optimized for simulator rendering engines, with multi-stage LOD (Level of Detail) hierarchies.',
      fullDetails: 'Specialized 3D geometry mesh creation using industry-standard tools (3ds Max, Blender, GMax). We balance ultra-realistic exterior and interior fidelity with high framerates through meticulous Level of Detail (LOD) distance thresholds, optimized drawcalls, and efficient texture atlasing.',
      icon: 'Box',
      image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?q=80&w=1000&auto=format&fit=crop',
      order: 2,
      isPublished: true
    },
    {
      id: 'srv-03',
      serviceNo: '03',
      title: 'Product Design',
      slug: 'product-design',
      description: 'End-to-end add-on creation from conceptual sketches to complete interactive virtual models with liveries and animations.',
      fullDetails: 'From initial prototype livery research to finished commercial-grade simulator packages. We design complete rolling stock families, custom passenger coach variants, high-capacity freight cars, and maintenance-of-way vehicles with opening doors, dynamic pantographs, and illuminated cab consoles.',
      icon: 'Palette',
      image: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=1000&auto=format&fit=crop',
      order: 3,
      isPublished: true
    },
    {
      id: 'srv-04',
      serviceNo: '04',
      title: 'Simulations',
      slug: 'simulations',
      description: 'Real-world physics modeling (.wag and .eng calibration), braking curves, mass distribution, and traction dynamics.',
      fullDetails: 'True simulation requires more than good looks—it demands authentic physics. We calculate real-world Davis formula drag coefficients, adhesion limits, electro-pneumatic brake propagation delays, tractive effort curves, and buffer slack action calibrated for Open Rails Train Simulator.',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1000&auto=format&fit=crop',
      order: 4,
      isPublished: true
    },
    {
      id: 'srv-05',
      serviceNo: '05',
      title: 'Visualization',
      slug: 'visualization',
      description: '4K photorealistic renders, promotional cinema showcases, and interactive 3D web presentations for developers.',
      fullDetails: 'Professional CGI renders and marketing media for rail industry clients, route builders, and digital hobbyists. We produce studio lighting renders, trackside cinematic sequences, 360-degree interactive turntable views, and high-resolution marketing artwork.',
      icon: 'Eye',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1000&auto=format&fit=crop',
      order: 5,
      isPublished: true
    },
    {
      id: 'srv-06',
      serviceNo: '06',
      title: 'Installation Support',
      slug: 'installation-support',
      description: 'Dedicated technical assistance, consist (.con) file setup, and folder troubleshooting for Open Rails and MSTS.',
      fullDetails: 'We ensure our customers never get stuck. Our technical support covers directory structuring, trainset conflicts, activity scripting, sound aliasing, and step-by-step guidance to ensure every coach and locomotive runs flawlessly on your PC setup.',
      icon: 'Headphones',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
      order: 6,
      isPublished: true
    }
  ];

  for (const srv of servicesData) {
    await prisma.service.upsert({
      where: { id: srv.id },
      update: srv,
      create: srv
    });
  }

  // 7. Coupons
  const couponsData = [
    {
      id: 'c-01',
      code: 'RAILWAY10',
      description: '10% discount on all coach packs and route assets',
      discountPercent: 10,
      minPurchase: 0,
      isActive: true
    },
    {
      id: 'c-02',
      code: 'VGEXPRESS20',
      description: '20% discount on orders above ₹1,000',
      discountPercent: 20,
      minPurchase: 1000,
      isActive: true
    },
    {
      id: 'c-03',
      code: 'FIRST100',
      description: 'Flat ₹100 off on your first simulator order',
      discountAmount: 100,
      minPurchase: 500,
      isActive: true
    }
  ];

  for (const c of couponsData) {
    await prisma.coupon.upsert({
      where: { id: c.id },
      update: c,
      create: c
    });
  }

  // 8. Sample Order & Entitlement for Demo User (so Demo user immediately has an order & downloadable product!)
  const sampleProduct = await prisma.product.findUnique({
    where: { id: 'prod-01' },
    include: { files: true }
  });

  if (sampleProduct && sampleProduct.files.length > 0) {
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: 'VG-ORD-90812' }
    });

    if (!existingOrder) {
      const order = await prisma.order.create({
        data: {
          orderNumber: 'VG-ORD-90812',
          userId: demoUser.id,
          customerName: demoUser.name,
          customerEmail: demoUser.email,
          customerPhone: demoUser.phone,
          billingAddress: '42 Railway Colony, Dadar East',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400014',
          totalAmount: 599,
          discountAmount: 0,
          finalAmount: 599,
          status: 'PAID',
          paymentMethod: 'RAZORPAY',
          paymentId: 'pay_sample_rzp_987263',
          items: {
            create: [
              {
                productId: sampleProduct.id,
                productName: sampleProduct.name,
                price: 599,
                quantity: 1
              }
            ]
          },
          payments: {
            create: [
              {
                gateway: 'RAZORPAY',
                transactionId: 'txn_rzp_987263',
                amount: 599,
                currency: 'INR',
                status: 'SUCCESS'
              }
            ]
          }
        }
      });

      // Grant download entitlement
      await prisma.downloadEntitlement.create({
        data: {
          userId: demoUser.id,
          productId: sampleProduct.id,
          productFileId: sampleProduct.files[0].id,
          orderId: order.id,
          maxDownloads: 10,
          downloadCount: 1,
          isActive: true
        }
      });
    }
  }

  // 9. Sample Contact Enquiry
  await prisma.contactEnquiry.create({
    data: {
      name: 'Aditya Sen',
      email: 'aditya.sen@railfan.in',
      phone: '+91 99887 76655',
      subject: 'Custom 3D Model for Howrah-Puri Route',
      message: 'Hello Varun, I am building the Howrah to Puri scenic route for Open Rails. Would you be available to commission custom 3D models of Kharagpur Junction platform canopies?',
      enquiryType: 'CUSTOM_MODEL',
      status: 'NEW'
    }
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('Admin account: admin@vg3dmodelers.com / Admin@VG3D#2025');
  console.log('Demo user account: demo@trainsim.com / Passenger@2025');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
