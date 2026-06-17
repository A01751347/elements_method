/**
 * Demo retreats (one per element).
 *
 * LOCATIONS AND DATES ARE PLACEHOLDERS — real values come from the founder
 * after location confirmation. Per audit guidelines, candidate locations
 * (Tepoztlán, Valle de Bravo, Filobobos, Nevado de Toluca, etc.) must NOT
 * be published as confirmed. Seeds keep `location` as null and dates as
 * generic future placeholders for development only.
 */
import type { NewRetreat } from "../schema/retreats";

const Y = new Date().getUTCFullYear();
const after = (months: number, day = 15): Date =>
  new Date(Date.UTC(Y, new Date().getUTCMonth() + months, day, 14, 0, 0));

export const retreatSeeds: Omit<NewRetreat, "id" | "createdAt" | "updatedAt" | "productId">[] = [
  {
    nameEs: "Inmersión Tierra · ROOTS",
    nameEn: "Earth Immersion · ROOTS",
    startDate: after(2, 14),
    endDate: after(2, 14),
    location: null,
    modality: "presencial",
    elementsCovered: ["tierra"],
    descriptionEs:
      "Inmersión de día completo. Ejercicios Root Contact, Trust Audit y Ancestor Tree. Cupo limitado a 15 líderes.",
    descriptionEn:
      "Full-day immersion. Root Contact, Trust Audit and Ancestor Tree exercises. Capped at 15 leaders.",
    imageUrl: null,
    priceMxn: "0",
    priceUsd: null,
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
  {
    nameEs: "Inmersión Fuego · IGNITE",
    nameEn: "Fire Immersion · IGNITE",
    startDate: after(3, 12),
    endDate: after(3, 12),
    location: null,
    modality: "presencial",
    elementsCovered: ["fuego"],
    descriptionEs:
      "Fire Council, Burning Letter y Vision Activation. Protocolo de Desconexión completo. Cupo limitado a 15.",
    descriptionEn:
      "Fire Council, Burning Letter and Vision Activation. Full Disconnection Protocol. Capped at 15.",
    imageUrl: null,
    priceMxn: "0",
    priceUsd: null,
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
  {
    nameEs: "Inmersión Agua · FLOW",
    nameEn: "Water Immersion · FLOW",
    startDate: after(4, 10),
    endDate: after(4, 10),
    location: null,
    modality: "presencial",
    elementsCovered: ["agua"],
    descriptionEs:
      "River Witness, Depth Interview y Adaptation Map. Trabajo somático con agua.",
    descriptionEn:
      "River Witness, Depth Interview and Adaptation Map. Somatic work with water.",
    imageUrl: null,
    priceMxn: "0",
    priceUsd: null,
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
  {
    nameEs: "Inmersión Aire · CLEAR",
    nameEn: "Air Immersion · CLEAR",
    startDate: after(5, 8),
    endDate: after(5, 8),
    location: null,
    modality: "presencial",
    elementsCovered: ["aire"],
    descriptionEs:
      "Summit Perspective, Silence Practice y 100-Word Truth. Inmersión de día completo en paisaje abierto.",
    descriptionEn:
      "Summit Perspective, Silence Practice and 100-Word Truth. Full-day immersion in open landscape.",
    imageUrl: null,
    priceMxn: "0",
    priceUsd: null,
    capacity: 15,
    lowSeatsThreshold: 5,
    active: true,
  },
];
