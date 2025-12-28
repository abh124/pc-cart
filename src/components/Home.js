import React from "react";
import './Home.css';
import image1 from '../assetes/image1.jpg';

function Home(){
    return(
       <div className="home-container">
        <h1 className="greeting">Welcome to PC CART</h1>
        <div className="image" onClick={() => window.location.href='/chop'}>
            <img src={image1} alt="image not found" />
        </div>
        <div className="buttons">
          <button onClick={() => window.location.href='/contact'}>Contact Us</button>
          <button onClick={() => window.location.href='/admin'}>im admin</button> 
        </div>
       </div>
    );
}
export default Home;