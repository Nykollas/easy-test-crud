import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import RowContainer from './components/RowContainer';
import SearchIcon from '@material-ui/icons/Search';
import PlusIcon from '@material-ui/icons/PlusOne';
import LeftArrow from '@material-ui/icons/ArrowLeft';
import RightArrow from '@material-ui/icons/ArrowRight';
import Button from '@material-ui/core/Button';
import Fuse from 'fuse.js';
import md5 from 'md5';
import firebase from 'firebase';
import './assets/styles.css';


var firebaseConfig = {
  apiKey: "AIzaSyCNxNkzej9YovwpOX5TZ1k0lnvmn8uwQtU",
  authDomain: "easy-test-aa57b.firebaseapp.com",
  databaseURL: "https://easy-test-aa57b.firebaseio.com",
  projectId: "easy-test-aa57b",
};

firebase.initializeApp(firebaseConfig);
class App extends Component {

  state = {
    data: [],
    searched_data: [],
    pages: [],
    ind_active: 0,
    next_cursor: null,
    previous_cursor: null
  }


  getData = () => {
    this.setState({ loading: true });
    firebase.database()
      .ref('employees')
      .orderByChild('id')
      .on('value', (snapshot) => {

        let arr_data = new Array();

        snapshot.forEach(snapshotChild => {
          let employee = {
            id: snapshotChild.val().id,
            name: snapshotChild.val().name,
            email: snapshotChild.val().email,
          }
          arr_data.push(employee);
        })

        this.setState({
          data: arr_data,

        });


      })
  }

  createEmployee = () => {
    let seed = Math.random();
    let uid = md5(seed);
    let new_employee = {
      id: uid,
      name: 'employee',
      email: 'employee@example.com'
    }
    firebase.database().ref("employees/" + uid).set(new_employee);
    firebase.database().ref("employee_qtd").transaction((currentValue) => {
      return ((currentValue || 0) + 1);
    }).catch(error => window.alert("Ocoorreu um erro tente novamente"))
  }

  componentDidMount = () => {
    this.getData();
  
  }

  filterData = (event) => {
    let data = this.state.data;
    let value = event.target.value;
    let options = {
      keys: ['name', 'email'],
    }
    let fuse = new Fuse(data, options);
    let res = fuse.search(value);
    this.setState({ searched_data: res, filtered: true });
    console.log(res);
    if (value == '') {
      this.setState({ filtered: false });
    }
  }

  render = () => {
    return (

      <div style={{ display: 'flex', flex: 0, margin: '5%', flexDirection: 'column' }}>

        <h1 className={"title"}>Easy Employees Simple Crud</h1>
        <div className='menu-container'>
          <div className="filter-container">
            <input
              className="filter-input"
              type='text'
              placeholder="Nome/E-mail"
              onChange={this.filterData}>
            </input>
            <SearchIcon style={{ fill: 'black' }}></SearchIcon>
          </div>
          <div className="new-button">
            <Button style={{ backgroundColor: "#dc0000" }}>
              <PlusIcon style={{ fill: 'white' }} onClick={this.createEmployee}>
              </PlusIcon>
            </Button>
          </div>
        </div>

        {this.state.filtered && this.state.searched_data ?
          <div className='table'>
            {
              this.state.searched_data.map((row) => {
                return <RowContainer name={row.name} email={row.email}></RowContainer>
              })
            }
          </div>
          :
          <CircularProgress className="home"></CircularProgress>
        }
        {this.state.data && !this.state.filtered ?
          <div className='table'>
            {
              this.state.data.map((row) => {
                return <RowContainer id={row.id} name={row.name} email={row.email}></RowContainer>
              })
            }
          </div>
          :
          <CircularProgress className='home'></CircularProgress>
        }
      </div>
    );
  }

}
export default App;
