import { expect, test } from "bun:test";
import { gatewayUrl } from "./secretGateway";

test("QR target preserves the current live URL including query and fragment", () => {
  expect(gatewayUrl({ href: "https://our-story.example/?gift=birthday#memories" })).toBe("https://our-story.example/?gift=birthday#memories");
});