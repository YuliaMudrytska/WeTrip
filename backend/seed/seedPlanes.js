const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Destino = require("../models/destino");
const Plan = require("../models/plan");

dotenv.config();

const TIPOS_PLAN = [
  {
    tipo: "completo",
    incluye: { transporte: true, alojamiento: true, rutas: true }
  },
  {
    tipo: "transporte_alojamiento",
    incluye: { transporte: true, alojamiento: true, rutas: false }
  },
  {
    tipo: "transporte_rutas",
    incluye: { transporte: true, alojamiento: false, rutas: true }
  },
  {
    tipo: "alojamiento_rutas",
    incluye: { transporte: false, alojamiento: true, rutas: true }
  }
];

const destinosBase = [
  {
    ciudad: "Madrid",
    pais: "España",
    slug: "madrid-espana",
    descripcion: "Ciudad cultural con historia, gastronomía y planes urbanos."
  },
  {
    ciudad: "París",
    pais: "Francia",
    slug: "paris-francia",
    descripcion: "Destino romántico con arte, moda, gastronomía y monumentos icónicos."
  },
  {
    ciudad: "Venecia",
    pais: "Italia",
    slug: "venecia-italia",
    descripcion: "Ciudad de canales, arquitectura histórica y paseos únicos."
  },
  {
    ciudad: "Roma",
    pais: "Italia",
    slug: "roma-italia",
    descripcion: "Capital histórica con ruinas, plazas, museos y gastronomía italiana."
  },
  {
    ciudad: "Tokio",
    pais: "Japón",
    slug: "tokio-japon",
    descripcion: "Destino moderno con tradición, tecnología y rutas únicas."
  },
  {
    ciudad: "Bruselas",
    pais: "Bélgica",
    slug: "bruselas-belgica",
    descripcion: "Ciudad europea con arquitectura, chocolate, museos y ambiente cultural."
  },
  {
    ciudad: "Seoul",
    pais: "Corea del Sur",
    slug: "seoul-corea-del-sur",
    descripcion: "Capital dinámica con cultura pop, historia, tecnología y gastronomía."
  },
  {
    ciudad: "Los Angeles",
    pais: "Estados Unidos",
    slug: "los-angeles-estados-unidos",
    descripcion: "Ciudad de cine, playas, rutas urbanas y entretenimiento."
  },
  {
    ciudad: "Barcelona",
    pais: "España",
    slug: "barcelona-espana",
    descripcion: "Destino mediterráneo con arquitectura, playa, cultura y gastronomía."
  },
  {
    ciudad: "Londres",
    pais: "Reino Unido",
    slug: "londres-reino-unido",
    descripcion: "Ciudad cosmopolita con historia, museos, mercados y planes urbanos."
  }
];

const imagenes = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
];

const crearPlanesParaDestino = (destinoId, ciudad) => {
  const planes = [];
  let contador = 1;

  TIPOS_PLAN.forEach((tipoPlan) => {
    for (let i = 1; i <= 5; i++) {
      planes.push({
        destinoId,
        tipo: tipoPlan.tipo,
        descripcion: `Plan ${contador} para descubrir ${ciudad} con una propuesta adaptada al tipo ${tipoPlan.tipo.replaceAll("_", " + ")}.`,
        imagen: `${imagenes[contador % imagenes.length]}?auto=format&fit=crop&w=800&q=80`,
        precioBasePorPersona: 180 + contador * 35,
        incluye: tipoPlan.incluye,
        maxPersonas: contador <= 10 ? 4 : 10
      });

      contador++;
    }
  });

  return planes;
};

const seedPlanes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");

    await Destino.deleteMany();
    await Plan.deleteMany();

    console.log("Destinos y planes anteriores eliminados");

    for (const destinoData of destinosBase) {
      const destino = await Destino.create({
        ...destinoData,
        imagen: `${imagenes[0]}?auto=format&fit=crop&w=800&q=80`
      });

      const planes = crearPlanesParaDestino(destino._id, destino.ciudad);

      await Plan.insertMany(planes);

      console.log(`✔ ${destino.ciudad}: 20 planes creados`);
    }

    console.log("Seed completado correctamente");
    console.log("Total creado: 10 ciudades y 200 planes");

    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  }
};

seedPlanes();