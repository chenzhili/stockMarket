import KLineGraphPC from './pc/kLineGraphPC/index'
import TimeSharingPC from './pc/timeSharingPC/index'

import TimeSharingH5 from './h5/timeSharingH5/index'
import KLineGraphH5 from './h5/kLineGraphH5/index'

/* import { pcOrH5 } from "../enums"

const requireComponent = require.context("./", true, /.js$/);

const exportComs = {};
requireComponent.keys().forEach(rc => {
    console.log(rc.split("/"))
    if (rc.split("/").some(item => ((item === pcOrH5.pc) || item === pcOrH5.h5))) {
        const com = requireComponent(rc).default;
        console.log(com, com.name);
        if (com) {
            exportComs[com.name] = com;
        }
    }
}); */

export { KLineGraphPC, TimeSharingPC, TimeSharingH5, KLineGraphH5 }
