import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { LOYALTY_CONFIG } from "./loyalty-config";

const passwordSchema = z.string().min(1);

async function admin(password: string) {
  const { checkAdminPassword } = await import("./admin.server");
  if (!checkAdminPassword(password)) throw new Error("Clave incorrecta");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: passwordSchema }).parse(d))
  .handler(async ({ data }) => {
    const { checkAdminPassword } = await import("./admin.server");
    return { ok: checkAdminPassword(data.password) };
  });

export const setStock = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ password: passwordSchema, enabled: z.boolean() }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin(data.password);
    const { data: row, error } = await db
      .from("store_settings")
      .update({ stamps_enabled: data.enabled })
      .eq("id", 1)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listCustomers = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: passwordSchema }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin(data.password);
    const { data: rows, error } = await db
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adjustStamps = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        password: passwordSchema,
        customerId: z.string().uuid().optional(),
        code: z.string().optional(),
        delta: z.number().int().min(-5).max(5),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin(data.password);

    const query = db.from("customers").select("*");
    const { data: customer, error: findError } = data.customerId
      ? await query.eq("id", data.customerId).maybeSingle()
      : await query.eq("code", data.code ?? "").maybeSingle();
    if (findError) throw new Error(findError.message);
    if (!customer) throw new Error("No encontramos esa tarjeta");

    if (data.delta > 0) {
      const { data: settings } = await db
        .from("store_settings")
        .select("stamps_enabled")
        .eq("id", 1)
        .maybeSingle();
      if (settings && !settings.stamps_enabled) {
        throw new Error("La acumulación de sellos está pausada por falta de stock");
      }
    }

    const stamps = Math.max(
      0,
      Math.min(LOYALTY_CONFIG.goal, customer.stamps + data.delta),
    );
    const midClaimed = stamps >= LOYALTY_CONFIG.midRewardAt;

    const { data: updated, error } = await db
      .from("customers")
      .update({ stamps, mid_reward_claimed: midClaimed })
      .eq("id", customer.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

export const redeemFinal = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ password: passwordSchema, customerId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin(data.password);
    const { data: customer, error: findError } = await db
      .from("customers")
      .select("*")
      .eq("id", data.customerId)
      .maybeSingle();
    if (findError) throw new Error(findError.message);
    if (!customer) throw new Error("Cliente no encontrado");
    if (customer.stamps < LOYALTY_CONFIG.goal) throw new Error("La tarjeta no está completa");

    const { data: updated, error } = await db
      .from("customers")
      .update({
        stamps: 0,
        mid_reward_claimed: false,
        final_rewards_claimed: customer.final_rewards_claimed + 1,
      })
      .eq("id", customer.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

export const deleteCustomer = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ password: passwordSchema, customerId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    const db = await admin(data.password);
    const { error } = await db.from("customers").delete().eq("id", data.customerId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
