import TextField from "@material-ui/core/TextField";
import Drawer from "@material-ui/core/Drawer";
import React, {Component} from "react";
import Fab from "@material-ui/core/Fab"
import SettingsIcon from '@material-ui/icons/Settings';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";

type DrawerState = {
    open: boolean
}

const drawer = (
    <div id="controls">
        <form noValidate>
            <InputLabel id="vertinterp-label">Vertical Interpolation *</InputLabel>
            <Select
                required
                labelId="vertinterp-label"
                id="vertinterp"
                defaultValue="nearest">
                <MenuItem value="nearest">Nearest Neighbor</MenuItem>
                <MenuItem value="linear">Linear</MenuItem>
                <MenuItem value="neutral_power">Neutral Power Law</MenuItem>
                <MenuItem value="stability_power">Stability-Corrected Power Law</MenuItem>
            </Select>
            <br/><br/>
            <InputLabel id="spatinterp-label">Spatial Interpolation *</InputLabel>
            <Select
                required
                labelId="spatinterp-label"
                id="spatinterp"
                defaultValue="idw">
                <MenuItem value="nearest">Nearest Neighbor</MenuItem>
                <MenuItem value="linear">Linear</MenuItem>
                <MenuItem value="cubic">Cubic</MenuItem>
                <MenuItem value="idw">Inverse Distance Weighting</MenuItem>
            </Select>
            <br/><br/>
            <TextField
                required
                id="startdate"
                label="Start Date"
                type="date"
                defaultValue="2007-01-01"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <br/><br/>
            <TextField
                required
                id="stopdate"
                label="Stop Date"
                type="date"
                defaultValue="2007-01-02"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <br/><br/>
            <TextField required id="height" label="Height (m)" defaultValue="30" />
        </form>
    </div>
);

export class ControlsDrawer extends Component<{},DrawerState> {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }
    toggleOpen = () => {
        this.setState({open: !this.state['open']})
    };

    render() {
        return (
            <React.Fragment>
            <Fab color="grey" aria-label="settings" onClick={this.toggleOpen} id="fab">
                <SettingsIcon />
            </Fab>
            <Drawer anchor="left" open={this.state["open"]} onClose={this.toggleOpen}>
                {drawer}
            </Drawer>
            </React.Fragment>
        );
    };
};

export default ControlsDrawer;

