import { world, system, Dimension, Vector3, ItemStack, Entity } from "@minecraft/server";

import { itemUiData, knappingMap } from "../data/item_ui.js";

/**
 * 
 * @param { Dimension } dimension 
 * @param { String } identifier 
 * @param { Vector3 } location 
 * @param { Player } player 
 * @param { { "type": String, "id": String[], "amount": Number, "entity": String, "initialItem": { "item": String, "index": Number | Number[], "consecutive": Boolean? }[] } } dataLocation 
 * @returns { Entity }
 */
export function spawnUiEntity(dimension, identifier, location, player, dataLocation) {
    const entity = dimension.spawnEntity(identifier, location);
    const entityContainer = entity.getComponent(`minecraft:inventory`).container;
    dataLocation.initialItem.forEach(element => {
        if (typeof element.index === `number`) {
            entityContainer.setItem(element.index, new ItemStack(element.item));
        } else {
            if (element.consecutive === null || !element.consecutive) {
                element.index.forEach(i => {
                    entityContainer.setItem(i, new ItemStack(element.item));
                })
            } else {
                for (let i = element.index[0]; i <= element.index[1]; i++) {
                    entityContainer.setItem(i, new ItemStack(element.item));
                };
            };
        };
    });
    knappingMap.set(entity.id, {
        "progress": Array(25).fill(true),
        "owner": player
    });
    return entity;
};