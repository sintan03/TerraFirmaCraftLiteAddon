// @ts-check

import { Entity, ItemStack } from "@minecraft/server";
import { knappingRecipes } from "../data/recipe_knapping.js";
import { knappingMap } from "../data/item_ui.js";

/**
* 
* @param { String } material
* @param { Boolean[] } state
*/
export function findKnappingRecipe(material, state) {
    const grid = to2D(state, 5);
    for (const recipe of knappingRecipes) {
        if (recipe.material !== material) continue;
        const patterns = [to2D(recipe.pattern, recipe.width), mirrorPattern(to2D(recipe.pattern, recipe.width))];
        for (const pattern of patterns) {
            const maxY = 5 - recipe.height;
            const maxX = 5 - recipe.width;
            for (let y = 0; y <= maxY; y++) {
                for (let x = 0; x <= maxX; x++) {
                    if (matchAt(pattern, grid, x, y)) return recipe;
                };
            };
        };
    };
    return undefined;
};

/**
 * 
 * @param { Boolean[][] } recipe
 * @param { Boolean[][] } grid
 * @param { Number } offsetX
 * @param { Number } offsetY
 */
function matchAt(recipe, grid, offsetX, offsetY) {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            let expected = false;
            if (y >= offsetY && y < offsetY + recipe.length && x >= offsetX && x < offsetX + recipe[0].length) {
                expected = recipe[y - offsetY][x - offsetX];
            };
            if (grid[y][x] !== expected)
                return false;
        };
    };
    return true;
};

/**
 * 
 * @param { Boolean[] } state 
 * @param { Number } width 
 * @returns { Boolean[][] }
 */
function to2D(state, width) {
    const result = [];
    for (let i = 0; i < state.length; i += width) {

        result.push(state.slice(i, i + width));
    };
    return result;
};

/**
 * 
 * @param { Boolean[][] } pattern
 */
function mirrorPattern(pattern) {

    return pattern.map(row =>
        [...row].reverse()
    );
};

/**
 * 
 * @param { Entity } entity 
 * @param { { "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] } } extractedData 
 * @param { Boolean[] } currentState 
 */
function processKnapping(entity, extractedData, currentState) {
    const entityContainer = entity.getComponent(`minecraft:inventory`)?.container;
    if (!entityContainer) return;
    const complete = entity.getProperty(`tfcla:complete`);
    const recipe = findKnappingRecipe(extractedData.itemId, currentState);
    if (recipe) {
        if (complete === 0) {
            entityContainer.setItem(27, new ItemStack(recipe.output));
            entity.setProperty(`tfcla:complete`, 1);
        } else if (complete === 1 && !entityContainer.getItem(27)) {
            entity.setProperty(`tfcla:complete`, 2);
            for (let i = 0; i <= 25; i++) {
                entityContainer.setItem(i);
            };
        };
    } else {
        if (complete === 1) {
            entityContainer.setItem(27, undefined);
            entity.setProperty("tfcla:complete", 0);
        };
    };
};


/**
 * 
 * @param { Entity } entity 
 * @param { { "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] } } extractedData
 */
export const knappingTick = (entity, extractedData) => {
    const mapData = knappingMap.get(entity.id);
    if (!mapData) return;
    const progress = mapData.progress;
    const player = mapData.owner;
    const currentState = /** @type { Boolean[] } */ ([]);
    const entityInventory = entity.getComponent(`minecraft:inventory`);
    if (!entityInventory) return;
    const entityContainer = entityInventory.container;
    for (let i = 1; i <= 25; i++) {
        currentState.push(entityContainer.getItem(i)?.typeId === extractedData.foreItem);
    };
    let changed = false;
    for (let i = 0; i < 25; i++) {
        if (progress[i] && !currentState[i]) {
            player.playSound(extractedData.sound);
            changed = true;
        };
    };
    if (changed) {
        player.runCommand(`clear @s ${extractedData.foreItem}`);
        mapData.progress = currentState;
        processKnapping(entity, extractedData, currentState);
    };
};