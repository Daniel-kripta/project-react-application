import { NavLink } from "react-router-dom";



export default function Navbar() {
  return (

    <nav>
        <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/search">Search Food</NavLink></li>
            <li><NavLink to="/savedfood">Saved Food</NavLink></li>
        </ul>
    </nav>
    )
}