import Link from 'next/link';

const Header = ({currentUser}) => {

    const Links = [
        ! currentUser && {label: 'Sign up', href: '/auth/signup'},
        !currentUser && {label: 'Sign In', href: '/auth/signin'},
        currentUser && {label: 'Sell Tickets', href: 'tickets/new'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && {label: 'Sign Out', href: '/auth/signout'},
    ].filter(linkConfig => linkConfig).map(({label, href}) => {
        return <li className='"nav-item' key={href}>
            <Link href = {href} className='nav-link'>
                {label}
            </Link>
        </li>
    })

    return (
        <nav className="navbar bg-dark" data-bs-theme="dark" >
            <Link href="/" className='navbar-brand'>
                TicketMaster
            </Link>

            <div>
                <ul className='nav d-flex align-items-centers'>
                    {Links}
                </ul>
            </div>
        </nav>
    )
}

export default Header;

