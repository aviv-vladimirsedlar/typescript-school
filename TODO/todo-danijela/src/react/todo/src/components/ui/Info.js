import React from 'react';
import {MODE_NONE} from '../../services/mode';

export default function Info(props) {
    return <p className="info">{props.mode === MODE_NONE ? 'Info' : "Cancel"}</p>;
}
