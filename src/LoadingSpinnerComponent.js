import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

export const LoadingSpinnerComponent = (props) => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress &&
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: "9999",
            transform: "translate(-50%, -50%)"
        }}>
            <Loader type="ThreeDots" color="grey" height="100" width="100" />
        </div>
    )
};

export default LoadingSpinnerComponent;