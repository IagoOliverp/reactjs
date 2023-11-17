import React, { useContext } from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Context } from '../Context/AuthContext';
import { Users } from '../pages/Users'
import { Adduser } from '../pages/AddUser';
import { Viewuser } from '../pages/ViewUser';
import { EditUSer } from '../pages/EditUser';

function CustomRoute({children, redirectTo}) {
    
    const {authenticated} = useContext(Context);

    return authenticated ? children: <Navigate to = {redirectTo}/>
}

export default function RoutesAdm() {
    return ( //Mudar as rotas
        <Routes> 
            <Route path="/" element={<Login/>}/>
            <Route path="/dashboard" element={<CustomRoute redirectTo="/"><Dashboard/></CustomRoute>}/>
            <Route path="/users" element={<CustomRoute redirectTo="/"><Users/></CustomRoute>}/>
            <Route path="/add-user" element={<CustomRoute redirectTo="/"><Adduser/></CustomRoute>}/>
            <Route path="/view-user/:id" element={<CustomRoute redirectTo="/"><Viewuser/></CustomRoute>}/>
            <Route path="/edit-user/:id" element={<CustomRoute redirectTo="/"><EditUSer/></CustomRoute>}/>
        </Routes>
    );
};
