import './css/App.css';
import './css/Unlock.css';

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


type UnlockProps = {
    world: World
    money: number
    showUnlocks: boolean
    onCloseUnlock: () => void
}


export default function UnlockComponent({world, money, showUnlocks, onCloseUnlock} : UnlockProps) { 

    useEffect(() => {
        setShow(showUnlocks);
    }, [showUnlocks]);

    const [show, setShow] = useState(showUnlocks);
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
        onCloseUnlock()
    };

    return (
        <div className="modal"> { show &&
            <div>
                <h1 className="title">Unlockssss !</h1>
                <div>
                    <div className='allUnlocks unlock'>
                        <div className='headerUnlock'><img className='menuImg' src={"http://localhost:4000/"+world.allunlocks[0].logo} /> <h2>Les unlocks globaux</h2></div>
                        
                        <div className='listUnlock'>
                            {world.allunlocks.map(unlock => (  !unlock.unlocked &&
                                <div>
                                    <h3>{unlock.name}</h3>
                                    <h2>{unlock.seuil}</h2>
                                    {unlock.typeratio} x{unlock.ratio}
                                </div>
                            ))}

                        </div>

                    </div>
                    {world.products.map(product => (
                        <div className='unlock' key={product.id}>
                            <div className='headerUnlock'><img className='menuImg' src={"http://localhost:4000/"+product.logo} /><h2>{product.name}</h2></div>
                            <div className='listUnlock'>
                                {product.paliers.map(palier => ( !palier.unlocked &&
                                    <div>
                                        <div>
                                            <h3>{palier.name} </h3>
                                        </div>

                                        <h2>{palier.seuil}</h2>
                                        {palier.typeratio} x{palier.ratio}                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <Button className="closebutton" color='error' onClick={close} >Close</Button>
                </div>
            </div>
        } </div>

    );

}






