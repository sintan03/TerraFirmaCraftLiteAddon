import { world, system, Player, PlayerInventoryType, DimensionTypes } from "@minecraft/server";

import { itemUiData } from "../data/item_ui.js";

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
    const entity = dimension.spawnEntity(uiType, playerHead);
    entity.nameTag = entity.typeId;
    entity.addTag(`tfcla_${player.name}`);
    player.addTag(`tfcla_knapping`);
};

world.afterEvents.playerHotbarSelectedSlotChange.subscribe(ev => {
    const { player, newSlotSelected } = ev;
    checkSlot(player, newSlotSelected);
});

world.afterEvents.playerInventoryItemChange.subscribe(ev => {
    const { player, slot } = ev;
    if (player.selectedSlotIndex !== slot) return;
    checkSlot(player, slot);
});

world.afterEvents.entityContainerClosed.subscribe(ev => {
    const { entity, closeSource } = ev;
    const entityId = entity.typeId;
    if (!itemUiData.some(value => value.entity === entityId)) return;
    entity.remove();
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