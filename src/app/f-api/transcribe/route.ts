import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const AI_PROXY_BASE = "https://rapid-bonus-3ec6.ab-reza.workers.dev";

function buildProxyUrl(path: string) {
  const base = AI_PROXY_BASE.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("audio") as File | null;
    const modelOverride = (form.get("model") as string | null) ?? null;
    const granularity = (form.get("granularity") as string | null) ?? null;

    if (!file) {
      return NextResponse.json(
        { error: "فایل صوتی ارسال نشده است." },
        { status: 400 }
      );
    }

    const fd = new FormData();
    fd.append("audio", file, (file as any).name ?? "audio.webm");
    if (modelOverride) fd.append("model", modelOverride);
    if (granularity) fd.append("granularity", granularity);

    const url = buildProxyUrl("/openai/transcribe");

    const upstream = await fetch(url, {
      method: "POST",
      body: fd,
      headers: {
        "User-Agent": "transcribe-proxy-client/1.0",
      },
    });

    const ct = upstream.headers.get("content-type") || "";
    const text = await upstream.text();

    if (!upstream.ok) {
      let detail: any = text;
      try {
        detail = JSON.parse(text);
      } catch {}
      return NextResponse.json(
        {
          error: "Upstream transcription error",
          detail,
        },
        { status: upstream.status }
      );
    }

    if (!/application\/json/i.test(ct)) {
      return NextResponse.json(
        {
          error: `Unexpected content-type from proxy: "${ct || "unknown"}"`,
          body: text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);

    return NextResponse.json({
      text: data.text ?? "",
      language: data.language ?? null,
      durationInSeconds: data.durationInSeconds ?? null,
      segments: Array.isArray(data.segments) ? data.segments : [],
      warnings: Array.isArray(data.warnings) ? data.warnings : [],
    });
  } catch (err: any) {
    const message = err?.message ?? "خطایی در تبدیل گفتار به متن رخ داده است.";
    const cause = err?.cause ?? null;

    return NextResponse.json({ error: message, cause }, { status: 500 });
  }
}
