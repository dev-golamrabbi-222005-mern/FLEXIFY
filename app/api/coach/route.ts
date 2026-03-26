// app/api/coach/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    // ── Coaches live in the USERS collection with role: "coach" ──────────────
    const query: Record<string, unknown> = { role: "coach" };
    if (status) {
      query.status = { $regex: status, $options: "i" };
    }

    const coaches = await dbConnect("users").find(query).toArray();

    // ── Normalise to a consistent shape ───────────────────────────────────────
    const normalised = coaches.map((c) => ({
      _id: c._id?.toString(),
      name: c.name ?? c.fullName ?? "Coach",
      email: c.email ?? "",
      // your DB field is experienceYears
      experience: c.experienceYears ?? c.experience ?? 0,
      // your DB field is specialties (string)
      expertise:
        typeof c.specialties === "string"
          ? c.specialties
          : (c.specialties?.[0] ?? c.expertise ?? c.category ?? ""),
      // your DB field is pricing.monthly
      charge: c.pricing?.monthly ?? c.charge ?? c.fee ?? 0,
      bio: c.bio ?? "",
      // certifications is array of objects — convert to strings for display
      certifications: (c.certifications ?? []).map(
        (cert: Record<string, string | number>) =>
          typeof cert === "string"
            ? cert
            : [cert.title, cert.issuedBy, cert.year]
                .filter(Boolean)
                .join(" · "),
      ),
      imageUrl: c.imageUrl ?? c.profileImage ?? c.image ?? null,
      rating: c.rating ?? null,
      clients: c.maxClients ?? c.clients ?? null,
      status: c.status ?? "approved",
      availableDays: c.availableDays ?? [],
      trainingTypes: c.trainingTypes ?? [],
      specialties: c.specialties ?? "",
      location: c.location ?? "",
    }));

    return NextResponse.json(normalised);
  } catch (error) {
    console.error("[api/coach GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch coaches" },
      { status: 500 },
    );
  }
};
