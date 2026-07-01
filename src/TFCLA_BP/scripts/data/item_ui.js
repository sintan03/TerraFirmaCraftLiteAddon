// @ts-check

import { Entity, Player, ItemStack } from "@minecraft/server";

import { findKnappingRecipe } from "../ui/function.js";

/** @type { Map<String, { "progress": Boolean[], "owner": Player, "itemId": String }> } */
export const knappingMap = new Map();

/** @type { "tfcla:ui_knapping" } */
export const knappingEntityId = "tfcla:ui_knapping";

/**
 *  
 * @param { String } itemId 
 * @param { String } sound 
 * @param { { "foreItem": String | undefined, "backItem"?: String | undefined, "always"?: Boolean | undefined } } option
 * @returns { { "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] } } 
 */
function createKnappingData(itemId, sound, option = { "foreItem": undefined, "backItem": undefined, "always": true }) {
    return {
        "itemId": itemId,
        "sound": sound,
        "foreItem": option.foreItem,
        "always": option.always ?? true,
        "initialItems": [
            {
                "itemId": option.foreItem,
                "index": [1, 25],
                "consecutive": true
            },
            {
                "itemId": option.backItem ?? "tfcla:ui_air",
                "index": 0,
                "consecutive": true
            },
            {
                "itemId": "tfcla:arrow_right",
                "index": 26
            }
        ]
    };
};

/** @type { { "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] }[] } */
export const KnappingData = [
    createKnappingData("tfcla:stone_loose_rock", "tfcla.item.knapping.stone", { "foreItem": "tfcla:ui_knapping_stone" }),
    createKnappingData("minecraft:clay_ball", "tfcla.item.knapping.clay", { "foreItem": "tfcla:ui_knapping_clay_ball", "backItem": "tfcla:ui_knapping_clay_ball_disabled", "always": false }),
    createKnappingData("tfcla:fire_clay", "tfcla.item.knapping.clay", { "foreItem": "tfcla:ui_knapping_fire_clay", "backItem": "tfcla:ui_knapping_fire_clay_disabled", "always": false }),
    createKnappingData("minecraft:leather", "tfcla.item.knapping.leather", { "foreItem": "tfcla:ui_knapping_leather", "always": false }),
];
