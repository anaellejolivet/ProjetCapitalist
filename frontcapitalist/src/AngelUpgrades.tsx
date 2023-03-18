import './css/App.css';
import './css/Upgrades.css';

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


type AngelProps = {
    world: World
    money: number
    showAngelUpgrades: boolean
    onCloseAngel: () => void
    onAngelUpgBought: (angelUpg : Pallier) => void
}


export default function AngelComponent({world, money, showAngelUpgrades, onCloseAngel, onAngelUpgBought} : AngelProps) { 

    useEffect(() => {
        setShow(showAngelUpgrades);
    }, [showAngelUpgrades]);
    
    const [show, setShow] = useState(showAngelUpgrades);
    const [open, setOpen] = React.useState(false);

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

    function close() {
        setShow(!show)
        onCloseAngel()
    }

    function onBuyAngelUpg(angelUpg : Pallier) {
        if (angelUpg.seuil <= world.activeangels) {
            onAngelUpgBought(angelUpg)
            setOpen(false);
        }
    }

    return (
        <div className="modal"> { show &&
            <div>
                <h1 className="title">Angel Upgraaades !</h1>
                <div>
                    <div className='allUnlocks'>
                        {world.angelupgrades.map(angelUpg => ( !angelUpg.unlocked &&
                            <div key={angelUpg.name} className='upgrades'>
                                <h4>{angelUpg.name}</h4>
                                <div>
                                    <h3>{angelUpg.seuil} <img className='imgMoney' src={"http://localhost:4000/icones/sphynx.png"}/></h3>
                                    <p>{world.products[angelUpg.idcible-1]?.name ? world.products[angelUpg.idcible-1].name : "Tout les produits"} {angelUpg.typeratio} x{angelUpg.ratio}</p>
                                </div>
                                <Button disabled={world.activeangels < angelUpg.seuil} onClick={() => onBuyAngelUpg(angelUpg) } >ACHETER !</Button>
                            </div>
                        ))}
                    </div>
                    <Button sx={{ position: 'absolute', right:'2%', top:'3%'}} className="closebutton" color='error' onClick={close} >X</Button>
                </div>
            </div>
        } </div>

    );

}






