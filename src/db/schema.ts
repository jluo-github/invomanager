import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type Status = "open" | "paid" | "void" | "hold";

export const statusEnum = pgEnum("status", ["open", "paid", "void", "hold"]);
export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),

  crateTs: timestamp("crateTs").notNull().defaultNow(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text("userId").notNull(),
  status: statusEnum("status").notNull(),

  // foreign keys
  customerId: integer("customerId")
    .notNull()
    .references(() => Customers.id),
});

export const Customers = pgTable("customers", {
  id: serial("id").primaryKey(),

  crateTs: timestamp("crateTs").notNull().defaultNow(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  userId: text("userId").notNull(),
});

// test-products
export const Products = pgTable("products", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
});
