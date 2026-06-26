/**
 * Operational seeds — venues, providers, subscription tiers, and the
 * 9-retreat calendar that drives /retiros.
 *
 * Source: src/data/launchData.ts (workflow-generated, June 2026).
 * Every placeholder is documented in /PLACEHOLDERS.md.
 */
import {
  calendarRetreats,
  providersInventory,
  venuesInventory,
  legalDocs,
} from "../../../data/launchData";
import type { NewVenue, NewProvider } from "../schema/operations";
import type { NewRetreat } from "../schema/retreats";

// ────────────────────────────────────────────────────────────────────────────
// VENUES
// ────────────────────────────────────────────────────────────────────────────

export const venueSeeds: Omit<NewVenue, "id" | "createdAt" | "updatedAt">[] =
  venuesInventory.map((v) => ({
    slug: v.slug,
    name: v.name,
    city: v.city,
    state: v.state,
    capacity: v.capacity || null,
    notesEs: v.notesEs || null,
    url: v.url || null,
    rangeMxn: v.rangeMxn || null,
    active: true,
    isPlaceholder: v.isPlaceholder,
    placeholderFields: v.placeholderFields,
  }));

// ────────────────────────────────────────────────────────────────────────────
// PROVIDERS
// ────────────────────────────────────────────────────────────────────────────

export const providerSeeds: Omit<NewProvider, "id" | "createdAt" | "updatedAt">[] =
  providersInventory.map((p) => ({
    slug: p.slug,
    disciplineEs: p.disciplineEs,
    disciplineEn: p.disciplineEn,
    elementAffinity: p.elementAffinity,
    descriptionEs: p.descriptionEs,
    descriptionEn: p.descriptionEn,
    providerName: p.providerName,
    providerContact: p.providerContact,
    status: p.status,
    notesEs: p.notesEs || null,
    notesEn: p.notesEn || null,
    active: true,
    isPlaceholder: p.isPlaceholder,
    placeholderFields: p.placeholderFields,
  }));

// ────────────────────────────────────────────────────────────────────────────
// RETREATS — replaces the old 4-element demo seeds with the 9-retreat
// production calendar driven by launchData (Oct 2026 → Q4 2027).
// ────────────────────────────────────────────────────────────────────────────

export const calendarRetreatSeeds: Omit<
  NewRetreat,
  "id" | "createdAt" | "updatedAt" | "productId"
>[] = calendarRetreats.map((r) => ({
  nameEs: r.themeEs,
  nameEn: r.themeEn,
  startDate: new Date(`${r.startDate}T15:00:00.000Z`),
  endDate: new Date(`${r.endDate}T23:00:00.000Z`),
  location: r.venueLabelEs === "Por confirmar" ? null : r.venueLabelEs,
  modality: "presencial",
  elementsCovered: [r.elementKey],
  descriptionEs: r.summaryEs,
  descriptionEn: r.summaryEn,
  imageUrl: null,
  priceMxn: "0",
  priceUsd: null,
  capacity: r.capacity,
  lowSeatsThreshold: 5,
  active: r.status === "open" || r.status === "waitlist",
}));

// Quick stats helper used by PLACEHOLDERS.md generation + seed log lines
export const operationsSeedStats = {
  venues: venueSeeds.length,
  providers: providerSeeds.length,
  retreats: calendarRetreatSeeds.length,
  placeholdersTotal:
    venuesInventory.reduce((n, v) => n + v.placeholderFields.length, 0) +
    providersInventory.reduce((n, p) => n + p.placeholderFields.length, 0) +
    calendarRetreats.reduce((n, r) => n + r.placeholderFields.length, 0) +
    legalDocs.reduce((n, d) => n + d.placeholderFields.length, 0),
};
