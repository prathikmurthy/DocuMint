import NextAuth from "next-auth";

import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        })
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async jwt({token, account}) {
            if (account) {
                token = Object.assign({}, token, {access_token: account.access_token});
            }
            return token
        },
        async session({session, token}) {
            if (session) {
                session = Object.assign({}, session, {access_token: token.access_token})
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
