import { describe, it, expect } from "vitest";
import { ANIMALS } from "@/lib/data/animalRelations";
import { amigosDe, enemigoDe, buildRelationMap } from "../personalMapEngine";

/**
 * El ciclo de doce no es una lista arbitraria: las relaciones son geometría.
 * Los dos amigos (三合 San He) están a cuatro y ocho posiciones; el enemigo
 * (六冲 Liu Chong) está a seis, o sea en el punto diametralmente opuesto.
 *
 * Este test NO compara contra las tablas `SAN_HE_TRIADS` / `LIU_CHONG_CLASHES`
 * del dataset —eso sería comprobar los datos contra sí mismos— sino contra la
 * regla posicional derivada del orden del ciclo. Si alguien reordena `ANIMALS`
 * o edita una tríada a mano, esto lo detecta.
 */
describe("geometría del ciclo de doce", () => {
  it("los doce signos están en el orden canónico", () => {
    expect(ANIMALS).toEqual([
      "Rata", "Buey", "Tigre", "Gato", "Dragón", "Serpiente",
      "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo",
    ]);
  });

  it("los dos amigos de cada signo están a cuatro y ocho posiciones", () => {
    for (let i = 0; i < ANIMALS.length; i++) {
      const esperados = [ANIMALS[(i + 4) % 12], ANIMALS[(i + 8) % 12]].sort();
      expect([...amigosDe(ANIMALS[i])].sort()).toEqual(esperados);
    }
  });

  it("el enemigo de cada signo está a seis posiciones", () => {
    for (let i = 0; i < ANIMALS.length; i++) {
      expect(enemigoDe(ANIMALS[i])).toBe(ANIMALS[(i + 6) % 12]);
    }
  });

  it("Caballo: amigos Tigre y Perro, enemigo Rata", () => {
    expect([...amigosDe("Caballo")].sort()).toEqual(["Perro", "Tigre"]);
    expect(enemigoDe("Caballo")).toBe("Rata");
  });

  it("la relación es simétrica: si A es amigo de B, B es amigo de A", () => {
    for (const a of ANIMALS) {
      for (const amigo of amigosDe(a)) expect(amigosDe(amigo)).toContain(a);
      const enemigo = enemigoDe(a)!;
      expect(enemigoDe(enemigo)).toBe(a);
    }
  });

  it("la tabla que se muestra en pantalla sale en orden del ciclo", () => {
    // La UI numera cada fila por su posición en este array: si el orden no
    // fuera el del ciclo, los números impresos mentirían.
    expect(buildRelationMap("Caballo").map((e) => e.animal)).toEqual([...ANIMALS]);
  });
});
