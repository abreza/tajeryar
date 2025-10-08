import createCache from "@emotion/cache";

import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export const createRtlCache = () => {
  const cache = createCache({
    key: "rtl-app",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  return cache;
};

export const createLtrCache = () => {
  const cache = createCache({
    key: "ltr-app",
    stylisPlugins: [prefixer],
  });
  return cache;
};
