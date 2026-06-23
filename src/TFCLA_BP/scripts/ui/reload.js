import { world, system, Dimension, DimensionTypes } from "@minecraft/server";

import { itemUiData } from "../data/item_ui.js";

system.run(() => {
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
            for(const dimension of dimensions) {
                const entities = dimension.getEntities({ "type": data.entity });
                if (!entities) continue;
                players.forEach(player => {
                    entities.forEach(entity => {
                        if (entity.hasTag(`tfcla_${player.name}`)) entity.teleport(player.getHeadLocation());
                    });
                });
            };
        });
    }, 1);
});