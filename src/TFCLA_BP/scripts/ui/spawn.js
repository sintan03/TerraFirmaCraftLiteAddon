// @ts-check

import { world, system, Dimension, Player, ItemStack, Entity } from "@minecraft/server";

import { KnappingData, knappingMap } from "../data/item_ui.js";

/**
 * 
 * @param { Dimension } dimension 
 * @param { String } identifier 
 * @param { import("@minecraft/server").Vector3 } location 
 * @param { Player } player 
 * @param { { "type": String, "itemId": String, "sound": String, "foreItem": String, "always": Boolean, "initialItems": { "itemId": String | undefined, "index": Number | Number[], "consecutive": Boolean? }[] } } extractedData 
 * @returns { Entity }
 */
export function spawnUiEntity(dimension, identifier, location, player, extractedData) {
    const entity = dimension.spawnEntity(/** @type { import("@minecraft/server").VanillaEntityIdentifier } */(identifier), location);
    const entityInventory = entity.getComponent(`minecraft:inventory`);
    if (entityInventory === undefined) {
        return entity;
    } else {
        const entityContainer = entityInventory.container;
        extractedData.initialItems.forEach(initialItem => {
            const initialItemId = initialItem.itemId ?? `minecraft:air`;
            if (typeof initialItem.index === `number`) {
                entityContainer.setItem(initialItem.index, new ItemStack(initialItemId));
            } else {
                if (initialItem.consecutive === null || !initialItem.consecutive) {
                    initialItem.index.forEach(i => {
                        entityContainer.setItem(i, new ItemStack(initialItemId));
                    })
                } else {
                    for (let i = initialItem.index[0]; i <= initialItem.index[1]; i++) {
                        entityContainer.setItem(i, new ItemStack(initialItemId));
                    };
                };
            };
        });
        knappingMap.set(entity.id, {
            "progress": Array(25).fill(true),
            "owner": player,
            "type": extractedData.type
        });
    };
    return entity;
};