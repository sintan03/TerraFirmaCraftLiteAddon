import { Entity, ItemStack, Player } from "@minecraft/server";

export const itemUiData = [
    {
        "type": "knapping_stone",
        "id": [
            "tfcla:stone_loose_rock"
        ],
        "amount": 2,
        "entity": "tfcla:ui_knapping",
        "sound": "tfcla.item.knapping.stone",
        "foreItem": "tfcla:ui_stone",
        "backItem": undefined,
        "initialItem": [
            {
                "item": "tfcla:ui_stone",
                "index": [25, 49],
                "consecutive": true
            },
            {
                "item": "tfcla:arrow_right",
                "index": 50
            }
        ],
        /**
         * 
         * @param { Entity } entity 
         */
        "tick": (entity, dataLocation) => {
            /** @type { Boolean[] } */
            const progress = knappingMap.get(entity.id).progress;
            const player = knappingMap.get(entity.id).owner;
            const change = [];
            const entityContainer = entity.getComponent(`minecraft:inventory`).container;
            for (let i = 25; i < 50; i++) {
                change.push(entityContainer.getItem(i)?.typeId === dataLocation.initialItem[0].item);
            };
            let changed = false;
            for (let i = 0; i < 25; i++) {
                if (progress[i] && !change[i]) {
                    player.playSound(dataLocation.sound);
                    changed = true;
                };
            };
            if (changed) {
                player.runCommand(`clear @s ${dataLocation.initialItem[0].item}`);
                knappingMap.set(entity.id, { "progress": change, "owner": player });
            };
        }
    }
]

/** @type { Map<String, { "progress": Boolean[], "owner": Player }> } */
export const knappingMap = new Map();