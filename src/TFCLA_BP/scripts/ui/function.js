// @ts-check

import { knappingRecipes } from "../data/recipe_knapping.js";

/**
* 
* @param { String } material
* @param { Boolean[] } state
*/
export function findKnappingRecipe(material, state) {
    return knappingRecipes.find(recipe => {
	if (recipe.material !== material) return false;
	return recipe.pattern.every((v, i) => v === state[i]);
    });
};
