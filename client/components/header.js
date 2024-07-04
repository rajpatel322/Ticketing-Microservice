import Link from 'next/link';

const Header = ({currentUser}) => {

    const Links = [
        ! currentUser && {label: 'Sign up', href: '/auth/signup'},
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'},
    ].filter(linkConfig => linkConfig).map(({label, href}) => {
        return <li className='"nav-item'>
            <Link href = {href} className='nav-link'>
                {label}
            </Link>
        </li>
    })

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/" className='navbar-brand'>
                TicketMaster
            </Link>

            <div className='d-flex justify-content-end'>
            <ul className='nav d-flex align-items-centers'>
                {Links}
            </ul>
            </div>
        </nav>
    )
}

export default Header;

