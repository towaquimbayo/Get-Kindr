import Link from "next/link";

const Navbar = () => {
    return (
        <nav className='flex-between w-full mb-16 pt-3'>
            {/* Desktop Navigation */}
            <div className='sm:flex hidden'>
                <div className='flex gap-3 md:gap-5'>
                    <Link href="/">Home</Link>
                    <Link href="/about">About</Link>
                    <Link href="/events">Events</Link>
                    <Link href="/login">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;