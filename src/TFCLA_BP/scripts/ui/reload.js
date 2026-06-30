// @ts-check

import { world, system, DimensionTypes, EquipmentSlot } from "@minecraft/server";

import { KnappingData, knappingEntityId, knappingMap, knappingTick } from "../data/item_ui.js";

system.runTimeout(() => {
    const players = world.getAllPlayers();
    const dimensions = DimensionTypes.getAll().map(dimensionType => world.getDimension(dimensionType.typeId));
    players.forEach(player => player.removeTag(`tfcla_knapping`));
    for (const dimension of dimensions) {
        const entities = dimension.getEntities({ "type": knappingEntityId });
        entities.forEach(entity => entity.remove());
    };
    system.runInterval(() => {
        for (const dimension of dimensions) {
            const entities = dimension.getEntities({ "type": knappingEntityId });
            if (!entities) continue;
            entities.forEach(entity => {
                const mapData = knappingMap.get(entity.id);
                if (mapData) {
                    const type = mapData.itemId;
                    const extractedData = KnappingData.find(value => value.itemId === type);
                    if (extractedData) {
                        const itemId = mapData.owner.getComponent(`minecraft:equippable`)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? ``;
                        if (itemId === type) {
                            knappingTick(entity, extractedData);
                            entity.teleport(mapData.owner.getHeadLocation());
                        } else {
                            knappingMap.delete(entity.id);
                            entity.remove();
                            mapData.owner.removeTag(`tfcla_knapping`);
                        };
                    };
                };
            });
        };
    }, 1);
}, 20);