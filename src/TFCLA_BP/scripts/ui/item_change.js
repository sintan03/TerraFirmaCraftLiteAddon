// @ts-check

import { world, Player, DimensionTypes, Entity, EquipmentSlot, PlayerInventoryType } from "@minecraft/server";

import { KnappingData, knappingEntityId, knappingMap } from "../data/item_ui.js";
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
        const oldEntity = dimension.getEntities({ "type": knappingEntityId }).find(entity => knappingMap.get(entity.id)?.owner.id === player.id);
        if (oldEntity) removeKnappingEntity(player, slot, oldEntity);
    };
    const playerInventory = player.getComponent(`minecraft:inventory`);
    if (playerInventory) {
        const itemStack = playerInventory.container.getItem(slot);
        if (itemStack) {
            const itemId = itemStack.typeId;
            const extractedData = KnappingData.find(value => value.itemId === itemId);
            if (!extractedData) return;
            const amount = itemStack.amount;
            if ((extractedData.always) && amount <= 1) return;
            const uiType = extractedData.itemId;
            const entity = spawnUiEntity(dimension, knappingEntityId, playerHead, player, extractedData);
            entity.nameTag = `${entity.typeId}_${uiType}`;
            player.addTag(`tfcla_knapping`);
        };
    };
};

/**
 * 
 * @param { Player } player 
 * @param { Number } slot 
 * @param { Entity } oldEntity
 */
function removeKnappingEntity(player, slot, oldEntity) {
    const mapData = knappingMap.get(oldEntity.id);
    if (mapData) {
        const playerSlot = player.selectedSlotIndex;
        if (playerSlot !== slot) return;
        const type = mapData.itemId;
        const playerEquippable = player.getComponent(`minecraft:equippable`);
        const itemId = playerEquippable?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? ``;
        if (itemId === type) return;
    };
    knappingMap.delete(oldEntity.id);
    oldEntity.remove();
    player.removeTag(`tfcla_knapping`);
};

world.afterEvents.playerHotbarSelectedSlotChange.subscribe(ev => {
    const { player, newSlotSelected } = ev;
    checkSlot(player, newSlotSelected);
});

world.afterEvents.playerInventoryItemChange.subscribe(ev => {
    const { player, slot, inventoryType } = ev;
    if (inventoryType !== PlayerInventoryType.Hotbar) return;
    if (player.selectedSlotIndex !== slot) return;
    checkSlot(player, slot);
});

world.afterEvents.entityContainerClosed.subscribe(ev => {
    const { entity, closeSource } = ev;
    if (!entity.isValid) return;
    const entityId = entity.typeId;
    if (knappingEntityId !== entityId) return;
    entity.remove();
    const player = /** @type { Player | undefined } */ (closeSource.entity);
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
    if (!entity.isValid) return;
    const itemComponent = entity.getComponent(`minecraft:item`);
    if (!itemComponent) return;
    const itemId = itemComponent.itemStack.typeId;
    if (removeItemData.starts.some(element => itemId.startsWith(element))) entity.remove();
});