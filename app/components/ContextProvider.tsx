"use client";
import {SessionProvider} from "next-auth/react";

// Types
import type {Session} from "next-auth";
import React from "react";

type Props = {
    session: Session | null,
    children: React.ReactNode
}

const ContextProvider = ({children, session}: Props) => {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
export default ContextProvider;