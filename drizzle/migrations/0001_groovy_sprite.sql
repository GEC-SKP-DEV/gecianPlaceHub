ALTER TABLE "categories" ADD COLUMN "input_type" varchar(50) DEFAULT 'single-select' NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "min_value" integer;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "max_value" integer;