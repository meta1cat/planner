import Vue from "vue";
import dayjs from "dayjs";

Vue.prototype.$dayjs = dayjs;

Vue.prototype.$format = time => {
  return dayjs(time).format("YYYY-MM-DD");
};

Vue.prototype.$format_md = time => {
  return dayjs(time).format("MM-DD");
};
