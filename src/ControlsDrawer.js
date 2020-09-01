import TextField from "@material-ui/core/TextField";
import Drawer from "@material-ui/core/Drawer";
import React, {Component} from "react";
import Fab from "@material-ui/core/Fab"
import SettingsIcon from '@material-ui/icons/Settings';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from "@material-ui/core/InputLabel";
import _ from "lodash"

type DrawerState = {
    open: boolean,
    startdate: string,
    stopdate: string,
    vertinterp: string,
    spatinterp: string,
    height: number
}

export class ControlsDrawer extends Component<{},DrawerState> {
    constructor() {
        super();
        this.state = {
            open: false,
            startdate: "2007-01-01",
            stopdate: "2007-01-02",
            vertinterp: 'nearest',
            spatinterp: 'idw',
            height: 30
        };
    };

    prepareRequest = (lat,lng) => {
        return 'http://localhost:8080/v1/windrose?height='+this.state.height+'m&lat='+lat+'&lon='+lng+
            '&start_date='+_.join(_.split(this.state.startdate,'-',3),'')+'&stop_date='+
            _.join(_.split(this.state.stopdate,'-',3),'')+
            '&vertical_interpolation='+this.state.vertinterp+
            '&spatial_interpolation='+this.state.spatinterp
    };

    toggleOpen = () => {
        this.setState({open: !this.state['open']})
    };

    settingsChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <React.Fragment>
            <Fab color="default" aria-label="settings" onClick={this.toggleOpen} id="fab">
                <SettingsIcon />
            </Fab>
            <Drawer anchor="left" open={this.state["open"]} onClose={this.toggleOpen}>
                <div id="controls">
                    <form noValidate>
                        <InputLabel id="vertinterp-label">Vertical Interpolation *</InputLabel>
                        <Select
                            required
                            labelId="vertinterp-label"
                            id="vertinterp"
                            defaultValue="nearest"
                            value={this.state.vertinterp}
                            name="vertinterp"
                            onChange={this.settingsChange}>
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
                            defaultValue="idw"
                            name="spatinterp"
                            value={this.state.spatinterp}
                            onChange={this.settingsChange}>
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
                            name="startdate"
                            value={this.state.startdate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={this.settingsChange}
                        />
                        <br/><br/>
                        <TextField
                            required
                            id="stopdate"
                            label="Stop Date"
                            type="date"
                            name="stopdate"
                            value={this.state.stopdate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={this.settingsChange}
                        />
                        <br/><br/>
                        <TextField
                            required
                            id="height"
                            label="Height (m)"
                            name="height"
                            value={this.state.height}
                            onChange={this.settingsChange}
                        />
                    </form>
                </div>
            </Drawer>
            </React.Fragment>
        );
    };
};

export default ControlsDrawer;

