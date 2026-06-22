import { world, system, Player } from "@minecraft/server";

import { itemUiData } from "../data/item_ui.js";

/**
 * 
 * @param { Player } player 
 * @param { Number } slot 
 */
function checkSlot(player, slot) {
    const inventory = player.getComponent(`minecraft:inventory`);
    const itemStack = inventory.container.getItem(slot);
    const itemId = itemStack?.typeId ?? "";
    if (!itemUiData.find(value => value.id.includes(itemId))) return;
    const dimension = player.dimension;
    const playerHead = player.getHeadLocation();
    const uiIndex = itemUiData.findIndex(value => value.id.includes(itemId));
    const uiType = itemUiData[uiIndex].entity;
    const entity = dimension.spawnEntity(uiType, playerHead);
    entity.nameTag = entity.typeId;
};

world.afterEvents.playerHotbarSelectedSlotChange.subscribe(ev => {
    const { player, newSlotSelected } = ev;
    checkSlot(player, newSlotSelected);
});