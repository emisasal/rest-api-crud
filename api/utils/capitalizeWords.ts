// Capitalize first letter of words
// input: "maría eleNa"
// return: "María Elena"

const capitalizeWords = (input: string): string => {
  return input.replace(
    /\b\p{L}[\p{L}\p{Mn}]*\b/gu,
    (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
  )
}

export default capitalizeWords
