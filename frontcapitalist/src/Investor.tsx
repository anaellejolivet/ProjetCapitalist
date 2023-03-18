import './css/App.css';
import './css/Upgrades.css';
import './css/Investor.css';


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


type InvestorProps = {
    world: World
    money: number
    showInvestors: boolean
    onCloseInvestors: () => void
    onResetWorld: () => void
}


export default function InvestorComponent({world, money, showInvestors, onCloseInvestors, onResetWorld} : InvestorProps) { 

    useEffect(() => {
        setShow(showInvestors);
    }, [showInvestors]);
    
    const [show, setShow] = useState(showInvestors);
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
        onCloseInvestors()
    }

    function onReset() {
        setShow(!show)
        onResetWorld()
        onCloseInvestors()
    }

    return (
        <div className="modal"> { show &&
            <div>
                <h1 className="title">Recommencer sur de bonnes bases</h1>
                <div className='investor'>
                    <div >
                        <h3>{world.activeangels} <img className='imgMoney' src={"http://localhost:4000/icones/sphynx.png"} /> sphynx en poche</h3>
                        <h3>Bonus par ange {world.angelbonus}%</h3>
                        <div> <Button disabled={false} onClick={onReset}> Reset le monde et recolter <b style={{margin: "0 5px 0 5px"}}> {Math.floor(150 * Math.sqrt(world.score/Math.pow(10, 15))-world.totalangels)} </b>sphynx </Button> </div>
                    </div>
                    <Button sx={{ position: 'absolute', right:'2%', top:'3%'}} className="closebutton" color='error' onClick={close} >X</Button>
                </div>
            </div>
        } </div>

    );

}






