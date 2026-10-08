import { test } from "node:test";
import { strictEqual } from "node:assert";
import { canEnterStory, nextCakePhase } from "./birthdayCake";

test("story stays locked until candle is blown out", () => {
  strictEqual(canEnterStory("lit"), false);
  strictEqual(canEnterStory(nextCakePhase("lit", "blow")), true);
});
test("cake cutting is optional for entering the story", () => {
  strictEqual(canEnterStory("blown"), true);
  strictEqual(nextCakePhase("lit", "cut"), "lit");
  strictEqual(nextCakePhase("blown", "cut"), "cut");
  strictEqual(canEnterStory("cut"), true);
});