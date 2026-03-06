// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider } from "next-themes";
// import { useState } from "react";

// export default function Providers({ children }) {
//   const [queryClient] = useState(() => new QueryClient());
//   return (
//     <QueryClientProvider client={queryClient}>
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       {children}
//     </ThemeProvider>
//     </QueryClientProvider>
//   );
// }

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

