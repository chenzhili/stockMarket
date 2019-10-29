import TimeSharingPC from './timeSharing';

/* istanbul ignore next */
TimeSharingPC.install = function(Vue) {
  Vue.component(TimeSharingPC.name, TimeSharingPC);
};

export default TimeSharingPC;