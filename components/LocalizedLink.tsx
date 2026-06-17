"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type LocalizedLinkProps = NextLinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & {
    children: React.ReactNode;
  };

export default function LocalizedLink({ href, ...rest }: LocalizedLinkProps) {
  const params = useParams();
  const locale = params?.locale || "en";

  let localizedHref = href;

  if (typeof href === "string") {
    if (href.startsWith("/")) {
      localizedHref = `/${locale}${href}`;
    }
  } else if (href && href.pathname && href.pathname.startsWith("/")) {
    localizedHref = { ...href, pathname: `/${locale}${href.pathname}` };
  }

  return <NextLink href={localizedHref} {...rest} />;
}
