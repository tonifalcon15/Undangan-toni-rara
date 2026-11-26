
import { getStore } from "@netlify/blobs";

const STORE_NAME = "toni-rara-guestbook";
const MAX_ENTRIES = 500;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export default async (request) => {
  const store = getStore(STORE_NAME);

  if (request.method === "GET") {
    try {
      const { blobs } = await store.list();
      const keys = blobs.map((b) => b.key).sort().reverse().slice(0, MAX_ENTRIES);
      const items = (
        await Promise.all(
          keys.map((key) => store.get(key, { type: "json" }))
        )
      ).filter(Boolean);

      items.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return json({ items });
    } catch {
      return json({ error: "Daftar ucapan belum dapat dimuat." }, 500);
    }
  }

  if (request.method !== "POST") {
    return json({ error: "Metode tidak didukung." }, 405);
  }

  try {
    const body = await request.json();
    const nama = String(body.nama || "").trim().slice(0, 80);
    const kehadiran = String(body.kehadiran || "");
    const jumlah = String(body.jumlah || "");
    const pesan = String(body.pesan || "").trim().slice(0, 600);

    if (
      !nama ||
      !pesan ||
      !["Hadir", "Tidak hadir"].includes(kehadiran) ||
      !["1 orang", "2 orang", "3 orang", "4 orang", "Lebih dari 4 orang"].includes(jumlah)
    ) {
      return json({
        error: "Mohon lengkapi nama, kehadiran, jumlah tamu, dan ucapan."
      }, 400);
    }

    if (String(body.website || "").trim()) {
      return json({ ok: true });
    }

    const entry = {
      nama,
      kehadiran,
      jumlah,
      pesan,
      createdAt: new Date().toISOString(),
    };

    const key = `${Date.now()}-${crypto.randomUUID()}`;
    await store.setJSON(key, entry);

    return json({ ok: true }, 201);
  } catch {
    return json({
      error: "Ucapan belum berhasil disimpan. Silakan coba kembali."
    }, 500);
  }
};
