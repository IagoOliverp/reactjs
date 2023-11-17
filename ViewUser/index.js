import React, { useEffect, useState } from 'react';

import { Link, useParams, Navigate } from 'react-router-dom';

import { servDeleteUser } from '../../services/ServDeleteUser';

import api from '../../config/configApi';

export const Viewuser = (props) => {

    const [data, setData] = useState('')
    const {id} = useParams()

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    useEffect(() => {

        const getUser = async () => {

            const headers = {
                'headers': {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

            await api.get("/user/" + id, headers)
            .then((response) => {
                if (response.data.user) {
                    setData(response.data.user)
                } else {
                    setStatus({
                        type: 'redError',
                        mensagem: 'Usuário não encontrado!'
                    });
                }
            }).catch((err) => {
                if(err.response){
                    setStatus({
                        type: 'redError',
                        mensagem: err.response.data.mensagem
                    });
                } else{
                    setStatus({
                        type: 'redError',
                        mensagem: 'Erro, tente mais tarde!'
                    });
                }
            })
        }

        getUser();
    },[id])

    const deleteUser = async (idUser) => {
        const response = await servDeleteUser(idUser);

        if (response) {
            if (response.type === "success") {
                setStatus({
                    type: "redSuccess",
                    mensagem: response.mensagem
                });
            } else {
                setStatus({
                    type: response.type,
                    mensagem: response.mensagem
                });
            }
        } else {
            setStatus({
                type: "redError",
                mensagem: "Erro: Tente mais tarde!"
            });
        }
    }


    /*const mensagemAdd = {
        type: status.type,
        mensagem: status.mensagem
    }*/

    const mensagemAdd = {
        type: "success",
        mensagem: status.mensagem
    }
    const mensagemAdd2 = {
        type: "error",
        mensagem: status.mensagem
    }

    return (
        <div>
            <Link to="/dashboard">Dashboard</Link><br />
            <Link to="/users">Usuários</Link><br />
            <h1>Detalhes do Usuário</h1>

            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            <Link to={"/edit-user/" + data.id}><button type="button">Editar</button></Link>{" "}
            <Link to={"#"}><button type="button" onClick={() => deleteUser(data.id)}>Apagar</button></Link><br />
            <hr />

            {status.type === 'redSuccess' ? <Navigate to="/users" state={mensagemAdd}/> : ""}
            {status.type === 'redError' ? <Navigate to="/users" state={mensagemAdd2}/> : ""}
            {status.type === "success" ? <p>{status.mensagem}</p> : ""}

            <span>{data.id}</span><br />
            <span>{data.name}</span><br />
            <span>{data.email}</span>
        </div>
    )
};