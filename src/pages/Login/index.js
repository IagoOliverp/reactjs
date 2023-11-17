import React, {useState, useContext} from 'react';
import api from '../../config/configApi'; //Configurar a conexão com a API
import { useNavigate } from 'react-router-dom'; //Redirecionar para outra rota
import {Context} from '../../Context/AuthContext';

//Exportando componente Login
export const Login = () => {

    const navigate = useNavigate();

    const {authenticated, signIn} = useContext(Context);

    console.log("Situação na página de login: " + authenticated);

    const [user, setUser] = useState({ //Definindo quais valores os dados irão possuir ao iniciar o servidor com o useState
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    });

    const valorInput = e => setUser({...user, [e.target.name]: e.target.value}); //Pegando os valores que estão nos inputs

    const loginSubmit = async e => { //Submetendo o Login através do evento do botão que irá bater na API com os dados dos Inputs e retornar uma resposta no console
        e.preventDefault();
        //console.log(user.password);
        setStatus({
            loading: true
        });

        const headers = {//Chamada dos headers, políticas para acesso e permissão de usuário na API
            'Content-Type': 'application/json'
        }
        
        await api.post("/login", user, {headers}) //Chamada da API com método POST que se encontra no back-end
            .then((response) => {
                //console.log(response);
                setStatus({
                    /*type: 'success',
                    mensagem: response.data.mensagem,*/
                    loading: false
                });

                localStorage.setItem('token', response.data.token);
                signIn(true);
                return navigate('/dashboard')

            }).catch((err) => {
                if (err.response) {
                    //console.log(err.response);
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem,
                        loading: false
                    })
                }else{
                    //console.log("Erro: tente mais tarde");
                    setStatus({
                        type: 'error',
                        mensagem: 'Erro: tente mais tarde!',
                        loading: false
                    });
                }
            });
    }

    return (//Formulário de login do usuário
        <div>
            <h1>Login</h1> 
            {status.type === 'error'? <p style={{color: "#ff0000"}}>{status.mensagem}</p> : ""}
            {status.type === 'success'? <p style={{color: "green"}}>{status.mensagem}</p> : ""}
            {status.loading ? <p>Validando...</p> : ""}
            <form onSubmit={loginSubmit}>
                <label>Usuário: </label>
                <input type="text" name="email" placeholder="Digite o e-mail" onChange={valorInput}></input><br></br>

                <label>Senha: </label>
                <input type="password" name="password" placeholder="Digite a senha" autoComplete="on" onChange={valorInput}></input><br></br>
                
                {status.loading ? <button type="submit" disabled>Acessando...</button> : <button type="submit">Acessar</button>}
                
            </form>
        </div>
    );
};