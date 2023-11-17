import React, { useEffect, useState } from 'react';
import api from '../../config/configApi';
import { useParams, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { servDeleteUser } from '../../services/ServDeleteUser';

export const EditUSer = (props) => {

    const {id} = useParams()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const EditUSer = async e => {
        e.preventDefault();

        const headers = {
            'headers': {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

        await api.put("/user", {id, name, email, password}, headers)
        .then((response) => {
            setStatus({
                type: 'redSuccess',
                mensagem: response.data.mensagem
            });
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                });
            }else {
                setStatus({
                    type: 'error',
                    mensagem: 'Erro: Tente mais tarde!'
                });
            }
        })
    }

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
                    setName(response.data.user.name);
                    setEmail(response.data.user.email);
                } else {
                    setStatus({
                        type: 'redWarning',
                        mensagem: 'Usuário não encontrado!'
                    });
                }
            }).catch((err) => {
                if(err.response){
                    setStatus({
                        type: 'redWarning',
                        mensagem: err.response.data.mensagem
                    });
                } else{
                    setStatus({
                        type: 'redWarning',
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
            if (response.type === "success"){
                setStatus({
                    type: 'redSuccess',
                    mensagem: response.mensagem
                })
            }else {
                setStatus({
                    type: "error",
                    mensagem: response.mensagem
                })
            }
        }else {
            setStatus({
                type: 'error',
                mensagem: 'Erro: Tente mais tarde'
            })
        }
    }


    const mensagemAdd = {
        type: 'error',
        mensagem: status.mensagem
    }
    const mensagemAdd2 = {
        type: 'success',
        mensagem: status.mensagem
    }


    return (
        <div>
            <Link to="/dashboard">Dashboard</Link><br />
            <Link to="/users">Usuários</Link><br />

            <h1>Editar Usuário</h1>

            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            <Link to={"/view-user/" + id}><button type="button">Visualizar</button></Link>{" "}
            <Link to="#"><button type="button" onClick={() => deleteUser(id)}>Apagar</button></Link>

            {status.type === 'redWarning' ? <Navigate to="/users" state={mensagemAdd}/> : ""}

            {status.type === 'redSuccess' ?  <Navigate to="/users" state={mensagemAdd2}/> : ""}

            {status.type === 'error' ?  <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
            <hr />
            <form onSubmit={EditUSer}>
                <label>Nome: </label>
                <input type="text" name="name" placeholder="Nome completo do usuário" value={name} onChange={text => setName(text.target.value)}/><br /><br />
                <label>E-mail: </label>
                <input type="email" name="email" placeholder="E-mail do usuário" value={email} onChange={text => setEmail(text.target.value)}/><br /><br />
                <label>Senha: </label>
                <input type="password" name="password" placeholder="Senha do Usuário" autoComplete="on" onChange={text => setPassword(text.target.value)}/><br /><br />
                <button type="submit">Salvar</button>
            </form>
        </div>
    )
}