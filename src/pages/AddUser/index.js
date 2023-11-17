import React, { useState } from "react";
import api from '../../config/configApi';
import { Link, Navigate } from 'react-router-dom';

export const Adduser = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    })

    const valueInput = e => setUser({...user, [e.target.name]: e.target.value});

    const addUser = async e => {
        e.preventDefault();

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        };

        await api.post("/user", user, headers)
        .then((response) => {
            setStatus({
                type:'success',
                mensagem: response.data.mensagem
            })
        }).catch((err) => {
            if (err.response) {
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente novamente!"
                })
            }
        })
    }

    const mensagemAdd = {
        type: status.type,
        mensagem: status.mensagem
    }

    return (
        <div>
            <Link to="/dashboard">Dashboard</Link><br />
            <Link to="/users">Usuários</Link>

            <h1>Cadastrar usuário</h1>
            <Link to="/users"><button type="button">Listar</button></Link><br /><hr/>
           
            {status.type === 'error' ? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
            {status.type === 'success' ? <Navigate to="/users" state={mensagemAdd}/> : ""}
            

            <form onSubmit={addUser}>
                <label>Nome: </label>
                <input type="text" name="name" placeholder="Nome Completo do Usuário" onChange={valueInput}/><br /><br />

                <label>E-mail: </label>
                <input type="email" name="email" placeholder="Email do Usuário" onChange={valueInput}/><br /><br />

                <label>Senha: </label>
                <input type="password" name="password" placeholder="Senha do Usuário" autoComplete="on" onChange={valueInput}/><br /><br />

                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
};