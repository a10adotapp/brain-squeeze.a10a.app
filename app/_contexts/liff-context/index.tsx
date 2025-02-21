"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import liff, { Liff } from "@line/liff";
import { getLineMiniappLiffId } from "./_actions/get-line-miniapp-liff-id";

type Context = {
  liff?: Liff | undefined;
  error: Error | null;
};

export const Context = createContext<Context>({
  error: null,
});

export function LiffContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [liffObject, setLiffObject] = useState<Liff | undefined>();

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      const liffId = await getLineMiniappLiffId();

      liff.init({ liffId })
        .then(() => {
          setLiffObject(liff);
        })
        .catch((error: Error) => {
          setError(error);
        });
    })();
  }, []);

  return (
    <Context.Provider value={{
      liff: liffObject,
      error,
    }}>
      {children}
    </Context.Provider>
  );
}
