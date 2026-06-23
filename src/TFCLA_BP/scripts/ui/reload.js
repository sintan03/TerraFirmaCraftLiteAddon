import { world, system, Dimension, DimensionTypes } from "@minecraft/server";

import { itemUiData } from "../data/item_ui.js";

system.run(() => {
    const players = world.getAllPlayers();
    /** @type { Dimension[] } */
    const dimensions = [];
    DimensionTypes.getAll().forEach(element => {
        dimensions.push(world.getDimension(element.typeId));
    });
    itemUiData.forEach(data => {
        dimensions.forEach(dimension => {
            const entities = dimension.getEntities(data.entity);
            if (!entities) continue;
            players.forEach(player => {
                entities.forEach(entity => {
                    if (!entity.hasTag(`tfcla_${player.name}`)) entity.remove();
                });
            });
        });
    });
    system.runInterval(() => {
        itemUiData.forEach(data => {
            dimensions.forEach(dimension => {
                const entities = dimension.getEntities(data.entity);
                if (!entities) continue;
                players.forEach(player => {
                    entities.forEach(entity => {
                        if (entity.hasTag(`tfcla_${player.name}`)) entity.teleport(player.getHeadLocation());
                    });
                });
            });
        });
    }, 1);
});