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
    showUnlocks: boolean
    onCloseUnlock: () => void
}


export default function UnlockComponent({world, money, showUnlocks, onCloseUnlock} : ManagerProps) { 

    const [show, setShow] = useState(showUnlocks);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        console.log("loead Unlock")
        setShow(showUnlocks);
    }, [showUnlocks]);

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
  
    useEffect(() => {
        console.log(world.allunlocks)
    }, []);

    function close() {
        setShow(!show)
        onCloseUnlock()
    }

    return (
        <div> { show &&
            <div className="modal">
                <div>
                    <h1 className="title">Unlockssss !</h1>
                </div>
                <div>
                {world.products.map(product => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <ul>
                    {product.paliers.map(palier => ( !palier.unlocked &&
                        <li>
                            <div className='unlock'>
                                <img src={palier.logo} />
                                <h3>{palier.name} </h3>
                            </div>

                            <h2>{palier.seuil}</h2>
                            {palier.typeratio} x{palier.ratio}
                            {palier.unlocked}
                            
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
                    <Button className="closebutton"  onClick={close} >Close</Button>


                </div>
            </div>
        } </div>

    );

}






