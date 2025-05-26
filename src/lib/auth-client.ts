import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { emailOTPClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL:
    "http://172.20.10.3:3000" /* Base URL of your Better Auth backend. */,
  plugins: [
    expoClient({
      scheme: "cyconnect",
      storagePrefix: "cyconnect",
      storage: SecureStore,
    }),
    emailOTPClient(),
  ],
});
