import { SYMBOLIC_ENTITIES, toLightweightEntity } from "@/lib/data/symbolic-entities";
import type { LightweightEntity } from "@/types/atlas";
import MundoClient from "./MundoClient";

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

/**
 * Server Component wrapper: reads the share param and builds the lightweight
 * entity catalog server-side, so the client `MundoClient` never imports the
 * rich (server-only) data layer.
 */
export default async function MundoPage({ searchParams }: Props) {
  const params = await searchParams;
  const catalog: LightweightEntity[] = SYMBOLIC_ENTITIES.map(toLightweightEntity);
  return <MundoClient refParam={params.ref ?? null} catalog={catalog} />;
}
