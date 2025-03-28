import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
    const { active, completed } = props;
    
    return (
      <QontoStepIconRoot ownerState={{ active }}>
        {(completed || active) ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }
  
  

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const OrderStepper = ({order}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [history, setHistory] = useState([]);

  let steps = [];

  if (order?.type === "taiquay") {
    if (order.deliveryMethod === "Tại cửa hàng") {
      steps = ["Đã hoàn thành"];
    } else {
      steps = ["Chờ giao hàng"];
    }
  } else if(order?.type === "online"){
    steps = ["Chờ xác nhận", "Đã xác nhận","Chờ giao hàng"];
  }

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel connector={<QontoConnector />}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={QontoStepIcon}>
              <div>
                <Typography variant="body2">{step}</Typography>
                <Typography variant="caption" color="textSecondary">10-10-2025</Typography>
              </div>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
        <Button variant="contained" color="primary" onClick={handleNext} disabled={activeStep >= steps.length - 1}>Tiếp tục</Button>
        <Button variant="contained" color="secondary" onClick={handleBack} disabled={activeStep === 0}>Quay lại</Button>
      </div>
    </div>
  );
};

export default OrderStepper;