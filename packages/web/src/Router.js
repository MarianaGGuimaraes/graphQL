import React from "react";
import {Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import Signin from './pages/Signin';

export default function Router () {
    return(
        <Routes>
            <Route path = '/' element ={<Home/>}/>
            <Route path ="/sign-in" element ={<Signin/>}/>
        </Routes>
    )
}