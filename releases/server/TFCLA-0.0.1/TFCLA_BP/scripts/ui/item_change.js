import { world, system, Player, PlayerInventoryType, DimensionTypes } from "@minecraft/server";

import { itemUiData, knappingMap } from "../data/item_ui.js";
import { removeItemData } from "../data/remove_item.js";
import { spawnUiEntity } from "./spawn.js";

/**
 * 
 * @param { Player } player 
 * @param { Number } slot 
 */
function checkSlot(player, slot) {
    const dimension = player.dimension;
    const playerHead = player.getHeadLocation();
    if (player.hasTag(`tfcla_knapping`)) {
        for (const data of itemUiData) {
            const oldEntity = dimension.getEntities({ "type": data.entity, "maxDistance": 1, "closest": 1, "location": playerHead })[0];
            if (!oldEntity) continue;
            knappingMap.delete(oldEntity.id);
            oldEntity.remove();
            player.removeTag(`tfcla_knapping`);
            break;
        };
    };
    const inventory = player.getComponent(`minecraft:inventory`);
    const itemStack = inventory.container.getItem(slot);
    const itemId = itemStack?.typeId ?? ``;
    if (!itemUiData.find(value => value.id.includes(itemId))) return;
    const itemUiDataFound = itemUiData.find(value => value.id.includes(itemId));
    const amount = itemStack.amount;
    if (amount < itemUiDataFound.amount) return;
    const uiType = itemUiDataFound.entity;
    const entity = spawnUiEntity(dimension, uiType, playerHead, player, itemUiDataFound);
    entity.nameTag = entity.typeId;
    player.addTag(`tfcla_knapping`);
};

world.afterEvents.playerHotbarSelectedSlotChange.subscribe(ev => {
    const { player, newSlotSelected } = ev;
    try {
        checkSlot(player, newSlotSelected);
    } catch (e) { };
});

world.afterEvents.playerInventoryItemChange.subscribe(ev => {
    const { player, slot } = ev;
    if (player.selectedSlotIndex !== slot) return;
    try {
        checkSlot(player, slot);
    } catch (e) { };
});

world.afterEvents.entityContainerClosed.subscribe(ev => {
    const { entity, closeSource } = ev;
    const entityId = entity.typeId;
    if (!itemUiData.some(value => value.entity === entityId)) return;
    try {
        entity.remove();
    } catch (e) { };
    /** @type { Player | undefined } */
    const player = closeSource.entity;
    if (!player) return;
    const slot = player.selectedSlotIndex;
    checkSlot(player, slot);
});

world.afterEvents.playerSpawn.subscribe(ev => {
    const { player } = ev;
    const playerName = player.name;
    const dimensions = DimensionTypes.getAll().map(dimensionType => world.getDimension(dimensionType.typeId));
    dimensions.forEach(dimension => {
        dimension.getEntities({ "tags": [`tfcla_${playerName}`] }).forEach(entity => entity.remove());
    });
});

world.afterEvents.entitySpawn.subscribe(ev => {
    const { entity } = ev;
    const itemComponent = entity.getComponent(`minecraft:item`);
    if (!itemComponent) return;
    const itemId = itemComponent.itemStack.typeId;
    if (removeItemData.starts.some(start => itemId.startsWith(start))) entity.remove(); 
});