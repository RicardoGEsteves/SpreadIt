"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

type QueryProvidersProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const QueryProviders = ({ children }: QueryProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
};

export default QueryProviders;
