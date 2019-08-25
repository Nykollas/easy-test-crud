import React, {Component} from 'react';
import firebase from 'firebase';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import '../assets/styles.css';


class Row extends Component{

    constructor(props){
        super(props);
    }

    delete = () =>{
            let id = this.props.id;
            firebase.database().ref("employees/"+id).remove();
            firebase.database().ref("employee_qtd").transaction((currentValue =>{
                return ((currentValue || 0) - 1 );
            }));
    }

    edit = () => {
        this.props.containerRef.setAsEditable();
    }


    render = () =>{
        return(
            <div className='row'>
                <div className='col' style={{alignItems:'center', justifyContent:'flex-end'}}>
                    <Button onClick={this.edit}><EditIcon style={{fill:'white'}}></EditIcon></Button>
                    <Button onClick={this.delete}><DeleteIcon style={{fill:'white'}} ></DeleteIcon></Button>
                </div>
                <div className='col'>
                    <p className="text">{this.props.email}</p>
                </div>
                <div className='col'>
                    <p className="text">{this.props.name}</p>
                </div>
            </div>
        );
    }
}

export default Row;