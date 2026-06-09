CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."buyer_type" AS ENUM('persona', 'empresa');--> statement-breakpoint
CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'rejected', 'spam');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('MXN', 'USD');--> statement-breakpoint
CREATE TYPE "public"."document_acceptance_type" AS ENUM('check_only', 'signature_upload');--> statement-breakpoint
CREATE TYPE "public"."document_applies_to" AS ENUM('persona', 'empresa', 'ambos');--> statement-breakpoint
CREATE TYPE "public"."element" AS ENUM('agua', 'fuego', 'aire', 'tierra');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('es', 'en');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending_documents', 'pending_payment', 'pending_transfer_validation', 'paid', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('stripe', 'transferencia');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('camino', 'elemento', 'retiro_inmersivo', 'programa_corporativo');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('nueva', 'contactada', 'aceptada', 'cerrada');--> statement-breakpoint
CREATE TYPE "public"."retreat_modality" AS ENUM('presencial', 'virtual', 'hibrido');--> statement-breakpoint
CREATE TYPE "public"."testimonial_type" AS ENUM('video', 'photo_quote', 'quote_only', 'company_logo');--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "product_combinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"required_product_ids" integer[] NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"type" "product_type" NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text,
	"description_es" text NOT NULL,
	"description_en" text,
	"includes_es" text,
	"includes_en" text,
	"duration" text,
	"modality" text,
	"price_mxn" numeric(10, 2) NOT NULL,
	"price_usd" numeric(10, 2),
	"stripe_price_id_mxn" text,
	"stripe_price_id_usd" text,
	"element" "element",
	"cover_image_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "retreats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" integer,
	"name_es" text NOT NULL,
	"name_en" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"location" text,
	"modality" text NOT NULL,
	"elements_covered" text[] NOT NULL,
	"description_es" text,
	"description_en" text,
	"image_url" text,
	"price_mxn" numeric(10, 2) NOT NULL,
	"price_usd" numeric(10, 2),
	"capacity" integer NOT NULL,
	"low_seats_threshold" integer DEFAULT 10 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folio" text NOT NULL,
	"buyer_type" "buyer_type" NOT NULL,
	"buyer_name" text NOT NULL,
	"buyer_email" text NOT NULL,
	"buyer_phone" text,
	"buyer_company" text,
	"buyer_rfc" text,
	"buyer_address" text,
	"product_ids" integer[] NOT NULL,
	"retreat_id" uuid,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"discount_rule" text,
	"iva" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" "currency" NOT NULL,
	"language" "locale" NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"stripe_session_id" text,
	"transfer_proof_url" text,
	"transfer_validated_at" timestamp,
	"transfer_validated_by" text,
	"status" "order_status" DEFAULT 'pending_documents' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_folio_unique" UNIQUE("folio"),
	CONSTRAINT "orders_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "document_downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"document_version" integer NOT NULL,
	"email" text,
	"ip_address" text,
	"user_agent" text,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_es" text NOT NULL,
	"name_en" text,
	"template_html_es" text NOT NULL,
	"template_html_en" text,
	"required_for_purchase" boolean DEFAULT true NOT NULL,
	"acceptance_type" "document_acceptance_type" NOT NULL,
	"applies_to" "document_applies_to" NOT NULL,
	"current_version" integer DEFAULT 1 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "document_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"template_html_es" text NOT NULL,
	"template_html_en" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"document_template_id" uuid NOT NULL,
	"document_version" integer NOT NULL,
	"generated_pdf_url" text NOT NULL,
	"generated_pdf_hash" text NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"accepted_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"signed_pdf_url" text,
	"signed_pdf_hash" text
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"token_id" uuid,
	"order_id" uuid,
	"retreat_id" uuid,
	"respondent_email" text,
	"respondent_name" text,
	"answers" jsonb NOT NULL,
	"shareable_phrase" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"token" text NOT NULL,
	"recipient_email" text NOT NULL,
	"recipient_name" text,
	"order_id" uuid,
	"retreat_id" uuid,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "form_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_es" text NOT NULL,
	"title_en" text,
	"description_es" text,
	"description_en" text,
	"fields" jsonb NOT NULL,
	"category" text,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"content" text NOT NULL,
	"status" "comment_status" DEFAULT 'pending' NOT NULL,
	"session_id" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"moderated_at" timestamp,
	"moderated_by" text
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title_es" text NOT NULL,
	"title_en" text,
	"excerpt_es" text,
	"excerpt_en" text,
	"content_es" jsonb NOT NULL,
	"content_en" jsonb,
	"cover_image_url" text,
	"author" text,
	"meta_description_es" text,
	"meta_description_en" text,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "client_logos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"logo_url" text NOT NULL,
	"website_url" text,
	"usage_authorization_url" text,
	"sort_order" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "testimonial_type" NOT NULL,
	"author_name" text,
	"author_role" text,
	"company_name" text,
	"quote_es" text,
	"quote_en" text,
	"video_url" text,
	"photo_url" text,
	"source_form_response_id" uuid,
	"retreat_id" uuid,
	"display_locations" text[],
	"approved_by_admin" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calculator_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enterprise_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote_number" text NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"number_of_people" integer NOT NULL,
	"number_of_sessions" integer NOT NULL,
	"modality" "retreat_modality" NOT NULL,
	"breakdown" jsonb NOT NULL,
	"total_mxn" numeric(10, 2) NOT NULL,
	"total_usd" numeric(10, 2),
	"currency" "currency" NOT NULL,
	"pdf_url" text,
	"language" text NOT NULL,
	"status" "quote_status" DEFAULT 'nueva' NOT NULL,
	"notes" text,
	"valid_until" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "enterprise_quotes_quote_number_unique" UNIQUE("quote_number")
);
--> statement-breakpoint
CREATE TABLE "cal_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cal_booking_id" text NOT NULL,
	"event_type_id" uuid,
	"attendee_name" text,
	"attendee_email" text,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cal_bookings_cal_booking_id_unique" UNIQUE("cal_booking_id")
);
--> statement-breakpoint
CREATE TABLE "cal_event_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cal_event_type_id" text NOT NULL,
	"slug" text NOT NULL,
	"title_es" text NOT NULL,
	"title_en" text,
	"duration_minutes" text,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "cal_event_types_cal_event_type_id_unique" UNIQUE("cal_event_type_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manychat_contact_id" text NOT NULL,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"page_context" text,
	"language" text,
	"last_message_at" timestamp,
	"messages" jsonb,
	"order_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversations_manychat_contact_id_unique" UNIQUE("manychat_contact_id")
);
--> statement-breakpoint
CREATE TABLE "cookie_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"essential" boolean DEFAULT true NOT NULL,
	"analytics" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"source" text,
	"language" text,
	"mailchimp_status" text,
	"mailchimp_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retreats" ADD CONSTRAINT "retreats_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_downloads" ADD CONSTRAINT "document_downloads_template_id_document_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."document_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_template_id_document_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."document_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_documents" ADD CONSTRAINT "order_documents_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_documents" ADD CONSTRAINT "order_documents_document_template_id_document_templates_id_fk" FOREIGN KEY ("document_template_id") REFERENCES "public"."document_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_token_id_form_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."form_tokens"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_tokens" ADD CONSTRAINT "form_tokens_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_tokens" ADD CONSTRAINT "form_tokens_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_tokens" ADD CONSTRAINT "form_tokens_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_source_form_response_id_form_responses_id_fk" FOREIGN KEY ("source_form_response_id") REFERENCES "public"."form_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_retreat_id_retreats_id_fk" FOREIGN KEY ("retreat_id") REFERENCES "public"."retreats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cal_bookings" ADD CONSTRAINT "cal_bookings_event_type_id_cal_event_types_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."cal_event_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;