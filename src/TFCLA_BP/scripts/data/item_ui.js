import { Entity, ItemStack, Player } from "@minecraft/server";

/** @type { Map<String, { "progress": Boolean[], "owner": Player, "type": String }> } */
export const knappingMap = new Map();

/**
 * 
 * @param { Entity } entity 
 */
const knappingTick = (entity, dataLocation) => {
    /** @type { Boolean[] } */
    if (!knappingMap.has(entity.id)) {
        console.error(`No map data: ${entity.id}`);
        return;
    }
    const mapData = knappingMap.get(entity.id);
    const progress = mapData.progress;
    const player = mapData.owner;
    const type = mapData.type;
    const currentState = [];
    const entityContainer = entity.getComponent(`minecraft:inventory`).container;
    for (let i = 1; i <= 25; i++) {
        currentState.push(entityContainer.getItem(i)?.typeId === dataLocation.initialItem[0].item);
    };
    let changed = false;
    for (let i = 0; i < 25; i++) {
        if (progress[i] && !currentState[i]) {
            player.playSound(dataLocation.sound);
            changed = true;
        };
    };
    if (changed) {
        player.runCommand(`clear @s ${dataLocation.initialItem[0].item}`);
        mapData.progress = currentState;
    };
};

export const itemUiData = [
    {
        "type": "knapping_stone",
        "id": "tfcla:stone_loose_rock",
        "amount": 2,
        "entity": "tfcla:ui_knapping",
        "sound": "tfcla.item.knapping.stone",
        "initialItem": [
            {
                "item": "tfcla:ui_knapping_stone",
                "index": [1, 25],
                "consecutive": true
            },
            {
                "item": "tfcla:arrow_right",
                "index": 26
            }
        ],
        "tick": knappingTick
    },
    {
        "type": "knapping_clay_ball",
        "id": "minecraft:clay_ball",
        "amount": 1,
        "entity": "tfcla:ui_knapping",
        "sound": "tfcla.item.knapping.clay",
        "initialItem": [
            {
                "item": "tfcla:ui_knapping_clay_ball",
                "index": [1, 25],
                "consecutive": true
            },
            {
                "item": "tfcla:ui_knapping_clay_ball_disabled",
                "index": 0
            },
            {
                "item": "tfcla:arrow_right",
                "index": 26
            }
        ],
        "tick": knappingTick
    },
    {
        "type": "knapping_fire_clay",
        "id": "tfcla:fire_clay",
        "amount": 1,
        "entity": "tfcla:ui_knapping",
        "sound": "tfcla.item.knapping.clay",
        "initialItem": [
            {
                "item": "tfcla:ui_knapping_fire_clay",
                "index": [1, 25],
                "consecutive": true
            },
            {
                "item": "tfcla:ui_knapping_fire_clay_disabled",
                "index": 0
            },
            {
                "item": "tfcla:arrow_right",
                "index": 26
            }
        ],
        "tick": knappingTick
    },
    {
        "type": "knapping_leather",
        "id": "minecraft:leather",
        "amount": 1,
        "entity": "tfcla:ui_knapping",
        "sound": "tfcla.item.knapping.leather",
        "initialItem": [
            {
                "item": "tfcla:ui_knapping_leather",
                "index": [1, 25],
                "consecutive": true
            },
            {
                "item": "tfcla:arrow_right",
                "index": 26
            }
        ],
        "tick": knappingTick
    }
]