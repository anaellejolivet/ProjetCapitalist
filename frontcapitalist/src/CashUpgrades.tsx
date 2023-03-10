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


type CashUpgradesProps = {
    world: World
    money: number
    showUpgrades: boolean
    onCloseCashUpgrades: () => void
    onUpgradeBought: (upgrade: Pallier) => void

}


export default function CashUpgradesComponent({world, money, showUpgrades, onCloseCashUpgrades, onUpgradeBought} : CashUpgradesProps) { 

    const [show, setShow] = useState(showUpgrades);
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        setShow(showUpgrades);
    }, [showUpgrades]);

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
        onCloseCashUpgrades()
    }

    function onBuyUpgrade(ugrade: Pallier) {
        if (ugrade.seuil <= money) {
            onUpgradeBought(ugrade)
            setOpen(false);
        }
    }

    return (
        <div> { show &&
            <div className="modal">
                <div>
                    <h1 className="title">Cash Upgraaades !</h1>
                    <div>
                        <div className='allUnlocks'>
                            {world.upgrades.map(upgd => (
                                <div className='upgrades'>
                                    <img src={upgd.logo}/>
                                    <div>
                                        <p>{upgd.name}</p>
                                        <h3>{upgd.seuil}</h3>
                                        <p>{world.products[upgd.idcible]?.name ? world.products[upgd.idcible].name : "Tout les produits"} {upgd.typeratio} x{upgd.ratio}</p>
                                    </div>
                                    <Button disabled={world.money < upgd.seuil} onClick={() => onBuyUpgrade(upgd) } >Buy !</Button>
                                </div>

                            ))}
                        </div>
                        <Button className="closebutton"  onClick={close} >Close</Button>


                    </div>
                </div>
            </div>
        } </div>

    );

}






