import { ReactNode } from "react";

export type LayoutProps = PageProps & {
  children: ReactNode;
};

export type PageProps = {
  params: Promise<{
    [key in string]: string | string[] | undefined;
  }>;
  searchParams: Promise<{
    [key in string]: string | string[] | undefined;
  }>;
};
