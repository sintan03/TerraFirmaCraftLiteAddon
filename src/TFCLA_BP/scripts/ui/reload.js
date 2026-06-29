// @ts-check

import { world, system, DimensionTypes } from "@minecraft/server";

import { KnappingData, knappingEntityId, knappingMap } from "../data/item_ui.js";

system.runTimeout(() => {
    const players = world.getAllPlayers();
    const dimensions = DimensionTypes.getAll().map(dimensionType => world.getDimension(dimensionType.typeId));
    players.forEach(player => player.removeTag(`tfcla_knapping`));
    for (const dimension of dimensions) {
        const entities = dimension.getEntities({ "type": knappingEntityId });
        entities.forEach(entity => entity.remove());
    };
    system.runInterval(() => {
        KnappingData.forEach(data => {
            for (const dimension of dimensions) {
                const entities = dimension.getEntities({ "type": knappingEntityId });
                if (!entities) continue;
                entities.forEach(entity => {
                    const mapData = knappingMap.get(entity.id);
                    if (mapData) {
                        const type = mapData.type;
                        const extractedData = KnappingData.find(value => value.type === type);
                        if (extractedData) {
                            extractedData.tick(entity, extractedData);
                            entity.teleport(mapData.owner.getHeadLocation());
                        };
                    };
                });
            };
        });
    }, 1);
}, 20);