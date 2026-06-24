import { world, system, Dimension, DimensionTypes } from "@minecraft/server";

import { itemUiData, knappingMap } from "../data/item_ui.js";

system.runTimeout(() => {
    const players = world.getAllPlayers();
    const dimensions = DimensionTypes.getAll().map(dimensionType => world.getDimension(dimensionType.typeId));
    players.forEach(player => player.removeTag(`tfcla_knapping`));
    itemUiData.forEach(data => {
        for(const dimension of dimensions) {
            const entities = dimension.getEntities({ "type": data.entity });
            entities.forEach(entity => entity.remove());
        };
    });
    system.runInterval(() => {
        itemUiData.forEach(data => {
            for (const dimension of dimensions) {
                const entities = dimension.getEntities({ "type": data.entity });
                if (!entities) continue;
                entities.forEach(entity => {
                    const itemUiDataFound = itemUiData.find(value => value.entity === entity.typeId);
                    itemUiDataFound.tick(entity, itemUiDataFound);
                    if (knappingMap.has(entity.id)) {
                        entity.teleport(knappingMap.get(entity.id).owner.getHeadLocation());
                    };
                });
            };
        });
    }, 1);
}, 20);