import React, { Component } from 'react';
import firebase from 'firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import md5 from 'md5';
class EditableRow extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        //Estado para armazenar o nome
        name: null,
        //Estado para armazenar o email
        email: null,
        //Estado que irá indicar se os dados estão em processo de atualização
        //Quando o saving for true o botão salvar irá apresentar um circular progress
        saving: false,
    }

    //Método para se salvar os dados atualizados
    save = () => {

        //Como o processo de atualização dos dados está sendo iniciado, deve-se definir 
        //o estado saving para true
        this.setState({ saving: true });
        //Gerando id do empregado
        let uid, seed;
        if(!this.props.id){
            seed = Math.random();
            uid = md5(seed);
        }
        uid = this.props.id;
        //Salvando os dados do empregado no banco de dados
        firebase.database().ref("employees/"+uid).update(
            {   
                name:this.state.name,
                email:this.state.email,
            }
        ).then(() => {
            this.setState({saving:false});
            this.props.containerRef.unsetAsEditable();
        }).catch(error => {
            window.alert("Ocorreu um erro tente novamente!")
            console.log(error);
        });
    }

    //Método para cancelar a atualização dos dados
    //Caso o saving seja true o botão de cancelar deve ser desabilitado
    close = () => {
        console.log(this.props.containerRef);
        this.props.containerRef.unsetAsEditable();
    }

    //Método para lidar com a edição dos nomes dos empregados
    handleChangeName = (event) => {
        const new_name = event.target.value;
        this.setState({
            name: new_name
        });
    }

    //Métodos para lidar com a edição dos emails dos empregados
    handleChangeEmail = (event) => {
        const new_email = event.target.value;
        this.setState({
            email: new_email
        });
    }

    //Passandos os dados das props para os states
    componentDidMount = () => {
        this.setState({
            name: this.props.name,
            email: this.props.email,
            id:this.props.id,
        });
    }

    //Método render
    render = () => {
        return (
            <div className='row'>
                <div className='col' style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button onClick={this.save}>
                        {  //Condicional para renderizar um CircularProgress caso os dados estejam sendo salvos
                            !this.state.saving ? 
                            <SaveIcon style={{fill:'white'}}></SaveIcon>
                            :
                            <CircularProgress className={'circular-progress'} size={15}></CircularProgress>
                        }
                    </Button>
                    {   //Condicional para desabilitar o botão de cancelar enquanto os dados estiverem sendo salvos
                        this.state.saving ? 
                            <Button disabled onClick={this.close}><CancelIcon style={{fill:'white'}}></CancelIcon></Button>
                        :
                        <Button  onClick={this.close}><CancelIcon style={{fill:'white'}}></CancelIcon></Button>

                    }       
                </div>
                <div className='col'>
                    <input className="input"
                        type='text'
                        //Condicional para evitar que aplicação quebre caso o state email undefined ou null 
                        value={this.state.email ? this.state.email : ''}
                        onChange={this.handleChangeEmail}
                        placeholder='E-mail'
                    >
                    </input>

                </div>
                <div className='col'>
                    <input
                        className="input"
                        type='text'
                        //Condicional para evitar que aplicação quebre caso o state name seja undefined ou null
                        value={this.state.name ? this.state.name : ''}
                        onChange={this.handleChangeName}
                        placeholder='Nome'
                    >
                    </input>
                </div>

            </div>
        );
    }
}

export default EditableRow;