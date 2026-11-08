import { describe, expect, it } from "vitest";
import { formatCurrency, formatDateTime } from "./formatters";
import { detailPath } from "./detail-path";

// O Intl usa espaço não separável entre "R$" e o valor
const normalize = (text: string) => text.replace(/\s/g, " ");

describe("formatCurrency", () => {
  it("formata números e strings numéricas em reais", () => {
    expect(normalize(formatCurrency(150))).toBe("R$ 150,00");
    expect(normalize(formatCurrency("1234.5"))).toBe("R$ 1.234,50");
  });

  it("devolve R$ 0,00 para valores vazios ou inválidos", () => {
    expect(formatCurrency(undefined)).toBe("R$ 0,00");
    expect(formatCurrency(null)).toBe("R$ 0,00");
    expect(formatCurrency("")).toBe("R$ 0,00");
    expect(formatCurrency("abc")).toBe("R$ 0,00");
  });
});

describe("formatDateTime", () => {
  it("formata data e hora no padrão brasileiro", () => {
    const text = formatDateTime(new Date(2026, 11, 1, 18, 30));
    expect(text).toMatch(/01\/12\/(20)?26/);
    expect(text).toContain("18:30");
  });
});

describe("detailPath", () => {
  it("monta o link de detalhe com o id", () => {
    expect(detailPath("/reservas", "abc")).toBe("/reservas?detalhe=abc");
  });
});
