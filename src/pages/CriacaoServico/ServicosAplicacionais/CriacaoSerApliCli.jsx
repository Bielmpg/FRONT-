import { Component } from "react";
import axios from "axios";
import { parseJWT } from '../../../services/auth';
import '../../../assets/css/style.css'

import Sidebar from "../../../components/Sidebar/SidebarCli/SidebarCliServicos";


export default class CadastroServicoAplicacionalCli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nomeServicoAplicacional: '',
            pilhaRuntime: '',
            skueTamanho: '',
            dataCadastro: new Date(),
            idUsuario: 0,

            listaServicos: [],

            isLoading: false,
        };
    }

    buscarServicosAplicacionais = () => {
        axios('http://localhost:5000/api/servicoaplicacionals')
            .then((resposta) => {
                if (resposta.status === 200) {
                    this.setState({ listaServicos: resposta.data });
                    console.log(this.state.listaServicos);
                }
            })
            .catch((erro) => console.log(erro));
    };

    atualizaStateCampo = (campo) => {
        this.setState({ [campo.target.name]: campo.target.value });
    };

    componentDidMount() {
        console.log(parseJWT().jti);
        console.log('inicia ciclo de vida');
        this.buscarServicosAplicacionais();
    }

    cadastrarServico = (event) => {
        event.preventDefault();
        this.setState({ isLoading: true });

        let servico = {
            nomeServicoAplicacional: this.state.nomeServicoAplicacional,
            pilhaRuntime: this.state.pilhaRuntime,
            skueTamanho: this.state.skueTamanho,
            dataCadastro: new Date(this.state.dataCadastro),
            idUsuario: parseJWT().jti
        };

        axios
            .post('http://localhost:5000/api/servicoaplicacionals', servico, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('usuario-login'),
                },
            })
            .then((resposta) => {
                if (resposta.status === 201) {
                    console.log('Servi??o Aplicacional Cadastrado.');
                    this.setState({ isLoading: false });
                }
            })
            .catch((erro) => {
                console.log(erro);
                this.setState({ isLoading: false });
            })
            .then(this.buscarServicosAplicacionais);

        window.location.href = "serapliusuariocli";
    };

    render() {
        return (
            <div>
                <Sidebar />
                <div className="conteudo">
                    <form onSubmit={this.cadastrarServico} className="container-conteudo-edicao-servico">
                        <h1>Dados do Servi??o</h1>

                        <h2>Detalhes da Inst??ncia</h2>
                        <label for="nomeserapli">Nome do Servi??o Aplicacional</label>
                        <input
                            type="text"
                            name="nomeServicoAplicacional"
                            value={this.state.nomeServicoAplicacional}
                            onChange={this.atualizaStateCampo}
                            className="input-text-edicao"
                            id="nomeserapli"></input>

                        <label for="runtime">Pilha de Runtime</label>
                        <select
                            id="runtime"
                            name="pilhaRuntime"
                            value={this.state.pilhaRuntime}
                            onChange={this.atualizaStateCampo}>
                            <option value="0" hidden>Selecione</option>
                            <option value=".NET 6 (LTS)">.NET 6 (LTS)</option>
                            <option value=".NET 5">.NET 5</option>
                            <option value="NODE 16 (LTS)">NODE 16 (LTS)</option>
                            <option value="NODE 15 (LTS)">NODE 15 (LTS)</option>
                        </select>

                        <label for="sku">SKU e Tamanho</label>
                        <select
                            id="sku"
                            name="skueTamanho"
                            value={this.state.skueTamanho}
                            onChange={this.atualizaStateCampo}>
                            <option value="0" hidden>Selecione</option>
                            <option value="B??sico B1- 100 ACU total, 1.75 GB de mem??ria">B??sico B1- 100 ACU total, 1.75 GB de mem??ria</option>
                            <option value="B??sico B2 -200 ACU total, 3.5 GB de mem??ria">B??sico B2 -200 ACU total, 3.5 GB de mem??ria</option>
                            <option value="Gratuito F1 - 1 GB de mem??ria">Gratuito F1 - 1 GB de mem??ria</option>
                        </select>


                        <div>
                            <button className="botao-editar">Criar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}