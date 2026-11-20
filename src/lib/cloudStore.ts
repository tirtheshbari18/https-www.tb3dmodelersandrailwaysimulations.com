/**
 * Cloud Persistence Store for VG-3D Modelers & Railway Simulations
 *
 * Ensures all product prices, offers, stock status, train boards, and home slides
 * permanently persist across all Vercel Serverless Lambdas, page refreshes,
 * new tabs, and device sessions without data loss.
 */

const CLOUD_OBJECT_ID = "ff808181a09d98f701a1f6ff06cd7d84";
const CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;

interface CloudDatabaseState {
  products: Record<string, any>;
  trainboards: Record<string, any>;
  slides: Record<string, any>;
}

// In-memory short-lived cache (3 seconds) to prevent redundant HTTP requests within a single render cycle
let memoryCache: {
  data: CloudDatabaseState;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 3000;

export async function getCloudState(): Promise<CloudDatabaseState> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(CLOUD_URL, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const state: CloudDatabaseState = {
        products: json.data?.products || {},
        trainboards: json.data?.trainboards || {},
        slides: json.data?.slides || {},
      };
      memoryCache = { data: state, timestamp: now };
      return state;
    }
  } catch (err) {
    console.warn("[CloudStore] Failed to fetch cloud state, using memory cache or empty:", err);
  }

  return memoryCache?.data || { products: {}, trainboards: {}, slides: {} };
}

async function updateCloudState(
  updater: (state: CloudDatabaseState) => void
): Promise<boolean> {
  try {
    const currentState = await getCloudState();
    updater(currentState);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(CLOUD_URL, {
      method: "PUT",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "vg3d_persistent_database_v1",
        data: currentState,
      }),
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      memoryCache = { data: currentState, timestamp: Date.now() };
      return true;
    }
  } catch (err) {
    console.error("[CloudStore] Error saving cloud state:", err);
  }
  return false;
}

export async function saveProductOverride(productId: string, data: any): Promise<boolean> {
  return updateCloudState((state) => {
    state.products[productId] = {
      ...(state.products[productId] || {}),
      ...data,
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function saveTrainboardOverride(trainboardId: string, data: any): Promise<boolean> {
  return updateCloudState((state) => {
    state.trainboards[trainboardId] = {
      ...(state.trainboards[trainboardId] || {}),
      ...data,
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function saveSlideOverride(slideId: string, data: any): Promise<boolean> {
  return updateCloudState((state) => {
    state.slides[slideId] = {
      ...(state.slides[slideId] || {}),
      ...data,
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function applyProductOverrides<T extends { id: string }>(products: T[]): Promise<T[]> {
  try {
    const state = await getCloudState();
    const overrides = state.products;

    return products.map((prod) => {
      const ovr = overrides[prod.id];
      if (!ovr) return prod;

      const merged: any = { ...prod, ...ovr };
      // Preserve complex nested objects unless overridden
      if (ovr.imageUrl && (prod as any).images) {
        merged.images = [{ url: ovr.imageUrl, isPrimary: true }, ...(prod as any).images.slice(1)];
      }
      return merged as T;
    });
  } catch (e) {
    return products;
  }
}

export async function applySingleProductOverride<T extends { id: string }>(product: T | null): Promise<T | null> {
  if (!product) return null;
  const list = await applyProductOverrides([product]);
  return list[0] || product;
}

export async function applyTrainboardOverrides<T extends { id: string }>(trainboards: T[]): Promise<T[]> {
  try {
    const state = await getCloudState();
    const overrides = state.trainboards;

    return trainboards.map((tb) => {
      const ovr = overrides[tb.id];
      if (!ovr) return tb;
      return { ...tb, ...ovr } as T;
    });
  } catch (e) {
    return trainboards;
  }
}

export async function applySlideOverrides<T extends { id: string }>(slides: T[]): Promise<T[]> {
  try {
    const state = await getCloudState();
    const overrides = state.slides;

    return slides.map((s) => {
      const ovr = overrides[s.id];
      if (!ovr) return s;
      return { ...s, ...ovr } as T;
    });
  } catch (e) {
    return slides;
  }
}
