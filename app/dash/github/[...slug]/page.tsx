// import axios from "axios/index";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

enum FileType {
    Folder,
    File
}

/**
 * The file structure of a repository
 */
type RepoFolder = {
    name: string;
    type: FileType.Folder,
    items: Array<RepoFolder | RepoFile>;
};

/**
 * A file in a repository
 */
type RepoFile = {
    name: string;
    type: FileType.File;
};

/**
 * Converts a list of filepaths into a tree structure
 * @param filepaths The list of filepaths to convert
 */
function convertFilepathsToMap(filepaths: string[]) {
    let fileMap: RepoFolder = {
        name: "root",
        type: FileType.Folder,
        items: []
    };

    /**
     * Inserts a file into the file map
     * @param pathComponents The path components of the file
     * @param currentFolder The current folder to insert the file into
     */
    function insertFile(pathComponents: string[], currentFolder: RepoFolder) {
        if (pathComponents.length === 1) {
            currentFolder.items.push({
                name: pathComponents[0],
                type: FileType.File
            });
        } else {
            let folderName = pathComponents[0];
            let nextFolder = currentFolder.items.find(item => item.type === FileType.Folder && item.name === folderName) as RepoFolder | undefined

            if (!nextFolder) {
                nextFolder = {
                    name: folderName,
                    type: FileType.Folder,
                    items: []
                };
                currentFolder.items.push(nextFolder);
            }

            insertFile(pathComponents.slice(1), nextFolder);
        }
    }

    // Insert each file into the file map
    filepaths.forEach(filepath => {
        let pathComponents = filepath.split('/');
        insertFile(pathComponents, fileMap);
    });

    return fileMap;
}

const i = async ({params}: {params: any}) => {
    // const router = useRouter()
    // const session = await getServerSession(authOptions);
    // const token = session.access_token;

    console.log(params)
    //@ts-ignore
    // let owner = router.query.slug[0]
    // //@ts-ignore
    // let repo = router.query.slug[1]

    // console.log(await fetchGithubRepoTree(owner, repo, "main", token))

    return (
        <div>Hello World</div>
    )
}


export default i

async function fetchGithubRepoTree(owner: any, repo: any, branch: any, accessToken = null) {
    const headers = accessToken ? { 'Authorization': `token ${accessToken}` } : {};
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

    try {
        const response = await axios.get(treeUrl, { headers });
        return response.data.tree.filter((item: any) => item.type === 'blob').map((item: any) => item.path);
    } catch (error: any) {
        return `Error fetching repository tree: ${error.message}`;
    }
}

/**
 * Fetches all repositories for a given access token
 * @param accessToken The access token to use
 */
async function fetchAllGithubRepositories(accessToken: any) {
    const headers = {'Authorization': `token ${accessToken}`};
    const repoListUrl = `https://api.github.com/user/repos`;

    try {
        const response = await axios.get(repoListUrl, {headers});
        return await Promise.all(response.data.map(async (repo: any) => {
            // Fetch branches for each repository
            const branchesUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/branches`;
            let branchNames = [];
            try {
                const branchesResponse = await axios.get(branchesUrl, {headers});
                branchNames = branchesResponse.data.map((branch: any) => branch.name);
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
