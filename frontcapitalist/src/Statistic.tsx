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


type StatProps = {
    world: World
    showStat: boolean
    onCloseStat: () => void
}


export default function StatComponent({world, showStat, onCloseStat} : StatProps) { 

    useEffect(() => {
        setShow(showStat);
    }, [showStat]);
    
    const [show, setShow] = useState(showStat);
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
        onCloseStat()
    }


    return (
        <div className="modal"> { show &&
            <div>
                <h1 className="title">Statistiques du monde</h1>
                <div className='investor'>
                    <div >
                        <h3><span style={{marginLeft : "10px"}} dangerouslySetInnerHTML={{__html: transform(world.money) }} /> <img className='imgMoney' src={"http://localhost:4000/icones/money.png"} /> scarabée(s) en poche</h3>
                        <h3>{world.activeangels} <img className='imgMoney' src={"http://localhost:4000/icones/sphynx.png"} /> sphynx en poche</h3>
                        <h3>Bonus par sphynx {world.angelbonus}%</h3>
                        <h2>Depuis le début du jeu :</h2>
                        <h4>Score : <span style={{marginLeft : "10px"}} dangerouslySetInnerHTML={{__html: transform(world.score) }} /> </h4>
                        <h4>Sphynx : {world.totalangels}</h4>
                    </div>
                    <Button sx={{ position: 'absolute', right:'2%', top:'3%'}} className="closebutton" color='error' onClick={close} >X</Button>
                </div>
            </div>
        } </div>

    );

}