// @ts-check

/**
 *
 * @param { String[] } pattern
 * @returns { Boolean[] }
 */
function convertPattern(pattern) {
    return pattern.flatMap(row => row.split("").map(char => char === "1"));
};

/**
 *
 * @param { String } material
 * @param { String } output
 * @param { String[] } pattern
 * @param { Number } amount
 * @returns { { "material": String, "output": String, "width": Number, "height": Number, "pattern": Boolean[], "amount": Number } }
 */
function createKnappingRecipe(material, output, pattern, amount = 1) {
    return {
        material,
        output,
        width: pattern[0].length,
        height: pattern.length,
        pattern: convertPattern(pattern),
        amount
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
    ),
    createKnappingRecipe(
        "tfcla:stone_loose_rock",
        "tfcla:stone_loose_rock",
        [
            "01",
            "11",
            "10"
        ]
    )

];
