import React, {Component} from 'react';
import Row from './Row';
import EditableRow from './EditableRow';



class RowContainer extends Component {

    constructor(props){
        super(props);
    }
    state = { editable:false }
    setAsEditable = () => {
        this.setState({editable:true});
    }
    unsetAsEditable = () =>{
        this.setState({editable:false});
    }
    render = () => {
        return (
            <div>
                {this.state.editable ?
                     <EditableRow containerRef={this} id={this.props.id} name={this.props.name} email={this.props.email}></EditableRow>
                     :
                     <Row containerRef={this} id={this.props.id} name={this.props.name} email={this.props.email}></Row>
                }
            </div>
        );
    }
}


export default RowContainer;