/**
 * Demo retreats (one per element). Real dates/locations come from the client
 * in cronograma Semana 0 (P-05).
 */
import type { NewRetreat } from "../schema/retreats";

const Y = new Date().getUTCFullYear();
const after = (months: number, day = 15): Date => new Date(Date.UTC(Y, new Date().getUTCMonth() + months, day, 14, 0, 0));

export const retreatSeeds: Omit<NewRetreat, "id" | "createdAt" | "updatedAt" | "productId">[] = [
  {
    nameEs: "Módulo Tierra · Tepoztlán",
    nameEn: "Earth Module · Tepoztlán",
    startDate: after(2, 14),
    endDate: after(2, 14),
    location: "Tepoztlán, Morelos",
    modality: "presencial",
    elementsCovered: ["tierra"],
    descriptionEs:
      "Inmersión de día completo en bosque al pie del Tepozteco. Ejercicios Root Contact, Trust Audit y Ancestor Tree. Cupo limitado a 15 líderes.",
    descriptionEn:
      "Full-day immersion in forest at the foot of Tepozteco. Root Contact, Trust Audit and Ancestor Tree exercises. Capped at 15 leaders.",
    imageUrl: null,
    priceMxn: "25000.00",
    priceUsd: "1390",
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
  {
    nameEs: "Módulo Fuego · Valle de Bravo",
    nameEn: "Fire Module · Valle de Bravo",
    startDate: after(3, 12),
    endDate: after(3, 12),
    location: "Valle de Bravo, Estado de México",
    modality: "presencial",
    elementsCovered: ["fuego"],
    descriptionEs:
      "Fire Council, Burning Letter y Vision Activation alrededor de fogata. Disconnection Protocol completo. Cupo limitado a 15.",
    descriptionEn:
      "Fire Council, Burning Letter and Vision Activation around a campfire. Full Disconnection Protocol. Capped at 15.",
    imageUrl: null,
    priceMxn: "25000.00",
    priceUsd: "1390",
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
  {
    nameEs: "Módulo Agua · Río Filobobos",
    nameEn: "Water Module · Filobobos River",
    startDate: after(4, 10),
    endDate: after(4, 10),
    location: "Tlapacoyan, Veracruz",
    modality: "presencial",
    elementsCovered: ["agua"],
    descriptionEs:
      "Inmersión junto al río. River Witness, Depth Interview y Adaptation Map. Trabajo somático con agua.",
    descriptionEn:
      "Immersion beside the river. River Witness, Depth Interview and Adaptation Map. Somatic work with water.",
    imageUrl: null,
    priceMxn: "25000.00",
    priceUsd: "1390",
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
  {
    nameEs: "Módulo Aire · Nevado de Toluca",
    nameEn: "Air Module · Nevado de Toluca",
    startDate: after(5, 8),
    endDate: after(5, 8),
    location: "Nevado de Toluca, Estado de México",
    modality: "presencial",
    elementsCovered: ["aire"],
    descriptionEs:
      "Summit Perspective en altitud, Silence Practice y 100-Word Truth. Inmersión de día completo en paisaje abierto.",
    descriptionEn:
      "Summit Perspective at altitude, Silence Practice and 100-Word Truth. Full-day immersion in open landscape.",
    imageUrl: null,
    priceMxn: "25000.00",
    priceUsd: "1390",
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
];
