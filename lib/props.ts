import { ReactNode } from "react";

export type LayoutProps = {
  params: Promise<{
    [key in string]: string | string[] | undefined;
  }>;
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
