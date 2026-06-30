// @ts-check

/**
 *
 * @param { String[] } pattern
 * @returns { Boolean[] }
 */
function convertPattern(pattern) {
    if (pattern.length !== 5)
        throw new Error("Pattern must have 5 rows.");

    if (pattern.some(row => row.length !== 5))
        throw new Error("Each row must have 5 columns.");

    return pattern.flatMap(row => row.split("").map(char => char === "1"));
};

/**
 *
 * @param { String } material
 * @param { String } output
 * @param { String[] } pattern
 */
function createKnappingRecipe(material, output, pattern) {
    return {
        material,
        output,
        pattern: convertPattern(pattern)
    };
};

export const knappingRecipes = [

    createKnappingRecipe(
        "tfcla:stone_loose_rock",
        "tfcla:stone_axe_head",
        [
            "01000",
            "11110",
            "11111",
            "11110",
            "01000"
        ]
    )

];
