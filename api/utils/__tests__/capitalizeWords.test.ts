import assert from "node:assert/strict"
import { test } from "node:test"
import capitalizeWords from "../capitalizeWords"

test("Capitalize the first letter", () => {
	const word = capitalizeWords("michael")
	assert.equal(word, "Michael")
	assert.notEqual(word, "michael")
})

test("Capitalize multiple words with accents", () => {
	const words = capitalizeWords("maría eleNa")

	assert.equal(words, "María Elena")
	assert.notEqual(words, "maría eleNa")
})
