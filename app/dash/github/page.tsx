// Typing
import {signIn, useSession} from "next-auth/react";
import Navbar from '../../components/Navbar';
import EntryContainer from "@/app/components/EntryContainer";
import RepoEntry from "@/app/components/RepoEntry";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {EntryType} from "@/app/components/EntryContainer";
import axios from "axios";


async function fetchAllGithubRepositories(accessToken: any) {
    const headers = { 'Authorization': `token ${accessToken}` };
    const repoListUrl = `https://api.github.com/user/repos`;

    try {
        const response = await axios.get(repoListUrl, { headers });
        return await Promise.all(response.data.map(async (repo: any) => {
            // Fetch branches for each repository
            const branchesUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/branches`;
            let branchNames = [];
            try {
                const branchesResponse = await axios.get(branchesUrl, { headers });
                branchNames = branchesResponse.data.map((branch: { name: any; }) => branch.name);
            } catch (branchError: any) {
                console.error(`Error fetching branches for ${repo.name}: ${branchError.message}`);
            }

            return {
                name: repo.name,
                owner: repo.owner.login,
                lastModified: repo.updated_at,
                private: repo.private,
                branches: branchNames, // Include branch names
                stars: repo.stargazers_count,
                watchers: repo.watchers_count,
            };
        }));
    } catch (error: any) {
        throw new Error(`Error fetching repositories: ${error.message}`);
    }
}

export default async () => {
    const session = await getServerSession(authOptions);
    const token = session.access_token;

    const repositories = await fetchAllGithubRepositories(token);
    const repoObjects = repositories.map(repo => {
        return {
            name: repo.name,
            lastModified: Date.parse(repo.lastModified),
            isprivate: repo.private,
            username: repo.owner,
        };
    });

    repoObjects.sort((a, b) => b.lastModified - a.lastModified);
    return (
        <>
            <Navbar/>
            <EntryContainer type={EntryType.Repository}>
                {repoObjects.map(repo => <RepoEntry key={repo.name} isPrivate={repo.isprivate} {...repo}/>)}
            </EntryContainer>
        </>);
}