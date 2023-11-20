import Image from "next/image";
import Link from 'next/link'
import Leaf from "../../public/leaf.svg";

const Navbar = () => {
    return (
        <div className="flex flex-col items-center justify-center fixed">
            <Link href={"/"}>
                <Image className={"py-4 text-white text-4xl"} src={Leaf} alt={"Logo"}/>
            </Link>
        </div>
    );
};

export default Navbar;