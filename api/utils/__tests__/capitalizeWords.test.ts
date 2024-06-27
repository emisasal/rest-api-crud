import capitalizeWords from "utils/capitalizeWords"

test("Capitalize the first letter", () => {
  const word = capitalizeWords("michael")
  expect(word).toStrictEqual("Michael")
  expect(word).not.toStrictEqual("michael")
})

test("Capitalize miltiple words with accents", () => {
  const words = capitalizeWords("maría eleNa")

  expect(words).toStrictEqual("María Elena")
  expect(words).not.toStrictEqual("maría eleNa")
})
