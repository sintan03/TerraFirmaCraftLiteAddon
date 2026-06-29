// @ts-check

import { Entity, Player } from "@minecraft/server";

/** @type { Map<String, { "progress": Boolean[], "owner": Player, "type": String }> } */
export const knappingMap = new Map();

/**
 * 
 * @param { Entity } entity 
 * @param { { "type": String, "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] } } extractedData
 */
export const knappingTick = (entity, extractedData) => {
    const mapData = knappingMap.get(entity.id);
    if (!mapData) return;
    const progress = mapData.progress;
    const player = mapData.owner;
    const currentState = [];
    const entityInventory = entity.getComponent(`minecraft:inventory`);
    if (!entityInventory) return;
    const entityContainer = entityInventory.container;
    for (let i = 1; i <= 25; i++) {
        currentState.push(entityContainer.getItem(i)?.typeId === extractedData.initialItems[0].itemId);
    };
    let changed = false;
    for (let i = 0; i < 25; i++) {
        if (progress[i] && !currentState[i]) {
            player.playSound(extractedData.sound);
            changed = true;
        };
    };
    if (changed) {
        player.runCommand(`clear @s ${extractedData.initialItems[0].itemId}`);
        mapData.progress = currentState;
    };
};

/** @type { "tfcla:ui_knapping" } */
export const knappingEntityId = "tfcla:ui_knapping";

/**
 * 
 * @param { String } type 
 * @param { String } itemId 
 * @param { String } sound 
 * @param { { "foreItem": String | undefined, "backItem"?: String | undefined, "always"?: Boolean | undefined } } option
 * @returns { { "type": String, "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] } } 
 */
function createKnappingData(type, itemId, sound, option = { "foreItem": undefined, "backItem": undefined, "always": true }) {
    return {
        "type": type,
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
            ...(option.backItem ? [{
                "itemId": option.backItem,
                "index": 0
            }] : []),
            {
                "itemId": "tfcla:arrow_right",
                "index": 26
            }
        ]
    };
};

/** @type { { "type": String, "itemId": String, "sound": String, "foreItem": String | undefined, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive"?: Boolean | undefined }[] }[] } */
export const KnappingData = [
    createKnappingData("knapping_stone", "tfcla:stone_loose_rock", "tfcla.item.knapping.stone", { "foreItem": "tfcla:ui_knapping_stone" }),
    createKnappingData("knapping_clay_ball", "minecraft:clay", "tfcla.item.knapping.clay", { "foreItem": "tfcla:ui_knapping_clay_ball", "backItem": "tfcla:ui_knapping_clay_ball_disabled", "always": false }),
    createKnappingData("knapping_fire_clay", "tfcla:fire_clay", "tfcla.item.knapping.clay", { "foreItem": "tfcla:ui_knapping_fire_clay", "backItem": "tfcla:ui_knapping_fire_clay_disabled", "always": false }),
    createKnappingData("knapping_leather", "minecraft:leather", "tfcla.item.knapping.leather", { "foreItem": "tfcla:ui_knapping_leather", "always": false }),
];