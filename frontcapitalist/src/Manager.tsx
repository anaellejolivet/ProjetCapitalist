import './css/App.css';
import './css/Manager.css';
import {Pallier, Product, World} from './world';
import MyProgressbar, { Orientation} from './MyProgressbar';
import oeil from './images/oeil-de-ra.png'
import {useEffect, useState} from 'react';
import { useInterval } from './MyInterval';
import { devis, transform } from './utils';
import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


type ManagerProps = {
    world: World
    money: number
    showManagers: boolean
    onCloseManager: () => void
    onManagerHired: (manager: Pallier) => void
}


export default function ManagerComponent({world, money, showManagers, onCloseManager, onManagerHired} : ManagerProps) { 

    const [show, setShow] = useState(showManagers);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setShow(showManagers);
    }, [showManagers]);



    const handleClick = () => {
        setOpen(true);
      };
    
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }

    setOpen(false);
    };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


    function hireManager(manager: Pallier) {
        if (manager.seuil <= money) {
            onManagerHired(manager)
        }
    }

    function close() {
        setShow(!show)
        onCloseManager()
    }

    return (
        <div className="modal"> { show &&
            <div >
                <div>
                    <h1 className="title">Managers pour faire le beurre !</h1>
                </div>
                <div>
                    {world.managers.filter( manager => !manager.unlocked).map(manager =>
                        <div key={manager.idcible} className="managergrid">
                            <div>
                                <div className="logo">
                                    <img alt="manager logo" className="round menuImg" src= {"http://localhost:4000/"+manager.logo} />
                                </div>
                            </div>
                            <div className="infosmanager">
                                <div className="managername"> <h3>{ manager.name}</h3> </div>
                                <div className="managercost"> <h3>{ manager.seuil}</h3> <img className='imgMoney' src={"http://localhost:4000/icones/money.png"}/> </div>
                                <div className="managercible"> <h5>{world.products[manager.idcible-1].name }</h5> </div>
                            </div>
                            <div>
                                <Button disabled={world.money < manager.seuil} onClick={() => hireManager(manager)}> ENGAGER !</Button>
                                <Snackbar
                                open={open}
                                autoHideDuration={6000}
                                onClose={handleClose}
                                message={manager.name+" a été engagé !" }
                                action={action}
                                />
                            </div>
                        </div>
                    )}
                    <Button sx={{ position: 'absolute', right:'2%', top:'3%'}} className="closebutton" color='error' onClick={close} >X</Button>


                </div>
            </div>
        } </div>

    );

}






