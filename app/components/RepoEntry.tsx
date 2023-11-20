import {IconLock} from '@tabler/icons-react';
import {IconLockOpen} from '@tabler/icons-react';
import Link from 'next/link';

type Props = {
    name: string;
    isPrivate: boolean;
    lastModified: Number;
    username: string
}

export default ({name, isPrivate, lastModified, username}: Props) => {

    return (
        <Link href={"/dash/github/" + username + '/' + name}>
            <div
                className={"flex items-center bg-dark-gray p-10 hover:bg-[#298F64] rounded-2xl transition ease-in duration-400 mb-3"}>
                {isPrivate ? <IconLock/> : <IconLockOpen/>}
                <h3 className="col-8 text-white font-semibold mx-8">{name}</h3>
                {/* <p className="col-4 text-gray-400 items-end">{0}</p> */}
            </div>
        </Link>
    )
}
