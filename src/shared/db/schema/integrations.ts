import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  // Optional — the footer form asks for it so we can also send event info by
  // phone/WhatsApp (client feedback #40). Requires `pnpm db:push`.
  phone: text("phone"),
  source: text("source"), // 'footer' | 'blog' | 'companies' | 'checkout'
  language: text("language"),
  mailchimpStatus: text("mailchimp_status"), // 'subscribed' | 'unsubscribed' | 'pending'
  mailchimpSyncedAt: timestamp("mailchimp_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  manychatContactId: text("manychat_contact_id").notNull().unique(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  pageContext: text("page_context"),
  language: text("language"),
  lastMessageAt: timestamp("last_message_at"),
  messages: jsonb("messages"),
  orderId: uuid("order_id").references(() => orders.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calEventTypes = pgTable("cal_event_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  calEventTypeId: text("cal_event_type_id").notNull().unique(),
  slug: text("slug").notNull(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en"),
  durationMinutes: text("duration_minutes"),
  active: boolean("active").default(true).notNull(),
});

export const calBookings = pgTable("cal_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  calBookingId: text("cal_booking_id").notNull().unique(),
  eventTypeId: uuid("event_type_id").references(() => calEventTypes.id),
  attendeeName: text("attendee_name"),
  attendeeEmail: text("attendee_email"),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cookieConsents = pgTable("cookie_consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  essential: boolean("essential").default(true).notNull(),
  analytics: boolean("analytics").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type CalEventType = typeof calEventTypes.$inferSelect;
export type CalBooking = typeof calBookings.$inferSelect;
export type CookieConsent = typeof cookieConsents.$inferSelect;
