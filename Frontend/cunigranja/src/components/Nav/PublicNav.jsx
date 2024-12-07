
import style from "./page.modulepublic.css"


function PublicNav() {
    return ( 

        <nav className="navbar bg-nav-public shadow-sm">
            <div className="container">
                <div className="nav-content">
                    <a className="navbar-brand" href="#">
                        <img
                            src="../assets/img/CUNIGRANJA-1.png"
                            alt="" 
                            width="100" 
                            height="80" 
                        />
                    </a>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a className="nav-link" href="/quienes-somos">Quienes somos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/contactanos">Contactanos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/documentacion">Documentacion</a>
                        </li>
                        <li className="nav-item">
                            <a className="button btn-pri" href="/user/login">Ingresar</a> 
                            
                        </li>
                      
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default PublicNav;