import { NextResponse } from "next/server";
import { CONTACTS } from "@/content/site";

type LeadBody = {
  name?: string;
  company?: string;
  contact?: string;
  phone?: string;
  email?: string;
  objectType?: string;
  message?: string;
  locale?: string;
  website?: string;
};

function clean(value: unknown, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function envValue(name: string) {
  return String(process.env[name] ?? "").trim().replace(/^(["'])(.*)\1$/, "$2");
}

function telegramToken() {
  return envValue("TELEGRAM_BOT_TOKEN")
    .replace(/^bot/i, "")
    .replace(/^<|>$/g, "")
    .trim();
}

function telegramChatId() {
  return envValue("TELEGRAM_CHAT_ID")
    .replace(/^<|>$/g, "")
    .trim();
}

function fallbackUrl(data: {
  name: string;
  company: string;
  phone: string;
  email: string;
  objectType: string;
  message: string;
}) {
  const subject = encodeURIComponent("Заявка с сайта Buyursin Technics");
  const body = encodeURIComponent([
    `Имя: ${data.name}`,
    `Компания: ${data.company || "—"}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email || "—"}`,
    `Тип объекта: ${data.objectType || "—"}`,
    "",
    "Задача:",
    data.message,
  ].join("\n"));
  return `${CONTACTS.emailHref}?subject=${subject}&body=${body}`;
}

type DeliveryResult =
  | { ok: true; channel: "telegram" | "webhook" }
  | { ok: false; channel: "telegram" | "webhook"; code: string; status?: number };

async function sendTelegram(text: string): Promise<DeliveryResult> {
  const token = telegramToken();
  const chatId = telegramChatId();
  if (!token || !chatId) return { ok: false, channel: "telegram", code: "not_configured" };
  if (!/^\d{6,}:[A-Za-z0-9_-]{20,}$/.test(token)) return { ok: false, channel: "telegram", code: "invalid_token_format" };
  if (!/^-?\d+$/.test(chatId) && !/^@[A-Za-z0-9_]{5,}$/.test(chatId)) return { ok: false, channel: "telegram", code: "invalid_chat_id" };

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    const result = await response.json().catch(() => null) as {
      ok?: boolean;
      description?: string;
      parameters?: { migrate_to_chat_id?: number };
    } | null;
    if (response.ok && result?.ok !== false) return { ok: true, channel: "telegram" };
    const description = result?.description?.toLowerCase() ?? "";
    return {
      ok: false,
      channel: "telegram",
      code: response.status === 401 || response.status === 404
        ? "invalid_token"
        : result?.parameters?.migrate_to_chat_id
          ? "chat_migrated"
        : description.includes("chat not found") || description.includes("chat_id is empty")
          ? "chat_not_found"
          : description.includes("bot was blocked") || response.status === 403
            ? "bot_blocked"
            : description.includes("group chat was upgraded")
              ? "chat_migrated"
            : response.status === 429
              ? "rate_limited"
              : "telegram_rejected",
      status: response.status,
    };
  } catch {
    return { ok: false, channel: "telegram", code: "network_error" };
  }
}

async function sendWebhook(payload: Record<string, string>): Promise<DeliveryResult> {
  const url = envValue("LEAD_WEBHOOK_URL");
  if (!url) return { ok: false, channel: "webhook", code: "not_configured" };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(envValue("LEAD_WEBHOOK_TOKEN") ? { Authorization: `Bearer ${envValue("LEAD_WEBHOOK_TOKEN")}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    return response.ok
      ? { ok: true, channel: "webhook" }
      : { ok: false, channel: "webhook", code: "webhook_rejected", status: response.status };
  } catch {
    return { ok: false, channel: "webhook", code: "network_error" };
  }
}

export async function POST(request: Request) {
  let raw: LeadBody;
  try {
    raw = await request.json() as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (clean(raw.website, 200)) return NextResponse.json({ delivered: true });

  const data = {
    name: clean(raw.name, 120),
    company: clean(raw.company, 160),
    phone: clean(raw.phone || raw.contact, 80),
    email: clean(raw.email, 160),
    objectType: clean(raw.objectType, 120),
    message: clean(raw.message, 2000),
    locale: clean(raw.locale, 8),
  };

  if (data.name.length < 2 || data.phone.length < 3 || data.message.length < 3) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
  }

  const text = [
    "🔔 НОВАЯ ЗАЯВКА С САЙТА",
    "",
    `👤 Имя: ${data.name}`,
    `🏢 Компания: ${data.company || "—"}`,
    `📞 Телефон: ${data.phone}`,
    `✉️ Email: ${data.email || "—"}`,
    `🏗 Тип объекта: ${data.objectType || "—"}`,
    "",
    "📝 Задача:",
    data.message,
    "",
    `🌐 Источник: btechnics.uz · ${data.locale || "ru"}`,
  ].join("\n");

  const [telegram, webhook] = await Promise.all([
    sendTelegram(text),
    sendWebhook({ ...data, source: "buyursin-website" }),
  ]);
  if (telegram.ok || webhook.ok) {
    return NextResponse.json({
      delivered: true,
      channel: telegram.ok ? telegram.channel : webhook.channel,
    });
  }

  return NextResponse.json(
    {
      delivered: false,
      error: telegram.code,
      fallbackUrl: fallbackUrl(data),
    },
    { status: 503 },
  );
}
