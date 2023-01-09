import UAuth from "@uauth/js";

let uauth: UAuth | undefined = undefined;

if (typeof window !== "undefined") {
  uauth = new UAuth({
    redirectUri: process.env.REACT_APP_UNSTOPPABLE_URI as string,
    clientID: process.env.REACT_APP_UNSTOPPABLE_ID as string,
    scope: "openid wallet",
  });
}

export default uauth;
