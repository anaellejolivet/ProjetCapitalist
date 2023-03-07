import './App.css';
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
        console.log("loead manager")
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
            setOpen(true);
        }
    }

    function close() {
        setShow(!show)
        onCloseManager()
    }

    return (
        <div> { show &&
            <div className="modal">
                <div>
                    <h1 className="title">Managers make you feel better !</h1>
                </div>
                <div>
                    {world.managers.filter( manager => !manager.unlocked).map(manager =>
                        <div key={manager.idcible} className="managergrid">
                            <div>
                                <div className="logo">
                                    {/* <img alt="manager logo" className="round" src= {props.services.server + manager.logo} /> */}
                                    <img alt="manager logo" className="round" src= {"truc"} />
                                </div>
                            </div>
                            <div className="infosmanager">
                                <div className="managername"> { manager.name} </div>
                                <div className="managercible"> {world.products[manager.idcible-1].name } </div>
                                <div className="managercost"> { manager.seuil} </div>
                            </div>
                            <div>
                                <Button disabled={world.money < manager.seuil} onClick={() => hireManager(manager)}> Hire !</Button>
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
                    <Button className="closebutton"  onClick={close} >Close</Button>


                </div>
            </div>
        } </div>

    );

}






