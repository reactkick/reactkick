import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables based on your project setup
  projectId: "your-project-id",
  publishableClientKey: "your-publishable-client-key",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  }
});
