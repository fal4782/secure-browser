"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createSession(formData: FormData) {
  const url = formData.get("url") as string;

  if (!url) {
    throw new Error("URL is required");
  }

  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const response = await fetch(`${API_BASE}/api/containers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.success) {
      revalidatePath("/");
      redirect(`/session/${data.data.containerId}`);
    } else {
      throw new Error(data.error || "Failed to create session");
    }
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

export async function getActiveSessions() {
  try {
    const response = await fetch(`${API_BASE}/api/containers`, {
      cache: "no-store",
    });

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

export async function stopSession(containerId: string) {
  try {
    const response = await fetch(`${API_BASE}/api/containers/${containerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      revalidatePath("/");
    }

    return data;
  } catch (error) {
    console.error("Error stopping session:", error);
    throw error;
  }
}
