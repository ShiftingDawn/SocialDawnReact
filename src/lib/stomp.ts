import { getApiBaseUrl } from "@lib/api.ts";

const hasWs = "WebSocket" in window || "MozWebSocket" in window;
const secure = getApiBaseUrl().startsWith("https");

const stompProto = `${hasWs ? "ws" : "http"}${secure ? "s" : ""}://`;
const rawurl = getApiBaseUrl().substring(secure ? "https://".length : "http://".length);
export const stompUrl = `${stompProto}${rawurl}ws`;
